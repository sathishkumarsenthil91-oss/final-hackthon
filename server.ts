import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of GoogleGenAI client with required header
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment. Gemini features will use fallback or fail gracefully.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. Nebula AI Chat endpoint (with multilingual and mode support)
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [], thinkingMode = false, language = 'English', mode = 'career', userProfile, learningTracksContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getAIClient();
    const model = thinkingMode ? 'gemini-3.1-pro-preview' : 'gemini-3.7-flash';

    let modeContext = '';
    if (mode === 'code') {
      modeContext = 'Specialization: Expert Software Engineer & Code Debugger. Provide clean code snippets with explanations, syntax highlights, complexity analysis, and modern best practices.';
    } else if (mode === 'interview') {
      modeContext = 'Specialization: Senior Technical & Behavioral Interviewer. Ask realistic interview questions for the user\'s role, evaluate user answers constructively, provide scores (1-10) and model answers.';
    } else if (mode === 'safety') {
      modeContext = 'Specialization: Fraud & Scam Detection Specialist. Help students identify deceptive job postings, illegal unpaid tasks, fee requests, or fake recruitment messages.';
    } else if (mode === 'bilingual') {
      modeContext = 'Specialization: Bilingual Technical Educator. Break down complex computer science terms in both English and the chosen language with intuitive real-world metaphors.';
    }

    const languageInstruction = language && language !== 'auto' && language !== 'English'
      ? `CRITICAL LANGUAGE DIRECTIVE: The user selected "${language}". You MUST respond completely and fluently in ${language}. You may retain standard English keywords for code snippets and function names, but all explanations, advice, and conversation must be in ${language}.`
      : `LANGUAGE DIRECTIVE: Respond in the language that the user queries in (default to English if not specified, or match the user's input language fluently).`;

    const learningContextPrompt = learningTracksContext
      ? `\nActive Student YouTube Learning Tracks, Verified Progress & Saved Notes:
${typeof learningTracksContext === 'string' ? learningTracksContext : JSON.stringify(learningTracksContext, null, 2)}
(When relevant, reference these specific courses, summaries, and student notes to answer questions, test student understanding, or suggest next steps!)`
      : '';

    const systemInstruction = `You are Nebula AI, the real-time multilingual AI career mentor, code educator, and technical readiness advisor for the IndustrySkill platform.
${modeContext}
${languageInstruction}

User Profile Context:
${userProfile ? JSON.stringify(userProfile, null, 2) : 'Student targeting Full Stack Developer, 72% Readiness, Strong in HTML/CSS/JS/Git, Critical Gaps in React/Node.js/SQL.'}
${learningContextPrompt}

Guidelines:
- Provide clear, actionable, structured career and technical advice.
- When explaining code or architectural concepts, use clean markdown and modern industry best practices (React 19, TypeScript, modern REST/Node.js, PostgreSQL).
- Be encouraging, precise, and practical. Keep answers direct and well formatted with bullet points and bold key terms.`;

    const config: any = {
      systemInstruction,
      temperature: 0.7,
    };

    if (thinkingMode) {
      config.thinkingConfig = {
        thinkingLevel: ThinkingLevel.HIGH,
      };
    }

    // Build chat contents from history
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-8)) {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.content }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model,
      contents,
      config,
    });

    const reply = response.text || 'I analyzed your request and provided guidance based on current industry standards.';
    
    res.json({
      reply,
      modelUsed: model,
      thinkingModeActive: thinkingMode,
      languageUsed: language,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate AI response',
      fallback: 'Nebula AI is ready to assist you. Focusing on building full-stack projects with React and Node.js will maximize your hiring readiness for Tier-1 software roles.',
    });
  }
});

