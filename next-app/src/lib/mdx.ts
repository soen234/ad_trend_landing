import { getAllBlogsFromDB, getBlogBySlugFromDB, type BlogPost as DBBlogPost } from './supabase';

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

// Convert DB blog to unified BlogPost type
function dbBlogToBlogPost(dbBlog: DBBlogPost): BlogPost {
  // Format published_at to readable date
  const date = new Date(dbBlog.published_at);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const publishedAt = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

  return {
    slug: dbBlog.slug,
    title_ko: dbBlog.title_ko,
    title_en: dbBlog.title_en,
    description_ko: dbBlog.description_ko,
    description_en: dbBlog.description_en,
    category_ko: dbBlog.category_ko,
    category_en: dbBlog.category_en,
    emoji: dbBlog.emoji,
    image: dbBlog.image_url || undefined,
    publishedAt,
    featured: dbBlog.featured,
    content: dbBlog.content,
  };
}

// Get all posts from DB
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const dbBlogs = await getAllBlogsFromDB();
    return dbBlogs.map(dbBlogToBlogPost);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

// Alias for backward compatibility
export const getAllPostsWithDB = getAllPosts;

// Get post by slug from DB
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const dbBlog = await getBlogBySlugFromDB(slug);
    if (dbBlog) {
      return dbBlogToBlogPost(dbBlog);
    }
  } catch (error) {
    console.error('Error fetching blog:', error);
  }
  return null;
}

// Alias for backward compatibility
export const getPostBySlugWithDB = getPostBySlug;

// Get all post slugs from DB
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const dbBlogs = await getAllBlogsFromDB();
    return dbBlogs.map((b) => b.slug);
  } catch (error) {
    console.error('Error fetching blog slugs:', error);
    return [];
  }
}

// Alias for backward compatibility
export const getAllPostSlugsWithDB = getAllPostSlugs;
