'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { getLatestNews, NewsItem } from '@/lib/supabase';

const categoryStyles: Record<string, React.CSSProperties> = {
  adtech: { background: 'rgba(139,92,246,0.2)', color: '#a78bfa' },
  martech: { background: 'rgba(74,222,128,0.2)', color: '#4ade80' },
  general: { background: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
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
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-10">{t('news.title')}</h2>

      <div className="grid gap-5 md:grid-cols-3">
        {loading && (
          <div className="text-center py-12 text-[var(--color-muted)] col-span-full">
            {t('news.loading')}
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-[var(--color-muted)] col-span-full">
            {t('news.error')}
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <div className="text-center py-12 text-[var(--color-muted)] col-span-full">
            {t('news.empty')}
          </div>
        )}

        {!loading &&
          !error &&
          news.map((item) => (
            <article key={item.id} className="news-card">
              <div className="flex items-center gap-4 mb-4">
                <span
                  className="px-3 py-1.5 rounded-lg text-sm font-medium"
                  style={categoryStyles[item.category] || { background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                >
                  {getCategoryLabel(item.category)}
                </span>
                <span className="text-sm text-[var(--color-muted)]">
                  {formatDate(item.published_at)}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-3">
                <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-accent-green)] transition-colors">
                  {lang === 'ko' && item.title_ko ? item.title_ko : item.title}
                </a>
              </h3>
              <p className="text-[15px] text-[var(--color-muted)] leading-relaxed">
                {lang === 'ko' && item.summary_ko ? item.summary_ko : item.summary}
              </p>
            </article>
          ))}
      </div>

      <div className="text-center mt-10">
        <Link href="/news" className="inline-flex items-center gap-2 text-[var(--color-accent-green)] font-medium text-[15px] hover:underline">
          {t('news.viewAll')} &rarr;
        </Link>
      </div>
    </section>
  );
}
