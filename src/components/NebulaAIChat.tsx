import React, { useState, useRef, useEffect } from 'react';
import { ViewType, UserProfile, ChatMessage } from '../types';
import { NEBULA_LOGO_URL } from '../data/mockData';

interface NebulaAIChatProps {
  user: UserProfile;
  onNavigate: (view: ViewType) => void;
}

export const NebulaAIChat: React.FC<NebulaAIChatProps> = ({ user, onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'model',
      content: `Hello ${user.name.split(' ')[0]}! I'm **Nebula AI**, your personal technical career readiness advisor.

I have loaded your profile for **${user.targetRole}** (Current Readiness: **${user.overallReadiness}%**).

How can I help you today? You can toggle **High Thinking Mode** above for deep technical audits, architectural deep dives, or career strategy questions.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinkingMode, setIsThinkingMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'How do I master React Hooks & Context quickly?',
    'What SQL concepts are tested in Full Stack intern interviews?',
    'Create a 14-day study plan to hit 85% readiness',
    'How do I detect recruitment scams & fake job offers?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-6),
          thinkingMode: isThinkingMode,
          userProfile: user,
        }),
      });

      const data = await response.json();
      const modelReply = data?.reply || data?.fallback || "I'm here to assist you with your career readiness goals.";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: modelReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data?.modelUsed,
        thinkingModeActive: isThinkingMode,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'model',
        content: 'I encountered a connection hiccup, but for your Full Stack roadmap, focusing on custom React hooks and RESTful Node.js endpoints will give you the highest immediate ROI for tech hiring.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pt-20 md:pt-24 pb-28 px-4 sm:px-6 max-w-3xl mx-auto flex flex-col h-[calc(100vh-20px)]">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 sm:p-5 neu-raised mb-4 flex justify-between items-center border border-blue-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950 p-2 flex items-center justify-center shadow-inner">
            <img
              src={NEBULA_LOGO_URL}
              alt="Nebula AI"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-[17px] font-bold text-[#121b2e] dark:text-white flex items-center gap-1.5">
              Nebula AI Mentor
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </h1>
            <p className="text-[12px] text-[#434655] dark:text-[#c3c6d7]">
              Powered by Google Gemini 3.1 Pro
            </p>
          </div>
        </div>

        {/* High Thinking Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsThinkingMode(!isThinkingMode)}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isThinkingMode
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-[#737686] dark:text-slate-400'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            {isThinkingMode ? 'Thinking: HIGH' : 'Fast Mode'}
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-[14px] leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-[#004ac6] text-white rounded-br-none neu-btn-primary'
                    : 'bg-white dark:bg-[#1e293b] text-[#121b2e] dark:text-white rounded-bl-none neu-raised border border-blue-50 dark:border-slate-800'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-[#004ac6] dark:text-[#60a5fa] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                      Nebula AI
                    </span>
                    {msg.thinkingModeActive && (
                      <span className="text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold border border-blue-100 dark:border-blue-900">
                        Deep Reasoning
                      </span>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div
                  className={`text-[10px] mt-2 text-right ${
                    isUser ? 'text-blue-100' : 'text-[#737686] dark:text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 neu-raised flex items-center gap-3 border border-blue-100 dark:border-slate-800">
              <span className="material-symbols-outlined text-[#004ac6] dark:text-[#60a5fa] animate-spin text-[20px]">
                progress_activity
              </span>
              <span className="text-[13px] font-semibold text-[#434655] dark:text-[#c3c6d7]">
                {isThinkingMode
                  ? 'Nebula is synthesizing deep technical guidance with Gemini 3.1 Pro...'
                  : 'Nebula is generating answer...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="text-[12px] whitespace-nowrap bg-white dark:bg-slate-800 text-[#004ac6] dark:text-[#60a5fa] px-3.5 py-1.5 rounded-full neu-raised border border-slate-200 dark:border-slate-700 hover:scale-95 transition-all cursor-pointer font-medium disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="relative flex items-center bg-white dark:bg-[#1e293b] rounded-2xl neu-raised p-2 border border-slate-200 dark:border-slate-800">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask Nebula AI anything about your tech career, code, or interview prep..."
          className="w-full bg-transparent border-none outline-none px-4 py-2 text-[14px] text-[#121b2e] dark:text-white placeholder:text-[#737686] dark:placeholder:text-slate-400"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim() || isLoading}
          className="neu-btn-primary w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">send</span>
        </button>
      </div>
    </main>
  );
};
