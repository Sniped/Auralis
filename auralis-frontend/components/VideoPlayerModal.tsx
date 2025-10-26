'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import TranscriptPanel from '@/components/TranscriptPanel';
import AnalysisPanel from '@/components/AnalysisPanel';

interface VideoPlayerModalProps {
  isOpen: boolean;
  videoKey: string | null;
  videoName: string;
  onClose: () => void;
}

/**
 * Video Player Modal Component
 * 
 * Displays a modal with video player, transcript, and analysis panels.
 * Fetches pre-signed URL from API and plays video.
 * 
 * Features:
 * - Video playback with controls
 * - Live transcript with speaker labels
 * - Sentiment analysis and insights
 * - Three-column layout (video, transcript, analysis)
 * - Loading state while fetching URL
 * - Error handling
 * - Click outside or ESC to close
 * - Responsive design (stacks on mobile)
 * - Dark theme matching dashboard
 * 
 * Testing Checklist:
 * [ ] Video plays correctly
 * [ ] Transcript loads and displays
 * [ ] Analysis loads and displays
 * [ ] Handles missing transcript gracefully
 * [ ] Handles missing analysis gracefully
 * [ ] Three-column layout displays properly
 * [ ] Mobile responsive design works
 * [ ] Current segment highlighting works
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
  const [currentTime, setCurrentTime] = useState(0);

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
        className="w-full max-w-7xl bg-[#0a1628] border-blue-500/30 shadow-2xl shadow-blue-500/20 max-h-[90vh] overflow-hidden"
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

          {/* Main Content: Video Player + Transcript + Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Player Section (Left - 50% on desktop, full width on mobile) */}
            <div className="lg:col-span-1">
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
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>

            {/* Transcript + Analysis Section (Right - 50% on desktop) */}
            <div className="lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 h-[600px]">
              {/* Transcript Panel */}
              <div className="bg-[#0a1628] border border-blue-500/20 rounded-xl overflow-hidden">
                <TranscriptPanel 
                  videoKey={videoKey || ''} 
                  currentTime={currentTime}
                />
              </div>

              {/* Analysis Panel */}
              <div className="bg-[#0a1628] border border-cyan-500/20 rounded-xl overflow-hidden">
                <AnalysisPanel videoKey={videoKey || ''} />
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
