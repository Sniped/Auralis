/**
 * API Route: List All Video Recordings from S3
 * 
 * GET /api/recordings/list
 * 
 * Lists all video files from the S3 bucket's recordings/ folder.
 * Returns metadata for all recordings (not filtered by user).
 * 
 * IAM Policy Required:
 * {
 *   "Effect": "Allow",
 *   "Action": ["s3:PutObject", "s3:GetObject", "s3:ListBucket", "s3:DeleteObject"],
 *   "Resource": [
 *     "arn:aws:s3:::auralis-knight-hacks",
 *     "arn:aws:s3:::auralis-knight-hacks/*"
 *   ]
 * }
 */

import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Recording } from '@/types/recordings';
import { extractUserIdFromKey, extractFileNameFromKey } from '@/lib/formatters';

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function GET() {
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

    // List all objects in the recordings/ folder
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: 'recordings/',
    });

    const response = await s3Client.send(command);

    // Process S3 objects into Recording format
    const recordings: Recording[] = (response.Contents || [])
      .filter((obj) => {
        // Filter out folder markers and ensure we have valid files
        return obj.Key && 
               obj.Key !== 'recordings/' && 
               !obj.Key.endsWith('/') &&
               obj.Size && 
               obj.Size > 0;
      })
      .map((obj) => {
        const key = obj.Key!;
        const fileName = extractFileNameFromKey(key);
        const userId = extractUserIdFromKey(key);
        const lastModified = obj.LastModified || new Date();
        const size = obj.Size || 0;

        return {
          key,
          fileName,
          lastModified,
          size,
          userId,
        };
      })
      // Sort by last modified date (newest first)
      .sort((a, b) => {
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      });

    return NextResponse.json({
      recordings,
      count: recordings.length,
    });
  } catch (error) {
    console.error('Error listing S3 recordings:', error);
    
    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.name === 'NoSuchBucket') {
        return NextResponse.json(
          { error: 'S3 bucket not found. Please check bucket configuration.' },
          { status: 404 }
        );
      }
      
      if (error.name === 'AccessDenied') {
        return NextResponse.json(
          { error: 'Access denied. Please check IAM permissions.' },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: `Failed to list recordings: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to list recordings' },
      { status: 500 }
    );
  }
}
