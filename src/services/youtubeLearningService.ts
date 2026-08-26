import { YouTubeLearningTrack, UnofficialLearningRecord, UserProfile } from '../types';

// Curated starter learning tracks for software engineering students
export const STARTER_YOUTUBE_TRACKS: YouTubeLearningTrack[] = [
  {
    id: 'yt-track-react-19',
    userId: 'default',
    videoId: '8pDqJVdNa44',
    videoUrl: 'https://www.youtube.com/watch?v=8pDqJVdNa44',
    title: 'React 19 Full Course & Actions, use() Hook, Server Components Guide',
    channel: 'FreeCodeCamp / Engineering Guild',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    durationSeconds: 1440, // 24 mins
    durationFormatted: '24m 00s',
    verifiedWatchedSeconds: 1080,
    currentTime: 1080,
    completionPercentage: 75,
    status: 'in_progress',
    lastWatched: new Date().toISOString(),
    dateAdded: new Date(Date.now() - 3 * 86400000).toISOString(),
    watchedRanges: [[0, 1080]],
    aiSummary: {
      summary: 'Comprehensive deep-dive into React 19 core innovations including the new use() API for promises, useActionState, Server Actions, Form Status hooks, and asset preloading optimizations.',
      keyPoints: [
        'useActionState simplifies async transitions without manual pending state flags.',
        'The use() hook unwraps Promises and Contexts dynamically inside render loops and conditionals.',
        'React Server Components (RSC) execute on Node.js runtime to shrink client bundle footprint.',
        'useOptimistic provides instant client UI updates prior to server confirmation.',
        'Automatic ref forwarding removes the legacy forwardRef boilerplate in functional components.'
      ],
      timestamps: [
        { time: '00:00', title: 'React 19 Architecture Overview', note: 'Why React 19 deprecates legacy compiler workarounds' },
        { time: '05:20', title: 'Actions & useActionState', note: 'Managing async form state without multiple useState hooks' },
        { time: '11:45', title: 'use() Hook for Promises & Context', note: 'Unwrapping data inside branches and loops' },
        { time: '18:10', title: 'Optimistic UI Updates', note: 'Implementing snappy user experiences with useOptimistic' }
      ],
      skillsValidated: ['React 19', 'useActionState', 'Server Actions', 'State Architecture'],
      generatedAt: new Date().toISOString(),
      modelUsed: 'gemini-3.7-flash'
    },
    notes: 'React 19 useActionState is game-changing for forms. No longer need isSubmitting / isPending booleans everywhere.'
  },
  {
    id: 'yt-track-ts-5',
    userId: 'default',
    videoId: 'ahCwqrYqo9o',
    videoUrl: 'https://www.youtube.com/watch?v=ahCwqrYqo9o',
    title: 'TypeScript 5.x Advanced Generics & Strict Enterprise Patterns',
    channel: 'Jack Herrington / Senior Engineer',
    thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc06a20a4b7?w=600&auto=format&fit=crop&q=80',
    durationSeconds: 1200, // 20 mins
    durationFormatted: '20m 00s',
    verifiedWatchedSeconds: 1200,
    currentTime: 1200,
    completionPercentage: 100,
    status: 'completed',
    lastWatched: new Date(Date.now() - 86400000).toISOString(),
    dateAdded: new Date(Date.now() - 5 * 86400000).toISOString(),
    watchedRanges: [[0, 1200]],
    aiSummary: {
      summary: 'Masterclass on TypeScript advanced type narrowing, conditional types, template literal types, and building type-safe APIs for distributed systems.',
      keyPoints: [
        'Const type parameters prevent unwanted array/object literal widening.',
        'Discriminated unions ensure exhaustive switch-case validation in redux/state reducers.',
        'Infer keyword enables extracting return types and argument types dynamically.',
        'Template literal types provide runtime-strict route and event name safety.'
      ],
      timestamps: [
        { time: '00:00', title: 'Const Type Parameters in TS 5', note: 'Preserving exact tuple literals' },
        { time: '06:15', title: 'Conditional Types & Infer', note: 'Writing robust utility types' },
        { time: '14:30', title: 'Building Type-Safe REST Clients', note: 'End-to-end API type safety' }
      ],
      skillsValidated: ['TypeScript', 'Generics', 'Type Narrowing', 'API Contracts'],
      generatedAt: new Date().toISOString(),
      modelUsed: 'gemini-3.7-flash'
    },
    notes: 'Remember: Always use const generics when creating strongly-typed configuration builders.',
    learningRecord: {
      recordId: 'IS-REC-YTL-2026-TS92A',
      userId: 'default',
      userName: 'Arun Kumar',
      videoTitle: 'TypeScript 5.x Advanced Generics & Strict Enterprise Patterns',
      channel: 'Jack Herrington / Senior Engineer',
      videoId: 'ahCwqrYqo9o',
      videoUrl: 'https://www.youtube.com/watch?v=ahCwqrYqo9o',
      verifiedWatchSeconds: 1200,
      verifiedWatchFormatted: '20m 00s',
      completionPercentage: 100,
      completionDate: new Date(Date.now() - 86400000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      disclaimer: 'This is an unofficial self-directed learning completion record generated by IndustrySkill to verify verified watch time. It is not issued, certified, or endorsed by YouTube, Google LLC, or the video creator.',
      skillsValidated: ['TypeScript', 'Generics', 'Strict Mode', 'Enterprise Architecture']
    }
  }
];

/**
 * Extracts video ID from any valid YouTube URL
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  
  // Standard full regex matching watch?v=, youtu.be/, embed/, shorts/, live/
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regex);
  if (match && match[1] && match[1].length === 11) {
    return match[1];
  }
  
  // If user pasted raw 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  
  return null;
}

/**
 * Formats seconds into MM:SS or HH:MM:SS
 */
export function formatSecondsToTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const total = Math.floor(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  }
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}

