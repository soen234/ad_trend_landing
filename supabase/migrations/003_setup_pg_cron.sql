-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Grant usage to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;

-- Create function to call fetch-news Edge Function
CREATE OR REPLACE FUNCTION call_fetch_news()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  service_role_key text;
  supabase_url text;
BEGIN
  -- Get secrets from vault or use hardcoded for now
  supabase_url := 'https://jwyjvinmgdozkgzydmax.supabase.co';
  service_role_key := current_setting('app.settings.service_role_key', true);

  -- If service_role_key is not set, use anon key
  IF service_role_key IS NULL OR service_role_key = '' THEN
    service_role_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eWp2aW5tZ2RvemtnenlkbWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NTAwNTUsImV4cCI6MjA4MjUyNjA1NX0.JKhtk6bfhnIkyrBD-BvOZfgo4NCzv3GN4802AikObfk';
  END IF;

  -- Call the Edge Function using pg_net
  PERFORM net.http_post(
    url := supabase_url || '/functions/v1/fetch-news',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := '{}'::jsonb
  );
END;
$$;

-- Schedule fetch-news to run 6 times a day (UTC times = KST -9)
-- 21:00 UTC = 06:00 KST (next day)
-- 00:00 UTC = 09:00 KST
-- 03:00 UTC = 12:00 KST
-- 06:00 UTC = 15:00 KST
-- 09:00 UTC = 18:00 KST
-- 12:00 UTC = 21:00 KST

-- Remove existing jobs if any
SELECT cron.unschedule('fetch-news-06') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'fetch-news-06');
SELECT cron.unschedule('fetch-news-09') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'fetch-news-09');
SELECT cron.unschedule('fetch-news-12') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'fetch-news-12');
SELECT cron.unschedule('fetch-news-15') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'fetch-news-15');
SELECT cron.unschedule('fetch-news-18') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'fetch-news-18');
SELECT cron.unschedule('fetch-news-21') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'fetch-news-21');

-- Schedule new jobs
SELECT cron.schedule('fetch-news-06', '0 21 * * *', 'SELECT call_fetch_news()');
SELECT cron.schedule('fetch-news-09', '0 0 * * *', 'SELECT call_fetch_news()');
SELECT cron.schedule('fetch-news-12', '0 3 * * *', 'SELECT call_fetch_news()');
SELECT cron.schedule('fetch-news-15', '0 6 * * *', 'SELECT call_fetch_news()');
SELECT cron.schedule('fetch-news-18', '0 9 * * *', 'SELECT call_fetch_news()');
SELECT cron.schedule('fetch-news-21', '0 12 * * *', 'SELECT call_fetch_news()');
