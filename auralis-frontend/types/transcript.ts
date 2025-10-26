/**
 * TypeScript Types for Transcript and Analysis Data
 * 
 * Based on AWS Transcribe JSON output format and sentiment analysis structure.
 */

// ============================================================================
// Transcript Types (AWS Transcribe Format)
// ============================================================================

/**
 * Individual word or punctuation item in transcript
 */
export interface TranscriptItem {
  start_time?: string;
  end_time?: string;
  alternatives: Array<{
    confidence: string;
    content: string;
  }>;
  type: 'pronunciation' | 'punctuation';
  speaker_label?: string;
}

/**
 * Speaker segment with timing information
 */
export interface SpeakerSegment {
  start_time: string;
  speaker_label: string;
  end_time: string;
  items: Array<{
    start_time: string;
    speaker_label: string;
    end_time: string;
  }>;
}

/**
 * Audio segment with speaker label and transcript text
 */
export interface AudioSegment {
  id: number;
  transcript: string;
  start_time: string;
  end_time: string;
  speaker_label: string;
  items: number[];
  confidence?: string;
}

/**
 * Speaker labels section of transcript
 */
export interface SpeakerLabels {
  speakers: number;
  segments: SpeakerSegment[];
}

/**
 * Main transcript section with full text
 */
export interface Transcript {
  transcript: string;
}

/**
 * Results section containing all transcript data
 */
export interface TranscriptResults {
  transcripts: Transcript[];
  speaker_labels?: SpeakerLabels;
  audio_segments?: AudioSegment[];
  items: TranscriptItem[];
}

// Sentiment Analysis Types
// AWS Comprehend format (legacy)
export interface SentimentScores {
  Positive: number;
  Negative: number;
  Neutral: number;
  Mixed: number;
}

export interface SegmentSentiment {
  text: string;
  sentiment: string;
  sentiment_score: SentimentScores;
  start_time: number;
  end_time: number;
}

export interface SentimentAnalysis {
  overall_sentiment: string;
  sentiment_scores: SentimentScores;
  segment_sentiments?: SegmentSentiment[];
}

// AWS Call Analytics format (current)
export interface SentimentPeriod {
  BeginOffsetMillis: number;
  EndOffsetMillis: number;
  Score: number; // -5 to 5 scale
}

export interface SentimentByPeriod {
  QUARTER: {
    AGENT?: SentimentPeriod[];
    CUSTOMER?: SentimentPeriod[];
  };
}

export interface CallAnalyticsSentiment {
  OverallSentiment: {
    AGENT?: number;
    CUSTOMER?: number;
  };
  SentimentByPeriod: SentimentByPeriod;
}

export interface ConversationCharacteristics {
  TotalConversationDurationMillis: number;
  Sentiment: CallAnalyticsSentiment;
  TalkTime?: Record<string, unknown>;
  TalkSpeed?: Record<string, unknown>;
  Interruptions?: Record<string, unknown>;
  NonTalkTime?: Record<string, unknown>;
}

export interface TranscriptItem {
  Type: string;
  Confidence: string;
  Content: string;
  BeginOffsetMillis?: number;
  EndOffsetMillis?: number;
}

export interface CallAnalyticsTranscript {
  ParticipantRole: string;
  Content: string;
  Items: TranscriptItem[];
  LoudnessScores?: number[];
  Sentiment?: number;
}

export interface AnalysisData {
  // AWS Comprehend format (legacy)
  sentiment_analysis?: SentimentAnalysis;
  
  // AWS Call Analytics format (current)
  ConversationCharacteristics?: ConversationCharacteristics;
  Transcript?: CallAnalyticsTranscript[];
  JobName?: string;
  JobStatus?: string;
  LanguageCode?: string;
}

export interface SummaryData {
  summary: string;
  fileName: string;
  generatedAt: string;
}

/**
 * Complete AWS Transcribe response structure
 */
export interface TranscriptResponse {
  jobName: string;
  accountId: string;
  status: string;
  results: TranscriptResults;
}

// ============================================================================
// Analysis Types (Sentiment Analysis)
// ============================================================================

/**
 * Sentiment score breakdown
 */
export interface SentimentScore {
  positive?: number;
  negative?: number;
  neutral?: number;
  mixed?: number;
}

/**
 * Key phrase detected in transcript
 */
export interface KeyPhrase {
  score?: number;
  text: string;
  beginOffset?: number;
  endOffset?: number;
}

/**
 * Named entity detected in transcript
 */
export interface Entity {
  score?: number;
  type: string;
  text: string;
  beginOffset?: number;
  endOffset?: number;
}

/**
 * Sentiment analysis for a segment or overall
 */
export interface SentimentData {
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
  sentimentScore?: SentimentScore;
}

/**
 * Complete analysis response structure
 * Note: Adjust this based on actual analysis file structure
 */
export interface AnalysisResponse {
  sentiment?: SentimentData;
  keyPhrases?: KeyPhrase[];
  entities?: Entity[];
  overallSentiment?: string;
  medicalSymptoms?: string[];
  emotionalCues?: string[];
  keyInsights?: string[];
  // Add more fields as needed based on actual analysis output
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Successful pre-signed URL response
 */
export interface PreSignedUrlResponse {
  url: string;
}

/**
 * Error response when file doesn't exist
 */
export interface FileNotFoundResponse {
  error: string;
  exists: false;
}

/**
 * API route response type
 */
export type TranscriptApiResponse = PreSignedUrlResponse | FileNotFoundResponse;
export type AnalysisApiResponse = PreSignedUrlResponse | FileNotFoundResponse;
