import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPostSlugs, getPostBySlug, type BlogPost } from '@/lib/mdx';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import BlogPostContent from '@/components/blog/BlogPostContent';

// Every post is a Markdown file in the repo, so all pages are built ahead of time.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Post not found' };
  }

  const images = post.image ? [{ url: post.image, alt: post.title_en }] : undefined;

  return {
    title: post.title_en,
    description: post.description_en,
    keywords: [post.category_en, 'ad trends', 'mobile advertising', 'app monetization'],
    openGraph: {
      type: 'article',
      title: post.title_en,
      description: post.description_en,
      url: `${SITE_URL}/blog/${slug}`,
      ...(images ? { images } : {}),
      publishedTime: post.publishedAt,
      authors: [SITE_NAME],
      tags: [post.category_en],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title_en,
      description: post.description_en,
      ...(post.image ? { images: [post.image] } : {}),
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

// JSON-LD structured data for blog posts
function generateJsonLd(post: BlogPost, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title_en,
    description: post.description_en,
    image: post.image || `${SITE_URL}/opengraph-image`,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/apple-touch-icon.png`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
    articleSection: post.category_en,
    inLanguage: 'en-US',
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = generateJsonLd(post, slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <BlogPostContent post={post} />
    </>
  );
}
