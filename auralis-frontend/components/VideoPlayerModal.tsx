'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface VideoPlayerModalProps {
  isOpen: boolean;
  videoKey: string | null;
  videoName: string;
  onClose: () => void;
}

/**
 * Video Player Modal Component
 * 
 * Displays a modal with video player and placeholder for transcript/analysis.
 * Fetches pre-signed URL from API and plays video using ReactPlayer.
 * 
 * Features:
 * - Video playback with controls
 * - Loading state while fetching URL
 * - Error handling
 * - Click outside or ESC to close
 * - Responsive layout (video left, transcript placeholder right)
 * - Dark theme matching dashboard
 */
export default function VideoPlayerModal({
  isOpen,
  videoKey,
  videoName,
  onClose,
}: VideoPlayerModalProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch pre-signed URL when modal opens
  useEffect(() => {
    if (!isOpen || !videoKey) {
      setVideoUrl(null);
      setError(null);
      return;
    }

    const fetchVideoUrl = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/recordings/view-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key: videoKey }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load video');
        }

        const data = await response.json();
        setVideoUrl(data.url);
      } catch (err) {
        console.error('Error fetching video URL:', err);
        setError(err instanceof Error ? err.message : 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoUrl();
  }, [isOpen, videoKey]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-6xl bg-[#0a1628] border-blue-500/30 shadow-2xl shadow-blue-500/20 max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent truncate pr-4">
              {videoName}
            </h2>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-2 hover:bg-blue-500/10 rounded-lg"
              aria-label="Close video player"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main Content: Video Player + Transcript Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player Section (Left - 2/3 width on large screens) */}
            <div className="lg:col-span-2">
              <div className="bg-black rounded-xl overflow-hidden aspect-video">
                {loading && (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
                      <p className="text-gray-400">Loading video...</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <div className="text-center px-4">
                      <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-400 font-semibold mb-2">Failed to load video</p>
                      <p className="text-gray-400 text-sm">{error}</p>
                      <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {!loading && !error && videoUrl && (
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full"
                    style={{ backgroundColor: '#000' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>

            {/* Transcript/Analysis Placeholder Section (Right - 1/3 width on large screens) */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6 h-full min-h-[300px] lg:min-h-[400px]">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg className="w-16 h-16 text-blue-400/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    Transcript & Analysis
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    AI-generated transcript and patient interaction analysis will appear here.
                  </p>
                  <div className="space-y-2 w-full">
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 text-left">
                      <p className="text-xs text-blue-300 font-semibold mb-1">Coming Soon:</p>
                      <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                        <li>Speech-to-text transcription</li>
                        <li>Symptom extraction</li>
                        <li>Emotional analysis</li>
                        <li>Key insights</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-6 pt-4 border-t border-blue-500/20">
            <p className="text-xs text-gray-500 text-center">
              Video URL expires in 1 hour • Press ESC or click outside to close
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
