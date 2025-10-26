/**
 * Analysis Utility Functions
 * 
 * Compute clinical metrics from AWS Transcribe data for medical documentation analysis.
 */

import { AudioSegment, TranscriptItem, SegmentSentiment, SentimentScores } from '@/types/transcript';
import { formatSpeakerLabel } from './s3-helpers';

export interface SpeakerStats {
  speakerId: string;
  speakerLabel: string;
  duration: number;
  percentage: number;
  wordCount: number;
}

export interface LowConfidenceSegment {
  text: string;
  time: string;
  confidence: number;
}

export interface KeyMoment {
  time: string;
  label: string;
  timestamp: number;
}

export interface AnalysisMetrics {
  duration: number;
  speakerCount: number;
  wordCount: number;
  speakingRate: number;
  averageConfidence: number;
  speakerStats: SpeakerStats[];
  lowConfidenceSegments: LowConfidenceSegment[];
  keyMoments: KeyMoment[];
}

/**
 * Calculate total conversation duration from segments
 */
export function calculateDuration(segments: AudioSegment[]): number {
  if (!segments || segments.length === 0) return 0;
  
  const lastSegment = segments[segments.length - 1];
  return parseFloat(lastSegment.end_time);
}

/**
 * Get speaking time statistics per speaker
 */
export function getSpeakerStats(segments: AudioSegment[], totalDuration: number): SpeakerStats[] {
  if (!segments || segments.length === 0) return [];
  
  const speakerMap = new Map<string, { duration: number; wordCount: number }>();
  
  // Calculate duration and word count per speaker
  segments.forEach(segment => {
    const duration = parseFloat(segment.end_time) - parseFloat(segment.start_time);
    const wordCount = segment.transcript.split(/\s+/).filter(w => w.length > 0).length;
    
    const current = speakerMap.get(segment.speaker_label) || { duration: 0, wordCount: 0 };
    speakerMap.set(segment.speaker_label, {
      duration: current.duration + duration,
      wordCount: current.wordCount + wordCount,
    });
  });
  
  // Convert to array with percentages
  const stats: SpeakerStats[] = Array.from(speakerMap.entries())
    .map(([speakerId, data]) => ({
      speakerId,
      speakerLabel: formatSpeakerLabel(speakerId),
      duration: data.duration,
      percentage: totalDuration > 0 ? (data.duration / totalDuration) * 100 : 0,
      wordCount: data.wordCount,
    }))
    .sort((a, b) => b.duration - a.duration);
  
  return stats;
}

/**
 * Count words in transcript
 */
