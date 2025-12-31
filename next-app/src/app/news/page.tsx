'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { getAllNews, NewsItem } from '@/lib/supabase';
import AdBanner from '@/components/ads/AdBanner';

const categoryColors: Record<string, string> = {
  programmatic: 'bg-[rgba(139,92,246,0.2)] text-[#a78bfa]',
  mobile: 'bg-[rgba(74,222,128,0.2)] text-[#4ade80]',
  privacy: 'bg-[rgba(251,191,36,0.2)] text-[#fbbf24]',
  platform: 'bg-[rgba(59,130,246,0.2)] text-[#60a5fa]',
  trend: 'bg-[rgba(236,72,153,0.2)] text-[#f472b6]',
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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 gradient-text">{t('news.pageTitle')}</h1>
        <p className="text-[var(--color-muted)] text-base">{t('news.pageSubtitle')}</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap justify-center mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-[var(--color-accent-green)] text-[var(--color-background)]'
                : 'bg-[var(--color-card)] text-[var(--color-muted)] hover:bg-[var(--color-card-hover)]'
            }`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      <AdBanner slot="1234567890" />

      {/* News Grid */}
      <div className="grid gap-6">
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

        {!loading && !error && filteredNews.length === 0 && (
          <div className="text-center py-10 text-[var(--color-muted-dark)]">
            {t('news.empty')}
          </div>
        )}

        {!loading &&
          !error &&
          filteredNews.map((item, index) => (
            <div key={item.id}>
              <article className="card p-6">
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
                <h2 className="text-xl font-bold mb-3">
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white no-underline hover:text-[var(--color-accent-green)] transition-colors"
                  >
                    {lang === 'ko' && item.title_ko ? item.title_ko : item.title}
                  </a>
                </h2>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed">
                  {lang === 'ko' && item.summary_ko ? item.summary_ko : item.summary}
                </p>
              </article>

              {/* Insert ad after every 3 news items */}
              {(index + 1) % 3 === 0 && index < filteredNews.length - 1 && (
                <AdBanner slot="0987654321" className="my-6" />
              )}
            </div>
          ))}
      </div>

      <AdBanner slot="3344556677" />
    </div>
  );
}
