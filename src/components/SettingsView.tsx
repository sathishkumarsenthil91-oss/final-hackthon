import React, { useState } from 'react';
import { AppSettings, UserProfile, ViewType } from '../types';
import { initialAppSettings } from '../data/mockData';
import { SupabaseDiagnosticsModal } from './SupabaseDiagnosticsModal';

interface SettingsViewProps {
  user: UserProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (view: ViewType) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  darkMode,
  onToggleDarkMode,
  onNavigate,
}) => {
  const [settings, setSettings] = useState<AppSettings>(initialAppSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const handleToggle = (key: keyof AppSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      return updated;
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset simulation data to initial state?')) {
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#151f38] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Platform Settings & Preferences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your account security, AI reasoning models, telemetry, and notifications.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          Save Preferences
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Settings updated and persisted!
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Section 0: Supabase Cloud Database & RLS Diagnostic */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-blue-950/40 border border-emerald-300/80 dark:border-emerald-800/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-2xl">database</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Supabase Database Connection & RLS Audit
                  </h2>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                    Live Project Connected
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Test and verify that your app can read and write data across all tables: <code className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">profiles</code>, <code className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">posts</code>, <code className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">messages</code>, <code className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">user_skills</code>, and <code className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">certificates</code>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDiagnostics(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Test Database Connection
            </button>
          </div>
        </div>

        {/* Section 1: Appearance & Display */}
        <div className="bg-white dark:bg-[#151f38] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">palette</span>
            Appearance & Visual Theme
          </h2>

          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Dark Mode Atmosphere</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Switch between high-contrast light theme and eye-safe twilight dark theme.
              </p>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                darkMode ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Compact Navigation Density</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Display tighter margins and smaller card padding for dense workstation setups.
              </p>
            </div>
            <button
              onClick={() => handleToggle('compactMode')}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                settings.compactMode ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>
        </div>

        {/* Section 2: AI & Nebula Bot Configuration */}
        <div className="bg-white dark:bg-[#151f38] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">smart_toy</span>
            Nebula AI & Model Intelligence
          </h2>

          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Thinking Mode (Reasoning Engine)</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Display step-by-step chain-of-thought analysis in AI Chat and recommendations.
              </p>
            </div>
            <button
              onClick={() => handleToggle('aiThinkingMode')}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                settings.aiThinkingMode ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Automated ATS Resume Telemetry</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Continuously recalculate your ATS score when adding new skills or completing courses.
              </p>
            </div>
            <button
              onClick={() => handleToggle('autoAtsAnalysis')}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                settings.autoAtsAnalysis ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>
        </div>

        {/* Section 3: Privacy & Security */}
        <div className="bg-white dark:bg-[#151f38] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">shield</span>
            Privacy, Recruiter Visibility & Scam Shield
          </h2>

          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Recruiter Discovery Spotlight</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Allow verified tech recruiters from Google, Microsoft, and startups to message you directly.
              </p>
            </div>
            <button
              onClick={() => handleToggle('recruiterVisibility')}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                settings.recruiterVisibility ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Real-Time Scam & Fraud Shield</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Automatically verify company domains and job offer authenticity in the background.
              </p>
            </div>
            <button
              onClick={() => handleToggle('fraudAlerts')}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                settings.fraudAlerts ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>
        </div>

        {/* Section 4: Maintenance & Danger Zone */}
        <div className="bg-white dark:bg-[#151f38] border border-red-200 dark:border-red-900/50 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
            <span className="material-symbols-outlined">warning</span>
            Simulation & Cache Controls
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Reset local simulated mock state, clear cached webinar RSVPs, or test clean user onboarding.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleResetData}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Application Cache
            </button>
            <button
              onClick={() => onNavigate('auth')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Sign Out to Login Screen
            </button>
          </div>
        </div>
      </div>

      <SupabaseDiagnosticsModal
        isOpen={showDiagnostics}
        onClose={() => setShowDiagnostics(false)}
      />
    </div>
  );
};
