'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { getLatestNews, NewsItem } from '@/lib/supabase';

const categoryColors: Record<string, string> = {
  programmatic: 'bg-[rgba(139,92,246,0.2)] text-[#a78bfa]',
  mobile: 'bg-[rgba(74,222,128,0.2)] text-[#4ade80]',
  privacy: 'bg-[rgba(251,191,36,0.2)] text-[#fbbf24]',
  platform: 'bg-[rgba(59,130,246,0.2)] text-[#60a5fa]',
  trend: 'bg-[rgba(236,72,153,0.2)] text-[#f472b6]',
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
    <section className="my-16">
      <h2 className="text-center text-3xl font-bold mb-8">{t('news.title')}</h2>

      <div className="grid gap-5">
        {loading && (
          <div className="text-center py-10 text-[var(--color-muted-dark)]">
            {t('news.loading')}
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-[var(--color-muted-dark)]">
            {t('news.error')}
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <div className="text-center py-10 text-[var(--color-muted-dark)]">
            {t('news.empty')}
          </div>
        )}

        {!loading &&
          !error &&
          news.map((item) => (
            <article key={item.id} className="card p-6">
              <div className="flex gap-3 items-center mb-3 flex-wrap">
                <span
                  className={`px-2.5 py-1 rounded text-xs font-semibold uppercase ${
                    categoryColors[item.category] || 'bg-[rgba(255,255,255,0.1)] text-white'
                  }`}
                >
                  {getCategoryLabel(item.category)}
                </span>
                <span className="text-[var(--color-muted-dark)] text-xs">
                  {formatDate(item.published_at)}
                </span>
              </div>
              <h3 className="text-base font-semibold mb-2 leading-snug">
                <a
                  href={item.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white no-underline hover:text-[var(--color-accent-green)] transition-colors"
                >
                  {lang === 'ko' && item.title_ko ? item.title_ko : item.title}
                </a>
              </h3>
              <p className="text-[var(--color-muted)] text-sm leading-relaxed">
                {lang === 'ko' && item.summary_ko ? item.summary_ko : item.summary}
              </p>
            </article>
          ))}
      </div>

      <Link
        href="/news"
        className="block text-center mt-6 text-[var(--color-accent-green)] no-underline font-medium hover:underline"
      >
        {t('news.viewAll')} &rarr;
      </Link>
    </section>
  );
}
