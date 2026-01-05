-- Add generate-digest cron schedule
--
-- fetch-news schedule (KST -> UTC):
-- 06:00 KST = 21:00 UTC (previous day)
-- 09:00 KST = 00:00 UTC
-- 12:00 KST = 03:00 UTC
-- 15:00 KST = 06:00 UTC
-- 18:00 KST = 09:00 UTC
-- 21:00 KST = 12:00 UTC
--
-- generate-digest schedule (KST -> UTC):
-- 09:05 KST = 00:05 UTC
-- 21:05 KST = 12:05 UTC

-- Create function to call generate-digest Edge Function
CREATE OR REPLACE FUNCTION call_generate_digest()
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
    url := supabase_url || '/functions/v1/generate-digest',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := '{}'::jsonb
  );
END;
$$;

-- Remove all existing cron jobs
SELECT cron.unschedule(jobname) FROM cron.job WHERE jobname LIKE 'fetch-news-%';
SELECT cron.unschedule(jobname) FROM cron.job WHERE jobname LIKE 'generate-digest-%';

-- Schedule fetch-news: 06:00, 09:00, 12:00, 15:00, 18:00, 21:00 KST
SELECT cron.schedule('fetch-news-06', '0 21 * * *', 'SELECT call_fetch_news()');
SELECT cron.schedule('fetch-news-09', '0 0 * * *', 'SELECT call_fetch_news()');
SELECT cron.schedule('fetch-news-12', '0 3 * * *', 'SELECT call_fetch_news()');
SELECT cron.schedule('fetch-news-15', '0 6 * * *', 'SELECT call_fetch_news()');
SELECT cron.schedule('fetch-news-18', '0 9 * * *', 'SELECT call_fetch_news()');
SELECT cron.schedule('fetch-news-21', '0 12 * * *', 'SELECT call_fetch_news()');

-- Schedule generate-digest: 09:05 KST, 21:05 KST
SELECT cron.schedule('generate-digest-09', '5 0 * * *', 'SELECT call_generate_digest()');
SELECT cron.schedule('generate-digest-21', '5 12 * * *', 'SELECT call_generate_digest()');
