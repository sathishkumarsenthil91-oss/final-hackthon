import React, { useEffect, useRef, useState } from 'react';
import { YouTubeLearningTrack, UserProfile, UnofficialLearningRecord } from '../types';
import {
  formatSecondsToTime,
  mergeWatchedInterval,
  calculateTotalVerifiedSeconds,
  createUnofficialRecord,
  downloadNotesAsPDF,
  downloadRecordAsPDF,
} from '../services/youtubeLearningService';

interface YouTubeSkillTrackPlayerProps {
  track: YouTubeLearningTrack;
  user: UserProfile;
  onUpdateTrack: (updated: YouTubeLearningTrack) => void;
  onClose: () => void;
  onAskNebulaAI?: (prompt: string) => void;
}

export const YouTubeSkillTrackPlayer: React.FC<YouTubeSkillTrackPlayerProps> = ({
  track,
  user,
  onUpdateTrack,
  onClose,
  onAskNebulaAI,
}) => {
  const [activeTab, setActiveTab] = useState<'player' | 'summary' | 'notes' | 'record'>('player');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(track.currentTime || 0);
  const [duration, setDuration] = useState<number>(track.durationSeconds || 1200);
  const [verifiedSeconds, setVerifiedSeconds] = useState<number>(track.verifiedWatchedSeconds || 0);
  const [watchedRanges, setWatchedRanges] = useState<[number, number][]>(track.watchedRanges || []);
  const [completionPercentage, setCompletionPercentage] = useState<number>(track.completionPercentage || 0);
  const [studentNotes, setStudentNotes] = useState<string>(track.notes || '');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState(track.aiSummary);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, string>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);
  const [copiedRecordId, setCopiedRecordId] = useState<boolean>(false);

  const playerRef = useRef<any>(null);
  const containerIdRef = useRef<string>(`yt-iframe-player-${track.videoId}-${Date.now()}`);
  const lastCheckedTimeRef = useRef<number>(track.currentTime || 0);
  const intervalTrackerRef = useRef<any>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    let isMounted = true;

    const initPlayer = () => {
      const YT = (window as any).YT;
      if (!YT || !YT.Player) return;

      try {
        playerRef.current = new YT.Player(containerIdRef.current, {
          videoId: track.videoId,
          playerVars: {
            start: Math.floor(track.currentTime || 0),
            autoplay: 1,
            rel: 0,
            modestbranding: 1,
            enablejsapi: 1,
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              const dur = event.target.getDuration();
              if (dur && dur > 0) {
                setDuration(dur);
              }
              lastCheckedTimeRef.current = event.target.getCurrentTime() || track.currentTime || 0;
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              // YT.PlayerState: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
              if (event.data === 1) {
                setIsPlaying(true);
              } else {
                setIsPlaying(false);
              }
            },
          },
        });
      } catch (err) {
        console.error('Error initializing YouTube player:', err);
      }
    };

    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.id = 'youtube-iframe-api-script';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      (window as any).onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      isMounted = false;
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [track.videoId]);

  // Real watch-time tracking loop (runs every 500ms when playing)
  useEffect(() => {
    if (!isPlaying) {
      if (intervalTrackerRef.current) {
        clearInterval(intervalTrackerRef.current);
        intervalTrackerRef.current = null;
      }
      return;
    }

    intervalTrackerRef.current = setInterval(() => {
      if (!playerRef.current || typeof playerRef.current.getCurrentTime !== 'function') return;

      try {
        const current = playerRef.current.getCurrentTime();
        const dur = playerRef.current.getDuration() || duration;
        if (dur > 0 && dur !== duration) {
          setDuration(dur);
        }

        const prev = lastCheckedTimeRef.current;
        const delta = current - prev;
        const playbackRate = playerRef.current.getPlaybackRate?.() || 1;

        // Anti-skip logic: Only credit real continuous playback progression
        // If delta is between 0 and 1.5 * playbackRate (approx normal progress)
        if (delta > 0 && delta <= 1.8 * playbackRate) {
          setWatchedRanges((prevRanges) => {
            const updatedRanges = mergeWatchedInterval(prevRanges, [prev, current]);
            const totalSecs = calculateTotalVerifiedSeconds(updatedRanges);
            const rawPercent = dur > 0 ? Math.min(100, Math.round((totalSecs / dur) * 100)) : 0;

            setVerifiedSeconds(totalSecs);
            setCompletionPercentage(rawPercent);

            // Trigger track state update
            const isCompleted = rawPercent >= 85;
            let record = track.learningRecord;
            if (isCompleted && !record) {
              record = createUnofficialRecord(user.name, user.email, {
                ...track,
                verifiedWatchedSeconds: totalSecs,
                completionPercentage: rawPercent,
                status: 'completed',
              });
            }

            onUpdateTrack({
              ...track,
              currentTime: current,
              verifiedWatchedSeconds: totalSecs,
              durationSeconds: dur,
              durationFormatted: formatSecondsToTime(dur),
              watchedRanges: updatedRanges,
              completionPercentage: rawPercent,
              status: isCompleted ? 'completed' : 'in_progress',
              lastWatched: new Date().toISOString(),
              learningRecord: record,
              notes: studentNotes,
            });

            return updatedRanges;
          });
        }

        // Always update current position
        lastCheckedTimeRef.current = current;
        setCurrentTime(current);
      } catch (err) {
        console.warn('Tracker tick error:', err);
      }
    }, 500);

    return () => {
      if (intervalTrackerRef.current) {
        clearInterval(intervalTrackerRef.current);
      }
    };
  }, [isPlaying, duration, studentNotes, user.name, user.email, onUpdateTrack, track]);

  // Fetch or trigger Gemini AI Summary
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const res = await fetch('/api/youtube/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: track.videoId,
          videoTitle: track.title,
          channel: track.channel,
          userNotes: studentNotes,
        }),
      });
      const data = await res.json();
      if (data.summary) {
        setSummaryData(data.summary);
        onUpdateTrack({
          ...track,
          aiSummary: data.summary,
        });
      }
    } catch (err) {
      console.error('Failed to generate summary:', err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Jump to timestamp in video
  const handleSeekTo = (timeStr: string) => {
    const parts = timeStr.split(':').map(Number);
    let seconds = 0;
    if (parts.length === 2) {
      seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(seconds, true);
      lastCheckedTimeRef.current = seconds;
      setCurrentTime(seconds);
      setActiveTab('player');
    }
  };

  // Save student notes
  const handleSaveNotes = (newNotes: string) => {
    setStudentNotes(newNotes);
    onUpdateTrack({
      ...track,
      notes: newNotes,
      lastWatched: new Date().toISOString(),
    });
  };

  const isCompleted = completionPercentage >= 85 || track.status === 'completed';
  const learningRecord = track.learningRecord || (isCompleted ? createUnofficialRecord(user.name, user.email, track) : null);

  const handleCopyRecordId = () => {
    if (learningRecord) {
      navigator.clipboard.writeText(learningRecord.recordId);
      setCopiedRecordId(true);
      setTimeout(() => setCopiedRecordId(false), 2000);
    }
  };

  const handleShareLinkedIn = () => {
    if (!learningRecord) return;
    const text = encodeURIComponent(
      `Excited to share that I completed a self-directed verified technical study course on "${learningRecord.videoTitle}" from ${learningRecord.channel} via IndustrySkill.\n\nVerified Watch Time: ${learningRecord.verifiedWatchFormatted} (${learningRecord.completionPercentage}% verified completion).\nUnofficial Record ID: ${learningRecord.recordId}\n#Engineering #ContinuousLearning #FullStack`
    );
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl flex flex-col my-auto max-h-[94vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between gap-4 bg-slate-950/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">smart_display</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30">
                  YouTube Skill Track
                </span>
                <span className="text-xs text-slate-400 truncate">
                  {track.channel}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-xl">
                {track.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isCompleted && (
              <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Verified {completionPercentage}%
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Player"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Real-time Watch Verification Progress Ribbon */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isPlaying ? 'Tracking Real Watch Time' : 'Paused'}</span>
            </div>
            <div className="text-slate-400">
              Verified: <strong className="text-blue-400">{formatSecondsToTime(verifiedSeconds)}</strong> / {formatSecondsToTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-28 sm:w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, completionPercentage)}%` }}
                />
              </div>
              <span className="font-extrabold text-white">{completionPercentage}%</span>
            </div>
            <span className="text-[11px] text-slate-400 hidden md:inline">
              (Anti-skip verification active)
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('player')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'player'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">play_circle</span>
            Video Player & Lab
          </button>
          <button
            onClick={() => {
              setActiveTab('summary');
              if (!summaryData && !isGeneratingSummary) {
                handleGenerateSummary();
              }
            }}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'summary'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            AI Summary & Key Takeaways
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'notes'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            My Notes & PDF Export
          </button>
          <button
            onClick={() => setActiveTab('record')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'record'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">military_tech</span>
            Completion Record {isCompleted ? '✓' : ''}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: PLAYER & LIVE METRICS */}
          {activeTab === 'player' && (
            <div className="space-y-6">
              {/* Embedded YouTube Iframe Container */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800">
                <div id={containerIdRef.current} className="w-full h-full" />
              </div>

              {/* Progress & Quick Stats Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[11px] uppercase font-bold text-slate-400">Current Position</span>
                  <div className="text-xl font-black text-white">{formatSecondsToTime(currentTime)}</div>
                  <p className="text-[11px] text-slate-400">Resumes automatically when you return</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[11px] uppercase font-bold text-slate-400">Verified Real Watch Time</span>
                  <div className="text-xl font-black text-blue-400">{formatSecondsToTime(verifiedSeconds)}</div>
                  <p className="text-[11px] text-slate-400">Excludes fast-forwarded / skipped intervals</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[11px] uppercase font-bold text-slate-400">Learning Status</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xl font-black ${
                        isCompleted ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {isCompleted ? 'Completed Verified' : `${completionPercentage}% Watched`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isCompleted ? 'Unofficial Record ready' : 'Earn certificate record at 85%'}
                  </p>
                </div>
              </div>

              {/* Quick Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/40 border border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('summary')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    View AI Summary
                  </button>
                  <button
                    onClick={() => downloadNotesAsPDF(track, user.name)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    Download Notes PDF
                  </button>
                </div>

                {onAskNebulaAI && (
                  <button
                    onClick={() => {
                      onAskNebulaAI(
                        `I am studying the YouTube track "${track.title}" by ${track.channel}. Can you test my understanding and explain the core architectural ideas?`
                      );
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">psychology</span>
                    Ask Nebula AI About This
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: AI SUMMARY & TAKEAWAYS */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-400">auto_awesome</span>
                    Gemini AI Technical Summary & Video Breakdown
                  </h3>
                  <p className="text-xs text-slate-400">
                    Extracted insights, timestamp chapters, and key architectural patterns
                  </p>
                </div>

                <button
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingSummary}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-blue-400 border border-blue-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-[16px] ${isGeneratingSummary ? 'animate-spin' : ''}`}>
                    refresh
                  </span>
                  {isGeneratingSummary ? 'Analyzing Video...' : 'Regenerate'}
                </button>
              </div>

              {isGeneratingSummary && !summaryData ? (
                <div className="p-12 text-center space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800">
                  <span className="material-symbols-outlined text-4xl text-blue-400 animate-spin">
                    progress_activity
                  </span>
                  <p className="text-sm font-bold text-white">Generating In-Depth AI Technical Breakdown...</p>
                  <p className="text-xs text-slate-400">Synthesizing core takeaways, timestamps, and quizzes with Gemini 3.7</p>
                </div>
              ) : summaryData ? (
                <div className="space-y-6">
                  {/* Executive Summary */}
                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <span className="text-[10px] uppercase font-black tracking-wider text-blue-400">
                      Executive Summary
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {summaryData.summary}
                    </p>
                  </div>

                  {/* Key Takeaways */}
                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400">
                      Key Technical Takeaways
                    </span>
                    <ul className="space-y-2">
                      {summaryData.keyPoints?.map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                          <span className="material-symbols-outlined text-emerald-400 text-[18px] shrink-0 mt-0.5">
                            check_circle
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Timestamp Chapters */}
                  {summaryData.timestamps && summaryData.timestamps.length > 0 && (
                    <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <span className="text-[10px] uppercase font-black tracking-wider text-purple-400">
                        Interactive Timestamp Chapters (Click to Seek Video)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {summaryData.timestamps.map((ts: any, idx: number) => (
                          <div
                            key={idx}
                            onClick={() => handleSeekTo(ts.time)}
                            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer flex items-start gap-3 group"
                          >
                            <span className="px-2 py-1 rounded-lg text-xs font-mono font-bold bg-purple-500/20 text-purple-300 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                              {ts.time}
                            </span>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                                {ts.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                                {ts.note}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Knowledge Check */}
                  {summaryData.quiz && summaryData.quiz.length > 0 && (
                    <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-black tracking-wider text-amber-400">
                          Self-Assessment Quick Quiz
                        </span>
                        <button
                          onClick={() => setShowQuizResults(!showQuizResults)}
                          className="text-xs text-amber-300 font-bold hover:underline cursor-pointer"
                        >
                          {showQuizResults ? 'Hide Answers' : 'Reveal Answers'}
                        </button>
                      </div>

                      <div className="space-y-4">
                        {summaryData.quiz.map((q: any, qIdx: number) => (
                          <div key={qIdx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                            <p className="text-xs sm:text-sm font-bold text-white">
                              {qIdx + 1}. {q.question}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              {q.options?.map((opt: string, optIdx: number) => {
                                const isSelected = selectedQuizAnswers[qIdx] === opt;
                                const isCorrect = q.correctAnswer === opt;
                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() =>
                                      setSelectedQuizAnswers((prev) => ({
                                        ...prev,
                                        [qIdx]: opt,
                                      }))
                                    }
                                    className={`p-2.5 rounded-lg text-left text-xs font-medium transition-all cursor-pointer ${
                                      showQuizResults
                                        ? isCorrect
                                          ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-bold'
                                          : isSelected
                                          ? 'bg-red-500/20 border border-red-500 text-red-300'
                                          : 'bg-slate-950/50 border border-slate-800 text-slate-400'
                                        : isSelected
                                        ? 'bg-blue-600 text-white font-bold'
                                        : 'bg-slate-950/50 hover:bg-slate-800 border border-slate-800 text-slate-300'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                            {showQuizResults && (
                              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                                <strong>Explanation:</strong> {q.explanation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 3: NOTES & PDF EXPORT */}
          {activeTab === 'notes' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-400">edit_note</span>
                    Personal Learning Notes
                  </h3>
                  <p className="text-xs text-slate-400">
                    Auto-saved per user session and included in your PDF download package
                  </p>
                </div>

                <button
                  onClick={() => downloadNotesAsPDF(track, user.name)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Download Notes as PDF
                </button>
              </div>

              <textarea
                value={studentNotes}
                onChange={(e) => handleSaveNotes(e.target.value)}
                placeholder="Write your study notes, code takeaways, implementation thoughts, or questions to ask Nebula AI here..."
                rows={10}
                className="w-full p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed"
              />

              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-400 text-[16px]">cloud_done</span>
                  Notes securely saved to user library
                </span>
                <span>{studentNotes.length} characters</span>
              </div>
            </div>
          )}

          {/* TAB 4: UNOFFICIAL LEARNING COMPLETION RECORD */}
          {activeTab === 'record' && (
            <div className="space-y-6">
              {learningRecord ? (
                <div className="space-y-6">
                  {/* Visual Record Card */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-2 border-indigo-500/30 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      VERIFIED WATCH TIME
                    </div>

                    <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-[28px]">school</span>
                    </div>

                    <span className="text-[11px] uppercase font-black tracking-widest text-blue-400">
                      INDUSTRYSKILL VERIFIED LAB RECORD
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                      Unofficial Learning Completion Record
                    </h3>

                    <p className="text-xs text-slate-400 mt-4">This record confirms that</p>
                    <div className="text-lg sm:text-xl font-black text-white border-b border-slate-700/80 inline-block px-4 pb-1 mt-1">
                      {user.name}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">has completed verified self-directed study for:</p>

                    <h4 className="text-base sm:text-lg font-bold text-blue-300 mt-1 max-w-xl mx-auto">
                      {learningRecord.videoTitle}
                    </h4>
                    <p className="text-xs text-slate-400">Source: {learningRecord.channel}</p>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 max-w-2xl mx-auto">
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Verified Watch</span>
                        <span className="text-sm font-black text-white">{learningRecord.verifiedWatchFormatted}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Completion</span>
                        <span className="text-sm font-black text-emerald-400">{learningRecord.completionPercentage}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Date</span>
                        <span className="text-sm font-black text-white">{learningRecord.completionDate}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Record ID</span>
                        <span className="text-xs font-mono font-bold text-indigo-300 truncate block">
                          {learningRecord.recordId}
                        </span>
                      </div>
                    </div>

                    {/* Disclaimer Box */}
                    <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 text-left text-[11px] text-red-200/90 leading-relaxed max-w-2xl mx-auto">
                      <strong>Disclaimer:</strong> {learningRecord.disclaimer}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => downloadRecordAsPDF(learningRecord)}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      Download Record PDF
                    </button>

                    <button
                      onClick={handleShareLinkedIn}
                      className="px-5 py-2.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <span className="material-symbols-outlined text-[18px]">share</span>
                      Share on LinkedIn
                    </button>

                    <button
                      onClick={handleCopyRecordId}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {copiedRecordId ? 'check' : 'content_copy'}
                      </span>
                      {copiedRecordId ? 'Copied Record ID!' : 'Copy Record ID'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center space-y-4 bg-slate-950/40 rounded-3xl border border-slate-800">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[32px]">lock_clock</span>
                  </div>
                  <h4 className="text-base font-bold text-white">Record Unlocks at 85% Verified Watch Time</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    You have verified <strong>{formatSecondsToTime(verifiedSeconds)}</strong> ({completionPercentage}%). Continue watching without skipping to unlock your shareable IndustrySkill completion certificate!
                  </p>
                  <button
                    onClick={() => setActiveTab('player')}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    Resume Watching
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
