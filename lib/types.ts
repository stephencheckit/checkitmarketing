export interface BlogArticle {
  title: string;
  url: string;
  author: string;
  date: string;
  readTime: string;
  description: string;
}

export interface SocialPost {
  platform: 'linkedin' | 'facebook' | 'twitter';
  content: string;
}

export interface ArticleWithPosts extends BlogArticle {
  posts: SocialPost[];
}

// ============================================
// BATTLECARD / COMPETITOR TYPES
// ============================================

export interface BattlecardCategory {
  id: string;
  name: string;
  order: number;
}

export interface CompanyData {
  name: string;
  website: string;
  tagline: string;
  entries: Record<string, string>; // categoryId -> value
}

export interface Competitor extends CompanyData {
  id: string;
}

export interface BattlecardData {
  ourCompany: CompanyData;
  competitors: Competitor[];
  categories: BattlecardCategory[];
}

export interface BattlecardVersion {
  id: number;
  version_number: number;
  change_notes: string | null;
  created_at: string;
  data?: BattlecardData;
}

export interface Battlecard {
  id: number;
  name: string;
  current_version: number;
  created_at: string;
  updated_at: string;
  data: BattlecardData;
  versionCreatedAt: string;
}