/**
 * Merges a new interval [start, end] into an existing list of intervals
 * Example: [[0, 10], [20, 30]] + [5, 25] => [[0, 30]]
 */
export function mergeWatchedInterval(
  existingRanges: [number, number][],
  newRange: [number, number]
): [number, number][] {
  if (!newRange || newRange[0] >= newRange[1]) return existingRanges;
  
  const all = [...existingRanges, newRange].map(([s, e]) => [Math.floor(s), Math.floor(e)] as [number, number]);
  all.sort((a, b) => a[0] - b[0]);

  const merged: [number, number][] = [];
  let current = all[0];

  for (let i = 1; i < all.length; i++) {
    const next = all[i];
    if (next[0] <= current[1] + 1) { // 1 second overlap or adjacent
      current[1] = Math.max(current[1], next[1]);
    } else {
      merged.push(current);
      current = next;
    }
  }
  merged.push(current);
  return merged;
}

/**
 * Calculates total unique verified seconds watched across intervals
 */
export function calculateTotalVerifiedSeconds(ranges: [number, number][]): number {
  if (!ranges || ranges.length === 0) return 0;
  return ranges.reduce((acc, [start, end]) => acc + Math.max(0, end - start), 0);
}

/**
 * Local Storage Persistence Layer per user
 */
const TRACKS_STORAGE_PREFIX = 'industryskill_yt_tracks_';

