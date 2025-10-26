'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatFileSize, formatDateTime, getRelativeTime } from '@/lib/formatters';

interface RecordingCardProps {
  videoKey: string;
  fileName: string;
  lastModified: Date;
  size: number;
  userId: string;
  onPlay: (key: string, name: string) => void;
}

/**
 * Recording Card Component
 * 
 * Displays a video recording with metadata in a card format.
 * Matches the design of existing "Recent Interactions" cards.
 * 
 * Features:
 * - Video icon/thumbnail placeholder
 * - File name with truncation
 * - Upload date (relative time)
 * - File size
 * - User ID
 * - Play button
 */
export default function RecordingCard({
  videoKey,
  fileName,
  lastModified,
  size,
  userId,
  onPlay,
}: RecordingCardProps) {
  const handlePlay = () => {
    onPlay(videoKey, fileName);
  };

  return (
    <Card className="group bg-gradient-to-br from-[rgba(59,130,246,0.12)] to-[rgba(6,182,212,0.12)] border-[rgba(59,130,246,0.35)] backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Video Icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg 
                className="w-8 h-8 text-blue-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
                />
              </svg>
            </div>
          </div>

          {/* Video Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg mb-2 truncate group-hover:text-blue-300 transition-colors">
              {fileName}
            </h3>
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-cyan-300">{getRelativeTime(new Date(lastModified))}</span>
                <span className="text-gray-500">•</span>
                <span>{formatDateTime(new Date(lastModified))}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>{formatFileSize(size)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>User: {userId.substring(0, 8)}...</span>
              </div>
            </div>
          </div>

          {/* Play Button */}
          <div className="flex-shrink-0">
            <Button
              onClick={handlePlay}
              size="sm"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play Video
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
