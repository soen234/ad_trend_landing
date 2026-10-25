import fs from 'fs';
import path from 'path';

/**
 * Blog posts live as Markdown files in `src/content/blog/<slug>.md`.
 * Each file starts with a frontmatter block of `key: value` lines, where values are
 * JSON literals (double-quoted strings, booleans). Posts are read at build time only.
 */
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
  /** ISO date, YYYY-MM-DD */
  publishedAt: string;
  featured?: boolean;
  content: string;
}

const POSTS_DIR = path.join(process.cwd(), 'src/content/blog');
const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    try {
      data[key] = JSON.parse(value);
    } catch {
      data[key] = value;
    }
  }
  return { data, content: match[2].trim() };
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function readPost(slug: string): BlogPost | null {
  if (!SLUG_RE.test(slug)) return null;
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;

  const { data, content } = parseFrontmatter(fs.readFileSync(file, 'utf8'));
  return {
    slug,
    title_ko: str(data.title_ko) || str(data.title_en),
    title_en: str(data.title_en),
    description_ko: str(data.description_ko) || str(data.description_en),
    description_en: str(data.description_en),
    category_ko: str(data.category_ko) || str(data.category_en),
    category_en: str(data.category_en),
    emoji: str(data.emoji),
    image: str(data.image) || undefined,
    publishedAt: str(data.publishedAt),
    featured: data.featured === true,
    content,
  };
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''))
    .filter((slug) => SLUG_RE.test(slug));
}

export function getAllPosts(): BlogPost[] {
  return getAllPostSlugs()
    .map(readPost)
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPostBySlug(slug: string): BlogPost | null {
  return readPost(slug);
}