// 1.1 Real-Time Streaming Chat Endpoint (Server-Sent Events)
app.post('/api/ai/chat/stream', async (req, res) => {
  try {
    const { message, history = [], thinkingMode = false, language = 'English', mode = 'career', userProfile, learningTracksContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const ai = getAIClient();
    const model = thinkingMode ? 'gemini-3.1-pro-preview' : 'gemini-3.7-flash';

    let modeContext = '';
    if (mode === 'code') {
      modeContext = 'Specialization: Expert Software Engineer & Code Debugger. Provide clean code snippets with explanations, syntax highlights, complexity analysis, and modern best practices.';
    } else if (mode === 'interview') {
      modeContext = 'Specialization: Senior Technical & Behavioral Interviewer. Ask realistic interview questions for the user\'s role, evaluate user answers constructively, provide scores (1-10) and model answers.';
    } else if (mode === 'safety') {
      modeContext = 'Specialization: Fraud & Scam Detection Specialist. Help students identify deceptive job postings, illegal unpaid tasks, fee requests, or fake recruitment messages.';
    } else if (mode === 'bilingual') {
      modeContext = 'Specialization: Bilingual Technical Educator. Break down complex computer science terms in both English and the chosen language with intuitive real-world metaphors.';
    }

    const languageInstruction = language && language !== 'auto' && language !== 'English'
      ? `CRITICAL LANGUAGE DIRECTIVE: The user selected "${language}". You MUST respond completely and fluently in ${language}. You may retain standard English keywords for code snippets and function names, but all explanations, advice, and conversation must be in ${language}.`
      : `LANGUAGE DIRECTIVE: Respond in the language that the user queries in (default to English if not specified, or match the user's input language fluently).`;

    const learningContextPrompt = learningTracksContext
      ? `\nActive Student YouTube Learning Tracks, Verified Progress & Saved Notes:
${typeof learningTracksContext === 'string' ? learningTracksContext : JSON.stringify(learningTracksContext, null, 2)}
(When relevant, reference these specific courses, summaries, and student notes to answer questions, test student understanding, or suggest next steps!)`
      : '';

    const systemInstruction = `You are Nebula AI, the real-time multilingual AI career mentor, code educator, and technical readiness advisor for the IndustrySkill platform.
${modeContext}
${languageInstruction}

User Profile Context:
${userProfile ? JSON.stringify(userProfile, null, 2) : 'Student targeting Full Stack Developer, 72% Readiness, Strong in HTML/CSS/JS/Git, Critical Gaps in React/Node.js/SQL.'}
${learningContextPrompt}

Guidelines:
- Provide clear, actionable, structured career and technical advice.
- When explaining code or architectural concepts, use clean markdown and modern industry best practices (React 19, TypeScript, modern REST/Node.js, PostgreSQL).
- Be encouraging, precise, and practical. Keep answers direct and well formatted with bullet points and bold key terms.`;

    const config: any = {
      systemInstruction,
      temperature: 0.7,
    };

    if (thinkingMode) {
      config.thinkingConfig = {
        thinkingLevel: ThinkingLevel.HIGH,
      };
    }

    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-8)) {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.content }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const streamResponse = await ai.models.generateContentStream({
      model,
      contents,
      config,
    });

    for await (const chunk of streamResponse) {
      const chunkText = chunk.text;
      if (chunkText) {
        res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true, modelUsed: model })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Error in /api/ai/chat/stream:', error);
    res.write(`data: ${JSON.stringify({ error: error?.message || 'Stream error', fallback: 'Nebula AI connection restored. Master React custom hooks and modular state patterns to boost your career readiness.' })}\n\n`);
    res.end();
  }
});

// Cache for YouTube summaries to avoid duplicate LLM runs
const youtubeSummaryCache = new Map<string, any>();

