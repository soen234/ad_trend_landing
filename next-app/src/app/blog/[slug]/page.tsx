import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllPostSlugs, getPostBySlug } from '@/lib/mdx';
import BlogPostContent from '@/components/blog/BlogPostContent';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  const ogImage = post.image || '/og-image.png';

  return {
    title: post.title_en,
    description: post.description_en,
    keywords: [post.category_en, 'mobile advertising', 'ad tech', 'app monetization'],
    openGraph: {
      type: 'article',
      title: post.title_en,
      description: post.description_en,
      url: `https://todayadtrend.com/blog/${slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title_en }],
      publishedTime: post.publishedAt,
      authors: ['TAT - Today Ad Trend'],
      tags: [post.category_en, 'Mobile Advertising'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title_en,
      description: post.description_en,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://todayadtrend.com/blog/${slug}`,
    },
  };
}

// JSON-LD structured data for blog posts
function generateJsonLd(post: NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title_en,
    description: post.description_en,
    image: post.image || 'https://todayadtrend.com/og-image.png',
    author: {
      '@type': 'Organization',
      name: 'TAT - Today Ad Trend',
      url: 'https://todayadtrend.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TAT - Today Ad Trend',
      logo: {
        '@type': 'ImageObject',
        url: 'https://todayadtrend.com/logo.png',
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://todayadtrend.com/blog/${slug}`,
    },
    articleSection: post.category_en,
    inLanguage: 'en-US',
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = generateJsonLd(post, slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostContent post={post} />
    </>
  );
}
