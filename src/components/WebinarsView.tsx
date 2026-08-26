import React, { useState } from 'react';
import { WebinarItem, ViewType, UserProfile, WebinarCertificate, GeneratedCertificate } from '../types';
import { initialWebinars } from '../data/mockData';
import { WebinarCertificateModal } from './WebinarCertificateModal';
import { CertificateGenerationModal } from './CertificateGenerationModal';

interface WebinarsViewProps {
  user: UserProfile;
  onNavigate: (view: ViewType) => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
}

export const WebinarsView: React.FC<WebinarsViewProps> = ({
  user,
  onNavigate,
  onUpdateUser,
}) => {
  const [webinars, setWebinars] = useState<WebinarItem[]>(initialWebinars);
  const [filterType, setFilterType] = useState<'All' | 'Upcoming' | 'Live' | 'Recorded'>('All');
  const [selectedWebinar, setSelectedWebinar] = useState<WebinarItem | null>(null);
  const [activePlayerWebinar, setActivePlayerWebinar] = useState<WebinarItem | null>(null);
  const [certificateWebinar, setCertificateWebinar] = useState<WebinarItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredWebinars = webinars.filter(
    (w) => filterType === 'All' || w.status === filterType
  );

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleRsvp = (webinarId: string) => {
    setWebinars((prev) =>
      prev.map((w) => {
        if (w.id === webinarId) {
          const newRegistered = !w.isRegistered;
          const newCount = newRegistered ? w.attendeesCount + 1 : w.attendeesCount - 1;
          showToast(newRegistered ? `RSVP Confirmed for "${w.title}"! Zoom link & Calendar invite sent.` : `RSVP Cancelled.`);
          return { ...w, isRegistered: newRegistered, registered: newRegistered, attendeesCount: newCount };
        }
        return w;
      })
    );
  };

  const handleToggleLike = (webinarId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWebinars((prev) =>
      prev.map((w) => {
        if (w.id === webinarId) {
          const nextLiked = !w.isLiked;
          const nextLikesCount = nextLiked ? (w.likesCount || 0) + 1 : Math.max(0, (w.likesCount || 1) - 1);
          if (nextLiked) {
            showToast(`You liked "${w.title}"! ❤️`);
          }
          return { ...w, isLiked: nextLiked, likesCount: nextLikesCount };
        }
        return w;
      })
    );
  };

  const handleCopyZoomCreds = (meetingId?: string, passcode?: string) => {
    if (!meetingId) return;
    const text = `Zoom Meeting ID: ${meetingId}${passcode ? ` | Passcode: ${passcode}` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(meetingId);
    showToast('Zoom Meeting details copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCertificateClaimed = (claimedCert: WebinarCertificate) => {
    setWebinars((prev) =>
      prev.map((w) => {
        if (w.id === claimedCert.webinarId) {
          return { ...w, hasClaimedCertificate: true, claimedCertificate: claimedCert };
        }
        return w;
      })
    );

    if (onUpdateUser) {
      const newCert: GeneratedCertificate = {
        id: `cert-${claimedCert.certificateId}`,
        serialId: claimedCert.certificateId,
        type: 'webinar',
        itemId: claimedCert.webinarId,
        title: claimedCert.webinarTitle,
        recipientName: claimedCert.recipientName || user.name || 'Learner',
        recipientEmail: user.email || 'learner@industryskill.edu',
        instructorOrSpeaker: claimedCert.speakerName,
        instructorRole: claimedCert.speakerRole,
        organization: claimedCert.speakerCompany || 'IndustrySkill',
        issueDate: claimedCert.issueDate,
        durationFormatted: claimedCert.duration || '60m',
        completionPercentage: 100,
        watchTimeSeconds: 3600,
        requiredWatchTimeSeconds: 3600,
        skillsValidated: claimedCert.tags || ['Live System Design', 'Tech Architecture'],
        legalDisclaimer:
          'This document certifies completion of non-accredited online learning activities. IndustrySkill and affiliated mentors are not officially affiliated with or endorsed by referenced third-party platforms.',
        verificationUrl: claimedCert.verificationUrl || `https://industryskill.edu/verify/${claimedCert.certificateId}`,
      };
      const existing = user.earnedCertificates || [];
      const updated = [...existing.filter((c) => c.serialId !== newCert.serialId), newCert];
      onUpdateUser({
        earnedCertificates: updated,
        certificationsCount: updated.length,
      });
    }

    showToast(`🎉 Certificate of Participation claimed for "${claimedCert.webinarTitle}"!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-purple-400/20 text-purple-300 border border-purple-300/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                LIVE TECH TALKS & AMAs
              </span>
              <span className="text-xs text-slate-300 font-semibold">Tier-1 Industry Mentors & Certificates</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interactive Webinars & Tech Workshops
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Join live interactive Zoom sessions and YouTube streams hosted by engineering leaders from Google, DeepMind, CNCF, and ScaleTech. Like favorite sessions, interact live, and generate verifiable participation certificates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('nebula')}
              className="px-4 py-2.5 bg-white text-purple-900 hover:bg-purple-50 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">psychology</span>
              Ask AI Speaker Qs
            </button>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fade-in shadow-xs">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {toastMsg}
        </div>
      )}

      {/* Filter Tabs & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(['All', 'Live', 'Upcoming', 'Recorded'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#151f38] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-semibold">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Zoom & YouTube Live Ready
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-amber-500">verified</span>
            Certificates Verified
          </span>
        </div>
      </div>

      {/* Webinars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWebinars.map((webinar) => {
          const speakerName = webinar.speaker?.name || webinar.speakerName || 'Lead Speaker';
          const speakerRole = webinar.speaker?.title || webinar.speakerRole || 'Staff Engineer';
          const speakerCompany = webinar.speaker?.company || webinar.speakerCompany || 'Industry Partner';
          const speakerAvatar = webinar.speaker?.avatar || webinar.speakerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
          const likes = webinar.likesCount ?? 850;
          const isLiked = webinar.isLiked ?? false;
          const hasCertificate = webinar.hasClaimedCertificate;

          return (
            <div
              key={webinar.id}
              className="bg-white dark:bg-[#151f38] border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Cover & Live Badges */}
                <div
                  className="relative h-48 bg-slate-900 overflow-hidden cursor-pointer"
                  onClick={() => {
                    if (webinar.youtubeVideoId) {
                      setActivePlayerWebinar(webinar);
                    } else {
                      setSelectedWebinar(webinar);
                    }
                  }}
                >
                  <img
                    src={webinar.thumbnail}
                    alt={webinar.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          webinar.status === 'Live'
                            ? 'bg-red-600 text-white animate-pulse'
                            : webinar.status === 'Upcoming'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {webinar.status === 'Live' ? '● LIVE NOW' : webinar.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs border border-white/10">
                        {webinar.category || 'Tech Masterclass'}
                      </span>
                    </div>

                    {/* YouTube Like Button */}
                    <button
                      onClick={(e) => handleToggleLike(webinar.id, e)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer ${
                        isLiked
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-black/60 text-white hover:bg-rose-500/80'
                      }`}
                      title={isLiked ? 'Unlike' : 'Like session'}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isLiked ? 'favorite' : 'favorite_border'}
                      </span>
                      <span>{likes.toLocaleString()}</span>
                    </button>
                  </div>

                  {/* Play Overlay Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <span className="material-symbols-outlined text-[24px]">play_arrow</span>
                    </div>
                  </div>

                  {/* Bottom Meta */}
                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-purple-300">event</span>
                      {webinar.date || webinar.dateTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">schedule</span>
                      {webinar.duration}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <h3
                    onClick={() => setSelectedWebinar(webinar)}
                    className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors"
                  >
                    {webinar.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {webinar.description}
                  </p>

                  {/* Speaker Card */}
                  <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <img
                      src={speakerAvatar}
                      alt={speakerName}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {speakerName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {speakerRole} • <strong className="text-purple-600 dark:text-purple-400">{speakerCompany}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Zoom & Attendees Status */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-blue-500">groups</span>
                      {webinar.attendeesCount.toLocaleString()} Attendees
                    </span>

                    {hasCertificate ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                        <span className="material-symbols-outlined text-[13px]">verified</span>
                        Cert Claimed
                      </span>
                    ) : (
                      <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">military_tech</span>
                        Cert Eligible
                      </span>
                    )}
                  </div>

                  {/* Zoom Direct Info Block if registered */}
                  {webinar.zoomMeetingId && (
                    <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-[11px]">
                      <div className="truncate pr-2">
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase block">
                          Zoom Meeting Access
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-mono">
                          ID: {webinar.zoomMeetingId}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyZoomCreds(webinar.zoomMeetingId, webinar.zoomPasscode)}
                        className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] transition-colors cursor-pointer shrink-0"
                      >
                        {copiedId === webinar.zoomMeetingId ? 'Copied ✓' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 space-y-2">
                <div className="flex items-center gap-2">
                  {/* Join Zoom / Stream Button */}
                  {webinar.zoomMeetingUrl ? (
                    <a
                      href={webinar.zoomMeetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">videocam</span>
                      Join Zoom
                    </a>
                  ) : (
                    <button
                      onClick={() => handleRsvp(webinar.id)}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer text-center ${
                        webinar.isRegistered
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {webinar.isRegistered ? 'RSVP Confirmed ✓' : 'RSVP Free'}
                    </button>
                  )}

                  {/* YouTube Player / Replay Button */}
                  {webinar.youtubeVideoId && (
                    <button
                      onClick={() => setActivePlayerWebinar(webinar)}
                      className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                      title="Watch Stream Replay on YouTube"
                    >
                      <span className="material-symbols-outlined text-[16px]">smart_display</span>
                      Watch
                    </button>
                  )}
                </div>

                {/* Generate Certificate Button */}
                <button
                  onClick={() => setCertificateWebinar(webinar)}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 dark:from-purple-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/50 dark:hover:to-indigo-900/50 border border-purple-200 dark:border-purple-800/80 text-purple-900 dark:text-purple-200 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-amber-500">
                    {hasCertificate ? 'verified' : 'military_tech'}
                  </span>
                  {hasCertificate ? 'View & Download Certificate' : 'Generate Webinar Certificate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded YouTube Replay Player Modal */}
      {activePlayerWebinar && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl space-y-4 my-auto">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2 truncate">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-600 text-white">
                  YOUTUBE STREAM
                </span>
                <h3 className="text-sm sm:text-base font-extrabold truncate">
                  {activePlayerWebinar.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePlayerWebinar(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-800">
                <iframe
                  src={`https://www.youtube.com/embed/${activePlayerWebinar.youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={activePlayerWebinar.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {activePlayerWebinar.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Presented by <strong>{activePlayerWebinar.speaker?.name || activePlayerWebinar.speakerName}</strong> ({activePlayerWebinar.speaker?.title || activePlayerWebinar.speakerRole} @ {activePlayerWebinar.speaker?.company || activePlayerWebinar.speakerCompany})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleLike(activePlayerWebinar.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                      activePlayerWebinar.isLiked
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {activePlayerWebinar.isLiked ? 'favorite' : 'favorite_border'}
                    </span>
                    {(activePlayerWebinar.likesCount || 0).toLocaleString()} Likes
                  </button>

                  <button
                    onClick={() => {
                      const web = activePlayerWebinar;
                      setActivePlayerWebinar(null);
                      setCertificateWebinar(web);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span className="material-symbols-outlined text-[16px]">military_tech</span>
                    Claim Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Details Modal */}
      {selectedWebinar && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-[#151f38] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">
                  {selectedWebinar.category} • {selectedWebinar.status}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedWebinar.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedWebinar(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p className="leading-relaxed">{selectedWebinar.description}</p>

              <div className="p-3.5 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-900 space-y-1.5 text-purple-900 dark:text-purple-200">
                <p><strong>Host:</strong> {selectedWebinar.speakerName} ({selectedWebinar.speakerRole} @ {selectedWebinar.speakerCompany})</p>
                <p><strong>Schedule:</strong> {selectedWebinar.date || selectedWebinar.dateTime} ({selectedWebinar.duration})</p>
                {selectedWebinar.zoomMeetingId && (
                  <p><strong>Zoom Room:</strong> Meeting ID {selectedWebinar.zoomMeetingId} • Passcode {selectedWebinar.zoomPasscode}</p>
                )}
              </div>

              {selectedWebinar.keyTakeaways && selectedWebinar.keyTakeaways.length > 0 && (
                <div className="space-y-1 pt-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Key Takeaways:</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    {selectedWebinar.keyTakeaways.map((takeaway, i) => (
                      <li key={i}>{takeaway}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  const web = selectedWebinar;
                  setSelectedWebinar(null);
                  setCertificateWebinar(web);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">military_tech</span>
                Claim Certificate
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedWebinar(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
                {selectedWebinar.zoomMeetingUrl ? (
                  <a
                    href={selectedWebinar.zoomMeetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">videocam</span>
                    Join Zoom Room
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      handleRsvp(selectedWebinar.id);
                      setSelectedWebinar(null);
                    }}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer"
                  >
                    {selectedWebinar.isRegistered ? 'Update RSVP' : 'Confirm Spot'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Webinar Certificate Generator Modal */}
      {certificateWebinar && (
        <WebinarCertificateModal
          webinar={certificateWebinar}
          user={user}
          onClose={() => setCertificateWebinar(null)}
          onCertificateClaimed={handleCertificateClaimed}
        />
      )}
    </div>
  );
};
