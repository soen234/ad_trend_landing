import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jwyjvinmgdozkgzydmax.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eWp2aW5tZ2RvemtnenlkbWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NTAwNTUsImV4cCI6MjA4MjUyNjA1NX0.JKhtk6bfhnIkyrBD-BvOZfgo4NCzv3GN4802AikObfk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface NewsItem {
  id: string;
  title: string;
  title_ko?: string;
  summary: string;
  summary_ko?: string;
  category: 'programmatic' | 'mobile' | 'privacy' | 'platform' | 'trend';
  source_url: string;
  published_at: string;
  created_at: string;
}

export async function getLatestNews(limit: number = 3): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from('ad_news')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }

  return data || [];
}

export async function getAllNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from('ad_news')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }

  return data || [];
}
