import React, { useState, useEffect } from 'react';
import { ViewType, UserProfile, SkillItem, RoadmapNode } from './types';
import { initialUserProfile, initialSkills, initialRoadmapNodes } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AuthView } from './components/AuthView';
import { LandingHero } from './components/LandingHero';
import { DashboardView } from './components/DashboardView';
import { ProfileView } from './components/ProfileView';
import { SkillsView } from './components/SkillsView';
import { SkillGapView } from './components/SkillGapView';
import { AIRecommendationsView } from './components/AIRecommendationsView';
import { CoursesView } from './components/CoursesView';
import { IndustryToolsView } from './components/IndustryToolsView';
import { CertificationsView } from './components/CertificationsView';
import { OpportunitiesView } from './components/OpportunitiesView';
import { WebinarsView } from './components/WebinarsView';
import { NebulaAIChat } from './components/NebulaAIChat';
import { AssignmentsView } from './components/AssignmentsView';
import { SafetyCenterView } from './components/SafetyCenterView';
import { SettingsView } from './components/SettingsView';
import { RoadmapView } from './components/RoadmapView';
import { NetworkView } from './components/NetworkView';
import { OnboardingWizard } from './components/OnboardingWizard';
import { LoginModal } from './components/LoginModal';
import { SmartCopilotDrawer } from './components/SmartCopilotDrawer';

