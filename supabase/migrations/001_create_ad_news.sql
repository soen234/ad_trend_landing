-- Ad News 테이블 생성
CREATE TABLE IF NOT EXISTS ad_news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_ko TEXT,
  summary TEXT,
  summary_ko TEXT,
  category TEXT NOT NULL CHECK (category IN ('programmatic', 'mobile', 'privacy', 'platform', 'trend')),
  source TEXT,
  source_url TEXT UNIQUE,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT FALSE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_ad_news_category ON ad_news(category);
CREATE INDEX IF NOT EXISTS idx_ad_news_published ON ad_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_ad_news_created ON ad_news(created_at DESC);

-- RLS (Row Level Security) 설정
ALTER TABLE ad_news ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능 (anon key로 조회 가능)
CREATE POLICY "Allow public read access" ON ad_news
  FOR SELECT USING (true);

-- service_role만 쓰기 가능 (Edge Function에서 사용)
CREATE POLICY "Allow service role write access" ON ad_news
  FOR ALL USING (auth.role() = 'service_role');

-- 초기 테스트 데이터 (선택사항)
INSERT INTO ad_news (title, title_ko, summary, summary_ko, category, source, source_url, published_at, is_featured)
VALUES
  (
    'Google Introduces New Privacy Sandbox Features for Android',
    'Google, Android용 새로운 Privacy Sandbox 기능 발표',
    'Google announced new Privacy Sandbox APIs for Android, providing advertisers with privacy-preserving alternatives to traditional tracking methods.',
    'Google이 Android용 새로운 Privacy Sandbox API를 발표했습니다. 광고주에게 기존 추적 방식을 대체할 프라이버시 보호 대안을 제공합니다.',
    'privacy',
    'TechCrunch',
    'https://example.com/google-privacy-sandbox',
    NOW() - INTERVAL '1 day',
    true
  ),
  (
    'Mobile Ad Spending Expected to Reach $400B in 2025',
    '2025년 모바일 광고 지출 4000억 달러 전망',
    'Industry analysts predict mobile advertising spending will hit $400 billion globally in 2025, driven by video and in-app advertising growth.',
    '업계 분석가들은 동영상 및 인앱 광고 성장에 힘입어 2025년 전 세계 모바일 광고 지출이 4000억 달러에 달할 것으로 전망합니다.',
    'trend',
    'AdWeek',
    'https://example.com/mobile-ad-spending-2025',
    NOW() - INTERVAL '2 days',
    false
  ),
  (
    'Meta Updates Advantage+ Campaign Features',
    'Meta, Advantage+ 캠페인 기능 업데이트',
    'Meta has rolled out new features for Advantage+ campaigns, including improved AI-driven creative optimization and expanded audience targeting.',
    'Meta가 향상된 AI 기반 크리에이티브 최적화와 확장된 오디언스 타겟팅을 포함한 Advantage+ 캠페인의 새로운 기능을 출시했습니다.',
    'platform',
    'Marketing Dive',
    'https://example.com/meta-advantage-plus',
    NOW() - INTERVAL '3 days',
    false
  );
