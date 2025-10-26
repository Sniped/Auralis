/**
 * S3 Helper Functions
 * 
 * Utilities for working with S3 keys and file naming conventions.
 */

/**
 * Extract base filename from video S3 key
 * 
 * Converts S3 video keys to base filename for matching transcript/analysis files.
 * 
 * Examples:
 * - "recordings/user123/1761448789852-WalterWhite2.mp4" → "1761448789852-WalterWhite2"
 * - "recordings/abc/1234567890-consultation.mov" → "1234567890-consultation"
 * 
 * @param s3Key - Full S3 key of video file
 * @returns Base filename without path, userId folder, or extension
 */
export function extractBaseFileName(s3Key: string): string {
  // Split by '/' and get the last part (filename with extension)
  const parts = s3Key.split('/');
  const fileNameWithExt = parts[parts.length - 1];
  
  // Remove file extension
  const lastDotIndex = fileNameWithExt.lastIndexOf('.');
  const baseFileName = lastDotIndex > 0 
    ? fileNameWithExt.substring(0, lastDotIndex)
    : fileNameWithExt;
  
  return baseFileName;
}

/**
 * Build transcript S3 key from base filename
 * 
 * @param baseFileName - Base filename extracted from video key
 * @returns S3 key for transcript JSON file
 * 
 * Example: "1761448789852-WalterWhite2" → "transcript/1761448789852-WalterWhite2.json"
 */
export function buildTranscriptKey(baseFileName: string): string {
  return `transcript/${baseFileName}.json`;
}

/**
 * Build analysis S3 key from base filename
 * 
 * @param baseFileName - Base filename extracted from video key
 * @returns S3 key for analysis JSON file
 * 
 * Example: "1761448789852-WalterWhite2" → "analysis/1761448789852-WalterWhite2.json"
 */
export function buildAnalysisKey(baseFileName: string): string {
  return `analysis/${baseFileName}.json`;
}

/**
 * Format seconds to MM:SS timestamp
 * 
 * @param seconds - Time in seconds
 * @returns Formatted timestamp string
 * 
 * Examples:
 * - 65 → "01:05"
 * - 125 → "02:05"
 * - 3661 → "61:01"
 */
export function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Convert speaker label to friendly name
 * 
 * @param speakerLabel - AWS Transcribe speaker label (spk_0, spk_1, etc.)
 * @returns Friendly speaker name
 * 
 * Examples:
 * - "spk_0" → "Speaker 1"
 * - "spk_1" → "Speaker 2"
 */
export function formatSpeakerLabel(speakerLabel: string): string {
  const match = speakerLabel.match(/spk_(\d+)/);
  if (match) {
    const speakerNum = parseInt(match[1], 10) + 1;
    return `Speaker ${speakerNum}`;
  }
  return speakerLabel;
}
