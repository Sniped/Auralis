/**
 * Utility functions for formatting file data
 */

/**
 * Convert bytes to human-readable file size
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format date to readable string
 * @param date - Date object
 * @returns Formatted date string (e.g., "Oct 25, 2025")
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Format date with time
 * @param date - Date object
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Extract user ID from S3 key
 * S3 structure: recordings/{userId}/{timestamp}-{filename}
 * @param key - S3 object key
 * @returns User ID or 'unknown'
 */
export function extractUserIdFromKey(key: string): string {
  const parts = key.split('/');
  if (parts.length >= 2 && parts[0] === 'recordings') {
    return parts[1];
  }
  return 'unknown';
}

/**
 * Extract clean filename from S3 key
 * Removes timestamp prefix and path
 * @param key - S3 object key
 * @returns Clean filename
 */
export function extractFileNameFromKey(key: string): string {
  const parts = key.split('/');
  const fullFileName = parts[parts.length - 1];
  
  // Remove timestamp prefix (format: {timestamp}-)
  const match = fullFileName.match(/^\d+-(.+)$/);
  if (match) {
    return match[1];
  }
  
  return fullFileName;
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param date - Date object
 * @returns Relative time string
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
}
