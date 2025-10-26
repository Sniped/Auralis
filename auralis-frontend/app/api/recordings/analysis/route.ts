/**
 * API Route: Generate Pre-signed URL for Analysis JSON
 * 
 * POST /api/recordings/analysis
 * 
 * Generates a temporary pre-signed URL for accessing analysis JSON files in S3.
 * Analysis files are stored in auralis-transcript-output-east1 bucket.
 * 
 * Request Body:
 * {
 *   "videoKey": "recordings/{userId}/{timestamp}-{filename}.mp4"
 * }
 * 
 * Response (Success):
 * {
 *   "url": "https://s3.amazonaws.com/..."
 * }
 * 
 * Response (Not Found):
 * {
 *   "error": "Analysis not found",
 *   "exists": false
 * }
 * 
 * File Matching Logic:
 * - Video: recordings/user123/1761448789852-WalterWhite2.mp4
 * - Extract: 1761448789852-WalterWhite2
 * - Analysis: analysis/1761448789852-WalterWhite2-analysis.json
 */

import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { extractBaseFileName, buildAnalysisKey } from '@/lib/s3-helpers';

// Initialize S3 Client for transcript bucket
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

interface AnalysisRequest {
  videoKey: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify environment variables
    if (!process.env.AWS_S3_TRANSCRIPT_BUCKET_NAME) {
      return NextResponse.json(
        { error: 'Transcript bucket not configured' },
        { status: 500 }
      );
    }

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return NextResponse.json(
        { error: 'AWS credentials not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const body: AnalysisRequest = await request.json();
    const { videoKey } = body;

    // Validate request
    if (!videoKey) {
      return NextResponse.json(
        { error: 'Missing required field: videoKey' },
        { status: 400 }
      );
    }

    // Extract base filename and build analysis key
    const baseFileName = extractBaseFileName(videoKey);
    const analysisKey = buildAnalysisKey(baseFileName);

    console.log('Analysis lookup:', {
      videoKey,
      baseFileName,
      analysisKey,
      bucket: process.env.AWS_S3_TRANSCRIPT_BUCKET_NAME,
    });

    // Check if analysis file exists using HeadObject
    try {
      const headCommand = new HeadObjectCommand({
        Bucket: process.env.AWS_S3_TRANSCRIPT_BUCKET_NAME,
        Key: analysisKey,
      });
      await s3Client.send(headCommand);
    } catch (headError) {
      // File doesn't exist - return graceful response
      const isNotFound = headError instanceof Error && headError.name === 'NotFound';
      const is404 = (headError as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404;
      
      if (isNotFound || is404) {
        console.log('Analysis not found:', analysisKey);
        return NextResponse.json(
          { 
            error: 'Analysis not available for this recording',
            exists: false 
          },
          { status: 404 }
        );
      }
      // Other error - rethrow
      throw headError;
    }

    // Generate pre-signed URL for GetObject
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_TRANSCRIPT_BUCKET_NAME,
      Key: analysisKey,
    });

    const expiresIn = 3600; // 1 hour
    const url = await getSignedUrl(s3Client, command, { expiresIn });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating analysis pre-signed URL:', error);

    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.name === 'AccessDenied') {
        return NextResponse.json(
          { error: 'Access denied. Please check IAM permissions for s3:GetObject on transcript bucket.' },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: `Failed to generate analysis URL: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate analysis URL' },
      { status: 500 }
    );
  }
}