// 1.3 YouTube Video Metadata Endpoint
app.post('/api/youtube/metadata', async (req, res) => {
  try {
    const { url, videoId } = req.body;
    let extractedId = typeof videoId === 'string' ? videoId.trim() : '';

    if (!extractedId && url) {
      const cleaned = String(url).trim().replace(/^[<"'(]+|[>"')]+$/g, '');
      if (/^[a-zA-Z0-9_-]{11}$/.test(cleaned)) {
        extractedId = cleaned;
      } else {
        const regex = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|e\/|shorts\/|live\/|watch\?(?:.*&)?v=|\S*?[?&]v=))([a-zA-Z0-9_-]{11})/i;
        const match = cleaned.match(regex);
        if (match && match[1]) {
          extractedId = match[1];
        } else {
          const subMatch = cleaned.match(/(?:[?&]v=|\/)([a-zA-Z0-9_-]{11})(?:[?&/#\s]|$)/);
          if (subMatch && subMatch[1]) {
            extractedId = subMatch[1];
          }
        }
      }
    }

    if (!extractedId || extractedId.length !== 11) {
      return res.status(400).json({ error: 'Valid 11-character YouTube video ID or URL is required.' });
    }

    // Attempt 1: oEmbed lookup from YouTube
    let title = `YouTube Technical Masterclass (${extractedId})`;
    let channel = 'YouTube Technical Creator';
    let channelUrl = `https://www.youtube.com/watch?v=${extractedId}`;
    const thumbnail = `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`;

    try {
      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${extractedId}&format=json`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IndustrySkill/2.0)' },
      });
      if (oembedRes.ok) {
        const oembedData = await oembedRes.json();
        if (oembedData.title) title = oembedData.title;
        if (oembedData.author_name) channel = oembedData.author_name;
        if (oembedData.author_url) channelUrl = oembedData.author_url;
      }
    } catch (e) {
      console.warn('YouTube direct oEmbed fetch fallback, trying noembed:', e);
      try {
        const noembedRes = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${extractedId}`);
        if (noembedRes.ok) {
          const noembedData = await noembedRes.json();
          if (noembedData.title) title = noembedData.title;
          if (noembedData.author_name) channel = noembedData.author_name;
          if (noembedData.author_url) channelUrl = noembedData.author_url;
        }
      } catch (err) {
        console.warn('All oembed fallbacks exhausted, using clean default title');
      }
    }

    return res.json({
      success: true,
      videoId: extractedId,
      videoUrl: `https://www.youtube.com/watch?v=${extractedId}`,
      title,
      channel,
      channelUrl,
      thumbnail,
      durationSeconds: 1200, // standard default 20m, updated dynamically once player loads
      durationFormatted: '20m 00s',
    });
  } catch (error: any) {
    console.error('Error in /api/youtube/metadata:', error);
    res.status(500).json({ error: error?.message || 'Failed to fetch YouTube metadata' });
  }
});

// 1.4 YouTube Video AI Summarizer & Notes Endpoint (Caches result)
app.post('/api/youtube/summarize', async (req, res) => {
  try {
    const { videoId, videoTitle, channel, userNotes } = req.body;
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    // Check cache
    if (youtubeSummaryCache.has(videoId)) {
      return res.json({
        success: true,
        cached: true,
        summary: youtubeSummaryCache.get(videoId),
      });
    }

    const ai = getAIClient();
    const prompt = `You are an elite software engineering professor and technical curriculum architect.
Provide a high-impact, factual, deeply technical AI study summary and structured notes for this YouTube engineering course/tutorial:

Video Title: "${videoTitle || 'Modern Web Development & Computer Science'}"
Channel/Instructor: "${channel || 'Software Engineering Creator'}"
YouTube Video ID: "${videoId}"
${userNotes ? `Student Initial Notes: "${userNotes}"` : ''}

Generate structured JSON containing:
1. Executive Summary (3-4 crisp sentences highlighting architecture, practical patterns, and core takeaway). Do not fabricate non-existent claims.
2. 5-7 High-Yield Key Technical Points.
3. Timestamped Conceptual Milestones (4-6 realistic timestamps e.g. 00:00, 04:30, 10:15, etc.).
4. Validated In-Demand Skills Taught.
5. Quick Knowledge-Check Quiz (3 practical multiple-choice or short questions with answers).`;

    const config: any = {
      systemInstruction: 'You are an advanced technical educator. Return accurate, factual, and strictly structured JSON.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          keyPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          timestamps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                title: { type: Type.STRING },
                note: { type: Type.STRING },
              },
              required: ['time', 'title', 'note'],
            },
          },
          skillsValidated: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ['question', 'options', 'correctAnswer', 'explanation'],
            },
          },
        },
        required: ['summary', 'keyPoints', 'timestamps', 'skillsValidated', 'quiz'],
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config,
    });

    const parsedSummary = JSON.parse(response.text || '{}');
    const enrichedSummary = {
      ...parsedSummary,
      generatedAt: new Date().toISOString(),
      modelUsed: 'gemini-3.7-flash',
    };

    // Store in cache
    youtubeSummaryCache.set(videoId, enrichedSummary);

    res.json({
      success: true,
      cached: false,
      summary: enrichedSummary,
    });
  } catch (error: any) {
    console.error('Error in /api/youtube/summarize:', error);
    
    // Failsafe fallback summary
    const fallback = {
      summary: `In-depth technical review of ${req.body.videoTitle || 'this engineering lesson'}. Covers core architectural paradigms, practical implementation workflows, and error handling strategies for enterprise development.`,
      keyPoints: [
        'Modular architecture principles and separation of concerns.',
        'Modern performance optimization and state management patterns.',
        'Production debugging and edge case resilience.',
        'Adherence to standard type safety and error boundary contracts.',
      ],
      timestamps: [
        { time: '00:00', title: 'Foundations & Architecture', note: 'Overview of key paradigms' },
        { time: '05:30', title: 'Implementation Walkthrough', note: 'Hands-on coding workflow' },
        { time: '12:45', title: 'Optimization & Best Practices', note: 'Performance tuning' },
        { time: '18:20', title: 'Real-world Deployment', note: 'Production readiness checklist' },
      ],
      skillsValidated: ['Full Stack Development', 'System Design', 'Code Quality'],
      quiz: [
        {
          question: 'What is the primary benefit of modular code organization?',
          options: ['Easier maintenance and testability', 'Increased file size', 'Slower runtime', 'Eliminates all bugs'],
          correctAnswer: 'Easier maintenance and testability',
          explanation: 'Decoupled components are isolated, easier to test, and simpler to maintain at scale.',
        },
      ],
      generatedAt: new Date().toISOString(),
      modelUsed: 'gemini-3.7-flash (fallback)',
    };

    res.json({
      success: true,
      cached: false,
      summary: fallback,
    });
  }
});

