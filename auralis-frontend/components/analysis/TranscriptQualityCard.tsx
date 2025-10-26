/**
 * Transcript Quality Card Component
 * 
 * Displays transcription confidence and identifies low-quality segments.
 */

import { LowConfidenceSegment, getQualityAssessment, formatTimestamp } from '@/lib/analysis-utils';

interface TranscriptQualityCardProps {
  averageConfidence: number;
  lowConfidenceSegments: LowConfidenceSegment[];
}

export default function TranscriptQualityCard({ 
  averageConfidence, 
  lowConfidenceSegments 
}: TranscriptQualityCardProps) {
  const quality = getQualityAssessment(averageConfidence);
  const confidencePercent = Math.round(averageConfidence * 100);
  
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Transcript Quality
      </h3>
      
      {/* Overall Confidence */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Average Confidence</span>
          <span className={`text-lg font-semibold ${quality.color}`}>{confidencePercent}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-3 rounded-full transition-all ${quality.bgColor}`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>
      
      {/* Quality Indicator */}
      <div className={`flex items-center gap-2 p-3 rounded-lg ${
        lowConfidenceSegments.length === 0 
          ? 'bg-green-500/10 border border-green-500/30' 
          : 'bg-yellow-500/10 border border-yellow-500/30'
      }`}>
        {lowConfidenceSegments.length === 0 ? (
          <>
            <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-green-300">{quality.label} quality transcript</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm text-yellow-300">
              {lowConfidenceSegments.length} segment{lowConfidenceSegments.length !== 1 ? 's' : ''} with low confidence
            </span>
          </>
        )}
      </div>
      
      {/* Low Confidence Segments */}
      {lowConfidenceSegments.length > 0 && (
        <div className="mt-4 space-y-2 max-h-40 overflow-y-auto scrollbar-custom">
          {lowConfidenceSegments.slice(0, 5).map((segment, index) => (
            <div key={index} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-xs text-yellow-400 font-mono">
                  {formatTimestamp(parseFloat(segment.time))}
                </span>
                <span className="text-xs text-red-400">
                  {Math.round(segment.confidence * 100)}%
                </span>
              </div>
              <p className="text-sm text-slate-300 italic">&ldquo;{segment.text}&rdquo;</p>
            </div>
          ))}
          {lowConfidenceSegments.length > 5 && (
            <p className="text-xs text-slate-500 text-center pt-2">
              +{lowConfidenceSegments.length - 5} more segments
            </p>
          )}
        </div>
      )}
    </div>
  );
}
