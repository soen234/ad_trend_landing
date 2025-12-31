-- 카테고리 제약 조건 업데이트
ALTER TABLE ad_news DROP CONSTRAINT IF EXISTS ad_news_category_check;
ALTER TABLE ad_news ADD CONSTRAINT ad_news_category_check
  CHECK (category IN ('adtech', 'martech', 'general', 'programmatic', 'mobile', 'privacy', 'platform', 'trend'));

-- Raw 뉴스 테이블 생성 (Gemini 처리 전 원본 뉴스 링크)
CREATE TABLE IF NOT EXISTS ad_news_raw (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT,
  source_url TEXT UNIQUE,
  category TEXT CHECK (category IN ('adtech', 'martech', 'general')),
  published_at TIMESTAMP WITH TIME ZONE,
  collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_processed BOOLEAN DEFAULT FALSE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_ad_news_raw_collected ON ad_news_raw(collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_ad_news_raw_category ON ad_news_raw(category);
CREATE INDEX IF NOT EXISTS idx_ad_news_raw_published ON ad_news_raw(published_at DESC);

-- RLS 설정
ALTER TABLE ad_news_raw ENABLE ROW LEVEL SECURITY;

-- 정책 생성 (이미 있으면 건너뜀)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ad_news_raw' AND policyname = 'Allow public read access') THEN
    CREATE POLICY "Allow public read access" ON ad_news_raw FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ad_news_raw' AND policyname = 'Allow service role write access') THEN
    CREATE POLICY "Allow service role write access" ON ad_news_raw FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- Daily Digest 테이블 (날짜별 요약)
CREATE TABLE IF NOT EXISTS ad_news_digest (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  digest_date DATE UNIQUE NOT NULL,
  summary TEXT,
  summary_ko TEXT,
  total_news_count INTEGER DEFAULT 0,
  adtech_count INTEGER DEFAULT 0,
  martech_count INTEGER DEFAULT 0,
  general_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 설정
ALTER TABLE ad_news_digest ENABLE ROW LEVEL SECURITY;

-- 정책 생성 (이미 있으면 건너뜀)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ad_news_digest' AND policyname = 'Allow public read access') THEN
    CREATE POLICY "Allow public read access" ON ad_news_digest FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ad_news_digest' AND policyname = 'Allow service role write access') THEN
    CREATE POLICY "Allow service role write access" ON ad_news_digest FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;