export function getWordCount(transcript: string): number {
  if (!transcript) return 0;
  return transcript.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Calculate speaking rate (words per minute)
 */
export function calculateSpeakingRate(wordCount: number, durationSeconds: number): number {
  if (durationSeconds === 0) return 0;
  const minutes = durationSeconds / 60;
  return Math.round(wordCount / minutes);
}

/**
 * Calculate average confidence score from transcript items
 */
export function getAverageConfidence(items: TranscriptItem[]): number {
  if (!items || items.length === 0) return 0;
  
  const itemsWithConfidence = items.filter(item => 
    item.type === 'pronunciation' && item.alternatives?.[0]?.confidence
  );
  
  if (itemsWithConfidence.length === 0) return 0;
  
  const totalConfidence = itemsWithConfidence.reduce((sum, item) => {
    return sum + parseFloat(item.alternatives[0].confidence);
  }, 0);
  
  return totalConfidence / itemsWithConfidence.length;
}

/**
 * Find segments with low transcription confidence
 */
export function getLowConfidenceSegments(
  items: TranscriptItem[], 
  threshold: number = 0.8
): LowConfidenceSegment[] {
  if (!items || items.length === 0) return [];
  
  const lowConfidence: LowConfidenceSegment[] = [];
  
  items.forEach(item => {
    if (item.type === 'pronunciation' && item.alternatives?.[0]) {
      const confidence = parseFloat(item.alternatives[0].confidence);
      
      if (confidence < threshold) {
        lowConfidence.push({
          text: item.alternatives[0].content,
          time: item.start_time || '0',
          confidence: confidence,
        });
      }
    }
  });
  
  return lowConfidence;
}

/**
 * Extract key moments from conversation
 */
export function getKeyMoments(audioSegments: AudioSegment[]): KeyMoment[] {
  if (!audioSegments || audioSegments.length === 0) return [];
  
  const moments: KeyMoment[] = [];
  const duration = calculateDuration(audioSegments);
  
  // Start of conversation
  moments.push({
    time: formatTimestamp(0),
    label: 'Conversation Start',
    timestamp: 0,
  });
  
  // Speaker changes
  let previousSpeaker = audioSegments[0]?.speaker_label;
  audioSegments.forEach((segment, index) => {
    if (index > 0 && segment.speaker_label !== previousSpeaker) {
      const timestamp = parseFloat(segment.start_time);
      moments.push({
        time: formatTimestamp(timestamp),
        label: `Speaker Change to ${formatSpeakerLabel(segment.speaker_label)}`,
        timestamp: timestamp,
      });
    }
    previousSpeaker = segment.speaker_label;
  });
  
  // End of conversation
  moments.push({
    time: formatTimestamp(duration),
    label: 'Conversation End',
    timestamp: duration,
  });
  
  // Limit to max 8 moments (start, end, + 6 most significant speaker changes)
  if (moments.length > 8) {
    const start = moments[0];
    const end = moments[moments.length - 1];
    const changes = moments.slice(1, -1);
    
    // Keep evenly distributed moments
    const step = Math.floor(changes.length / 6);
    const selectedChanges = changes.filter((_, i) => i % step === 0).slice(0, 6);
    
    return [start, ...selectedChanges, end];
  }
  
  return moments;
}

/**
 * Format seconds to MM:SS or HH:MM:SS
 */
export function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format duration to human-readable string
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get conversation balance insight
 */
export function getConversationBalance(speakerStats: SpeakerStats[]): string {
  if (speakerStats.length === 0) return 'No data';
  if (speakerStats.length === 1) return 'Single speaker';
  
  const topSpeaker = speakerStats[0];
  
  if (topSpeaker.percentage > 70) {
    return `${topSpeaker.speakerLabel} dominated (${Math.round(topSpeaker.percentage)}%)`;
  } else if (topSpeaker.percentage > 60) {
    return `${topSpeaker.speakerLabel} led conversation (${Math.round(topSpeaker.percentage)}%)`;
  } else {
    return 'Balanced conversation';
  }
}

/**
 * Get quality assessment from confidence score
 */
export function getQualityAssessment(confidence: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (confidence >= 0.9) {
    return {
      label: 'Excellent',
      color: 'text-green-400',
      bgColor: 'bg-green-500',
    };
  } else if (confidence >= 0.8) {
    return {
      label: 'Good',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500',
    };
  } else {
    return {
      label: 'Fair',
      color: 'text-red-400',
      bgColor: 'bg-red-500',
    };
  }
}

/**
 * Get speaker color for visualizations
 */
export function getSpeakerColor(speakerId: string): string {
  const colors = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#8b5cf6', // Purple
    '#f59e0b', // Orange
    '#ec4899', // Pink
    '#06b6d4', // Cyan
  ];
  
  // Extract number from spk_0, spk_1, etc.
  const match = speakerId.match(/(\d+)/);
  const index = match ? parseInt(match[1], 10) : 0;
  
  return colors[index % colors.length];
}

/**
 * Get sentiment color based on sentiment type
 */
export function getSentimentColor(sentiment: string): string {
  switch (sentiment.toUpperCase()) {
    case 'POSITIVE':
      return 'green';
    case 'NEGATIVE':
      return 'red';
    case 'NEUTRAL':
      return 'gray';
    case 'MIXED':
      return 'yellow';
    default:
      return 'gray';
  }
}

/**
 * Get sentiment emoji based on sentiment type
 */
export function getSentimentEmoji(sentiment: string): string {
  switch (sentiment.toUpperCase()) {
    case 'POSITIVE':
      return '😊';
    case 'NEGATIVE':
      return '😟';
    case 'NEUTRAL':
      return '😐';
    case 'MIXED':
      return '😕';
    default:
      return '😐';
  }
}

/**
 * Get key emotional moments from sentiment segments
 */
