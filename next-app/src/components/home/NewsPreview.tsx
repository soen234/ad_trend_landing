'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { getLatestNews, NewsItem } from '@/lib/supabase';

const categoryStyles: Record<string, React.CSSProperties> = {
  programmatic: { background: 'rgba(139,92,246,0.2)', color: '#a78bfa' },
  mobile: { background: 'rgba(74,222,128,0.2)', color: '#4ade80' },
  privacy: { background: 'rgba(251,191,36,0.2)', color: '#fbbf24' },
  platform: { background: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
  trend: { background: 'rgba(236,72,153,0.2)', color: '#f472b6' },
};

export default function NewsPreview() {
  const { lang, t } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const data = await getLatestNews(3);
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
    return t(`news.categories.${category}`) || category;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <section className="news-section">
      <h2>{t('news.title')}</h2>

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

        {!loading && !error && news.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-muted-dark)' }}>
            {t('news.empty')}
          </div>
        )}

        {!loading &&
          !error &&
          news.map((item) => (
            <article key={item.id} className="news-card">
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
              <h3>
                <a href={item.source_url} target="_blank" rel="noopener noreferrer">
                  {lang === 'ko' && item.title_ko ? item.title_ko : item.title}
                </a>
              </h3>
              <p>{lang === 'ko' && item.summary_ko ? item.summary_ko : item.summary}</p>
            </article>
          ))}
      </div>

      <Link href="/news" className="view-all-link">
        {t('news.viewAll')} &rarr;
      </Link>
    </section>
  );
}
