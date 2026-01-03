'use client';

import { Fragment, useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  getNewsByDate,
  getAvailableDates,
  getDigestByDate,
  NewsItem,
  NewsDigest,
} from '@/lib/supabase';
import AdBanner from '@/components/ads/AdBanner';

const categoryStyles: Record<string, React.CSSProperties> = {
  adtech: { background: 'rgba(139,92,246,0.2)', color: '#a78bfa' },
  martech: { background: 'rgba(74,222,128,0.2)', color: '#4ade80' },
  general: { background: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
};

const categories = ['all', 'adtech', 'martech', 'general'];

export default function NewsPage() {
  const { lang, t } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [digest, setDigest] = useState<NewsDigest | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load available dates on mount
  useEffect(() => {
    async function loadDates() {
      try {
        const dates = await getAvailableDates();
        setAvailableDates(dates);
        if (dates.length > 0) {
          setSelectedDate(dates[0]); // Select most recent date
        }
      } catch {
        setError(true);
      }
    }
    loadDates();
  }, []);

  // Load news and digest when date changes
  useEffect(() => {
    if (!selectedDate) return;

    async function loadNewsAndDigest() {
      setLoading(true);
      try {
        const [newsData, digestData] = await Promise.all([
          getNewsByDate(selectedDate),
          getDigestByDate(selectedDate),
        ]);
        setNews(newsData);
        setDigest(digestData);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadNewsAndDigest();
  }, [selectedDate]);

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

  const formatDateForDisplay = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const filteredNews =
    selectedCategory === 'all'
      ? news
      : news.filter((item) => item.category === selectedCategory);

  // Navigate to previous/next date
  const currentIndex = availableDates.indexOf(selectedDate);
  const hasPrev = currentIndex < availableDates.length - 1;
  const hasNext = currentIndex > 0;

  const goToPrev = () => {
    if (hasPrev) {
      setSelectedDate(availableDates[currentIndex + 1]);
    }
  };

  const goToNext = () => {
    if (hasNext) {
      setSelectedDate(availableDates[currentIndex - 1]);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold gradient-text mb-3">{t('news.pageTitle')}</h1>
        <p className="text-[var(--color-muted)] text-[15px]">{t('news.pageSubtitle')}</p>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-center gap-5 mb-10">
        <button
          onClick={goToPrev}
          disabled={!hasPrev}
          className="p-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-border)] transition-colors"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="text-center min-w-[220px]">
          <div className="text-xl font-semibold">{selectedDate && formatDateForDisplay(selectedDate)}</div>
        </div>

        <button
          onClick={goToNext}
          disabled={!hasNext}
          className="p-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-border)] transition-colors"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Daily Digest Section */}
      {digest && (digest.summary || digest.summary_ko) && (
        <div className="bg-gradient-to-br from-[rgba(74,222,128,0.08)] to-[rgba(34,211,238,0.08)] border border-[rgba(74,222,128,0.2)] rounded-2xl p-8 mb-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-12 h-12 bg-gradient-to-br from-[var(--color-accent-green)] to-[var(--color-accent-cyan)] rounded-xl flex items-center justify-center text-2xl">📝</span>
            <div>
              <h2 className="text-xl font-bold">
                {lang === 'ko' ? '오늘의 AI 요약' : "Today's AI Summary"}
              </h2>
              <p className="text-sm text-[var(--color-muted)]">
                {lang === 'ko' ? 'Gemini가 분석한 주요 트렌드' : 'Key trends analyzed by Gemini'}
              </p>
            </div>
          </div>

          {/* AI Generated Summary - Main Focus */}
          <p className="text-[17px] text-white leading-relaxed mb-6">
            {lang === 'ko' && digest.summary_ko ? digest.summary_ko : digest.summary}
          </p>

          {/* Category Counts - Smaller, Secondary (실제 뉴스 갯수 기반) */}
          <div className="flex items-center gap-6 pt-6 border-t border-[rgba(255,255,255,0.1)]">
            <span className="text-sm text-[var(--color-muted)]">
              {lang === 'ko' ? '오늘의 뉴스' : "Today's news"}:
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#a78bfa]"></span>
                <span className="text-sm text-[var(--color-muted)]">AdTech {news.filter(n => n.category === 'adtech').length}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4ade80]"></span>
                <span className="text-sm text-[var(--color-muted)]">MarTech {news.filter(n => n.category === 'martech').length}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#60a5fa]"></span>
                <span className="text-sm text-[var(--color-muted)]">General {news.filter(n => n.category === 'general').length}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-8 py-4 rounded-full text-[15px] font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[var(--color-accent-green)] to-[var(--color-accent-cyan)] text-[var(--color-background)]'
                : 'bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent-green)]'
            }`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      <AdBanner slot="1234567890" />

      {/* News Grid */}
      <div className="flex flex-col gap-5 mt-8">
        {loading && (
          <div className="text-center py-12 text-[var(--color-muted)]">
            {t('news.loading')}
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-[var(--color-muted)]">
            {t('news.error')}
          </div>
        )}

        {!loading && !error && filteredNews.length === 0 && (
          <div className="text-center py-12 text-[var(--color-muted)]">
            {t('news.empty')}
          </div>
        )}

        {!loading &&
          !error &&
          filteredNews.map((item, index) => (
            <Fragment key={item.id}>
              <article className="news-card-lg">
                <div className="flex items-center gap-4 mb-5">
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
                <h2 className="text-xl font-semibold mb-4">
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--color-accent-green)] transition-colors"
                  >
                    {lang === 'ko' && item.title_ko ? item.title_ko : item.title}
                  </a>
                </h2>
                <p className="text-[15px] text-[var(--color-muted)] leading-relaxed">
                  {lang === 'ko' && item.summary_ko ? item.summary_ko : item.summary}
                </p>
              </article>
              {(index + 1) % 3 === 0 && index < filteredNews.length - 1 && (
                <AdBanner slot="0987654321" />
              )}
            </Fragment>
          ))}
      </div>

      <AdBanner slot="3344556677" />
    </div>
  );
}
