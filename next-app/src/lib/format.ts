// Date and number formatting shared by server and client components.
// All dates are rendered in UTC so the server and the browser agree.

type Lang = 'en' | 'ko';

function toDate(value: string): Date | null {
  // Treat bare YYYY-MM-DD values as UTC midnight.
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "2025-12-30" -> "Dec 30, 2025" */
export function formatPostDate(value: string, lang: Lang = 'en'): string {
  const date = toDate(value);
  if (!date) return value;
  return date.toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** "2026-10-26" -> "Monday, October 26, 2026" */
export function formatLongDate(value: string): string {
  const date = toDate(value);
  if (!date) return value;
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** ISO timestamp -> "Oct 25" */
export function formatShortDate(value: string): string {
  const date = toDate(value);
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/** 12345 -> "12,345" */
export function formatCount(value: number): string {
  return Number.isFinite(value) ? Math.round(value).toLocaleString('en-US') : '0';
}

/** 0.4234 -> "42%" (one decimal below 10%) */
export function formatShare(share: number): string {
  if (!Number.isFinite(share)) return '0%';
  const pct = share * 100;
  return pct > 0 && pct < 10 ? `${pct.toFixed(1)}%` : `${Math.round(pct)}%`;
}

/** 2.345 -> "+2.3 pts", -0.04 -> "0.0 pts" */
export function formatDeltaPt(delta: number): string {
  if (!Number.isFinite(delta)) return '';
  const rounded = Math.round(delta * 10) / 10;
  if (rounded === 0) return '0.0 pts';
  return `${rounded > 0 ? '+' : '−'}${Math.abs(rounded).toFixed(1)} pts`;
}

/** Whole days between an ISO date and a reference date (both UTC). */
export function daysBetween(from: string, to: string): number | null {
  const a = toDate(from);
  const b = toDate(to);
  if (!a || !b) return null;
  return Math.max(0, Math.floor((b.getTime() - a.getTime()) / 86_400_000));
}
