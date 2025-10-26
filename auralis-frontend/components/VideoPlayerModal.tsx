'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TranscriptResponse, AnalysisData } from '@/types/transcript';
import TranscriptPanel from '@/components/TranscriptPanel';
import AnalysisSection from '@/components/AnalysisSection';

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
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Function to seek video to specific time
  const handleSeekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

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

  // Fetch transcript data for analysis with polling
  useEffect(() => {
    if (!isOpen || !videoKey) {
      setTranscript(null);
      setTranscriptError(null);
      return;
    }

    let pollInterval: NodeJS.Timeout | null = null;
    let isMounted = true;

    const fetchTranscriptData = async () => {
      if (!isMounted) return;

      try {
        // Step 1: Get pre-signed URL from API
        const urlResponse = await fetch('/api/recordings/transcript', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoKey }),
        });

        if (!urlResponse.ok) {
          const errorData = await urlResponse.json();
          
          // Handle "not found" gracefully - continue polling
          if (errorData.exists === false) {
            console.log('Transcript not ready yet, will retry...');
            return;
          }
          
          throw new Error(errorData.error || 'Failed to get transcript URL');
        }

        const { url } = await urlResponse.json();

        // Step 2: Fetch transcript JSON from S3
        const transcriptResponse = await fetch(url);
        
        if (!transcriptResponse.ok) {
          throw new Error('Failed to fetch transcript data');
        }

        const transcriptData: TranscriptResponse = await transcriptResponse.json();
        
        if (isMounted) {
          setTranscript(transcriptData);
          setTranscriptLoading(false);
          
          // Stop polling once we have data
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
        }
      } catch (err) {
        console.error('Error fetching transcript for analysis:', err);
        // Don't set error state, just keep polling
      }
    };

    // Initial fetch
    setTranscriptLoading(true);
    setTranscriptError(null);
    fetchTranscriptData();

    // Poll every 5 seconds
    pollInterval = setInterval(fetchTranscriptData, 5000);

    // Cleanup
    return () => {
      isMounted = false;
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [isOpen, videoKey]);

  // Fetch analysis data for sentiment visualization with polling
  useEffect(() => {
    if (!isOpen || !videoKey) {
      setAnalysisData(null);
      return;
    }

    let pollInterval: NodeJS.Timeout | null = null;
    let isMounted = true;

    const fetchAnalysisData = async () => {
      if (!isMounted) return;

      try {
        // Step 1: Get pre-signed URL from API
        const urlResponse = await fetch('/api/recordings/analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoKey }),
        });

        if (!urlResponse.ok) {
          const errorData = await urlResponse.json();
          
          // Handle "not found" gracefully - continue polling
          if (errorData.exists === false) {
            console.log('Analysis not ready yet, will retry...');
            return;
          }
          
          throw new Error(errorData.error || 'Failed to get analysis URL');
        }

        const { url } = await urlResponse.json();

        // Step 2: Fetch analysis JSON from S3
        const analysisResponse = await fetch(url);
        
        if (!analysisResponse.ok) {
          throw new Error('Failed to fetch analysis data');
        }

        const data: AnalysisData = await analysisResponse.json();
        
        if (isMounted) {
          setAnalysisData(data);
          
          // Stop polling once we have data
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
        }
      } catch (err) {
        console.error('Error fetching analysis data:', err);
        // Don't set error state, just keep polling
      }
    };

    // Initial fetch
    fetchAnalysisData();

    // Poll every 5 seconds
    pollInterval = setInterval(fetchAnalysisData, 5000);

    // Cleanup
    return () => {
      isMounted = false;
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
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
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-full flex items-start justify-center p-4 py-8">
        <Card
          className="w-full max-w-7xl bg-[#0a1628] border-blue-500/30 shadow-2xl shadow-blue-500/20"
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

          {/* Main Content: Video/Transcript on Top, Analysis Full Width Below */}
          <div className="space-y-6">
            {/* Top Row: Video + Transcript Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player - Left Side (2/3 width) */}
              <div className="lg:col-span-2 h-[600px] flex flex-col">
                <div className="bg-black rounded-xl overflow-hidden flex-1">
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
                      ref={videoRef}
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

              {/* Transcript Panel - Right Side (1/3 width) */}
              <div className="lg:col-span-1 h-[600px]">
                <div className="bg-[#0a1628] border border-blue-500/20 rounded-xl overflow-hidden h-full">
                  <TranscriptPanel 
                    videoKey={videoKey || ''} 
                    currentTime={currentTime}
                    onSeekTo={handleSeekTo}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Row: Analysis Panel - Full Width */}
            <div className="w-full">
              <div className="bg-[#0a1628] border border-cyan-500/20 rounded-xl overflow-hidden h-[500px]">
                <AnalysisSection 
                  transcript={transcript}
                  analysisData={analysisData}
                  loading={transcriptLoading}
                  error={transcriptError}
                  onSeekTo={handleSeekTo}
                />
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
    </div>
  );
}
