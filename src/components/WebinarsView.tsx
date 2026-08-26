import React, { useState } from 'react';
import { WebinarItem, ViewType } from '../types';
import { initialWebinars } from '../data/mockData';

interface WebinarsViewProps {
  onNavigate: (view: ViewType) => void;
}

export const WebinarsView: React.FC<WebinarsViewProps> = ({ onNavigate }) => {
  const [webinars, setWebinars] = useState<WebinarItem[]>(initialWebinars);
  const [filterType, setFilterType] = useState<'All' | 'Upcoming' | 'Live' | 'Recorded'>('All');
  const [selectedWebinar, setSelectedWebinar] = useState<WebinarItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredWebinars = webinars.filter(
    (w) => filterType === 'All' || w.status === filterType
  );

  const handleRsvp = (webinarId: string) => {
    setWebinars((prev) =>
      prev.map((w) => {
        if (w.id === webinarId) {
          const newRegistered = !w.isRegistered;
          const newCount = newRegistered ? w.attendeesCount + 1 : w.attendeesCount - 1;
          setToastMsg(newRegistered ? `RSVP Confirmed for "${w.title}"! Calendar invite sent.` : `RSVP Cancelled.`);
          setTimeout(() => setToastMsg(null), 3000);
          return { ...w, isRegistered: newRegistered, attendeesCount: newCount };
        }
        return w;
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-purple-400/20 text-purple-300 border border-purple-300/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                LIVE TECH TALKS & AMAs
              </span>
              <span className="text-xs text-slate-300 font-semibold">Tier-1 Industry Mentors</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interactive Webinars & Tech Workshops
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Join live technical breakdowns, system design deep-dives, and hiring AMA sessions hosted by principal engineers from Google, Stripe, Meta, and OpenAI.
            </p>
          </div>

          <div className="flex items-center gap-3">
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
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {toastMsg}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['All', 'Live', 'Upcoming', 'Recorded'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === type
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#151f38] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Webinars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWebinars.map((webinar) => (
          <div
            key={webinar.id}
            className="bg-white dark:bg-[#151f38] border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              {/* Cover */}
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img
                  src={webinar.thumbnail}
                  alt={webinar.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                      webinar.status === 'Live'
                        ? 'bg-red-600 text-white animate-pulse'
                        : webinar.status === 'Upcoming'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {webinar.status === 'Live' ? '● LIVE NOW' : webinar.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                    {webinar.category}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-purple-300">event</span>
                    {webinar.date} • {webinar.time}
                  </span>
                  <span>{webinar.duration}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {webinar.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {webinar.description}
                </p>

                {/* Speaker Card */}
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <img
                    src={webinar.speakerAvatar}
                    alt={webinar.speakerName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {webinar.speakerName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {webinar.speakerRole} • <strong className="text-blue-600 dark:text-blue-400">{webinar.speakerCompany}</strong>
                    </p>
                  </div>
                </div>

                {/* Attendees */}
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-1">
                  <span>👥 {webinar.attendeesCount.toLocaleString()} Attendees</span>
                  {webinar.isRegistered && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      Registered
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 pt-0 flex items-center gap-3">
              <button
                onClick={() => setSelectedWebinar(webinar)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Session Details
              </button>

              <button
                onClick={() => handleRsvp(webinar.id)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer text-center ${
                  webinar.isRegistered
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {webinar.status === 'Recorded'
                  ? 'Watch Replay'
                  : webinar.isRegistered
                  ? 'RSVP Confirmed ✓'
                  : 'RSVP Free'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Webinar Detail Modal */}
      {selectedWebinar && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#151f38] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8 animate-fade-in">
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
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-900 space-y-1 text-purple-900 dark:text-purple-200">
                <p><strong>Host:</strong> {selectedWebinar.speakerName} ({selectedWebinar.speakerRole} @ {selectedWebinar.speakerCompany})</p>
                <p><strong>Schedule:</strong> {selectedWebinar.date} at {selectedWebinar.time} ({selectedWebinar.duration})</p>
                <p><strong>Platform:</strong> Google Meet / High-Definition Stream</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedWebinar(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleRsvp(selectedWebinar.id);
                  setSelectedWebinar(null);
                }}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer"
              >
                {selectedWebinar.isRegistered ? 'Update Registration' : 'Confirm Free Spot'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
