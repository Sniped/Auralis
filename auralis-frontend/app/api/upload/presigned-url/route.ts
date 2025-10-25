import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Type definitions
interface PresignedUrlRequest {
  fileName: string;
  fileType: string;
  userId: string;
}

interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: PresignedUrlRequest = await request.json();
    const { fileName, fileType, userId } = body;

    // Validate required fields
    if (!fileName || !fileType || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: fileName, fileType, or userId' },
        { status: 400 }
      );
    }

    // Validate file type (must be video)
    if (!fileType.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only video files are allowed.' },
        { status: 400 }
      );
    }

    // Generate unique S3 key
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `recordings/${userId}/${timestamp}-${sanitizedFileName}`;

    // Create PutObject command
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    // Generate pre-signed URL (5 minute expiration)
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300, // 5 minutes
    });

    // Return response
    const response: PresignedUrlResponse = {
      uploadUrl,
      key,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
