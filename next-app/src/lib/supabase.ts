import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jwyjvinmgdozkgzydmax.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eWp2aW5tZ2RvemtnenlkbWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NTAwNTUsImV4cCI6MjA4MjUyNjA1NX0.JKhtk6bfhnIkyrBD-BvOZfgo4NCzv3GN4802AikObfk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Convert UTC timestamp to KST date string (YYYY-MM-DD)
function toKSTDate(utcTimestamp: string): string {
  const date = new Date(utcTimestamp);
  // Add 9 hours for KST
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kstDate.toISOString().split('T')[0];
}

// Get KST date range for a given KST date (returns UTC timestamps)
function getKSTDateRange(kstDate: string): { start: string; end: string } {
  // KST midnight = UTC previous day 15:00
  // e.g., 2026-01-03 00:00 KST = 2026-01-02 15:00 UTC
  const startUTC = new Date(`${kstDate}T00:00:00+09:00`).toISOString();
  const endUTC = new Date(`${kstDate}T23:59:59.999+09:00`).toISOString();
  return { start: startUTC, end: endUTC };
}

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

// Get news by KST date (YYYY-MM-DD)
export async function getNewsByDate(date: string): Promise<NewsItem[]> {
  const { start, end } = getKSTDateRange(date);

  const { data, error } = await supabase
    .from('ad_news')
    .select('*')
    .gte('published_at', start)
    .lte('published_at', end)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching news by date:', error);
    return [];
  }

  return data || [];
}

// Get available dates with news (in KST)
export async function getAvailableDates(): Promise<string[]> {
  const { data, error } = await supabase
    .from('ad_news')
    .select('published_at')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching dates:', error);
    return [];
  }

  // Extract unique dates in KST
  const dates = new Set<string>();
  data?.forEach((item) => {
    const kstDate = toKSTDate(item.published_at);
    dates.add(kstDate);
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
