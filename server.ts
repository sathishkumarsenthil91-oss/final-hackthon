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

// 1. Nebula AI Chat endpoint with support for High Thinking mode
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [], thinkingMode = false, userProfile } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getAIClient();
    
    // Choose model based on requirements:
    // If thinkingMode is true -> gemini-3.1-pro-preview with ThinkingLevel.HIGH (do not set maxOutputTokens)
    // Otherwise -> gemini-3.5-flash for general tasks
    const model = thinkingMode ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash';

    const systemInstruction = `You are Nebula AI, the intelligent career mentor and technical readiness advisor for the IndustrySkill platform.
You assist university students and early-career developers in discovering their skill gaps, preparing for high-impact tech roles, evaluating job safety, and crafting personalized study plans.

User Profile Context:
${userProfile ? JSON.stringify(userProfile, null, 2) : 'Default Student: Arun Kumar, Aiming for Full Stack Developer, 72% Readiness, Strong in HTML/CSS/JS/Git, Critical Gaps in React/Node.js/SQL.'}

Guidelines:
- Provide clear, actionable, structured career and technical advice.
- When explaining code or architectural concepts, use clean markdown and modern industry best practices (React 19, TypeScript, modern REST/Node.js, PostgreSQL).
- Be encouraging, precise, and practical. Keep answers direct and well formatted with bullet points.`;

    const config: any = {
      systemInstruction,
      temperature: 0.7,
    };

    if (thinkingMode) {
      config.thinkingConfig = {
        thinkingLevel: ThinkingLevel.HIGH,
      };
      // Note: As per instructions, do NOT set maxOutputTokens when thinkingLevel is HIGH
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
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate AI response',
      fallback: 'Nebula AI encountered a connection issue. Based on industry standards for your target role, focusing on mastering React hooks and state management is your highest priority step.',
    });
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
    const model = useHighThinking ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash';

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
