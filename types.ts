export interface SubArticle {
  title: string;
  content: string;
}

export interface Tool {
  name: string;
  description: string;
  category: string;
  color: string;
  tags?: string[];
  articles?: SubArticle[];
  isHidden?: boolean;
}

export interface GeneratedToolDetails {
  command: string;
  exploit: string;
}

export interface CategoryInfo {
  id?: number; // Added for Supabase
  name: string;
  color: string;
  sort_order?: number; // Added for ordering
}

export type ToolFormData = Omit<Tool, 'articles'>;

export interface GitHubSettings {
  owner: string;
  repo: string;
  pat: string;
  path: string;
}

export interface ToolSubmission {
  id: number;
  created_at: string;
  user_id: string;
  user_email: string;
  tool_name: string;
  description: string;
  category: string;
  tags?: string[];
  color: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_at?: string;
  reviewed_by?: string;
  review_notes?: string;
}

export interface ToolSubmissionFormData {
  tool_name: string;
  description: string;
  category: string;
  tags?: string[];
  color?: string;
}

export interface UserProfile {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
}