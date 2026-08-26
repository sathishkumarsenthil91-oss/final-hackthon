export type ViewType = 
  | 'auth'
  | 'landing'
  | 'dashboard'
  | 'profile'
  | 'skills'
  | 'skill-gap'
  | 'ai-recommendations'
  | 'courses'
  | 'industry-tools'
  | 'certifications'
  | 'opportunities'
  | 'webinars'
  | 'nebula'
  | 'assignments'
  | 'safety'
  | 'settings'
  | 'onboarding'
  | 'login'
  | 'register';

export interface UserProfile {
  name: string;
  avatarUrl: string;
  email: string;
  phone?: string;
  bio?: string;
  college: string;
  degree: string;
  gradYear: string;
  gpa?: string;
  location?: string;
  targetRole: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeFileName?: string;
  overallReadiness: number; // e.g. 72
  matchedSkillsCount: number; // e.g. 18
  totalTargetSkills: number; // e.g. 25
  learningProgress: number; // e.g. 64
  activeCoursesCount: number; // e.g. 4
  opportunitiesCount: number; // e.g. 18
  newMatchedCount: number; // e.g. 6
  completedAssignmentsCount?: number;
  certificationsCount?: number;
}

export interface SkillItem {
  id: string;
  name: string;
  proficiency: number; // 0 - 100
  category: 'foundation' | 'gap' | 'upcoming';
  priority?: 'high' | 'medium' | 'low';
  experience?: string;
  lastAssessed?: string;
  verified?: boolean;
}

export interface SkillGapMetric {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  gapPercentage: number;
  urgency: 'Critical' | 'Moderate' | 'Good';
  suggestedAction: string;
  estimatedHours: number;
}

export interface AIRecommendation {
  id: string;
  category: 'Skill Sprint' | 'Project' | 'Certification' | 'Internship Strategy';
  title: string;
  description: string;
  impactScore: number; // e.g. 96
  estimatedTime: string;
  tags: string[];
  actionLabel: string;
  actionView: ViewType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CourseItem {
  id: string;
  title: string;
  provider: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modulesCount: number;
  rating: number;
  enrolledCount: number;
  progress: number; // 0 - 100
  isEnrolled: boolean;
  coverImage?: string;
  skillsTaught: string[];
  description: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
}

export interface IndustryTool {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'DevOps & Cloud' | 'Testing & QA' | 'Design & Collab';
  proficiencyRequired: 'Essential' | 'Recommended' | 'Bonus';
  icon: string;
  description: string;
  status: 'Mastered' | 'In Progress' | 'Not Started';
  popularFor: string[];
  cheatSheetUrl?: string;
  quickTip: string;
  marketDemand: number; // e.g. 92%
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  badgeUrl?: string;
  difficulty: 'Foundational' | 'Associate' | 'Professional';
  marketValue: 'Very High' | 'High' | 'Medium';
  status: 'Earned' | 'In Progress' | 'Planned';
  examCode?: string;
  targetDate?: string;
  skillsValidated: string[];
  voucherDiscount?: string;
  prepProgress?: number;
}

export interface WebinarItem {
  id: string;
  title: string;
  speaker: {
    name: string;
    title: string;
    company: string;
    avatar: string;
  };
  dateTime: string;
  duration: string;
  tags: string[];
  status: 'Upcoming' | 'Live' | 'Recorded';
  registered: boolean;
  attendeesCount: number;
  keyTakeaways: string[];
}

export interface AssignmentItem {
  id: string;
  title: string;
  courseOrTopic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Graded' | 'Overdue';
  score?: number;
  maxScore: number;
  skillsTested: string[];
  description: string;
  deliverables: string[];
  feedback?: string;
}

export interface RoadmapNode {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'upcoming';
  progress: number;
  description: string;
  subtopics?: string[];
  recommendedResources?: {
    title: string;
    type: string;
    link?: string;
  }[];
}

export interface OpportunityItem {
  id: string;
  title: string;
  company: string;
  locationType: 'Remote' | 'Hybrid' | 'Onsite';
  matchScore: number;
  duration: string;
  verified: boolean;
  tags: string[];
  companyLogoUrl?: string;
  description: string;
  stipend?: string;
  applied?: boolean;
  saved?: boolean;
  deadline?: string;
}

export interface SafetySignal {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  icon: string;
}

export interface SafetyReport {
  riskScore: number; // 0 - 100
  riskLevel: 'HIGH RISK' | 'MODERATE RISK' | 'LOW RISK' | 'VERIFIED SAFE';
  summary: string;
  detectedSignals: SafetySignal[];
  recommendation: string;
  verificationChecklist: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  thinkingModeActive?: boolean;
}

export interface AppSettings {
  emailNotifications: boolean;
  jobAlerts: boolean;
  weeklyProgressDigest: boolean;
  geminiThinkingMode: boolean;
  fraudAlerts: boolean;
  autoSyncGithub: boolean;
  preferredLanguage: string;
  profileVisibility: 'Public' | 'Recruiters Only' | 'Private';
}
