/**
 * Key Moments Card Component
 * 
 * Displays clickable timestamps for important conversation moments.
 */

import { KeyMoment } from '@/lib/analysis-utils';

interface KeyMomentsCardProps {
  keyMoments: KeyMoment[];
  onSeekTo: (seconds: number) => void;
}

export default function KeyMomentsCard({ keyMoments, onSeekTo }: KeyMomentsCardProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
        Key Moments
      </h3>
      
      <div className="space-y-2">
        {keyMoments.map((moment, index) => (
          <button
            key={index}
            onClick={() => onSeekTo(moment.timestamp)}
            className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/30 hover:border-cyan-500/50 rounded-lg transition-all group"
          >
            <div className="flex items-center gap-3 flex-1">
              {/* Time Badge */}
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 font-mono text-sm rounded-md border border-cyan-500/30 group-hover:bg-cyan-500/30 transition-colors">
                {moment.time}
              </span>
              
              {/* Label */}
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                {moment.label}
              </span>
            </div>
            
            {/* Jump Icon */}
            <svg 
              className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        ))}
      </div>
      
      {keyMoments.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">No key moments identified</p>
        </div>
      )}
    </div>
  );
}
