import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  category_ko: string;
  category_en: string;
  emoji: string;
  image?: string;
  publishedAt: string;
  featured?: boolean;
  content: string;
}

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title_ko: data.title_ko || '',
        title_en: data.title_en || '',
        description_ko: data.description_ko || '',
        description_en: data.description_en || '',
        category_ko: data.category_ko || '',
        category_en: data.category_en || '',
        emoji: data.emoji || '',
        image: data.image || '',
        publishedAt: data.publishedAt || '',
        featured: data.featured || false,
        content,
      };
    });

  return allPostsData.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title_ko: data.title_ko || '',
    title_en: data.title_en || '',
    description_ko: data.description_ko || '',
    description_en: data.description_en || '',
    category_ko: data.category_ko || '',
    category_en: data.category_en || '',
    emoji: data.emoji || '',
    image: data.image || '',
    publishedAt: data.publishedAt || '',
    featured: data.featured || false,
    content,
  };
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => fileName.replace(/\.mdx$/, ''));
}
