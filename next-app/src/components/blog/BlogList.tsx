'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import AdBanner from '@/components/ads/AdBanner';
import type { BlogPost } from '@/lib/mdx';

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  const { lang, t } = useLanguage();

  const featuredPost = posts.find((post) => post.featured);
  const regularPosts = posts.filter((post) => !post.featured);

  return (
    <div>
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 gradient-text">
          {lang === 'ko' ? '광고 트렌드 블로그' : 'Ad Trend Blog'}
        </h1>
        <p className="text-[var(--color-muted)] text-base">
          {lang === 'ko'
            ? '모바일 광고의 최신 트렌드와 인사이트를 공유합니다'
            : 'Sharing the latest trends and insights in mobile advertising'}
        </p>
      </div>

      <AdBanner slot="1234567890" />

      {/* Featured Post */}
      {featuredPost && (
        <article className="card grid md:grid-cols-2 gap-0 mb-8 overflow-hidden">
          <div className="min-h-[180px] md:min-h-[280px] bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] flex items-center justify-center text-5xl md:rounded-l-2xl">
            {featuredPost.emoji}
          </div>
          <div className="p-6 flex flex-col justify-center">
            <span className="bg-gradient-to-r from-[var(--color-accent-green)] to-[var(--color-accent-cyan)] text-[var(--color-background)] px-2.5 py-1 rounded text-xs font-semibold uppercase inline-block mb-3 w-fit">
              {t('blog.featured')}
            </span>
            <div className="flex gap-4 mb-3">
              <span className="bg-[rgba(74,222,128,0.2)] text-[var(--color-accent-green)] px-2.5 py-1 rounded text-xs font-medium">
                {lang === 'ko' ? featuredPost.category_ko : featuredPost.category_en}
              </span>
              <span className="text-[var(--color-muted-dark)] text-xs">
                {featuredPost.publishedAt}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-3">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="text-white no-underline hover:text-[var(--color-accent-green)] transition-colors"
              >
                {lang === 'ko' ? featuredPost.title_ko : featuredPost.title_en}
              </Link>
            </h2>
            <p className="text-[var(--color-muted)] text-sm leading-relaxed mb-4">
              {lang === 'ko' ? featuredPost.description_ko : featuredPost.description_en}
            </p>
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="text-[var(--color-accent-green)] no-underline text-sm font-medium hover:underline"
            >
              {t('blog.readMore')} &rarr;
            </Link>
          </div>
        </article>
      )}

      {/* Blog Grid */}
      <div className="grid gap-6">
        {regularPosts.map((post, index) => (
          <div key={post.slug}>
            <article className="card overflow-hidden">
              <div className="h-[180px] bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] flex items-center justify-center text-5xl">
                {post.emoji}
              </div>
              <div className="p-6">
                <div className="flex gap-4 mb-3">
                  <span className="bg-[rgba(74,222,128,0.2)] text-[var(--color-accent-green)] px-2.5 py-1 rounded text-xs font-medium">
                    {lang === 'ko' ? post.category_ko : post.category_en}
                  </span>
                  <span className="text-[var(--color-muted-dark)] text-xs">{post.publishedAt}</span>
                </div>
                <h2 className="text-xl font-bold mb-3">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-white no-underline hover:text-[var(--color-accent-green)] transition-colors"
                  >
                    {lang === 'ko' ? post.title_ko : post.title_en}
                  </Link>
                </h2>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed mb-4">
                  {lang === 'ko' ? post.description_ko : post.description_en}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-[var(--color-accent-green)] no-underline text-sm font-medium hover:underline"
                >
                  {t('blog.readMore')} &rarr;
                </Link>
              </div>
            </article>

            {/* Insert ad after every 2 posts */}
            {(index + 1) % 2 === 0 && index < regularPosts.length - 1 && (
              <AdBanner slot="0987654321" className="my-6" />
            )}
          </div>
        ))}
      </div>

      <AdBanner slot="3344556677" />
    </div>
  );
}
