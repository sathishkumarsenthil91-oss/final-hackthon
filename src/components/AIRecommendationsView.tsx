import React, { useState } from 'react';
import { UserProfile, ViewType, AIRecommendation } from '../types';
import { initialAIRecommendations } from '../data/mockData';

interface AIRecommendationsViewProps {
  user: UserProfile;
  onNavigate: (view: ViewType) => void;
}

export const AIRecommendationsView: React.FC<AIRecommendationsViewProps> = ({
  user,
  onNavigate,
}) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(initialAIRecommendations);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const categories = ['All', 'Skill Sprint', 'Internship Strategy', 'Project', 'Certification'];

  const filtered = recommendations.filter(
    (r) => activeCategory === 'All' || r.category === activeCategory
  );

  const handleRefreshRecommendations = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // add a dynamic high impact recommendation
      const newRec: AIRecommendation = {
        id: `rec-${Date.now()}`,
        category: 'Project',
        title: 'Build Full-Stack Real-Time Microservice with PostgreSQL & Redis',
        description: 'AI detected that Tier-1 companies value distributed event streaming. Build a pub/sub event worker in Node.js & Redis.',
        impactScore: 98,
        estimatedTime: '10 hours',
        tags: ['Redis', 'Microservices', 'Fresh Recommendation'],
        actionLabel: 'View Starter Architecture',
        actionView: 'assignments',
        difficulty: 'Advanced',
      };
      setRecommendations((prev) => [newRec, ...prev.filter((p) => p.id !== newRec.id)]);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-white/20 text-white backdrop-blur-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                GEMINI 3.1 PRO POWERED
              </span>
              <span className="text-xs text-blue-100 font-semibold">Continuous Career Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Career Recommendations & Growth Sprints
            </h1>
            <p className="text-blue-100 text-sm max-w-2xl leading-relaxed">
              Personalized, highest-return career actions derived by evaluating your resume, GitHub commits, skill delta, and verified summer internship openings.
            </p>
          </div>

          <button
            onClick={handleRefreshRecommendations}
            disabled={isRefreshing}
            className="px-5 py-3 bg-white text-blue-800 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <span className={`material-symbols-outlined text-[18px] ${isRefreshing ? 'animate-spin' : ''}`}>
              refresh
            </span>
            {isRefreshing ? 'Recalculating Career Vector...' : 'Refresh AI Recommendations'}
          </button>
        </div>

        {/* Highlight Score Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl">
            <span className="text-[11px] font-bold text-blue-100 uppercase">Top Action ROI</span>
            <p className="text-2xl font-black mt-0.5">+18%</p>
            <p className="text-[10px] text-blue-200">Readiness boost potential</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl">
            <span className="text-[11px] font-bold text-blue-100 uppercase">Target Requisitions</span>
            <p className="text-2xl font-black mt-0.5">19 Roles</p>
            <p className="text-[10px] text-emerald-300 font-semibold">90%+ match threshold</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl">
            <span className="text-[11px] font-bold text-blue-100 uppercase">Weekly Hours</span>
            <p className="text-2xl font-black mt-0.5">6-8 hrs</p>
            <p className="text-[10px] text-blue-200">Recommended study budget</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl">
            <span className="text-[11px] font-bold text-blue-100 uppercase">AI Mentor Confidence</span>
            <p className="text-2xl font-black mt-0.5">99.4%</p>
            <p className="text-[10px] text-amber-200 font-semibold">High-accuracy prediction</p>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#151f38] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommendations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((rec) => (
          <div
            key={rec.id}
            className="bg-white dark:bg-[#151f38] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {rec.category}
                </span>

                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-black bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  {rec.impactScore}% Match ROI
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {rec.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {rec.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {rec.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-xs text-slate-400 font-medium">
                ⏱️ Est. Time: <strong className="text-slate-700 dark:text-slate-200">{rec.estimatedTime}</strong>
              </div>

              <button
                onClick={() => onNavigate(rec.actionView)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{rec.actionLabel}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