export default function App() {
  // Starting page is Auth view with Login and Register forms
  const [currentView, setCurrentView] = useState<ViewType>('auth');
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [roadmapNodes, setRoadmapNodes] = useState<RoadmapNode[]>(initialRoadmapNodes);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [safetyInitialData, setSafetyInitialData] = useState<{ url: string; content: string }>({
    url: '',
    content: '',
  });

  // Sync dark mode class with root html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScanOpportunityInSafetyCenter = (url: string, content: string) => {
    setSafetyInitialData({ url, content });
    setCurrentView('safety');
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const handleLoginSuccess = (name: string, email: string, additionalData?: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      name,
      email,
      ...(additionalData || {}),
    }));
  };

  const handleSignOut = () => {
    setCurrentView('auth');
  };

  // If on Auth starting view, render AuthView cleanly
  if (currentView === 'auth' || currentView === 'login' || currentView === 'register') {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1329] text-[#0f172a] dark:text-[#f8fafc] transition-colors duration-200">
        <AuthView
          initialMode={currentView === 'register' ? 'register' : 'login'}
          onLoginSuccess={handleLoginSuccess}
          onNavigate={handleNavigate}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1329] text-[#0f172a] dark:text-[#f8fafc] transition-colors duration-200">
      {/* Top Header Bar with Mega Menu */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        user={user}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
        onOpenCopilot={() => setIsCopilotOpen(true)}
      />

      {/* Main View Router for all 14 sections */}
      <div className="w-full">
        {currentView === 'landing' && (
          <LandingHero onNavigate={handleNavigate} user={user} />
        )}

        {/* 1. Dashboard */}
        {currentView === 'dashboard' && (
          <DashboardView
            user={user}
            skills={skills}
            onNavigate={handleNavigate}
            onSelectSkillForLearning={() => setCurrentView('courses')}
            onOpenCopilot={() => setIsCopilotOpen(true)}
          />
        )}

        {/* 2. My Profile */}
        {currentView === 'profile' && (
          <div className="pt-20 md:pt-24 pb-24">
            <ProfileView
              user={user}
              skills={skills}
              onUpdateProfile={handleUpdateProfile}
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {/* 3. My Skills */}
        {currentView === 'skills' && (
          <div className="pt-20 md:pt-24 pb-24">
            <SkillsView
              user={user}
              skills={skills}
              onNavigate={handleNavigate}
              onUpdateSkills={(newSkills) => setSkills(newSkills)}
            />
          </div>
        )}

        {/* 4. Skill Gap Analysis */}
        {currentView === 'skill-gap' && (
          <div className="pt-20 md:pt-24 pb-24">
            <SkillGapView
              user={user}
              skills={skills}
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {/* 5. AI Recommendations */}
        {currentView === 'ai-recommendations' && (
          <div className="pt-20 md:pt-24 pb-24">
            <AIRecommendationsView
              user={user}
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {/* 6. Courses & YouTube Skill Tracks */}
        {currentView === 'courses' && (
          <div className="pt-20 md:pt-24 pb-24">
            <CoursesView
              user={user}
              onNavigate={handleNavigate}
              onUpdateUser={handleUpdateProfile}
              onAskNebulaAI={(prompt) => {
                handleNavigate('nebula');
              }}
            />
          </div>
        )}

        {/* 7. Industry Tools */}
        {currentView === 'industry-tools' && (
          <div className="pt-20 md:pt-24 pb-24">
            <IndustryToolsView onNavigate={handleNavigate} />
          </div>
        )}

        {/* 8. Certifications */}
        {currentView === 'certifications' && (
          <div className="pt-20 md:pt-24 pb-24">
            <CertificationsView onNavigate={handleNavigate} />
          </div>
        )}

        {/* 9. Internships & Jobs */}
        {currentView === 'opportunities' && (
          <div className="pt-20 md:pt-24 pb-24">
            <OpportunitiesView
              user={user}
              onNavigate={handleNavigate}
              onUpdateUser={handleUpdateProfile}
              onScanOpportunityInSafetyCenter={handleScanOpportunityInSafetyCenter}
            />
          </div>
        )}

        {/* 9b. Professional Career Network (SkillNet) */}
        {currentView === 'network' && (
          <div className="pt-20 md:pt-24 pb-24">
            <NetworkView
              user={user}
              onNavigate={handleNavigate}
              onUpdateUser={handleUpdateProfile}
            />
          </div>
        )}

        {/* 10. Webinars */}
        {currentView === 'webinars' && (
          <div className="pt-20 md:pt-24 pb-24">
            <WebinarsView
              user={user}
              onNavigate={handleNavigate}
              onUpdateUser={handleUpdateProfile}
            />
          </div>
        )}

        {/* 11. AI Chatbot (Nebula) */}
        {currentView === 'nebula' && (
          <NebulaAIChat user={user} onNavigate={handleNavigate} />
        )}

        {/* 12. Assignments */}
        {currentView === 'assignments' && (
          <div className="pt-20 md:pt-24 pb-24">
            <AssignmentsView onNavigate={handleNavigate} />
          </div>
        )}

        {/* 13. Fraud Detection (Safety Center) */}
        {currentView === 'safety' && (
          <div className="pt-20 md:pt-24 pb-24">
            <SafetyCenterView
              initialUrl={safetyInitialData.url}
              initialContent={safetyInitialData.content}
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {/* 14. Settings */}
        {currentView === 'settings' && (
          <div className="pt-20 md:pt-24 pb-24">
            <SettingsView
              user={user}
              darkMode={isDarkMode}
              onToggleDarkMode={handleToggleTheme}
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {/* Roadmap Secondary View */}
        {currentView === 'roadmap' && (
          <div className="pt-20 md:pt-24 pb-24">
            <RoadmapView
              user={user}
              nodes={roadmapNodes}
              onNavigate={handleNavigate}
              onUpdateNodes={(newNodes) => setRoadmapNodes(newNodes)}
            />
          </div>
        )}

        {/* Onboarding Wizard */}
        {currentView === 'onboarding' && (
          <OnboardingWizard
            onComplete={handleUpdateProfile}
            onNavigate={handleNavigate}
          />
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 md:bottom-8 right-5 z-40 flex flex-col gap-3">
        {/* Floating Copilot Button */}
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer flex items-center justify-center border-2 border-white dark:border-slate-800"
          title="Open AI Job Copilot & Resume ATS Scanner"
        >
          <span className="material-symbols-outlined text-[22px]">auto_fix_high</span>
        </button>
      </div>

      {/* Smart Copilot Drawer (Best Feature) */}
      <SmartCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        user={user}
        skills={skills}
        onNavigate={handleNavigate}
      />

      {/* Bottom Navigation Bar for Mobile */}
      <BottomNav currentView={currentView} onNavigate={handleNavigate} />

      {/* Authentication Login Modal (if opened from secondary views) */}
      <LoginModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onNavigate={handleNavigate}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
