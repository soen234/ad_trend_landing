'use client';

import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { useLanguage } from '@/hooks/useLanguage';
import AdBanner from '@/components/ads/AdBanner';
import type { BlogPost } from '@/lib/mdx';

interface BlogPostContentProps {
  post: BlogPost;
}

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 gradient-text" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold mt-8 mb-4 text-white" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-bold mt-6 mb-3 text-white" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-[var(--color-muted)] leading-relaxed mb-4" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside text-[var(--color-muted)] mb-4 space-y-2" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside text-[var(--color-muted)] mb-4 space-y-2" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="ml-4" {...props} />,
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="text-white font-semibold" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-[var(--color-accent-green)] pl-4 my-4 italic text-[var(--color-muted)]"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-[var(--color-card)] px-2 py-1 rounded text-sm text-[var(--color-accent-cyan)]" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-[var(--color-card)] p-4 rounded-lg overflow-x-auto my-4" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="p-3 text-left border-b border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-accent-green)] font-semibold" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="p-3 border-b border-[var(--color-border)] text-[var(--color-muted)]" {...props} />
  ),
};

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const { lang } = useLanguage();

  return (
    <article className="max-w-[800px] mx-auto">
      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-[var(--color-accent-green)] no-underline mb-6 text-sm hover:underline"
      >
        &larr; {lang === 'ko' ? '블로그로 돌아가기' : 'Back to Blog'}
      </Link>

      {/* Featured Image */}
      {post.image && (
        <div className="h-[240px] md:h-[320px] rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f]">
          <img
            src={post.image}
            alt={lang === 'ko' ? post.title_ko : post.title_en}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <div className="flex gap-4 mb-4">
          <span className="bg-[rgba(74,222,128,0.2)] text-[var(--color-accent-green)] px-2.5 py-1 rounded text-xs font-medium">
            {lang === 'ko' ? post.category_ko : post.category_en}
          </span>
          <span className="text-[var(--color-muted-dark)] text-xs">{post.publishedAt}</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 gradient-text">
          {lang === 'ko' ? post.title_ko : post.title_en}
        </h1>
        <p className="text-lg text-[var(--color-muted)]">
          {lang === 'ko' ? post.description_ko : post.description_en}
        </p>
      </header>

      <AdBanner slot="1234567890" />

      {/* Content */}
      <div className="prose prose-invert max-w-none">
        <MDXRemote source={post.content} components={components} />
      </div>

      <AdBanner slot="0987654321" />

      {/* Back Link */}
      <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[var(--color-accent-green)] no-underline text-sm hover:underline"
        >
          &larr; {lang === 'ko' ? '블로그로 돌아가기' : 'Back to Blog'}
        </Link>
      </div>
    </article>
  );
}
