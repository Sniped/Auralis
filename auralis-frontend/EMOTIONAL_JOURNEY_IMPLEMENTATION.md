# Emotional Journey Card Implementation

## Overview
Successfully implemented an **Emotional Journey Card** to visualize AWS Comprehend sentiment analysis data as part of the clinical analysis section. This card displays patient emotional state throughout medical consultations.

## Files Created/Modified

### New Files (1)
1. **`components/analysis/EmotionalJourneyCard.tsx`** (352 lines)
   - Main visualization component for emotional sentiment data
   - Displays overall sentiment, distribution, timeline, and key moments
   - Fully integrated with clinical analysis system

### Modified Files (4)
1. **`types/transcript.ts`**
   - Added sentiment analysis interfaces:
     - `SentimentScores`: Positive, Negative, Neutral, Mixed percentages
     - `SegmentSentiment`: Text, sentiment, scores, timestamps
     - `SentimentAnalysis`: Overall sentiment + segment data
     - `AnalysisData`: Container for sentiment_analysis object

2. **`lib/analysis-utils.ts`**
   - Added 5 sentiment utility functions:
     - `getSentimentColor()`: Maps sentiment to color ('green'|'red'|'gray'|'yellow')
     - `getSentimentEmoji()`: Maps sentiment to emoji (😊/😟/😐/😕)
     - `getKeyEmotionalMoments()`: Filters strong sentiment segments (>0.7 score)
     - `generateEmotionalInsight()`: Creates clinical summary with pattern detection
     - `getSentimentPercentages()`: Converts decimal scores to rounded percentages

3. **`components/AnalysisSection.tsx`**
   - Added `analysisData` prop of type `AnalysisData | null`
   - Imported and rendered `EmotionalJourneyCard` as FIRST card (before OverviewCard)
   - Updated card ordering in comments (Row 1 → Row 5)

4. **`components/VideoPlayerModal.tsx`**
   - Added `analysisData` state variable
   - Created new `useEffect` hook to fetch analysis JSON from S3
   - Passes `analysisData` prop to `AnalysisSection`
   - Handles missing analysis gracefully (optional data)

## Component Features

### EmotionalJourneyCard Visualization Elements

1. **Overall Sentiment Badge**
   - Large, prominent badge with emoji and color coding
   - Background colors: green (positive), red (negative), gray (neutral), yellow (mixed)
   - Displays overall sentiment label in uppercase

2. **Sentiment Distribution**
   - Horizontal stacked bar chart showing percentage breakdown
   - 4 categories: Positive, Negative, Neutral, Mixed
   - Interactive hover states with percentage tooltips
   - Breakdown list with colored dots and percentages

3. **Emotional Timeline**
   - Visual timeline showing sentiment changes throughout conversation
   - Each segment colored by dominant sentiment
   - Hover tooltips display:
     - Sentiment label
     - Start/end timestamps
   - Time markers at 0%, 50%, 100% duration

4. **Key Emotional Moments**
   - Lists up to 5 strongest emotional segments (>0.7 score)
   - Each moment shows:
     - Emoji indicator
     - Timestamp badge (clickable)
     - Sentiment label
     - Text excerpt (truncated)
   - Click to seek video to specific moment
   - Arrow icon on hover for navigation cue

5. **Clinical Insight**
   - AI-generated summary with pattern detection:
     - **Distress detection**: Counts negative spikes with timestamps
     - **Resilience assessment**: Detects recovery from distress
     - **Volatility tracking**: Counts sentiment changes
     - **Stability assessment**: Identifies consistent positive affect
   - Lightbulb icon for visual recognition
   - Cyan accent box for emphasis

### Loading & Error States
- Skeleton loader matching final layout
- Graceful handling of missing sentiment data
- "Emotional analysis not available" placeholder with icon

## Data Flow

```
VideoPlayerModal
  ├─ Fetches analysis JSON from S3 (via /api/recordings/analysis)
  ├─ Stores in analysisData state
  └─ Passes to AnalysisSection
      └─ Passes to EmotionalJourneyCard
          ├─ Computes percentages (getSentimentPercentages)
          ├─ Filters key moments (getKeyEmotionalMoments)
          └─ Generates insight (generateEmotionalInsight)
```

## AWS Comprehend Data Structure

```typescript
{
  "sentiment_analysis": {
    "overall_sentiment": "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "MIXED",
    "sentiment_scores": {
      "Positive": 0.85,
      "Negative": 0.05,
      "Neutral": 0.08,
      "Mixed": 0.02
    },
    "segment_sentiments": [
      {
        "text": "Patient expressed feeling better today",
        "sentiment": "POSITIVE",
        "sentiment_score": {
          "Positive": 0.95,
          "Negative": 0.01,
          "Neutral": 0.03,
          "Mixed": 0.01
        },
        "start_time": 12.5,
        "end_time": 18.3
      }
      // ... more segments
    ]
  }
}
```

