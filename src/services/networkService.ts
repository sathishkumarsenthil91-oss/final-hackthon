import { NetworkUser, NetworkPost, NetworkConversation, FollowRequest, GeneratedCertificate, UserProfile } from '../types';
import { USER_ALT_PHOTO, USER_ARUN_PHOTO } from '../data/mockData';

const NETWORK_POSTS_KEY = 'skillnet_posts_v1';
const NETWORK_USERS_KEY = 'skillnet_users_v1';
const NETWORK_CONVERSATIONS_KEY = 'skillnet_conversations_v1';
const NETWORK_FOLLOW_REQUESTS_KEY = 'skillnet_follow_requests_v1';

export const initialNetworkUsers: NetworkUser[] = [
  {
    id: 'user-priya-sharma',
    name: 'Priya Sharma',
    headline: 'Senior Staff Engineer @ Google Cloud • Distributed Systems & Go • Ex-Microsoft',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&auto=format&fit=crop&q=80',
    company: 'Google',
    role: 'Senior Staff Engineer',
    location: 'Mountain View, CA (Hybrid)',
    bio: 'Architecting ultra-scale cloud primitives and Kubernetes schedulers. Passionate about mentoring early-career SWEs and open-source contributions.',
    followersCount: 14200,
    followingCount: 380,
    isFollowing: true,
    isPrivate: false,
    isAlumni: true,
    isMentor: true,
    mutualCount: 18,
    skills: ['Distributed Systems', 'Go (Golang)', 'Kubernetes', 'Cloud Architecture', 'gRPC'],
    onlineStatus: 'online',
    certificates: [
      {
        id: 'cert-ps-1',
        serialId: 'IS-CERT-2026-CRS-89214',
        type: 'course',
        itemId: 'crs-cloud-arch',
        title: 'Advanced Cloud Microservices & Scalability',
        recipientName: 'Priya Sharma',
        instructorOrSpeaker: 'Dr. Arthur Vance',
        organization: 'IndustrySkill Academic Consortium',
        issueDate: 'January 15, 2026',
        durationFormatted: '8h 00m',
        completionPercentage: 100,
        watchTimeSeconds: 28800,
        requiredWatchTimeSeconds: 28800,
        skillsValidated: ['Kubernetes', 'Cloud Native', 'Distributed Tracing'],
        legalDisclaimer: 'Unofficial verified educational record issued by IndustrySkill Academy.',
        verificationUrl: 'https://industryskill.edu/verify/IS-CERT-2026-CRS-89214',
      },
    ],
    projects: [
      {
        id: 'proj-k8s-mesh',
        title: 'Zero-Latency Service Mesh for Edge Compute',
        description: 'Lightweight Rust and eBPF-driven networking mesh delivering sub-millisecond inter-service proxies.',
        tags: ['Rust', 'eBPF', 'Kubernetes', 'gRPC'],
        githubUrl: 'https://github.com/priyasharma/edge-mesh',
        demoUrl: 'https://edge-mesh.dev',
        date: '2025',
        stars: 1240,
      },
    ],
    internships: [
      {
        id: 'exp-ps-1',
        role: 'Senior Staff Software Engineer',
        company: 'Google Cloud Platform',
        period: '2022 - Present',
        location: 'Sunnyvale, CA',
        description: 'Leading the Core Infrastructure scheduler teams supporting 4M+ daily container workloads.',
        verified: true,
      },
      {
        id: 'exp-ps-2',
        role: 'Principal Software Engineer',
        company: 'Microsoft Azure',
        period: '2018 - 2022',
        location: 'Redmond, WA',
        description: 'Designed Azure Service Fabric telemetry and distributed caching algorithms.',
        verified: true,
      },
    ],
    achievements: [
      {
        id: 'ach-ps-1',
        title: 'Google Engineering Excellence Award 2025',
        issuer: 'Google LLC',
        date: 'Nov 2025',
        badge: '🏆 Excellence in Systems Architecture',
      },
    ],
  },
  {
    id: 'user-marcus-chen',
    name: 'Marcus Chen',
    headline: 'Technical Recruiter & University Talent Partner @ Stripe • Hiring SWE Interns & New Grads 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    company: 'Stripe',
    role: 'Lead University Recruiter',
    location: 'San Francisco, CA',
    bio: 'Connecting exceptional student builders with high-impact engineering teams at Stripe. DM me if you love high-reliability APIs!',
    followersCount: 8900,
    followingCount: 1200,
    isFollowing: true,
    isPrivate: false,
    isRecruiter: true,
    mutualCount: 12,
    skills: ['Technical Recruiting', 'Campus Hiring', 'Resume Reviews', 'Career Strategy', 'Fintech'],
    onlineStatus: 'online',
    certificates: [],
    projects: [
      {
        id: 'proj-stripe-guide',
        title: 'The 2026 Engineering Interview Playbook',
        description: 'Comprehensive curriculum on crafting high-signal portfolios, API design challenges, and systems fundamentals.',
        tags: ['Career Strategy', 'System Design', 'Interview Prep'],
        demoUrl: 'https://stripe.com/careers/university',
        date: '2026',
      },
    ],
    internships: [
      {
        id: 'exp-mc-1',
        role: 'Lead University Technical Recruiter',
        company: 'Stripe',
        period: '2023 - Present',
        location: 'San Francisco, CA',
        description: 'Managing global internship hiring pipelines across North America and APAC.',
        verified: true,
      },
    ],
    achievements: [
      {
        id: 'ach-mc-1',
        title: 'Top 10 Tech Recruiter Spotlight',
        issuer: 'TechTalent Global',
        date: '2025',
        badge: '🌟 Talent Innovator',
      },
    ],
  },
  {
    id: 'user-elena-rostova',
    name: 'Elena Rostova',
    headline: 'Research Scientist @ DeepMind • LLM Reasoning & Multimodal Alignment • PhD Stanford',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1000&auto=format&fit=crop&q=80',
    company: 'Google DeepMind',
    role: 'Research Scientist',
    location: 'London, UK / San Francisco',
    bio: 'Working on Gemini next-gen agentic capabilities, test-time compute scaling, and verifiable mathematical reasoning.',
    followersCount: 22400,
    followingCount: 410,
    isFollowing: false,
    isPrivate: false,
    isMentor: true,
    mutualCount: 9,
    skills: ['PyTorch', 'Transformers', 'Reinforcement Learning (RLHF)', 'AI Safety', 'Python'],
    onlineStatus: 'idle',
    certificates: [
      {
        id: 'cert-er-1',
        serialId: 'IS-CERT-2026-WEB-99120',
        type: 'webinar',
        itemId: 'web-gemini-deepdive',
        title: 'Deep Dive: Scaling Gemini Multimodal Models & Function Calling',
        recipientName: 'Elena Rostova',
        instructorOrSpeaker: 'Dr. Arthur Vance',
        organization: 'IndustrySkill Global Tech Summit',
        issueDate: 'February 10, 2026',
        durationFormatted: '1h 30m',
        completionPercentage: 100,
        watchTimeSeconds: 5400,
        requiredWatchTimeSeconds: 5400,
        skillsValidated: ['Gemini 2.5', 'Agentic Workflows', 'Multimodal Prompting'],
        legalDisclaimer: 'Unofficial verified educational record issued by IndustrySkill Academy.',
        verificationUrl: 'https://industryskill.edu/verify/IS-CERT-2026-WEB-99120',
      },
    ],
    projects: [
      {
        id: 'proj-reasoning-bench',
        title: 'OpenReason: Evaluation Benchmark for Multi-Step AI Chains',
        description: 'Standardized evaluation harness measuring hallucinations and theorem-proving accuracy in neural models.',
        tags: ['Python', 'PyTorch', 'HuggingFace', 'Benchmark'],
        githubUrl: 'https://github.com/deepmind/open-reason',
        date: '2025',
        stars: 3400,
      },
    ],
    internships: [
      {
        id: 'exp-er-1',
        role: 'Research Scientist',
        company: 'Google DeepMind',
        period: '2024 - Present',
        location: 'London & SF',
        description: 'Developing next-generation reasoning architectures and RLHF alignment strategies.',
        verified: true,
      },
    ],
    achievements: [
      {
        id: 'ach-er-1',
        title: 'NeurIPS 2025 Outstanding Paper Award',
        issuer: 'NeurIPS Foundation',
        date: 'Dec 2025',
        badge: '📄 Best Paper Award',
      },
    ],
  },
  {
    id: 'user-rahul-patel',
    name: 'Rahul Patel',
    headline: 'Full Stack Engineer @ TechNova • Open Source Maintainer • React 19 & TypeScript',
    avatarUrl: USER_ALT_PHOTO,
    coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1000&auto=format&fit=crop&q=80',
    company: 'TechNova Labs',
    role: 'Full Stack Engineer',
    location: 'Bangalore, India / Remote',
    bio: 'Building hyper-fluid developer toolkits with React, Vite, and Cloudflare Workers. Always happy to collaborate on student open-source projects!',
    followersCount: 3400,
    followingCount: 520,
    isFollowing: false,
    isPrivate: true,
    mutualCount: 14,
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    onlineStatus: 'online',
    certificates: [],
    projects: [
      {
        id: 'proj-fast-ui',
        title: 'TailwindUI Generator & Theme Matrix',
        description: 'Automated design-token compiler that generates accessible Tailwind components with WCAG AAA compliance.',
        tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
        githubUrl: 'https://github.com/rahulpatel/tailwind-matrix',
        date: '2025',
        stars: 890,
      },
    ],
    internships: [
      {
        id: 'exp-rp-1',
        role: 'Full Stack Software Engineer',
        company: 'TechNova Labs',
        period: '2025 - Present',
        location: 'Remote',
        description: 'Building collaborative design systems and client-side high-performance apps.',
        verified: true,
      },
    ],
    achievements: [
      {
        id: 'ach-rp-1',
        title: 'GitHub Arctic Code Vault Contributor',
        issuer: 'GitHub',
        date: '2024',
        badge: '❄️ Open Source Fellow',
      },
    ],
  },
];

