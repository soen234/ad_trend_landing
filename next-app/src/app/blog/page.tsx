import { getAllPosts } from '@/lib/mdx';
import BlogList from '@/components/blog/BlogList';

export const metadata = {
  title: 'Blog - TAT Today Ad Trend',
  description: 'Sharing the latest trends and insights in mobile advertising',
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await getAllPosts();

  return <BlogList posts={posts} />;
}
