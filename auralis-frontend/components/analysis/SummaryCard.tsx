/**
 * Summary Card Component
 * 
 * Displays LLM-generated summary of the conversation from sentiment analysis.
 */

import { SummaryData } from '@/types/transcript';

interface SummaryCardProps {
  summaryData: SummaryData | null;
  loading?: boolean;
}

export default function SummaryCard({ summaryData, loading }: SummaryCardProps) {
  // Loading State
  if (loading) {
    return (
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  // Not Available State
  if (!summaryData) {
    return (
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Conversation Summary
        </h3>
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm text-slate-400">Summary not available</p>
          <p className="text-xs text-slate-500 mt-1">AI summary has not been generated yet</p>
        </div>
      </div>
    );
  }

  // Format the generated date
  const formattedDate = new Date(summaryData.generatedAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Conversation Summary
        </h3>
        
        {/* AI Badge */}
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-xs font-semibold text-purple-300 uppercase tracking-wide">AI Generated</span>
        </div>
      </div>

      {/* Summary Content */}
      <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4 mb-4">
        <p className="text-sm text-slate-300 leading-relaxed">
          {summaryData.summary}
        </p>
      </div>

      {/* Footer Metadata */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Generated {formattedDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="truncate">{summaryData.fileName}</span>
        </div>
      </div>
    </div>
  );
}
