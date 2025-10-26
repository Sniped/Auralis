'use client';

import { useEffect, useState, useRef } from 'react';
import { TranscriptResponse, AudioSegment } from '@/types/transcript';
import { formatTimestamp, formatSpeakerLabel } from '@/lib/s3-helpers';

interface TranscriptPanelProps {
  videoKey: string;
  currentTime?: number;
  onSeekTo?: (time: number) => void;
}

/**
 * Transcript Panel Component
 * 
 * Displays AI-generated transcript from AWS Transcribe with speaker labels.
 * Fetches transcript JSON from S3 and displays formatted content.
 * 
 * Features:
 * - Full transcript text display
 * - Speaker-labeled segments with timestamps
 * - Current segment highlighting based on video playback
 * - Click segment to seek video
 * - Search transcript with highlighting
 * - Graceful handling of missing transcripts
 * - Loading and error states
 */

// Helper component to highlight search text
function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  
  return (
    <>
      {parts.map((part, index) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={index} className="bg-yellow-500/30 text-yellow-200 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

export default function TranscriptPanel({ videoKey, currentTime = 0, onSeekTo }: TranscriptPanelProps) {
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const activeSegmentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!videoKey) return;

    const fetchTranscript = async () => {
      setLoading(true);
      setError(null);

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
          
          // Handle "not found" gracefully - don't show as error
          if (errorData.exists === false) {
            setTranscript(null);
            setError(null);
            setLoading(false);
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
        setTranscript(transcriptData);
      } catch (err) {
        console.error('Error fetching transcript:', err);
        setError(err instanceof Error ? err.message : 'Failed to load transcript');
      } finally {
        setLoading(false);
      }
    };

    fetchTranscript();
  }, [videoKey]);

  // Determine if a segment is currently active based on video time
  const isSegmentActive = (segment: AudioSegment): boolean => {
    const startTime = parseFloat(segment.start_time);
    const endTime = parseFloat(segment.end_time);
    return currentTime >= startTime && currentTime <= endTime;
  };

  // Auto-scroll to active segment
  useEffect(() => {
    // Only auto-scroll if user is not manually scrolling
    if (!isUserScrolling && activeSegmentRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeElement = activeSegmentRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      
      // Check if element is outside viewport
      const isOutOfView = 
        elementRect.top < containerRect.top || 
        elementRect.bottom > containerRect.bottom;
      
      if (isOutOfView) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [currentTime, isUserScrolling]);

  // Detect when user manually scrolls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // User is scrolling manually
      setIsUserScrolling(true);
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Re-enable auto-scroll after 3 seconds of no scrolling
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 3000);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Handle segment click to seek video
  const handleSegmentClick = (startTime: string) => {
    if (onSeekTo) {
      onSeekTo(parseFloat(startTime));
    }
  };

  // Filter segments based on search query
  const getFilteredSegments = (segments: AudioSegment[]): AudioSegment[] => {
    if (!searchQuery.trim()) return segments;
    
    const query = searchQuery.toLowerCase();
    return segments.filter(segment => 
      segment.transcript.toLowerCase().includes(query) ||
      formatSpeakerLabel(segment.speaker_label).toLowerCase().includes(query)
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-3"></div>
          <p className="text-sm text-gray-400">Loading transcript...</p>
        </div>
      </div>
    );
  }

  // Not available state (not an error)
  if (!transcript && !error) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <svg className="w-12 h-12 text-blue-400/50 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm text-gray-400">Transcript not available</p>
          <p className="text-xs text-gray-500 mt-1">This recording has not been transcribed yet</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-400">Failed to load transcript</p>
          <p className="text-xs text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const fullTranscript = transcript?.results?.transcripts?.[0]?.transcript || '';
  const audioSegments = transcript?.results?.audio_segments || [];
  const filteredSegments = getFilteredSegments(audioSegments);

  return (
    <div className="h-full flex flex-col bg-[#0a1628] overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-blue-500/20">
        <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2 mb-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Transcript
        </h3>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-gray-800/50 border border-blue-500/30 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
          />
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Search Results Count */}
        {searchQuery && (
          <p className="text-xs text-gray-500 mt-2">
            {filteredSegments.length} result{filteredSegments.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Content */}
      <div 
        ref={containerRef} 
        className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-custom"
      >
        {/* Full Transcript Section */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
            Full Transcript
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {fullTranscript || 'No transcript text available'}
          </p>
        </div>

        {/* Speaker Segments Section */}
        {audioSegments.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
              Speaker Segments {searchQuery && `(${filteredSegments.length}/${audioSegments.length})`}
            </h4>
            {filteredSegments.length === 0 ? (
              <div className="text-center py-8 bg-gray-800/30 border border-gray-700/30 rounded-lg">
                <svg className="w-10 h-10 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-sm text-gray-400">No results found for &quot;{searchQuery}&quot;</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSegments.map((segment, index) => {
                  const isActive = isSegmentActive(segment);
                  
                  return (
                    <div
                      key={segment.id || index}
                      ref={isActive ? activeSegmentRef : null}
                      onClick={() => handleSegmentClick(segment.start_time)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-500/20 border-blue-400/50 shadow-lg shadow-blue-500/20'
                          : 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50 hover:border-blue-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            isActive
                              ? 'bg-blue-500 text-white'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {formatSpeakerLabel(segment.speaker_label)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSegmentClick(segment.start_time);
                              }}
                              className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                              {formatTimestamp(parseFloat(segment.start_time))}
                            </button>
                            <span className="text-xs text-gray-600">→</span>
                            <span className="text-xs text-gray-400">
                              {formatTimestamp(parseFloat(segment.end_time))}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {searchQuery ? (
                              <HighlightText text={segment.transcript} highlight={searchQuery} />
                            ) : (
                              segment.transcript
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {audioSegments.length === 0 && fullTranscript && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">
              Speaker segments not available for this transcript
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
