'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { getAllNews, NewsItem } from '@/lib/supabase';
import AdBanner from '@/components/ads/AdBanner';

const categoryStyles: Record<string, React.CSSProperties> = {
  programmatic: { background: 'rgba(139,92,246,0.2)', color: '#a78bfa' },
  mobile: { background: 'rgba(74,222,128,0.2)', color: '#4ade80' },
  privacy: { background: 'rgba(251,191,36,0.2)', color: '#fbbf24' },
  platform: { background: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
  trend: { background: 'rgba(236,72,153,0.2)', color: '#f472b6' },
};

const categories = ['all', 'programmatic', 'mobile', 'privacy', 'platform', 'trend'];

export default function NewsPage() {
  const { lang, t } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function fetchNews() {
      try {
        const data = await getAllNews();
        setNews(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const getCategoryLabel = (category: string) => {
    if (category === 'all') {
      return lang === 'ko' ? '전체' : 'All';
    }
    return t(`news.categories.${category}`) || category;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredNews =
    selectedCategory === 'all'
      ? news
      : news.filter((item) => item.category === selectedCategory);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="gradient-text">{t('news.pageTitle')}</h1>
        <p>{t('news.pageSubtitle')}</p>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      <AdBanner slot="1234567890" />

      {/* News Grid */}
      <div className="news-grid">
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-muted-dark)' }}>
            {t('news.loading')}
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-muted-dark)' }}>
            {t('news.error')}
          </div>
        )}

        {!loading && !error && filteredNews.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-muted-dark)' }}>
            {t('news.empty')}
          </div>
        )}

        {!loading &&
          !error &&
          filteredNews.map((item, index) => (
            <div key={item.id}>
              <article className="news-card">
                <div className="news-meta">
                  <span
                    className="category-badge"
                    style={categoryStyles[item.category] || { background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                  >
                    {getCategoryLabel(item.category)}
                  </span>
                  <span className="news-date">
                    {formatDate(item.published_at)}
                  </span>
                </div>
                <h2>
                  <a href={item.source_url} target="_blank" rel="noopener noreferrer">
                    {lang === 'ko' && item.title_ko ? item.title_ko : item.title}
                  </a>
                </h2>
                <p>{lang === 'ko' && item.summary_ko ? item.summary_ko : item.summary}</p>
              </article>

              {/* Insert ad after every 3 news items */}
              {(index + 1) % 3 === 0 && index < filteredNews.length - 1 && (
                <AdBanner slot="0987654321" />
              )}
            </div>
          ))}
      </div>

      <AdBanner slot="3344556677" />
    </div>
  );
}