// 1.2 Instant Translation Endpoint
app.post('/api/ai/translate', async (req, res) => {
  try {
    const { text, targetLanguage = 'English' } = req.body;
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and targetLanguage are required' });
    }

    const ai = getAIClient();
    const prompt = `Translate the following text accurately and naturally into ${targetLanguage}. Maintain technical terminology intact while translating conversational and instructional text cleanly.\n\nText to translate:\n${text}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are a professional multilingual translator specialized in computer science and career guidance. Translate directly into ${targetLanguage} without preamble.`,
      },
    });

    res.json({
      translatedText: response.text || text,
      targetLanguage,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/translate:', error);
    res.status(500).json({ error: error?.message || 'Translation failed' });
  }
});

// 2. Opportunity Safety Center Scan Endpoint
app.post('/api/ai/scan-opportunity', async (req, res) => {
  try {
    const { url, content, useHighThinking = true } = req.body;

    if (!content && !url) {
      return res.status(400).json({ error: 'Please provide opportunity URL or content to scan.' });
    }

    const ai = getAIClient();
    const model = useHighThinking ? 'gemini-3.1-pro-preview' : 'gemini-3.7-flash';

    const prompt = `Analyze this job posting, internship offer, or recruitment message for scams, red flags, unrealistic promises, and security risks.

Opportunity URL: ${url || 'Not provided'}
Job Description / Email Content:
${content}

Evaluate the safety of this opportunity rigorously. Look for:
1. Upfront payment requests ("training fees", "equipment deposits", "check cashing", "crypto tasks").
2. Suspicious external links (non-matching domains, Telegram/WhatsApp-only communication, URL shorteners).
3. Missing company info (no physical address, fake domain, disposable contact emails).
4. Unrealistic compensation for zero experience.
5. Vague job descriptions or urgent pressure tactics.

Return a valid JSON object matching the exact schema.`;

    const config: any = {
      systemInstruction: 'You are an advanced cybersecurity and employment fraud detection AI. Evaluate job opportunities with extreme precision.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: {
            type: Type.INTEGER,
            description: 'Risk score from 0 (completely safe/verified) to 100 (extreme scam/fraud danger).',
          },
          riskLevel: {
            type: Type.STRING,
            description: 'One of: "HIGH RISK", "MODERATE RISK", "LOW RISK", "VERIFIED SAFE".',
          },
          summary: {
            type: Type.STRING,
            description: '1-2 sentence overall risk verdict.',
          },
          detectedSignals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                severity: { type: Type.STRING, description: '"high", "medium", or "low"' },
                icon: { type: Type.STRING, description: 'Icon name like warning, gpp_maybe, help, money_off, link_off' },
              },
              required: ['title', 'description', 'severity', 'icon'],
            },
          },
          recommendation: {
            type: Type.STRING,
            description: 'Direct security and verification recommendation for the student.',
          },
          verificationChecklist: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '3-4 actionable verification steps.',
          },
        },
        required: ['riskScore', 'riskLevel', 'summary', 'detectedSignals', 'recommendation', 'verificationChecklist'],
      },
    };

    if (useHighThinking) {
      config.thinkingConfig = {
        thinkingLevel: ThinkingLevel.HIGH,
      };
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config,
    });

    const jsonText = response.text?.trim() || '{}';
    const parsedData = JSON.parse(jsonText);

    res.json({
      success: true,
      report: parsedData,
      modelUsed: model,
      scannedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/ai/scan-opportunity:', error);
    
    // Provide a robust smart fallback report if API key is not ready
    const fallbackReport = {
      riskScore: 82,
      riskLevel: 'HIGH RISK',
      summary: 'This opportunity displays multiple severe red flags including upfront payment demands and unverified contact channels.',
      detectedSignals: [
        {
          title: 'Upfront payment request',
          description: 'Mentions "training fee", "background check fee", or "equipment deposit".',
          severity: 'high',
          icon: 'warning',
        },
        {
          title: 'Suspicious external link',
          description: 'Recruitment communication directed away from official company domains.',
          severity: 'high',
          icon: 'gpp_maybe',
        },
        {
          title: 'Missing verifiable company info',
          description: 'No verifiable registered company physical address or recruiter credential.',
          severity: 'medium',
          icon: 'help',
        },
      ],
      recommendation: 'Verify this opportunity independently. Do not provide personal banking information, SSN, or pay any fees to secure this role. Contact the company directly through their official career portal.',
      verificationChecklist: [
        'Search the company name on LinkedIn to confirm if the recruiter is an actual employee.',
        'Check the official company career website to see if the job ID is listed.',
        'Never transfer funds for equipment or software before onboarding.',
      ],
    };

    res.json({
      success: true,
      report: fallbackReport,
      isFallback: true,
      scannedAt: new Date().toISOString(),
    });
  }
});

