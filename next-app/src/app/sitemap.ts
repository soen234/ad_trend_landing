import { MetadataRoute } from 'next';
import { getAllBlogsFromDB } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://todayadtrend.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Dynamic blog pages
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const blogs = await getAllBlogsFromDB();
    blogPages = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }

  return [...staticPages, ...blogPages];
}
