/**
 * Emotional Journey Card Component
 * 
 * Visualizes sentiment analysis data from AWS Comprehend or AWS Call Analytics.
 * Shows overall sentiment, distribution, timeline, and key emotional moments.
 */

import { AnalysisData, SentimentPeriod } from '@/types/transcript';
import {
  getSentimentColor,
  getSentimentEmoji,
  getKeyEmotionalMoments,
  generateEmotionalInsight,
  getSentimentPercentages,
  formatTimestamp,
  getCallAnalyticsSentimentLabel,
  convertCallAnalyticsToScores,
} from '@/lib/analysis-utils';

interface EmotionalJourneyCardProps {
  analysisData: AnalysisData | null;
  loading?: boolean;
  onSeekTo?: (seconds: number) => void;
}

export default function EmotionalJourneyCard({
  analysisData,
  loading,
  onSeekTo,
}: EmotionalJourneyCardProps) {
  // Loading State
  if (loading) {
    return (
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-16 bg-slate-700 rounded"></div>
          <div className="h-24 bg-slate-700 rounded"></div>
          <div className="h-32 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Not Available State
  if (!analysisData?.sentiment_analysis && !analysisData?.ConversationCharacteristics?.Sentiment) {
    return (
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">😊</span>
          Emotional Journey
        </h3>
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-slate-400">Emotional analysis not available</p>
          <p className="text-xs text-slate-500 mt-1">Sentiment data has not been processed yet</p>
        </div>
      </div>
    );
  }

  // Detect format and extract data
  let overall_sentiment: string;
  let sentiment_scores: { Positive: number; Negative: number; Neutral: number; Mixed: number };
  let segment_sentiments: Array<{ 
    text: string; 
    sentiment: string; 
    sentiment_score: { Positive: number; Negative: number; Neutral: number; Mixed: number }; 
    start_time: number; 
    end_time: number 
  }> = [];
  let duration = 0;

  if (analysisData?.ConversationCharacteristics?.Sentiment) {
    // AWS Call Analytics format
    const callSentiment = analysisData.ConversationCharacteristics.Sentiment;
    const overallScore = callSentiment.OverallSentiment.CUSTOMER || callSentiment.OverallSentiment.AGENT || 0;
    
    overall_sentiment = getCallAnalyticsSentimentLabel(overallScore);
    sentiment_scores = convertCallAnalyticsToScores(overallScore);
    
    // Convert quarterly sentiment periods to segments
    const customerPeriods = callSentiment.SentimentByPeriod.QUARTER.CUSTOMER || [];
    
    // Use customer periods (can combine with agent later if needed)
    segment_sentiments = customerPeriods.map((period: SentimentPeriod) => ({
      text: '', // No text in Call Analytics format
      sentiment: getCallAnalyticsSentimentLabel(period.Score),
      sentiment_score: convertCallAnalyticsToScores(period.Score),
      start_time: period.BeginOffsetMillis / 1000, // Convert to seconds
      end_time: period.EndOffsetMillis / 1000,
    }));
    
    duration = analysisData.ConversationCharacteristics.TotalConversationDurationMillis / 1000;
  } else if (analysisData?.sentiment_analysis) {
    // AWS Comprehend format (legacy)
    overall_sentiment = analysisData.sentiment_analysis.overall_sentiment;
    sentiment_scores = analysisData.sentiment_analysis.sentiment_scores;
    segment_sentiments = analysisData.sentiment_analysis.segment_sentiments || [];
    
    if (segment_sentiments.length > 0) {
      duration = segment_sentiments[segment_sentiments.length - 1].end_time;
    }
  } else {
    // Fallback - shouldn't reach here due to earlier check
    return null;
  }

  const percentages = getSentimentPercentages(sentiment_scores);
  const colorBase = getSentimentColor(overall_sentiment);
  const emoji = getSentimentEmoji(overall_sentiment);
  const keyMoments = getKeyEmotionalMoments(segment_sentiments);
  const insight = generateEmotionalInsight(overall_sentiment, segment_sentiments);

  // Map color base to actual Tailwind classes
  const colorClasses = {
    green: {
      bg: 'bg-green-500/20',
      border: 'border-green-500/40',
      text: 'text-green-400',
      bar: 'bg-green-500',
      barHover: 'hover:bg-green-400',
      badge: 'bg-green-500/20',
      badgeBorder: 'border-green-500/30',
      badgeText: 'text-green-300',
      hoverBorder: 'hover:border-green-500/50',
    },
    red: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/40',
      text: 'text-red-400',
      bar: 'bg-red-500',
      barHover: 'hover:bg-red-400',
      badge: 'bg-red-500/20',
      badgeBorder: 'border-red-500/30',
      badgeText: 'text-red-300',
      hoverBorder: 'hover:border-red-500/50',
    },
    gray: {
      bg: 'bg-gray-500/20',
      border: 'border-gray-500/40',
      text: 'text-gray-400',
      bar: 'bg-gray-500',
      barHover: 'hover:bg-gray-400',
      badge: 'bg-gray-500/20',
      badgeBorder: 'border-gray-500/30',
      badgeText: 'text-gray-300',
      hoverBorder: 'hover:border-gray-500/50',
    },
    yellow: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/40',
      text: 'text-yellow-400',
      bar: 'bg-yellow-500',
      barHover: 'hover:bg-yellow-400',
      badge: 'bg-yellow-500/20',
      badgeBorder: 'border-yellow-500/30',
      badgeText: 'text-yellow-300',
      hoverBorder: 'hover:border-yellow-500/50',
    },
  };

  const colors = colorClasses[colorBase as keyof typeof colorClasses];

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
      {/* Header */}
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        Emotional Journey
      </h3>

      {/* Overall Sentiment Badge */}
      <div className="mb-6">
        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl ${colors.bg} border ${colors.border}`}>
          <span className="text-3xl">{emoji}</span>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Overall Sentiment</div>
            <div className={`text-xl font-bold ${colors.text}`}>
              {overall_sentiment}
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Distribution */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-slate-300 mb-3">Sentiment Distribution</h4>
        
        {/* Stacked Bar */}
        <div className="h-8 rounded-full overflow-hidden flex bg-slate-800 mb-3">
          {percentages.Positive > 0 && (
            <div
              className="bg-green-500 hover:bg-green-400 transition-all"
              style={{ width: `${percentages.Positive}%` }}
              title={`Positive: ${percentages.Positive}%`}
            />
          )}
          {percentages.Negative > 0 && (
            <div
              className="bg-red-500 hover:bg-red-400 transition-all"
              style={{ width: `${percentages.Negative}%` }}
              title={`Negative: ${percentages.Negative}%`}
            />
          )}
          {percentages.Neutral > 0 && (
            <div
              className="bg-gray-500 hover:bg-gray-400 transition-all"
              style={{ width: `${percentages.Neutral}%` }}
              title={`Neutral: ${percentages.Neutral}%`}
            />
          )}
          {percentages.Mixed > 0 && (
            <div
              className="bg-yellow-500 hover:bg-yellow-400 transition-all"
              style={{ width: `${percentages.Mixed}%` }}
              title={`Mixed: ${percentages.Mixed}%`}
            />
          )}
        </div>

        {/* Breakdown List */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-slate-300">{percentages.Positive}% Positive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-slate-300">{percentages.Negative}% Negative</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span className="text-sm text-slate-300">{percentages.Neutral}% Neutral</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-slate-300">{percentages.Mixed}% Mixed</span>
          </div>
        </div>
      </div>

      {/* Emotional Timeline */}
      {segment_sentiments && segment_sentiments.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Emotional Timeline</h4>
          
          <div className="relative h-10 bg-slate-800 rounded-lg overflow-hidden">
            {segment_sentiments.map((segment, index: number) => {
              const start = segment.start_time;
              const end = segment.end_time;
              const left = (start / duration) * 100;
              const width = ((end - start) / duration) * 100;
              const segmentColor = getSentimentColor(segment.sentiment);
              const segmentColorClasses = colorClasses[segmentColor as keyof typeof colorClasses];
              
              return (
                <div
                  key={index}
                  className={`absolute top-0 bottom-0 ${segmentColorClasses.bar} hover:opacity-80 transition-all cursor-pointer group`}
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                  }}
                  title={`${formatTimestamp(start)} - ${formatTimestamp(end)}: ${segment.sentiment}`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-950 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    <div className="font-semibold">{segment.sentiment}</div>
                    <div className="text-slate-400">{formatTimestamp(start)} - {formatTimestamp(end)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Markers */}
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>0:00</span>
            <span>{formatTimestamp(duration / 2)}</span>
            <span>{formatTimestamp(duration)}</span>
          </div>
        </div>
      )}

      {/* Key Emotional Moments */}
      {keyMoments.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Key Emotional Moments</h4>
          <div className="space-y-2">
            {keyMoments.slice(0, 5).map((moment, index) => {
              const momentEmoji = getSentimentEmoji(moment.sentiment);
              const momentColor = getSentimentColor(moment.sentiment);
              const momentColorClasses = colorClasses[momentColor as keyof typeof colorClasses];
              
              return (
                <button
                  key={index}
                  onClick={() => onSeekTo?.(moment.timestamp)}
                  className={`w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/30 ${momentColorClasses.hoverBorder} rounded-lg transition-all group text-left`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{momentEmoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 ${momentColorClasses.badge} ${momentColorClasses.badgeText} font-mono text-xs rounded border ${momentColorClasses.badgeBorder}`}>
                          {moment.time}
                        </span>
                        <span className={`text-xs font-semibold ${momentColorClasses.text} uppercase`}>
                          {moment.sentiment}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 truncate">{moment.text}</p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Clinical Insight */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <div className="flex-1">
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-1">
              Clinical Insight
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {insight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
