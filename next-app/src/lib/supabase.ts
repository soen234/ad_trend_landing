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
  category: 'adtech' | 'martech' | 'general';
  source_url: string;
  published_at: string;
  created_at: string;
}

export interface NewsDigest {
  id: string;
  digest_date: string;
  summary?: string;
  summary_ko?: string;
  total_news_count: number;
  adtech_count: number;
  martech_count: number;
  general_count: number;
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

// Get news by date (YYYY-MM-DD)
export async function getNewsByDate(date: string): Promise<NewsItem[]> {
  const startOfDay = `${date}T00:00:00.000Z`;
  const endOfDay = `${date}T23:59:59.999Z`;

  const { data, error } = await supabase
    .from('ad_news')
    .select('*')
    .gte('published_at', startOfDay)
    .lte('published_at', endOfDay)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching news by date:', error);
    return [];
  }

  return data || [];
}

// Get available dates with news
export async function getAvailableDates(): Promise<string[]> {
  const { data, error } = await supabase
    .from('ad_news')
    .select('published_at')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching dates:', error);
    return [];
  }

  // Extract unique dates
  const dates = new Set<string>();
  data?.forEach((item) => {
    const date = item.published_at.split('T')[0];
    dates.add(date);
  });

  return Array.from(dates);
}

// Get digest for a specific date
export async function getDigestByDate(date: string): Promise<NewsDigest | null> {
  const { data, error } = await supabase
    .from('ad_news_digest')
    .select('*')
    .eq('digest_date', date)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') { // Not found is OK
      console.error('Error fetching digest:', error);
    }
    return null;
  }

  return data;
}

// Get latest digest
export async function getLatestDigest(): Promise<NewsDigest | null> {
  const { data, error } = await supabase
    .from('ad_news_digest')
    .select('*')
    .order('digest_date', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching latest digest:', error);
    }
    return null;
  }

  return data;
}
