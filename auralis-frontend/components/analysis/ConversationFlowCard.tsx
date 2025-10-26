/**
 * Conversation Flow Card Component
 * 
 * Visual timeline showing when each speaker talked throughout the conversation.
 */

import { AudioSegment } from '@/types/transcript';
import { getSpeakerColor, formatTimestamp } from '@/lib/analysis-utils';
import { formatSpeakerLabel } from '@/lib/s3-helpers';

interface ConversationFlowCardProps {
  audioSegments: AudioSegment[];
  duration: number;
}

export default function ConversationFlowCard({ audioSegments, duration }: ConversationFlowCardProps) {
  // Get unique speakers
  const speakers = Array.from(new Set(audioSegments.map(s => s.speaker_label)));
  
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Conversation Flow
      </h3>
      
      <div className="space-y-3">
        {speakers.map((speaker) => {
          const speakerSegments = audioSegments.filter(s => s.speaker_label === speaker);
          
          return (
            <div key={speaker} className="space-y-1">
              {/* Speaker Label */}
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getSpeakerColor(speaker) }}
                />
                <span className="text-sm font-medium text-slate-300">
                  {formatSpeakerLabel(speaker)}
                </span>
              </div>
              
              {/* Timeline Bar */}
              <div className="relative h-8 bg-slate-800 rounded-lg overflow-hidden">
                {speakerSegments.map((segment, index) => {
                  const start = parseFloat(segment.start_time);
                  const end = parseFloat(segment.end_time);
                  const left = (start / duration) * 100;
                  const width = ((end - start) / duration) * 100;
                  
                  return (
                    <div
                      key={index}
                      className="absolute top-0 bottom-0 transition-all hover:opacity-80 cursor-pointer group"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        backgroundColor: getSpeakerColor(speaker),
                      }}
                      title={`${formatTimestamp(start)} - ${formatTimestamp(end)}`}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-950 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {formatTimestamp(start)} - {formatTimestamp(end)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Time Axis */}
      <div className="mt-4 pt-3 border-t border-slate-700/50">
        <div className="flex justify-between text-xs text-slate-500">
          <span>0:00</span>
          <span>{formatTimestamp(duration / 2)}</span>
          <span>{formatTimestamp(duration)}</span>
        </div>
      </div>
    </div>
  );
}