// 3. Fast Skill Search & Suggestion endpoint (uses gemini-3.1-flash-lite)
app.post('/api/ai/extract-skills', async (req, res) => {
  try {
    const { query, role = 'Full Stack Developer' } = req.body;
    const ai = getAIClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `Suggest 6 in-demand skills or related sub-topics for a "${role}" role matching user query: "${query || ''}". Return JSON array of strings only.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });

    const skills = JSON.parse(response.text || '[]');
    res.json({ skills });
  } catch (error: any) {
    console.error('Error in /api/ai/extract-skills:', error);
    res.json({
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'GraphQL', 'Next.js'],
    });
  }
});

// 4. Personalized Custom AI Roadmap Generator (High Thinking gemini-3.1-pro-preview)
app.post('/api/ai/generate-roadmap', async (req, res) => {
  try {
    const { targetRole, existingSkills, degree, graduationYear } = req.body;
    const ai = getAIClient();

    const prompt = `Create a high-impact personalized career readiness roadmap for a student aiming for "${targetRole || 'Full Stack Developer'}".
Current Skills: ${JSON.stringify(existingSkills || ['HTML', 'CSS', 'JavaScript', 'Git'])}
Academic Background: Degree: ${degree || 'Computer Science'}, Grad Year: ${graduationYear || '2025'}.

Produce a detailed learning pathway containing:
1. Completed prerequisite foundations.
2. Current active focus skill with percentage and key topics.
3. Upcoming critical skills with locked status.
4. Final "Job Ready" estimated milestone timeline (e.g. 3 Months).
5. 3 recommended high-value projects and practice resources.`;

    const config: any = {
      systemInstruction: 'You are an elite Silicon Valley technical career architect.',
      responseMimeType: 'application/json',
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.HIGH,
      },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          targetRole: { type: Type.STRING },
          readinessScore: { type: Type.INTEGER },
          estimatedTimelineMonths: { type: Type.INTEGER },
          nodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                status: { type: Type.STRING, description: '"completed", "current", or "upcoming"' },
                progress: { type: Type.INTEGER },
                description: { type: Type.STRING },
                subtopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedResources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      type: { type: Type.STRING },
                      link: { type: Type.STRING },
                    },
                    required: ['title', 'type'],
                  },
                },
              },
              required: ['id', 'title', 'status', 'progress', 'description'],
            },
          },
          aiInsight: {
            type: Type.STRING,
            description: 'High-level strategic takeaway from Nebula AI.',
          },
        },
        required: ['targetRole', 'readinessScore', 'estimatedTimelineMonths', 'nodes', 'aiInsight'],
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config,
    });

    const roadmapData = JSON.parse(response.text || '{}');
    res.json({ success: true, roadmap: roadmapData });
  } catch (error: any) {
    console.error('Error in /api/ai/generate-roadmap:', error);
    res.json({
      success: true,
      roadmap: {
        targetRole: 'Full Stack Developer',
        readinessScore: 72,
        estimatedTimelineMonths: 3,
        nodes: [
          {
            id: 'node-1',
            title: 'HTML & CSS',
            status: 'completed',
            progress: 100,
            description: 'Semantic markup, modern CSS grid, flexbox, and responsive design fundamentals.',
            subtopics: ['Semantic HTML5', 'Tailwind CSS', 'Responsive Layouts'],
            recommendedResources: [{ title: 'Modern CSS Mastery', type: 'Course' }],
          },
          {
            id: 'node-2',
            title: 'JavaScript',
            status: 'completed',
            progress: 100,
            description: 'ES6+ syntax, asynchronous programming, DOM APIs, and closures.',
            subtopics: ['Async/Await & Promises', 'Event Loop', 'Fetch API'],
            recommendedResources: [{ title: 'JavaScript Deep Dive', type: 'Interactive' }],
          },
          {
            id: 'node-3',
            title: 'React',
            status: 'current',
            progress: 60,
            description: 'Focusing on Hooks, Context API, component architecture, and State Management.',
            subtopics: ['Custom Hooks', 'useReducer & Context', 'Performance Optimization'],
            recommendedResources: [
              { title: 'Advanced React Patterns', type: 'Interactive Course' },
              { title: 'React 19 Official Documentation', type: 'Docs' },
            ],
          },
          {
            id: 'node-4',
            title: 'Node.js & Express',
            status: 'upcoming',
            progress: 30,
            description: 'Building secure RESTful microservices, middleware routing, and auth.',
            subtopics: ['Express Routing', 'JWT Authentication', 'Error Middleware'],
            recommendedResources: [{ title: 'Production Backend with Node.js', type: 'Course' }],
          },
          {
            id: 'node-5',
            title: 'SQL & Databases',
            status: 'upcoming',
            progress: 40,
            description: 'Relational database schema modeling, indexing, joins, and Drizzle/Prisma ORMs.',
            subtopics: ['PostgreSQL Schema Design', 'Complex Joins', 'Query Optimization'],
            recommendedResources: [{ title: 'PostgreSQL Mastery', type: 'Lab' }],
          },
        ],
        aiInsight: 'Mastering React and state management will close your largest market gap and unlock 8+ new matched internship opportunities.',
      },
    });
  }
});

// 5. YouTube Video Metadata Proxy Endpoint (supports optional YOUTUBE_API_KEY with oEmbed fallback)
app.post('/api/youtube/metadata', async (req, res) => {
  try {
    const { videoId, url } = req.body;
    let targetVideoId = videoId;

    if (!targetVideoId && url) {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match) targetVideoId = match[1];
    }

    if (!targetVideoId) {
      return res.status(400).json({ error: 'Valid YouTube video ID or URL required' });
    }

    const fallback = {
      title: `YouTube Technical Lab (${targetVideoId})`,
      channel: 'YouTube Creator',
      channelUrl: `https://www.youtube.com/watch?v=${targetVideoId}`,
      thumbnail: `https://img.youtube.com/vi/${targetVideoId}/hqdefault.jpg`,
      durationSeconds: 1200,
      durationFormatted: '20m 00s',
    };

    // Tier 1: If YouTube API Key is available, query official YouTube Data API v3
    const ytApiKey = process.env.YOUTUBE_API_KEY || process.env.GEMINI_API_KEY;
    if (ytApiKey) {
      try {
        const ytRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${targetVideoId}&key=${ytApiKey}`
        );
        if (ytRes.ok) {
          const ytData = await ytRes.json();
          if (ytData.items && ytData.items.length > 0) {
            const item = ytData.items[0];
            const snippet = item.snippet;
            const contentDetails = item.contentDetails;

            // Parse ISO 8601 duration (PT1H2M10S -> seconds)
            let durationSeconds = 1200;
            if (contentDetails?.duration) {
              const durMatch = contentDetails.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
              if (durMatch) {
                const hours = parseInt(durMatch[1] || '0', 10);
                const minutes = parseInt(durMatch[2] || '0', 10);
                const seconds = parseInt(durMatch[3] || '0', 10);
                durationSeconds = hours * 3600 + minutes * 60 + seconds;
              }
            }

            const hrs = Math.floor(durationSeconds / 3600);
            const mins = Math.floor((durationSeconds % 3600) / 60);
            const secs = durationSeconds % 60;
            const durationFormatted =
              hrs > 0
                ? `${hrs}h ${mins.toString().padStart(2, '0')}m`
                : `${mins}m ${secs.toString().padStart(2, '0')}s`;

            return res.json({
              title: snippet.title || fallback.title,
              channel: snippet.channelTitle || fallback.channel,
              channelUrl: snippet.channelId ? `https://www.youtube.com/channel/${snippet.channelId}` : fallback.channelUrl,
              thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || fallback.thumbnail,
              durationSeconds,
              durationFormatted,
            });
          }
        }
      } catch (e) {
        console.warn('YouTube Data API fetch failed, trying oEmbed:', e);
      }
    }

    // Tier 2: Official YouTube oEmbed service
    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${targetVideoId}&format=json`
      );
      if (oembedRes.ok) {
        const oembedData = await oembedRes.json();
        return res.json({
          title: oembedData.title || fallback.title,
          channel: oembedData.author_name || fallback.channel,
          channelUrl: oembedData.author_url || fallback.channelUrl,
          thumbnail: oembedData.thumbnail_url || fallback.thumbnail,
          durationSeconds: 1200,
          durationFormatted: '20m 00s',
        });
      }
    } catch (e) {
      console.warn('YouTube oEmbed fetch failed, trying noembed:', e);
    }

    // Tier 3: NoEmbed fallback
    try {
      const noembedRes = await fetch(
        `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${targetVideoId}`
      );
      if (noembedRes.ok) {
        const noembedData = await noembedRes.json();
        return res.json({
          title: noembedData.title || fallback.title,
          channel: noembedData.author_name || fallback.channel,
          channelUrl: noembedData.author_url || fallback.channelUrl,
          thumbnail: noembedData.thumbnail_url || fallback.thumbnail,
          durationSeconds: 1200,
          durationFormatted: '20m 00s',
        });
      }
    } catch (e) {
      // Fall through to default
    }

    return res.json(fallback);
  } catch (error: any) {
    console.error('Error in /api/youtube/metadata:', error);
    res.status(500).json({ error: 'Failed to fetch YouTube metadata' });
  }
});

// Vite middleware for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IndustrySkill server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