export function loadUserTracks(userId: string = 'default'): YouTubeLearningTrack[] {
  try {
    const raw = localStorage.getItem(`${TRACKS_STORAGE_PREFIX}${userId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load user tracks from localStorage:', err);
  }
  return STARTER_YOUTUBE_TRACKS;
}

export function saveUserTracks(userId: string = 'default', tracks: YouTubeLearningTrack[]): void {
  try {
    localStorage.setItem(`${TRACKS_STORAGE_PREFIX}${userId}`, JSON.stringify(tracks));
  } catch (err) {
    console.error('Failed to save user tracks to localStorage:', err);
  }
}

/**
 * Generates unique Record ID for learning completion
 */
export function generateRecordId(videoId: string): string {
  const cleanId = (videoId || 'GEN').substring(0, 4).toUpperCase();
  const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `IS-REC-YTL-${new Date().getFullYear()}-${cleanId}-${randomHex}`;
}

/**
 * Generates an Unofficial Learning Completion Record
 */
export function createUnofficialRecord(
  userName: string,
  userEmail: string,
  track: YouTubeLearningTrack
): UnofficialLearningRecord {
  return {
    recordId: track.learningRecord?.recordId || generateRecordId(track.videoId),
    userId: userEmail || 'user-active',
    userName: userName || 'Student Learner',
    videoTitle: track.title,
    channel: track.channel,
    videoId: track.videoId,
    videoUrl: track.videoUrl,
    verifiedWatchSeconds: track.verifiedWatchedSeconds,
    verifiedWatchFormatted: formatSecondsToTime(track.verifiedWatchedSeconds),
    completionPercentage: track.completionPercentage,
    completionDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    disclaimer: 'This is an unofficial self-directed learning completion record generated by IndustrySkill to verify authentic watch progress. It is not issued, certified, or endorsed by YouTube, Google LLC, or the video creator.',
    skillsValidated: track.aiSummary?.skillsValidated || ['Full Stack Engineering', 'Independent Study']
  };
}

/**
 * Triggers clean PDF / Print download of learning notes
 */
export function downloadNotesAsPDF(track: YouTubeLearningTrack, userName: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download and print your notes.');
    return;
  }

  const keyPointsHtml = track.aiSummary?.keyPoints
    ?.map((kp) => `<li style="margin-bottom: 8px; font-size: 13px; color: #334155; line-height: 1.5;">${kp}</li>`)
    .join('') || '<p style="color: #64748b;">No AI takeaways saved yet.</p>';

  const timestampsHtml = track.aiSummary?.timestamps
    ?.map(
      (t) => `
      <div style="display: flex; gap: 12px; margin-bottom: 8px; font-size: 12px;">
        <span style="font-weight: 700; color: #2563eb; background: #eff6ff; padding: 2px 8px; border-radius: 6px; height: fit-content;">${t.time}</span>
        <div>
          <strong style="color: #0f172a;">${t.title}</strong>
          <p style="margin: 2px 0 0 0; color: #64748b;">${t.note}</p>
        </div>
      </div>
    `
    )
    .join('') || '';

  const studentNotesHtml = track.notes
    ? `<div style="margin-top: 16px; padding: 14px; background: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 8px;">
        <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #1e293b;">Personal Student Notes</h4>
        <p style="margin: 0; font-size: 13px; color: #334155; white-space: pre-wrap;">${track.notes}</p>
       </div>`
    : '';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${track.title} - IndustrySkill Verified Learning Notes</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; }
          .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
          .badge { display: inline-block; background: #dbeafe; color: #1d4ed8; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; }
          .verified-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; border-radius: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .disclaimer { margin-top: 36px; padding-top: 16px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #64748b; line-height: 1.4; text-align: center; }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; display: flex; justify-content: flex-end; gap: 10px;">
          <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer;">
            Print / Save as PDF
          </button>
        </div>

        <div class="header">
          <div>
            <span class="badge">IndustrySkill Verified Learning Note</span>
            <h1 style="margin: 8px 0 4px 0; font-size: 22px; color: #0f172a;">${track.title}</h1>
            <p style="margin: 0; font-size: 13px; color: #64748b;">Instructor/Channel: <strong>${track.channel}</strong> • Source: ${track.videoUrl}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-size: 12px; font-weight: bold; color: #0f172a;">Student: ${userName}</p>
            <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">Date: ${new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div class="verified-box">
          <div>
            <strong style="color: #166534; font-size: 13px;">✓ Verified Watch Progress</strong>
            <p style="margin: 2px 0 0 0; font-size: 12px; color: #15803d;">
              ${formatSecondsToTime(track.verifiedWatchedSeconds)} verified / ${track.durationFormatted} (${track.completionPercentage}% completion)
            </p>
          </div>
          <span style="font-size: 12px; font-weight: 800; color: #166534; background: #dcfce7; padding: 4px 10px; border-radius: 8px;">
            ${track.status === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}
          </span>
        </div>

        <h3 style="font-size: 16px; color: #0f172a; margin-top: 20px; margin-bottom: 8px;">Executive Summary</h3>
        <p style="font-size: 13px; color: #334155; line-height: 1.6; background: #f8fafc; padding: 14px; border-radius: 8px;">
          ${track.aiSummary?.summary || 'Summary in progress.'}
        </p>

        <h3 style="font-size: 16px; color: #0f172a; margin-top: 24px; margin-bottom: 8px;">Key Technical Takeaways</h3>
        <ul style="padding-left: 20px; margin-top: 0;">
          ${keyPointsHtml}
        </ul>

        ${timestampsHtml ? `<h3 style="font-size: 16px; color: #0f172a; margin-top: 24px; margin-bottom: 12px;">Timestamped Chapters</h3>${timestampsHtml}` : ''}

        ${studentNotesHtml}

        <div class="disclaimer">
          <p><strong>Disclaimer:</strong> This verified learning record and study sheet is independently generated by IndustrySkill. It is not affiliated with, sponsored, or certified by YouTube, Google LLC, or the creator. Record ID: ${track.learningRecord?.recordId || generateRecordId(track.videoId)}</p>
        </div>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Triggers clean PDF / Print download of the Unofficial Learning Completion Record
 */
export function downloadRecordAsPDF(record: UnofficialLearningRecord) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download and print your completion record.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Unofficial Learning Record - ${record.videoTitle}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 850px; margin: 0 auto; background: #f8fafc; }
          .certificate {
            background: #ffffff;
            border: 8px double #1e3a8a;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            position: relative;
          }
          .title { font-size: 26px; font-weight: 900; color: #1e3a8a; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
          .subtitle { font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
          .recipient { font-size: 32px; font-weight: 800; color: #0f172a; margin: 24px 0 8px 0; border-bottom: 2px solid #e2e8f0; display: inline-block; padding-bottom: 4px; min-width: 320px; }
          .course-title { font-size: 20px; font-weight: 700; color: #2563eb; margin: 12px 0 4px 0; }
          .channel { font-size: 14px; color: #475569; font-weight: 600; }
          .metrics { display: flex; justify-content: center; gap: 40px; margin: 28px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; padding: 16px 0; }
          .metric-item { text-align: center; }
          .metric-value { font-size: 18px; font-weight: 800; color: #0f172a; }
          .metric-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-top: 2px; }
          .disclaimer-box { background: #fef2f2; border: 1px solid #fecaca; padding: 12px 18px; border-radius: 10px; font-size: 11px; color: #991b1b; line-height: 1.4; margin-top: 24px; text-align: left; }
          @media print {
            body { padding: 0; background: white; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; display: flex; justify-content: flex-end; gap: 10px;">
          <button onclick="window.print()" style="background: #1e3a8a; color: white; border: none; padding: 12px 24px; font-weight: bold; border-radius: 10px; cursor: pointer;">
            Print / Save Certificate PDF
          </button>
        </div>

        <div class="certificate">
          <div style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 28px;">🎓</span>
            <span style="font-size: 16px; font-weight: 900; color: #2563eb; letter-spacing: 0.5px;">INDUSTRYSKILL VERIFIED LAB</span>
          </div>

          <div class="title">Unofficial Learning Completion Record</div>
          <div class="subtitle">Self-Directed Engineering Study Verification</div>

          <p style="margin-top: 24px; font-size: 14px; color: #64748b;">This document verifies that</p>
          <div class="recipient">${record.userName}</div>
          <p style="font-size: 14px; color: #64748b; margin-top: 6px;">has successfully completed self-directed study and verified real watch time for:</p>

          <div class="course-title">${record.videoTitle}</div>
          <div class="channel">Curated from: ${record.channel}</div>

          <div class="metrics">
            <div class="metric-item">
              <div class="metric-value">${record.verifiedWatchFormatted}</div>
              <div class="metric-label">Verified Watch Time</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">${record.completionPercentage}%</div>
              <div class="metric-label">Actual Completion</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">${record.completionDate}</div>
              <div class="metric-label">Completion Date</div>
            </div>
            <div class="metric-item">
              <div class="metric-value" style="font-family: monospace;">${record.recordId}</div>
              <div class="metric-label">Verification ID</div>
            </div>
          </div>

          <div class="disclaimer-box">
            <strong>Mandatory Verification Disclaimer:</strong> ${record.disclaimer}
          </div>
        </div>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
