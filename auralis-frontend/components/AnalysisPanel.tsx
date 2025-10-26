'use client';

import { useEffect, useState } from 'react';
import { AnalysisResponse } from '@/types/transcript';

interface AnalysisPanelProps {
  videoKey: string;
}

/**
 * Analysis Panel Component
 * 
 * Displays sentiment analysis and key insights from patient interaction recording.
 * Fetches analysis JSON from S3 and displays formatted metrics.
 * 
 * Features:
 * - Overall sentiment indicator with color coding
 * - Key phrases extraction
 * - Named entity recognition
 * - Medical symptoms (if available)
 * - Emotional cues (if available)
 * - Graceful handling of missing analysis
 */
export default function AnalysisPanel({ videoKey }: AnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoKey) return;

    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);

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
          
          // Handle "not found" gracefully - don't show as error
          if (errorData.exists === false) {
            setAnalysis(null);
            setError(null);
            setLoading(false);
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

        const analysisData: AnalysisResponse = await analysisResponse.json();
        setAnalysis(analysisData);
      } catch (err) {
        console.error('Error fetching analysis:', err);
        setError(err instanceof Error ? err.message : 'Failed to load analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [videoKey]);

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mb-3"></div>
          <p className="text-sm text-gray-400">Loading analysis...</p>
        </div>
      </div>
    );
  }

  // Not available state (not an error)
  if (!analysis && !error) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <svg className="w-12 h-12 text-cyan-400/50 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm text-gray-400">Analysis not available</p>
          <p className="text-xs text-gray-500 mt-1">This recording has not been analyzed yet</p>
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
          <p className="text-sm text-red-400">Failed to load analysis</p>
          <p className="text-xs text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0a1628] overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-cyan-500/20">
        <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Analysis
        </h3>
      </div>

      {/* Raw JSON Display */}
      <div className="flex-1 overflow-y-auto p-4">
        <pre className="text-xs text-gray-300 bg-gray-900/50 p-4 rounded-lg overflow-x-auto border border-cyan-500/20">
          {JSON.stringify(analysis, null, 2)}
        </pre>
      </div>
    </div>
  );
}
