-- Create ad_blog table for auto-generated blog posts
CREATE TABLE IF NOT EXISTS ad_blog (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title_ko TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ko TEXT NOT NULL,
  description_en TEXT NOT NULL,
  content TEXT NOT NULL,
  category_ko VARCHAR(100) NOT NULL,
  category_en VARCHAR(100) NOT NULL,
  emoji VARCHAR(10) DEFAULT '',
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_ad_blog_published_at ON ad_blog(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_ad_blog_slug ON ad_blog(slug);

-- Create function to call generate-blog Edge Function
CREATE OR REPLACE FUNCTION call_generate_blog()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  service_role_key text;
  supabase_url text;
BEGIN
  supabase_url := 'https://jwyjvinmgdozkgzydmax.supabase.co';
  service_role_key := current_setting('app.settings.service_role_key', true);

  IF service_role_key IS NULL OR service_role_key = '' THEN
    service_role_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eWp2aW5tZ2RvemtnenlkbWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NTAwNTUsImV4cCI6MjA4MjUyNjA1NX0.JKhtk6bfhnIkyrBD-BvOZfgo4NCzv3GN4802AikObfk';
  END IF;

  -- Call the Edge Function using pg_net
  PERFORM net.http_post(
    url := supabase_url || '/functions/v1/generate-blog',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := '{}'::jsonb
  );
END;
$$;

-- Schedule generate-blog: 21:10 KST = 12:10 UTC
SELECT cron.schedule('generate-blog-21', '10 12 * * *', 'SELECT call_generate_blog()');

-- RLS (Row Level Security) 설정
ALTER TABLE ad_blog ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능 (anon key로 조회 가능)
CREATE POLICY "Allow public read access" ON ad_blog
  FOR SELECT USING (true);

-- service_role만 쓰기 가능 (Edge Function에서 사용)
CREATE POLICY "Allow service role write access" ON ad_blog
  FOR ALL USING (auth.role() = 'service_role');
