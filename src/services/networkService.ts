import { NetworkUser, NetworkPost, NetworkConversation, FollowRequest, UserProfile } from '../types';
import { isDemoId } from './supabaseService';

const NETWORK_POSTS_KEY = 'skillnet_posts_v4';
const NETWORK_USERS_KEY = 'skillnet_users_v4';
const NETWORK_CONVERSATIONS_KEY = 'skillnet_conversations_v4';
const NETWORK_FOLLOW_REQUESTS_KEY = 'skillnet_follow_requests_v4';

// Real community defaults - empty until populated by real users & posts
export const initialNetworkUsers: NetworkUser[] = [];
export const initialNetworkPosts: NetworkPost[] = [];
export const initialConversations: NetworkConversation[] = [];
export const initialFollowRequests: FollowRequest[] = [];

// Helper functions for persistent LocalStorage management
export function loadNetworkPosts(currentUser: UserProfile): NetworkPost[] {
  try {
    const raw = localStorage.getItem(NETWORK_POSTS_KEY);
    if (raw) {
      const parsed: NetworkPost[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((p) => !isDemoId(p.id) && !isDemoId(p.author?.id));
      }
    }
  } catch (e) {
    console.error('Failed to load posts from storage', e);
  }
  return [];
}

export function saveNetworkPosts(posts: NetworkPost[]): void {
  try {
    const cleanPosts = posts.filter((p) => !isDemoId(p.id) && !isDemoId(p.author?.id));
    localStorage.setItem(NETWORK_POSTS_KEY, JSON.stringify(cleanPosts));
  } catch (e) {
    console.error('Failed to save posts', e);
  }
}

export function loadNetworkUsers(): NetworkUser[] {
  try {
    const raw = localStorage.getItem(NETWORK_USERS_KEY);
    if (raw) {
      const parsed: NetworkUser[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((u) => !isDemoId(u.id));
      }
    }
  } catch (e) {
    console.error('Failed to load users from storage', e);
  }
  return [];
}

export function saveNetworkUsers(users: NetworkUser[]): void {
  try {
    const cleanUsers = users.filter((u) => !isDemoId(u.id));
    localStorage.setItem(NETWORK_USERS_KEY, JSON.stringify(cleanUsers));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

export function loadConversations(): NetworkConversation[] {
  try {
    const raw = localStorage.getItem(NETWORK_CONVERSATIONS_KEY);
    if (raw) {
      const parsed: NetworkConversation[] = JSON.parse(raw);
      return parsed.filter(
        (c) =>
          !c.id.startsWith('conv-priya') &&
          !c.id.startsWith('conv-marcus') &&
          !isDemoId(c.participant?.id)
      );
    }
  } catch (e) {
    console.error('Failed to load conversations', e);
  }
  return [];
}

export function saveConversations(convs: NetworkConversation[]): void {
  try {
    const cleanConvs = convs.filter(
      (c) =>
        !c.id.startsWith('conv-priya') &&
        !c.id.startsWith('conv-marcus') &&
        !isDemoId(c.participant?.id)
    );
    localStorage.setItem(NETWORK_CONVERSATIONS_KEY, JSON.stringify(cleanConvs));
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
  return [];
}

export function saveFollowRequests(requests: FollowRequest[]): void {
  try {
    localStorage.setItem(NETWORK_FOLLOW_REQUESTS_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save follow requests', e);
  }
}
