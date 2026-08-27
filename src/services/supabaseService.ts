import { SupabaseClient } from '@supabase/supabase-js';
import { supabase as existingSupabaseClient } from '../supabaseClient';
import { NetworkUser, NetworkPost, NetworkConversation, NetworkMessage, UserLibraryItem, LibraryAccessRequest, UserProfile, GeneratedCertificate } from '../types';
import { initialNetworkUsers, initialNetworkPosts, initialConversations } from './networkService';

// Supabase Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export function getSupabaseClient(): SupabaseClient | null {
  // Reuse existing singleton Supabase client
  if (existingSupabaseClient) {
    return existingSupabaseClient as unknown as SupabaseClient;
  }
  return null;
}

export const isSupabaseConfigured = (): boolean => {
  return Boolean((supabaseUrl && supabaseAnonKey) || existingSupabaseClient);
};

// Local storage persistent keys for synchronized real-user networking
const getStorageKey = (baseKey: string, user?: UserProfile): string => {
  const userIdentifier = user?.email
    ? user.email.toLowerCase().replace(/[^a-z0-9]/g, '_')
    : 'default_account';
  return `${baseKey}_${userIdentifier}`;
};

const BASE_STORAGE_KEYS = {
  USERS: 'industryskill_connectivity_users_v3',
  POSTS: 'industryskill_connectivity_posts_v3',
  MESSAGES: 'industryskill_connectivity_messages_v3',
  LIBRARY_REQUESTS: 'industryskill_library_requests_v3',
  USER_LIBRARIES: 'industryskill_user_libraries_v3',
  SETUP_DONE: 'industryskill_connectivity_setup_done_v3',
};

// Generate realistic real user learning libraries
export function getInitialUserLibraries(): Record<string, UserLibraryItem[]> {
  return {
    'user-priya-sharma': [
      {
        id: 'lib-ps-1',
        type: 'course',
        title: 'Advanced Cloud Microservices & Scalability',
        providerOrChannel: 'IndustrySkill Academic',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80',
        progressPercentage: 100,
        currentLessonOrChapter: 'Completed (All 8 Modules)',
        totalDurationOrModules: '8h 00m • 8 Modules',
        skillsCovered: ['Kubernetes', 'Cloud Native', 'Distributed Tracing', 'gRPC'],
        lastStudiedAt: 'Yesterday',
        isCompleted: true,
        notesCount: 14,
        certificateSerial: 'IS-CERT-2026-CRS-89214',
      },
      {
        id: 'lib-ps-2',
        type: 'youtube_track',
        title: 'Golang Concurrency Patterns & Channels Deep Dive',
        providerOrChannel: 'GopherAcademy',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
        progressPercentage: 78,
        currentLessonOrChapter: 'Module 4: Mutex Contention vs Worker Pools',
        totalDurationOrModules: '3h 45m',
        skillsCovered: ['Go', 'Concurrency', 'Goroutines', 'Channel Buffers'],
        lastStudiedAt: '2 days ago',
        isCompleted: false,
        notesCount: 9,
      },
    ],
    'user-marcus-chen': [
      {
        id: 'lib-mc-1',
        type: 'course',
        title: 'API Resilience, Idempotency & Payment Gateways',
        providerOrChannel: 'Stripe Engineering Academy',
        thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=80',
        progressPercentage: 92,
        currentLessonOrChapter: 'Chapter 6: Webhook Retry Idempotency & Replay Attacks',
        totalDurationOrModules: '5h 30m',
        skillsCovered: ['API Design', 'Fintech', 'Idempotency', 'Security'],
        lastStudiedAt: '3 hours ago',
        isCompleted: false,
        notesCount: 12,
      },
    ],
    'user-elena-rostova': [
      {
        id: 'lib-er-1',
        type: 'youtube_track',
        title: 'Deep Dive: Scaling Gemini Multimodal Models & Function Calling',
        providerOrChannel: 'Google DeepMind Tech Talks',
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
        progressPercentage: 100,
        currentLessonOrChapter: 'Completed (All 6 Chapters)',
        totalDurationOrModules: '1h 30m',
        skillsCovered: ['Gemini 2.5', 'Agentic Workflows', 'Multimodal Prompting'],
        lastStudiedAt: '4 days ago',
        isCompleted: true,
        notesCount: 22,
        certificateSerial: 'IS-CERT-2026-WEB-99120',
      },
      {
        id: 'lib-er-2',
        type: 'course',
        title: 'Test-Time Compute & Reinforcement Learning from Human Feedback',
        providerOrChannel: 'Stanford Online AI Series',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=400&auto=format&fit=crop&q=80',
        progressPercentage: 65,
        currentLessonOrChapter: 'Section 3: Tree Search & Value Model Distillation',
        totalDurationOrModules: '12h 00m',
        skillsCovered: ['PyTorch', 'RLHF', 'Transformers', 'Evaluation'],
        lastStudiedAt: 'Yesterday',
        isCompleted: false,
        notesCount: 18,
      },
    ],
    'user-rahul-patel': [
      {
        id: 'lib-rp-1',
        type: 'youtube_track',
        title: 'React 19 Server Components, Actions & Optimistic UI',
        providerOrChannel: 'Frontend Masters & Jack Herrington',
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&auto=format&fit=crop&q=80',
        progressPercentage: 84,
        currentLessonOrChapter: 'Lesson 7: useActionState and useOptimistic in Production',
        totalDurationOrModules: '4h 15m',
        skillsCovered: ['React 19', 'TypeScript', 'Server Actions', 'Optimistic UI'],
        lastStudiedAt: '1 hour ago',
        isCompleted: false,
        notesCount: 15,
      },
      {
        id: 'lib-rp-2',
        type: 'course',
        title: 'PostgreSQL Advanced Indexing & Query Tuning',
        providerOrChannel: 'IndustrySkill Data Engineering',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&auto=format&fit=crop&q=80',
        progressPercentage: 45,
        currentLessonOrChapter: 'Module 3: Partial & GIN Indexes for JSONB',
        totalDurationOrModules: '6h 00m',
        skillsCovered: ['PostgreSQL', 'SQL Optimization', 'GIN Indexes', 'Drizzle ORM'],
        lastStudiedAt: '3 days ago',
        isCompleted: false,
        notesCount: 7,
      },
    ],
  };
}