export function getKeyEmotionalMoments(segments: SegmentSentiment[]): Array<{
  time: string;
  timestamp: number;
  sentiment: string;
  text: string;
  score: number;
}> {
  if (!segments || segments.length === 0) return [];
  
  const moments: Array<{
    time: string;
    timestamp: number;
    sentiment: string;
    text: string;
    score: number;
  }> = [];
  
  segments.forEach((segment) => {
    // Get the dominant sentiment score
    const scores = segment.sentiment_score;
    const dominantScore = Math.max(
      scores.Positive,
      scores.Negative,
      scores.Neutral,
      scores.Mixed
    );
    
    // Only include moments with strong sentiment (>0.7)
    if (dominantScore > 0.7 && segment.sentiment !== 'NEUTRAL') {
      moments.push({
        time: formatTimestamp(segment.start_time),
        timestamp: segment.start_time,
        sentiment: segment.sentiment,
        text: segment.text.substring(0, 50) + (segment.text.length > 50 ? '...' : ''),
        score: dominantScore,
      });
    }
  });
  
  // Sort by timestamp
  return moments.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Generate clinical insight based on sentiment data
 */
export function generateEmotionalInsight(
  overallSentiment: string,
  segments: SegmentSentiment[]
): string {
  if (!segments || segments.length === 0) {
    return `Overall emotional state: ${overallSentiment.toLowerCase()}`;
  }
  
  // Count sentiment changes
  let sentimentChanges = 0;
  let negativeSpikes = 0;
  let positiveSpikes = 0;
  
  for (let i = 1; i < segments.length; i++) {
    if (segments[i].sentiment !== segments[i - 1].sentiment) {
      sentimentChanges++;
    }
    
    if (segments[i].sentiment === 'NEGATIVE' && segments[i].sentiment_score.Negative > 0.7) {
      negativeSpikes++;
    }
    
    if (segments[i].sentiment === 'POSITIVE' && segments[i].sentiment_score.Positive > 0.7) {
      positiveSpikes++;
    }
  }
  
  // Generate insight based on patterns
  if (overallSentiment === 'POSITIVE' && negativeSpikes === 0) {
    return 'Patient maintained positive affect throughout conversation with stable emotional state.';
  }
  
  if (overallSentiment === 'NEGATIVE') {
    return `Patient expressed distress during conversation. ${negativeSpikes} moment${negativeSpikes !== 1 ? 's' : ''} of heightened concern detected.`;
  }
  
  if (sentimentChanges > segments.length * 0.5) {
    return `Emotional state fluctuated throughout conversation with ${sentimentChanges} sentiment shifts. Consider follow-up on patient concerns.`;
  }
  
  if (negativeSpikes > 0 && positiveSpikes > 0) {
    const firstNegative = segments.find(s => s.sentiment === 'NEGATIVE' && s.sentiment_score.Negative > 0.7);
    const lastPositive = segments.reverse().find(s => s.sentiment === 'POSITIVE' && s.sentiment_score.Positive > 0.7);
    
    if (firstNegative && lastPositive && lastPositive.start_time > firstNegative.start_time) {
      return `Brief distress detected at ${formatTimestamp(firstNegative.start_time)}, resolved by ${formatTimestamp(lastPositive.start_time)}. Patient showed emotional resilience.`;
    }
    
    return `Mixed emotional responses noted. Patient expressed both concerns and positive reactions during visit.`;
  }
  
  if (overallSentiment === 'NEUTRAL') {
    return 'Patient maintained neutral emotional state throughout conversation. No significant distress or elevated positive affect detected.';
  }
  
  return 'Emotional state remained stable throughout the conversation.';
}

/**
 * Convert sentiment scores to percentages
 */
export function getSentimentPercentages(scores: SentimentScores): {
  Positive: number;
  Negative: number;
  Neutral: number;
  Mixed: number;
} {
  return {
    Positive: Math.round(scores.Positive * 1000) / 10,
    Negative: Math.round(scores.Negative * 1000) / 10,
    Neutral: Math.round(scores.Neutral * 1000) / 10,
    Mixed: Math.round(scores.Mixed * 1000) / 10,
  };
}

/**
 * Convert AWS Call Analytics sentiment score (-5 to 5) to sentiment label
 * 
 * @param score - Sentiment score from -5 (very negative) to 5 (very positive)
 * @returns Sentiment label: POSITIVE, NEGATIVE, or NEUTRAL
 */
export function getCallAnalyticsSentimentLabel(score: number): string {
  if (score >= 2) return 'POSITIVE';
  if (score <= -2) return 'NEGATIVE';
  return 'NEUTRAL';
}

/**
 * Convert AWS Call Analytics overall sentiment to percentage-based scores
 * 
 * @param overallScore - Overall sentiment score (-5 to 5)
 * @returns SentimentScores object with percentages
 */
export function convertCallAnalyticsToScores(overallScore: number): SentimentScores {
  // Normalize -5 to 5 scale to 0-1 scale
  const normalized = (overallScore + 5) / 10;
  
  if (overallScore >= 2) {
    // Positive
    return {
      Positive: normalized,
      Negative: 0.1,
      Neutral: 1 - normalized - 0.1,
      Mixed: 0,
    };
  } else if (overallScore <= -2) {
    // Negative
    return {
      Positive: 0.1,
      Negative: 1 - normalized,
      Neutral: normalized - 0.1,
      Mixed: 0,
    };
  } else {
    // Neutral
    return {
      Positive: 0.2,
      Negative: 0.2,
      Neutral: 0.6,
      Mixed: 0,
    };
  }
}
