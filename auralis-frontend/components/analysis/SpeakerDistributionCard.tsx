/**
 * Speaker Distribution Card Component
 * 
 * Visual representation of speaking time per participant.
 */

import { SpeakerStats, getSpeakerColor, getConversationBalance, formatDuration } from '@/lib/analysis-utils';

interface SpeakerDistributionCardProps {
  speakerStats: SpeakerStats[];
}

export default function SpeakerDistributionCard({ speakerStats }: SpeakerDistributionCardProps) {
  const balance = getConversationBalance(speakerStats);
  
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Speaking Time Distribution
      </h3>
      
      {/* Stacked Bar Chart */}
      <div className="mb-6">
        <div className="h-8 rounded-full overflow-hidden flex bg-slate-800">
          {speakerStats.map((speaker) => (
            <div
              key={speaker.speakerId}
              style={{
                width: `${speaker.percentage}%`,
                backgroundColor: getSpeakerColor(speaker.speakerId),
              }}
              className="transition-all hover:opacity-80"
              title={`${speaker.speakerLabel}: ${Math.round(speaker.percentage)}%`}
            />
          ))}
        </div>
      </div>
      
      {/* Speaker List */}
      <div className="space-y-3">
        {speakerStats.map((speaker) => (
          <div key={speaker.speakerId} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: getSpeakerColor(speaker.speakerId) }}
              />
              <span className="text-sm font-medium text-slate-200">{speaker.speakerLabel}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">{formatDuration(speaker.duration)}</span>
              <span className="text-sm font-semibold text-cyan-400 w-12 text-right">
                {Math.round(speaker.percentage)}%
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Insight */}
      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-slate-300">{balance}</span>
        </div>
      </div>
    </div>
  );
}
