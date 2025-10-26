/**
 * Analysis Types
 * 
 * TypeScript interfaces for clinical analysis metrics.
 */

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
