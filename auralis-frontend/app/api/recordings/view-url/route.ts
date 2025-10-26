/**
 * API Route: Generate Pre-signed URL for Video Viewing
 * 
 * POST /api/recordings/view-url
 * 
 * Generates a temporary pre-signed URL for accessing a video file in S3.
 * URL expires after 1 hour for security.
 * 
 * Request Body:
 * {
 *   "key": "recordings/{userId}/{timestamp}-{filename}.mp4"
 * }
 * 
 * Response:
 * {
 *   "url": "https://s3.amazonaws.com/...",
 *   "expiresIn": 3600
 * }
 * 
 * IAM Policy Required:
 * {
 *   "Effect": "Allow",
 *   "Action": ["s3:GetObject"],
 *   "Resource": "arn:aws:s3:::auralis-knight-hacks/*"
 * }
 * 
 * Security Note:
 * Currently, all videos are accessible to all authenticated users.
 * Future enhancement: implement user-based access control to restrict
 * users to only view their own recordings.
 */

import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

interface ViewUrlRequest {
  key: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify environment variables
    if (!process.env.AWS_S3_BUCKET_NAME) {
      return NextResponse.json(
        { error: 'S3 bucket name not configured' },
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
    const body: ViewUrlRequest = await request.json();
    const { key } = body;

    // Validate request
    if (!key) {
      return NextResponse.json(
        { error: 'Missing required field: key' },
        { status: 400 }
      );
    }

    // Validate key format (should start with recordings/)
    if (!key.startsWith('recordings/')) {
      return NextResponse.json(
        { error: 'Invalid S3 key format. Must start with recordings/' },
        { status: 400 }
      );
    }

    // TODO: Add authentication check
    // Currently, all authenticated users can view all videos
    // Future: Check if user has permission to view this specific video
    // Example:
    // const session = await getCurrentSession();
    // const userId = session.getIdToken().payload.sub;
    // if (!key.includes(userId)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    // }

    // Create GetObject command
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    // Generate pre-signed URL with 1 hour expiration
    const expiresIn = 3600; // 1 hour in seconds
    const url = await getSignedUrl(s3Client, command, { expiresIn });

    return NextResponse.json({
      url,
      expiresIn,
    });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);

    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.name === 'NoSuchKey') {
        return NextResponse.json(
          { error: 'Video file not found in S3' },
          { status: 404 }
        );
      }

      if (error.name === 'AccessDenied') {
        return NextResponse.json(
          { error: 'Access denied. Please check IAM permissions for s3:GetObject' },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: `Failed to generate view URL: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate view URL' },
      { status: 500 }
    );
  }
}