## Clinical Pattern Detection

### Distress Detection
```typescript
// Counts negative spikes with score >0.7
// Provides timestamps of concerning moments
// Example: "Patient expressed distress during conversation. 2 moment(s) of heightened concern detected at 1:23 and 3:45."
```

### Emotional Resilience
```typescript
// Detects recovery patterns (negative → positive transitions)
// Example: "Brief distress detected at 1:23, resolved by 2:15. Patient showed emotional resilience."
```

### Volatility Assessment
```typescript
// Counts sentiment changes between consecutive segments
// Example: "Emotional state fluctuated throughout conversation with 8 sentiment shifts."
```

### Stability Assessment
```typescript
// Identifies consistent positive affect
// Example: "Patient maintained positive affect throughout conversation with stable emotional state."
```

## Styling & Theme

### Color Coding
- **Positive**: Green (`bg-green-500`, `text-green-400`, `border-green-500`)
- **Negative**: Red (`bg-red-500`, `text-red-400`, `border-red-500`)
- **Neutral**: Gray (`bg-gray-500`, `text-gray-400`, `border-gray-500`)
- **Mixed**: Yellow (`bg-yellow-500`, `text-yellow-400`, `border-yellow-500`)

### Dark Theme Consistency
- Card background: `bg-slate-900/50`
- Borders: `border-slate-700/50`
- Text: `text-white` (headings), `text-slate-300` (body), `text-slate-400` (secondary)
- Accents: Cyan (`text-cyan-400`) for interactive elements

### Responsive Design
- Stacked bar chart: Full width with flex layout
- Breakdown list: 2 columns on mobile, 4 columns on desktop (`grid-cols-2 md:grid-cols-4`)
- Timeline: Adaptive width based on segment durations
- Key moments: Full-width buttons with truncated text

## Integration Points

### API Endpoints
- **`POST /api/recordings/analysis`**
  - Input: `{ videoKey: string }`
  - Output: `{ url: string, exists: boolean }`
  - Returns pre-signed S3 URL for analysis JSON

### Component Props
```typescript
interface EmotionalJourneyCardProps {
  analysisData: AnalysisData | null;  // Sentiment analysis data
  loading?: boolean;                   // Loading state
  onSeekTo?: (seconds: number) => void; // Video seek callback
}
```

### Dependencies
- `@/types/transcript`: Type definitions
- `@/lib/analysis-utils`: Utility functions
- React hooks: None (pure component)
- External libraries: None

## Testing Checklist

- [ ] Card displays at top of analysis section
- [ ] Overall sentiment badge shows correct color and emoji
- [ ] Sentiment distribution percentages sum to ~100%
- [ ] Stacked bar chart widths match percentages
- [ ] Timeline segments render with correct colors
- [ ] Timeline tooltips show on hover
- [ ] Key moments list displays up to 5 items
- [ ] Clicking key moments seeks video to timestamp
- [ ] Clinical insight text is relevant and actionable
- [ ] Loading skeleton displays during data fetch
- [ ] "Not available" message shows when data is missing
- [ ] Component handles null/undefined data gracefully
- [ ] Responsive layout works on mobile devices
- [ ] Dark theme colors are consistent
- [ ] Hover states work on all interactive elements

## Future Enhancements

### Potential Improvements
1. **Sentiment Trend Graph**: Line chart showing sentiment over time
2. **Comparison View**: Compare emotional journey across multiple visits
3. **Export Report**: Download sentiment analysis as PDF
4. **Color-blind Mode**: Alternative color schemes for accessibility
5. **Detailed Segment View**: Expandable list showing all segments with full text
6. **Mental Health Screening**: Integration with standardized screening tools
7. **Alerts**: Notify clinicians of severe distress patterns
8. **Historical Analysis**: Longitudinal tracking of emotional patterns

### Known Limitations
- Maximum 5 key moments displayed (can be increased)
- Timeline segments may be too narrow for very short segments (<1 second)
- Long segment text is truncated (no expand option)
- Insight generation uses basic pattern detection (could use ML)

## Documentation Links
- [AWS Comprehend Sentiment Analysis](https://docs.aws.amazon.com/comprehend/latest/dg/how-sentiment.html)
- [Clinical Analysis System](./CLINICAL_ANALYSIS_IMPLEMENTATION.md)
- [TypeScript Interfaces](./types/transcript.ts)
- [Utility Functions](./lib/analysis-utils.ts)

## Summary
The Emotional Journey Card is now fully integrated into the clinical analysis section, providing healthcare professionals with immediate visibility into patient emotional state during medical consultations. The card combines visual analytics with AI-generated clinical insights to support better patient care and documentation.
