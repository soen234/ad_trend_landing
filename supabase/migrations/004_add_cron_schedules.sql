-- Add 06:00 KST and 21:00 KST schedules
-- 21:00 UTC = 06:00 KST (next day)
-- 12:00 UTC = 21:00 KST

-- Remove if exists (safe to run multiple times)
SELECT cron.unschedule('fetch-news-06') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'fetch-news-06');
SELECT cron.unschedule('fetch-news-21') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'fetch-news-21');

-- Schedule new jobs
SELECT cron.schedule('fetch-news-06', '0 21 * * *', 'SELECT call_fetch_news()');
SELECT cron.schedule('fetch-news-21', '0 12 * * *', 'SELECT call_fetch_news()');
