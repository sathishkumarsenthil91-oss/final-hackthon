import React, { useState } from 'react';
import { ViewType, UserProfile } from '../types';
import { LOGO_URL } from '../data/mockData';
import { GoogleLogo } from './GoogleLogo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewType) => void;
  onLoginSuccess: (name: string, email: string, additionalData?: Partial<UserProfile>) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('arun.k@university.edu');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCollege, setRegCollege] = useState('');
  const [regRole, setRegRole] = useState('Full Stack Developer');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess('Arun Kumar', loginEmail);
    onClose();
    onNavigate('dashboard');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(regName || 'New Student', regEmail || 'student@university.edu', {
      college: regCollege || 'National Institute of Technology',
      targetRole: regRole,
    });
    onClose();
    onNavigate('onboarding');
  };

  const handleGoogleSignIn = () => {
    onLoginSuccess('Arun Kumar', 'arun.k@gmail.com');
    onClose();
    onNavigate('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#151f38] rounded-3xl p-6 sm:p-8 max-w-md w-full neu-raised border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-200 my-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <img
            src={LOGO_URL}
            alt="IndustrySkill Logo"
            className="w-12 h-12 rounded-xl mb-2.5 object-cover shadow-sm ring-2 ring-blue-500/20"
          />
          <h2 className="text-[22px] font-black text-slate-900 dark:text-white">
            {tab === 'login' ? 'Sign In to IndustrySkill' : 'Create Student Account'}
          </h2>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
            {tab === 'login'
              ? 'Access your benchmark matrix and personalized career path.'
              : 'Start tracking industry skills and verified internships.'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-[#0d1527] rounded-2xl mb-5 neu-inset border border-slate-200/50 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-white dark:bg-[#1e293b] text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-white dark:bg-[#1e293b] text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-[12px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-[#0d1527] border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 text-[14px] text-slate-900 dark:text-white neu-inset outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a href="#forgot" className="text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-[#0d1527] border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 text-[14px] text-slate-900 dark:text-white neu-inset outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="neu-btn-primary w-full py-3 rounded-xl text-[14px] font-bold cursor-pointer mt-1"
            >
              Sign In
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="text-[12px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Arun Kumar"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-[#0d1527] border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-[14px] text-slate-900 dark:text-white neu-inset outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[12px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="student@university.edu"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-[#0d1527] border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-[14px] text-slate-900 dark:text-white neu-inset outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  College
                </label>
                <input
                  type="text"
                  placeholder="e.g. NIT"
                  value={regCollege}
                  onChange={(e) => setRegCollege(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0d1527] border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-[13px] text-slate-900 dark:text-white neu-inset outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Role
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0d1527] border border-slate-200 dark:border-slate-700/80 rounded-xl px-2 py-2 text-[12px] text-slate-900 dark:text-white outline-none focus:border-blue-500"
                >
                  <option value="Full Stack Developer">Full Stack</option>
                  <option value="Frontend Specialist">Frontend</option>
                  <option value="Backend Engineer">Backend</option>
                  <option value="AI Engineer">AI Engineer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[12px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-[#0d1527] border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-[13px] text-slate-900 dark:text-white neu-inset outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="neu-btn-primary w-full py-3 rounded-xl text-[14px] font-bold cursor-pointer mt-1"
            >
              Create Account
            </button>
          </form>
        )}

        {/* BOTTOM SECTION: GOOGLE AUTH BUTTON */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              OR
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 hover:border-blue-400 rounded-xl py-2.5 px-4 flex items-center justify-center gap-3 text-[14px] font-bold text-slate-800 dark:text-white neu-raised hover:scale-[0.99] transition-all cursor-pointer shadow-xs"
          >
            <GoogleLogo className="w-5 h-5 shrink-0" />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