export const initialNetworkPosts: NetworkPost[] = [];

export const initialConversations: NetworkConversation[] = [
  {
    id: 'conv-priya',
    participant: initialNetworkUsers[0],
    lastMessage: 'Your implementation of the distributed scheduler looks clean! Let me know if you want feedback on system design.',
    lastMessageTime: '10:45 AM',
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        senderId: 'user-priya-sharma',
        receiverId: 'current-user',
        content: 'Hi! Saw your recent verified certificate in Advanced Cloud Microservices. Congratulations!',
        timestamp: '10:40 AM',
        isRead: true,
      },
      {
        id: 'm2',
        senderId: 'current-user',
        receiverId: 'user-priya-sharma',
        content: 'Thank you Priya! Your lectures on Kubernetes scheduling algorithms were incredibly helpful.',
        timestamp: '10:42 AM',
        isRead: true,
      },
      {
        id: 'm3',
        senderId: 'user-priya-sharma',
        receiverId: 'current-user',
        content: 'Your implementation of the distributed scheduler looks clean! Let me know if you want feedback on system design.',
        timestamp: '10:45 AM',
        isRead: false,
      },
    ],
  },
  {
    id: 'conv-marcus',
    participant: initialNetworkUsers[1],
    lastMessage: 'Hey! We are currently reviewing Summer 2026 engineering applications. Make sure your profile certificates are up to date.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: 'm4',
        senderId: 'user-marcus-chen',
        receiverId: 'current-user',
        content: 'Hey! We are currently reviewing Summer 2026 engineering applications. Make sure your profile certificates are up to date.',
        timestamp: 'Yesterday at 3:15 PM',
        isRead: true,
      },
    ],
  },
];

