/**
 * TypeScript types for video recording functionality
 */

export interface Recording {
  key: string;           // S3 key (full path)
  fileName: string;      // Extracted filename
  lastModified: Date;    // Upload date
  size: number;          // File size in bytes
  userId: string;        // User ID from folder structure
}

export interface PresignedUrlResponse {
  url: string;           // Pre-signed URL for video access
  expiresIn: number;     // Expiration time in seconds
}

export interface RecordingsListResponse {
  recordings: Recording[];
  count: number;
}

export interface VideoMetadata {
  key: string;
  name: string;
}
