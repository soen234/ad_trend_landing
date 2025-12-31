/**
 * Card Design Guide - Consistent spacing for all card components
 *
 * Card Types:
 * 1. Image Card (blog posts) - Has image + content section
 * 2. Content Card (news items) - Content only, no image
 *
 * Spacing Rules:
 * - Card padding: 28px (p-7) for content cards
 * - Image to content gap: 32px (pt-8 on content section for image cards)
 * - Meta row → Title: 20px (mb-5)
 * - Title → Description: 16px (mb-4)
 * - Description → Link: 20px (mb-5) when followed by link, 0 when last element
 * - Internal element gap in meta row: 16px (gap-4)
 *
 * Applied Components:
 * - BlogList.tsx: Featured post, regular posts
 * - NewsPreview.tsx: Home page news cards
 * - news/page.tsx: News page cards
 *
 * Skills Reference:
 * - .claude/skills/design-guide.md
 */

export const cardStyles = {
  // Card container
  card: 'bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-accent-green)] transition-colors',

  // Image section (for blog cards)
  imageSection: 'h-[200px] bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] flex items-center justify-center text-5xl overflow-hidden',
  image: 'w-full h-full object-cover',

  // Content section
  content: 'p-6',
  contentWithImage: 'p-6 pt-6', // Consistent padding when following an image

  // Meta row (category + date)
  metaRow: 'flex items-center gap-4 mb-4',

  // Category badge
  categoryBadge: 'px-2.5 py-1 rounded text-xs font-medium',
  categoryBadgeAlt: 'px-3 py-1.5 rounded-lg text-sm font-medium', // Larger variant

  // Date text
  dateText: 'text-xs text-[var(--color-muted-dark)]',
  dateTextAlt: 'text-sm text-[var(--color-muted)]', // Larger variant

  // Title
  title: 'text-lg font-semibold mb-3',
  titleLarge: 'text-xl font-bold mb-3',
  titleLink: 'hover:text-[var(--color-accent-green)] transition-colors',

  // Description
  description: 'text-sm text-[var(--color-muted)] leading-relaxed mb-5',
  descriptionAlt: 'text-[15px] text-[var(--color-muted)] leading-relaxed',

  // Read more link
  readMoreLink: 'text-[var(--color-accent-green)] no-underline text-sm font-medium hover:underline',

  // Featured badge
  featuredBadge: 'bg-gradient-to-r from-[var(--color-accent-green)] to-[var(--color-accent-cyan)] text-[var(--color-background)] px-2.5 py-1 rounded text-xs font-semibold uppercase inline-block mb-3 w-fit',
};

// Category color styles
export const categoryColors: Record<string, React.CSSProperties> = {
  adtech: { background: 'rgba(139,92,246,0.2)', color: '#a78bfa' },
  martech: { background: 'rgba(74,222,128,0.2)', color: '#4ade80' },
  general: { background: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
};

// Default category style for blog posts
export const blogCategoryStyle: React.CSSProperties = {
  background: 'rgba(74,222,128,0.2)',
  color: 'var(--color-accent-green)',
};