export const initialFollowRequests: FollowRequest[] = [
  {
    id: 'req-1',
    requester: {
      id: 'user-sarah-jenkins',
      name: 'Sarah Jenkins',
      headline: 'Backend Intern @ Datadog • CS Junior @ UC Berkeley',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      company: 'Datadog',
      role: 'Backend Intern',
      location: 'Berkeley, CA',
      bio: 'Lover of metrics, OpenTelemetry, and high-throughput logging pipelines.',
      followersCount: 890,
      followingCount: 310,
      isFollowing: false,
      isPrivate: false,
      mutualCount: 7,
      skills: ['Go', 'Distributed Tracing', 'OpenTelemetry', 'PostgreSQL'],
      onlineStatus: 'online',
      certificates: [],
      projects: [],
      internships: [],
      achievements: [],
    },
    timestamp: '3 hours ago',
    status: 'pending',
  },
];

// Helper functions for persistent LocalStorage management
export function loadNetworkPosts(currentUser: UserProfile): NetworkPost[] {
  try {
    const raw = localStorage.getItem(NETWORK_POSTS_KEY);
    if (raw) {
      const parsed: NetworkPost[] = JSON.parse(raw);
      // Filter out any legacy hardcoded demo posts
      return parsed.filter(
        (p) =>
          !p.id.startsWith('post-priya-') &&
          !p.id.startsWith('post-elena-') &&
          !p.id.startsWith('post-marcus-') &&
          !p.id.startsWith('post-rahul-') &&
          !p.id.startsWith('demo-')
      );
    }
  } catch (e) {
    console.error('Failed to load posts from storage', e);
  }
  return initialNetworkPosts;
}

export function saveNetworkPosts(posts: NetworkPost[]): void {
  try {
    localStorage.setItem(NETWORK_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save posts', e);
  }
}

export function loadNetworkUsers(): NetworkUser[] {
  try {
    const raw = localStorage.getItem(NETWORK_USERS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load users from storage', e);
  }
  return initialNetworkUsers;
}

export function saveNetworkUsers(users: NetworkUser[]): void {
  try {
    localStorage.setItem(NETWORK_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

export function loadConversations(): NetworkConversation[] {
  try {
    const raw = localStorage.getItem(NETWORK_CONVERSATIONS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load conversations', e);
  }
  return initialConversations;
}

export function saveConversations(convs: NetworkConversation[]): void {
  try {
    localStorage.setItem(NETWORK_CONVERSATIONS_KEY, JSON.stringify(convs));
  } catch (e) {
    console.error('Failed to save conversations', e);
  }
}

export function loadFollowRequests(): FollowRequest[] {
  try {
    const raw = localStorage.getItem(NETWORK_FOLLOW_REQUESTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load follow requests', e);
  }
  return initialFollowRequests;
}

export function saveFollowRequests(requests: FollowRequest[]): void {
  try {
    localStorage.setItem(NETWORK_FOLLOW_REQUESTS_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save follow requests', e);
  }
}
