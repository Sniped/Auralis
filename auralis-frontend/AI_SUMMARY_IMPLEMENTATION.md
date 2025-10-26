# AI Summary Card Implementation

## Overview
Added a new AI-generated Conversation Summary card to the clinical analysis section. This card displays LLM-generated summaries of patient interactions stored in the S3 `summaries/` folder.

## Files Created/Modified

### New Files (2)

1. **`app/api/recordings/summary/route.ts`** (152 lines)
   - API endpoint to generate pre-signed URLs for summary JSON files
   - Endpoint: `POST /api/recordings/summary`
   - Bucket: `auralis-transcript-output-east1`
   - Folder: `summaries/`
   - File pattern: `summaries/{timestamp}-{filename}.json`

2. **`components/analysis/SummaryCard.tsx`** (93 lines)
   - Visual component displaying AI-generated summary
   - Features:
     - AI badge indicator
     - Purple-themed styling
     - Generated timestamp
     - Filename reference
     - Loading skeleton
     - Graceful "not available" state

### Modified Files (4)

1. **`types/transcript.ts`**
   - Added `SummaryData` interface:
     ```typescript
     {
       summary: string;
       fileName: string;
       generatedAt: string;
     }
     ```

2. **`components/VideoPlayerModal.tsx`**
   - Added `summaryData` state
   - Implemented polling for summary data (5-second intervals)
   - Passes `summaryData` to `AnalysisSection`

3. **`components/AnalysisSection.tsx`**
   - Added `summaryData` prop
   - Imported `SummaryCard` component
   - Rendered `SummaryCard` as **first card** (top position)
   - Updated row numbering in comments (Row 1-6)

## Data Structure

### Summary JSON Format
```json
{
  "summary": "This appears to be a fragmented conversation between people discussing...",
  "fileName": "1761489727488-GX010013",
  "generatedAt": "2025-10-26T14:46:34.569Z"
}
```

### S3 File Location
```
Bucket: auralis-transcript-output-east1
Path:   summaries/{timestamp}-{filename}.json

Example: summaries/1761489727488-GX010013.json
```

## Component Features

### Visual Design

**Header:**
- Purple-themed icon (document icon)
- "Conversation Summary" title
- "AI Generated" badge with lightning icon

**Content:**
- Purple-tinted background box
- Full summary text
- Easy-to-read typography
- Responsive layout

**Footer Metadata:**
- Generated timestamp (formatted)
- Filename reference
- Clock and file icons

### States

1. **Loading State**
   - Skeleton loader with pulsing animation
   - Placeholder content blocks

2. **Available State**
   - Full summary displayed
   - Metadata shown
   - Purple accent colors

3. **Not Available State**
   - Document icon
   - "Summary not available" message
   - "AI summary has not been generated yet" subtitle

## Integration Flow

```
VideoPlayerModal
  ├─ Polls /api/recordings/summary every 5 seconds
  ├─ Fetches JSON from pre-signed S3 URL
  ├─ Stores in summaryData state
  └─ Passes to AnalysisSection
      └─ Renders SummaryCard at top
```

## Card Order (Top to Bottom)

1. **🆕 AI Summary** - LLM-generated conversation overview
2. **Emotional Journey** - Sentiment analysis visualization
3. **Overview** - Duration, speakers, words, rate
4. **Speaker Distribution + Quality** - 2-column grid
5. **Conversation Flow** - Timeline visualization
6. **Key Moments** - Important timestamps

## Polling Behavior

### Automatic Retry
- Polls every **5 seconds** if file not found
- Shows loading spinner during polling
- Stops polling once data is loaded
- Cleans up on component unmount

### Error Handling
- Network errors: Logged to console, polling continues
- 404 Not Found: Continues polling (file may be processing)
- Other errors: Logged, polling continues

## API Endpoint Details

### Request
```typescript
POST /api/recordings/summary
Content-Type: application/json

{
  "videoKey": "recordings/user123/1761489727488-GX010013.mp4"
}
```

### Response (Success)
```json
{
  "url": "https://s3.amazonaws.com/auralis-transcript-output-east1/summaries/..."
}
```

