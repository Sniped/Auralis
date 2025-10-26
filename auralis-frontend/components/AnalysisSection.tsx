/**
 * Analysis Section Component
 * 
 * Main container for clinical analysis visualizations.
 * Computes metrics from AWS Transcribe data and displays insights.
 */

'use client';

import { useMemo } from 'react';
import { TranscriptResponse, AnalysisData } from '@/types/transcript';
import {
  calculateDuration,
  getSpeakerStats,
  getWordCount,
  calculateSpeakingRate,
  getAverageConfidence,
  getLowConfidenceSegments,
  getKeyMoments,
  AnalysisMetrics,
} from '@/lib/analysis-utils';
import EmotionalJourneyCard from './analysis/EmotionalJourneyCard';
import OverviewCard from './analysis/OverviewCard';
import SpeakerDistributionCard from './analysis/SpeakerDistributionCard';
import TranscriptQualityCard from './analysis/TranscriptQualityCard';
import ConversationFlowCard from './analysis/ConversationFlowCard';
import KeyMomentsCard from './analysis/KeyMomentsCard';

interface AnalysisSectionProps {
  transcript: TranscriptResponse | null;
  analysisData: AnalysisData | null;
  loading: boolean;
  error: string | null;
  onSeekTo: (seconds: number) => void;
}

export default function AnalysisSection({
  transcript,
  analysisData,
  loading,
  error,
  onSeekTo,
}: AnalysisSectionProps) {
  // Compute metrics from transcript data
  const metrics: AnalysisMetrics | null = useMemo(() => {
    if (!transcript?.results) return null;

    const audioSegments = transcript.results.audio_segments || [];
    const fullTranscript = transcript.results.transcripts?.[0]?.transcript || '';
    const items = transcript.results.items || [];

    const duration = calculateDuration(audioSegments);
    const wordCount = getWordCount(fullTranscript);
    const speakerStats = getSpeakerStats(audioSegments, duration);
    const speakingRate = calculateSpeakingRate(wordCount, duration);
    const averageConfidence = getAverageConfidence(items);
    const lowConfidenceSegments = getLowConfidenceSegments(items, 0.8);
    const keyMoments = getKeyMoments(audioSegments);

    return {
      duration,
      speakerCount: speakerStats.length,
      wordCount,
      speakingRate,
      averageConfidence,
      speakerStats,
      lowConfidenceSegments,
      keyMoments,
    };
  }, [transcript]);

  // Loading State
  if (loading) {
    return (
      <div className="h-full flex flex-col bg-[#0a1628]">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-cyan-500/20">
          <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Clinical Analysis
          </h3>
        </div>

        {/* Loading Skeletons */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-custom space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-20 bg-slate-700 rounded"></div>
                <div className="h-20 bg-slate-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Not Available State
  if (!transcript && !error) {
    return (
      <div className="h-full flex flex-col bg-[#0a1628]">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-cyan-500/20">
          <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Clinical Analysis
          </h3>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <svg className="w-16 h-16 text-cyan-400/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm text-gray-400">Analysis not available</p>
            <p className="text-xs text-gray-500 mt-1">Transcript data is required for analysis</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="h-full flex flex-col bg-[#0a1628]">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-cyan-500/20">
          <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Clinical Analysis
          </h3>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-400">Failed to load analysis</p>
            <p className="text-xs text-gray-500 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // No metrics computed
  if (!metrics) {
    return (
      <div className="h-full flex flex-col bg-[#0a1628]">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-cyan-500/20">
          <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Clinical Analysis
          </h3>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-sm text-gray-400">Unable to compute metrics</p>
            <p className="text-xs text-gray-500 mt-1">Transcript data may be incomplete</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Analysis Display
  return (
    <div className="h-full flex flex-col bg-[#0a1628]">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-cyan-500/20">
        <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Clinical Analysis
        </h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-custom space-y-6">
        {/* Row 1: Emotional Journey - Full Width */}
        <EmotionalJourneyCard
          analysisData={analysisData}
          loading={loading}
          onSeekTo={onSeekTo}
        />

        {/* Row 2: Overview - Full Width */}
        <OverviewCard
          duration={metrics.duration}
          speakerCount={metrics.speakerCount}
          wordCount={metrics.wordCount}
          speakingRate={metrics.speakingRate}
        />

        {/* Row 3: Speaker Distribution + Quality - 50/50 Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpeakerDistributionCard speakerStats={metrics.speakerStats} />
          <TranscriptQualityCard
            averageConfidence={metrics.averageConfidence}
            lowConfidenceSegments={metrics.lowConfidenceSegments}
          />
        </div>

        {/* Row 4: Conversation Flow - Full Width */}
        {transcript?.results?.audio_segments && (
          <ConversationFlowCard
            audioSegments={transcript.results.audio_segments}
            duration={metrics.duration}
          />
        )}

        {/* Row 5: Key Moments - Full Width */}
        <KeyMomentsCard keyMoments={metrics.keyMoments} onSeekTo={onSeekTo} />
      </div>
    </div>
  );
}
