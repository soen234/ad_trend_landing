/**
 * Every link that comes from the briefing JSON (item url, imageUrl, pulse exampleUrl,
 * long-runner url, sources[].url) goes through this before it reaches an href or src.
 * Only absolute http(s) URLs pass; anything else (javascript:, data:, relative paths,
 * garbage) returns null and the caller renders plain text or skips the image.
 */
export function safeHref(value: unknown): string | null {
  if (typeof value !== 'string' || value.trim() === '') return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

/** rel for links that leave the site */
export const EXTERNAL_REL = 'noopener noreferrer';

const SITE_HOSTS = ['todayadtrend.com', 'www.todayadtrend.com'];

/**
 * Links that point back at this site (for example the synthetic Creative Pulse item)
 * become internal paths so they open in the same tab. Expects a value from safeHref().
 */
export function internalPath(href: string | null): string | null {
  if (!href) return null;
  const url = new URL(href);
  if (!SITE_HOSTS.includes(url.hostname)) return null;
  return `${url.pathname}${url.search}${url.hash}` || '/';
}
