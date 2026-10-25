import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/mdx';
import BlogList from '@/components/blog/BlogList';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Guides and explainers on ad formats, monetization and advertising trends from the Today Ad Trend team.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return <BlogList posts={posts} />;
}