// Convert current user profile into a real NetworkUser
export function mapProfileToNetworkUser(user: UserProfile, libraryItems?: UserLibraryItem[]): NetworkUser {
  const generatedHandle = user.userId || user.username || (user.email ? `@${user.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_')}` : '@developer');
  const cleanUsername = generatedHandle.startsWith('@') ? generatedHandle.substring(1) : generatedHandle;

  return {
    id: user.email ? `usr-${user.email.replace(/[^a-zA-Z0-9]/g, '_')}` : 'current-user-real',
    userId: generatedHandle.startsWith('@') ? generatedHandle : `@${generatedHandle}`,
    username: cleanUsername,
    name: user.name || (user.email ? user.email.split('@')[0] : 'Student Developer'),
    headline: user.headline || `${user.targetRole || 'Full Stack Engineer'} • ${user.college || 'Tech Institute'} '${user.gradYear || '2026'}`,
    avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    company: user.college || 'IndustrySkill Academy',
    role: user.targetRole || 'Full Stack Engineer',
    location: user.location || 'San Francisco, CA / Remote',
    bio: user.bio || `Passionate student developer targeting ${user.targetRole || 'Full Stack Engineering'}. Actively building verified projects, solving distributed systems challenges, and collaborating with peers.`,
    followersCount: user.followersCount ?? 4,
    followingCount: user.followingCount ?? 2,
    isFollowing: false,
    isFollower: false,
    isFriend: false,
    isPrivate: Boolean(user.isPrivateAccount),
    isLibraryPrivate: Boolean(user.isPrivateAccount),
    skills: user.skills && user.skills.length > 0 ? user.skills : ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Git', 'System Design'],
    interests: user.interests && user.interests.length > 0 ? user.interests : ['AI & Machine Learning', 'Cloud Architecture', 'Distributed Systems', 'Full-Stack Web'],
    certificates: user.earnedCertificates || [],
    libraryItems: libraryItems || [],
    projects: user.projects || [],
    internships: user.internships || [],
    achievements: user.achievements || [],
    onlineStatus: 'online',
    currentlyStudyingStory: {
      topic: 'Full-Stack Distributed Systems',
      courseTitle: 'React 19 & Cloudflare Architecture',
      progress: user.learningProgress || 72,
      updatedAt: 'Just now',
    },
  };
}