### Response (Not Found)
```json
{
  "error": "Summary not available for this recording",
  "exists": false
}
```

## Styling Theme

### Colors
- **Primary**: Purple (`purple-400`, `purple-500`)
- **Background**: `bg-purple-500/5`
- **Border**: `border-purple-500/20`
- **Badge**: `bg-purple-500/20` with `border-purple-500/30`

### Consistency
- Matches dark theme of other cards
- Uses same card structure (`bg-slate-900/50`)
- Responsive design
- Same loading/error patterns

## Use Cases

### Primary Use Case
**Clinical Documentation Review**
- Doctor opens patient video
- AI summary provides quick overview
- Doctor can quickly understand conversation context
- Reduces time needed to review full transcript

### Example Summaries

**Good Summary:**
```
"Patient presents with chest pain and shortness of breath. 
Discussion covers symptom onset, medical history, and current 
medications. Doctor recommends cardiac workup and follows up 
on previous hypertension treatment."
```

**Technical Summary:**
```
"This appears to be a fragmented conversation between people 
discussing the technical aspects of a video processing system, 
likely involving AWS services like Cognito and S3."
```

## LLM Integration

### Expected Input to LLM
- Full conversation transcript
- Sentiment analysis data
- Speaker labels
- Timestamps

### Expected Output Format
```json
{
  "summary": "Concise overview of conversation (1-3 sentences)",
  "fileName": "Original video filename",
  "generatedAt": "ISO 8601 timestamp"
}
```

### Processing Workflow
1. Video uploaded → Transcription job starts
2. Transcription completes → Sentiment analysis runs
3. Analysis completes → LLM summarization triggered
4. Summary generated → Saved to `summaries/` folder
5. Frontend polls and displays when ready

## Performance

### Data Size
- Average summary: ~200-500 characters
- JSON payload: ~300-600 bytes
- Negligible network impact

### Polling Impact
- 1 request per 5 seconds (when summary not available)
- Stops immediately when data loads
- Maximum ~12 requests per minute
- Typical: 2-6 requests before data available

## Testing Checklist

- [ ] Upload video and immediately open
- [ ] Verify summary card shows loading spinner
- [ ] Wait for summary to be generated
- [ ] Verify summary populates automatically
- [ ] Check summary text is readable
- [ ] Verify timestamp is formatted correctly
- [ ] Verify filename matches video
- [ ] Test with missing summary (graceful degradation)
- [ ] Check responsive layout on mobile
- [ ] Verify polling stops after data loads
- [ ] Test component unmount (no memory leaks)

## Future Enhancements

### Potential Improvements
1. **Editable Summaries** - Allow doctors to refine AI summaries
2. **Multiple Summaries** - Show summary history/versions
3. **Summary Length Options** - Brief, standard, detailed
4. **Export to PDF** - Include summary in report exports
5. **Copy to Clipboard** - Easy sharing of summary text
6. **Key Points Extraction** - Bullet-point highlights
7. **Action Items** - Extract recommended follow-ups
8. **Medical Coding** - Suggest ICD/CPT codes from summary

### LLM Enhancements
- Structured output (chief complaint, diagnosis, plan)
- Medical terminology optimization
- Multiple language support
- Confidence scoring
- Source citation (reference specific segments)

## Dependencies

### NPM Packages
- None (uses existing AWS SDK and Next.js APIs)

### AWS Services
- S3 (summary file storage)
- IAM (permissions for S3 access)

### Internal Dependencies
- `lib/s3-helpers.ts` - `extractBaseFileName()`
- `types/transcript.ts` - `SummaryData` interface
- Existing card styling patterns

## Summary

The AI Summary Card provides immediate context about patient conversations through LLM-generated summaries. Positioned at the top of the clinical analysis section, it allows healthcare providers to quickly grasp conversation content before reviewing detailed analytics.

**Key Benefits:**
- ⚡ Quick overview of conversation
- 🤖 AI-powered insights
- 🔄 Automatic polling and updates
- 🎨 Consistent visual design
- 📱 Responsive layout
- ♿ Accessible markup
