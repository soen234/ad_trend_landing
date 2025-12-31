# Design Guide Skill

## Overview
This skill ensures all UI components follow the project's design system for consistent spacing and styling.

## When to Use
- Creating new card components
- Modifying existing UI components
- Adding new pages with content cards

## Card Component Design Guide

### Card Container
```tsx
className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-accent-green)] transition-colors"
```

### Spacing Rules

| Element | Spacing | Tailwind Class |
|---------|---------|----------------|
| Card padding (content-only) | 28px | `p-7` |
| Card padding (with image) | 24px sides, 32px top | `p-6 pt-8` |
| Meta row → Title gap | 20px | `mb-5` |
| Title → Description gap | 16px | `mb-4` |
| Description → Link gap | 20px | `mb-5` |
| Meta row internal gap | 16px | `gap-4` |

### Meta Row (Category + Date)
```tsx
<div className="flex items-center gap-4 mb-5">
  <span className="px-3 py-1.5 rounded-lg text-sm font-medium" style={categoryStyle}>
    {category}
  </span>
  <span className="text-sm text-[var(--color-muted)]">
    {date}
  </span>
</div>
```

### Title
```tsx
<h2 className="text-xl font-semibold mb-4">
  <a href={url} className="hover:text-[var(--color-accent-green)] transition-colors">
    {title}
  </a>
</h2>
```

### Description
```tsx
// If last element (no link follows)
<p className="text-[15px] text-[var(--color-muted)] leading-relaxed">
  {description}
</p>

// If link follows
<p className="text-[15px] text-[var(--color-muted)] leading-relaxed mb-5">
  {description}
</p>
```

### Read More Link
```tsx
<a href={url} className="text-[var(--color-accent-green)] no-underline text-sm font-medium hover:underline">
  {t('blog.readMore')} →
</a>
```

## Category Colors
```tsx
const categoryColors: Record<string, React.CSSProperties> = {
  adtech: { background: 'rgba(139,92,246,0.2)', color: '#a78bfa' },
  martech: { background: 'rgba(74,222,128,0.2)', color: '#4ade80' },
  general: { background: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
};
```

## Complete Article Card Example
```tsx
<article className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-7 hover:border-[var(--color-accent-green)] transition-colors">
  {/* Meta Row */}
  <div className="flex items-center gap-4 mb-5">
    <span className="px-3 py-1.5 rounded-lg text-sm font-medium" style={categoryStyle}>
      {category}
    </span>
    <span className="text-sm text-[var(--color-muted)]">{date}</span>
  </div>

  {/* Title */}
  <h2 className="text-xl font-semibold mb-4">
    <a href={url} className="hover:text-[var(--color-accent-green)] transition-colors">
      {title}
    </a>
  </h2>

  {/* Description */}
  <p className="text-[15px] text-[var(--color-muted)] leading-relaxed">
    {description}
  </p>
</article>
```

## Image Card Example (Blog)
```tsx
<article className="card overflow-hidden">
  {/* Image Section */}
  <div className="h-[200px] bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] flex items-center justify-center overflow-hidden rounded-t-2xl">
    <img src={image} alt={title} className="w-full h-full object-cover" />
  </div>

  {/* Content Section */}
  <div className="p-6 pt-8">
    {/* Meta Row */}
    <div className="flex items-center gap-4 mb-5">
      <span className="bg-[rgba(74,222,128,0.2)] text-[var(--color-accent-green)] px-2.5 py-1 rounded text-xs font-medium">
        {category}
      </span>
      <span className="text-[var(--color-muted-dark)] text-xs">{date}</span>
    </div>

    {/* Title */}
    <h2 className="text-xl font-bold mb-4">
      <a href={url} className="text-white no-underline hover:text-[var(--color-accent-green)] transition-colors">
        {title}
      </a>
    </h2>

    {/* Description */}
    <p className="text-[var(--color-muted)] text-sm leading-relaxed mb-5">
      {description}
    </p>

    {/* Read More */}
    <a href={url} className="text-[var(--color-accent-green)] no-underline text-sm font-medium hover:underline">
      Read More →
    </a>
  </div>
</article>
```

## Reference Files
- `/next-app/src/styles/cardStyles.ts` - Style constants
- `/next-app/src/app/news/page.tsx` - News cards
- `/next-app/src/components/blog/BlogList.tsx` - Blog cards
- `/next-app/src/components/home/NewsPreview.tsx` - Home news preview