// Service methods
export const connectivityService = {
  // Check if profile setup is completed for the current authenticated user
  isSetupCompleted(user: UserProfile): boolean {
    if (user.connectivitySetupCompleted) return true;
    try {
      const key = getStorageKey(BASE_STORAGE_KEYS.SETUP_DONE, user);
      return localStorage.getItem(key) === 'true';
    } catch {
      return false;
    }
  },

  // Mark profile setup completed with new data
  completeSetup(
    user: UserProfile,
    data: {
      userId: string;
      name: string;
      avatarUrl: string;
      skills: string[];
      interests: string[];
      headline?: string;
      bio?: string;
    }
  ): void {
    try {
      const key = getStorageKey(BASE_STORAGE_KEYS.SETUP_DONE, user);
      localStorage.setItem(key, 'true');

      // Update user in users list if exists or ensure currentUserMapped has this data
      const users = this.getUsers(user);
      const currentMapped = mapProfileToNetworkUser({
        ...user,
        userId: data.userId,
        name: data.name,
        avatarUrl: data.avatarUrl,
        skills: data.skills,
        interests: data.interests,
        headline: data.headline,
        bio: data.bio,
      });

      const updatedUsers = users.map((u) => {
        if (u.id === currentMapped.id || u.id === 'current-user-real') {
          return {
            ...u,
            userId: data.userId,
            name: data.name,
            avatarUrl: data.avatarUrl,
            skills: data.skills,
            interests: data.interests,
            headline: data.headline || u.headline,
            bio: data.bio || u.bio,
          };
        }
        return u;
      });

      this.saveUsers(updatedUsers, user);
    } catch (e) {
      console.error('Error completing connectivity setup:', e);
    }
  },

  // Load Users with Privacy, Library, and Follow state (isolated per user)
  getUsers(currentUser: UserProfile): NetworkUser[] {
    try {
      const storageKey = getStorageKey(BASE_STORAGE_KEYS.USERS, currentUser);
      const stored = localStorage.getItem(storageKey);
      let users: NetworkUser[] = stored ? JSON.parse(stored) : initialNetworkUsers;

      const libraries = this.getUserLibraries(currentUser);
      const currentReqs = this.getAccessRequests(currentUser);

      // Ensure libraryItems & follower/friend states are calculated
      users = users.map((u) => {
        const userLib = libraries[u.id] || [];
        const isApproved = currentReqs.some(
          (r) => r.targetUserId === u.id && r.status === 'approved'
        );
        const isRequested = currentReqs.some(
          (r) => r.targetUserId === u.id && r.status === 'pending'
        );

        // A user is a Friend if they are mutually followed
        const isFriend = Boolean(u.isFollowing && u.isFollower);

        return {
          ...u,
          libraryItems: userLib,
          isFriend,
          isLibraryPrivate: u.isPrivate !== undefined ? u.isPrivate : false,
          hasAccessToLibrary: !u.isPrivate || isApproved,
          isAccessRequested: isRequested,
        };
      });

      return users;
    } catch (e) {
      console.error('Error fetching connectivity users:', e);
      return initialNetworkUsers;
    }
  },

  // Save Users (isolated per user)
  saveUsers(users: NetworkUser[], currentUser?: UserProfile): void {
    try {
      const storageKey = getStorageKey(BASE_STORAGE_KEYS.USERS, currentUser);
      localStorage.setItem(storageKey, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users:', e);
    }
  },

  // Get all libraries
  getUserLibraries(currentUser?: UserProfile): Record<string, UserLibraryItem[]> {
    try {
      const storageKey = getStorageKey(BASE_STORAGE_KEYS.USER_LIBRARIES, currentUser);
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error fetching user libraries:', e);
    }
    const initial = getInitialUserLibraries();
    try {
      const storageKey = getStorageKey(BASE_STORAGE_KEYS.USER_LIBRARIES, currentUser);
      localStorage.setItem(storageKey, JSON.stringify(initial));
    } catch {}
    return initial;
  },

  // Save library for specific user
  saveUserLibrary(userId: string, items: UserLibraryItem[], currentUser?: UserProfile): void {
    try {
      const all = this.getUserLibraries(currentUser);
      all[userId] = items;
      const storageKey = getStorageKey(BASE_STORAGE_KEYS.USER_LIBRARIES, currentUser);
      localStorage.setItem(storageKey, JSON.stringify(all));
    } catch (e) {
      console.error('Error saving user library:', e);
    }
  },

  // Load Posts (isolated per user)
  getPosts(currentUser: UserProfile): NetworkPost[] {
    try {
      const storageKey = getStorageKey(BASE_STORAGE_KEYS.POSTS, currentUser);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error fetching posts:', e);
    }
    return initialNetworkPosts;
  },

  // Save Posts (isolated per user)
  savePosts(posts: NetworkPost[], currentUser?: UserProfile): void {
    try {
      const storageKey = getStorageKey(BASE_STORAGE_KEYS.POSTS, currentUser);
      localStorage.setItem(storageKey, JSON.stringify(posts));
    } catch (e) {
      console.error('Error saving posts:', e);
    }
  },

  // Create a new Post
  createPost(
    currentUser: UserProfile,
    payload: {
      content: string;
      imageUrl?: string;
      codeSnippet?: { language: string; code: string };
      attachedCertificate?: GeneratedCertificate;
      tags?: string[];
    }
  ): NetworkPost {
    const currentMapped = mapProfileToNetworkUser(currentUser);
    const newPost: NetworkPost = {
      id: `post-${Date.now()}`,
      author: {
        id: currentMapped.id,
        name: currentMapped.name,
        avatarUrl: currentMapped.avatarUrl,
        headline: currentMapped.headline,
        company: currentMapped.company,
        isCurrentUser: true,
      },
      timestamp: 'Just now',
      content: payload.content,
      tags: payload.tags || ['#LearningInPublic', '#TechSkills', '#BuildInPublic'],
      skills: payload.attachedCertificate ? payload.attachedCertificate.skillsValidated : ['Software Engineering'],
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      repostsCount: 0,
      isReposted: false,
      imageUrl: payload.imageUrl,
      codeSnippet: payload.codeSnippet,
      attachedCertificate: payload.attachedCertificate,
      comments: [],
    };

    const existingPosts = this.getPosts(currentUser);
    const updated = [newPost, ...existingPosts];
    this.savePosts(updated, currentUser);
    return newPost;
  },

  // Toggle Like on Post
  toggleLike(postId: string, currentUser: UserProfile): NetworkPost[] {
    const posts = this.getPosts(currentUser);
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
      }
      return p;
    });
    this.savePosts(updated, currentUser);
    return updated;
  },

  // Add comment
  addComment(postId: string, content: string, currentUser: UserProfile): NetworkPost[] {
    const currentMapped = mapProfileToNetworkUser(currentUser);
    const posts = this.getPosts(currentUser);
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const newComment = {
          id: `c-${Date.now()}`,
          authorId: currentMapped.id,
          authorName: currentMapped.name,
          authorAvatar: currentMapped.avatarUrl,
          authorHeadline: currentMapped.headline,
          timestamp: 'Just now',
          content,
          likesCount: 0,
          isLiked: false,
        };
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, newComment],
        };
      }
      return p;
    });
    this.savePosts(updated, currentUser);
    return updated;
  },

  // Conversations & Direct Messaging (isolated per user)
  getConversations(currentUser: UserProfile): NetworkConversation[] {
    try {
      const storageKey = getStorageKey(BASE_STORAGE_KEYS.MESSAGES, currentUser);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error fetching conversations:', e);
    }
    return initialConversations;
  },

  saveConversations(convs: NetworkConversation[], currentUser?: UserProfile): void {
    try {
      const storageKey = getStorageKey(BASE_STORAGE_KEYS.MESSAGES, currentUser);
      localStorage.setItem(storageKey, JSON.stringify(convs));
    } catch (e) {
      console.error('Error saving conversations:', e);
    }
  },

  sendMessage(
    participantId: string,
    content: string,
    currentUser: UserProfile
  ): NetworkConversation[] {
    const currentMapped = mapProfileToNetworkUser(currentUser);
    const convs = this.getConversations(currentUser);
    const users = this.getUsers(currentUser);
    const targetUser = users.find((u) => u.id === participantId) || initialNetworkUsers[0];

    let found = false;
    const updated = convs.map((conv) => {
      if (conv.participant.id === participantId) {
        found = true;
        const newMsg: NetworkMessage = {
          id: `msg-${Date.now()}`,
          senderId: currentMapped.id,
          receiverId: participantId,
          content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true,
        };
        return {
          ...conv,
          lastMessage: content,
          lastMessageTime: 'Just now',
          messages: [...conv.messages, newMsg],
        };
      }
      return conv;
    });

    if (!found) {
      const newMsg: NetworkMessage = {
        id: `msg-${Date.now()}`,
        senderId: currentMapped.id,
        receiverId: participantId,
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
      };
      updated.unshift({
        id: `conv-${participantId}`,
        participant: targetUser,
        lastMessage: content,
        lastMessageTime: 'Just now',
        unreadCount: 0,
        messages: [newMsg],
      });
    }

    this.saveConversations(updated, currentUser);
    return updated;
  },

  // Follow Requests and Library Privacy Access Requests
  getAccessRequests(currentUser?: UserProfile): LibraryAccessRequest[] {
    try {
      const storageKey = getStorageKey(BASE_STORAGE_KEYS.LIBRARY_REQUESTS, currentUser);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading access requests:', e);
    }
    return [
      {
        id: 'req-init-1',
        requesterId: 'user-marcus-chen',
        requesterName: 'Marcus Chen',
        requesterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        requesterHeadline: 'Lead University Recruiter @ Stripe',
        targetUserId: 'current-user-real',
        requestedAt: '20 mins ago',
        status: 'pending',
      },
    ];
  },

  saveAccessRequests(requests: LibraryAccessRequest[], currentUser?: UserProfile): void {
    try {
      const storageKey = getStorageKey(BASE_STORAGE_KEYS.LIBRARY_REQUESTS, currentUser);
      localStorage.setItem(storageKey, JSON.stringify(requests));
    } catch (e) {
      console.error('Error saving access requests:', e);
    }
  },

  // Request Access to a private user's library
  requestLibraryAccess(
    targetUserId: string,
    currentUser: UserProfile
  ): { success: boolean; request: LibraryAccessRequest } {
    const currentMapped = mapProfileToNetworkUser(currentUser);
    const existing = this.getAccessRequests(currentUser);

    // Check if already requested
    const alreadyReq = existing.find(
      (r) => r.requesterId === currentMapped.id && r.targetUserId === targetUserId
    );
    if (alreadyReq) {
      return { success: true, request: alreadyReq };
    }

    const newReq: LibraryAccessRequest = {
      id: `req-${Date.now()}`,
      requesterId: currentMapped.id,
      requesterName: currentMapped.name,
      requesterAvatar: currentMapped.avatarUrl,
      requesterHeadline: currentMapped.headline,
      targetUserId,
      requestedAt: 'Just now',
      status: 'pending',
    };

    const updated = [newReq, ...existing];
    this.saveAccessRequests(updated, currentUser);
    return { success: true, request: newReq };
  },

  // Approve or Decline Access Request
  respondToAccessRequest(
    requestId: string,
    decision: 'approved' | 'declined',
    currentUser?: UserProfile
  ): LibraryAccessRequest[] {
    const existing = this.getAccessRequests(currentUser);
    const updated = existing.map((r) => {
      if (r.id === requestId) {
        return { ...r, status: decision };
      }
      return r;
    });
    this.saveAccessRequests(updated, currentUser);
    return updated;
  },

  // Toggle user follow / connect
  toggleFollow(targetUserId: string, currentUser: UserProfile): NetworkUser[] {
    const users = this.getUsers(currentUser);
    const updated = users.map((u) => {
      if (u.id === targetUserId) {
        const nextState = !u.isFollowing;
        const isFriend = Boolean(nextState && u.isFollower);
        return {
          ...u,
          isFollowing: nextState,
          isFriend,
          followersCount: nextState ? u.followersCount + 1 : Math.max(0, u.followersCount - 1),
        };
      }
      return u;
    });
    this.saveUsers(updated, currentUser);
    return updated;
  },

  // Toggle profile privacy
  toggleProfilePrivacy(isPrivate: boolean, currentUser: UserProfile): void {
    const users = this.getUsers(currentUser);
    const currentMapped = mapProfileToNetworkUser(currentUser);
    const updated = users.map((u) => {
      if (u.id === currentMapped.id || u.id === 'current-user-real') {
        return { ...u, isPrivate, isLibraryPrivate: isPrivate };
      }
      return u;
    });
    this.saveUsers(updated, currentUser);
  },
};
