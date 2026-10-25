import type { Role, Section } from './types';

export const ROLES: readonly Role[] = ['performance', 'ua', 'brand'];
export const SECTIONS: readonly Section[] = ['news', 'platform', 'expert', 'creative'];
export const DEFAULT_ROLE: Role = 'performance';

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value);
}

export function isSection(value: unknown): value is Section {
  return typeof value === 'string' && (SECTIONS as readonly string[]).includes(value);
}

interface RoleMeta {
  /** Tab label */
  short: string;
  /** Edition title */
  label: string;
  /** Used in "So what for {audience}" */
  audience: string;
  description: string;
}

export const ROLE_META: Record<Role, RoleMeta> = {
  performance: {
    short: 'Performance',
    label: 'Performance marketing',
    audience: 'performance marketers',
    description: 'Paid social and search, bidding, measurement and conversion.',
  },
  ua: {
    short: 'UA / App',
    label: 'UA & app marketing',
    audience: 'UA marketers',
    description: 'User acquisition, app stores, SKAdNetwork and mobile measurement.',
  },
  brand: {
    short: 'Brand',
    label: 'Brand & creative',
    audience: 'brand marketers',
    description: 'Brand campaigns, creative, video and culture.',
  },
};

interface SectionMeta {
  label: string;
  /** Plural heading used for feed lists */
  heading: string;
  /** CSS class that sets --tone for badges and accents (see globals.css) */
  tone: string;
}

export const SECTION_META: Record<Section, SectionMeta> = {
  news: { label: 'News', heading: 'Industry news', tone: 'tone-news' },
  platform: { label: 'Platform update', heading: 'Platform updates', tone: 'tone-platform' },
  expert: { label: 'Expert take', heading: 'Expert takes', tone: 'tone-expert' },
  creative: { label: 'Creative Pulse', heading: 'Creative Pulse', tone: 'tone-creative' },
};

const PLATFORM_LABELS: Record<string, string> = {
  meta: 'Meta',
  google: 'Google',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  apple: 'Apple',
  amazon: 'Amazon',
  microsoft: 'Microsoft',
  snap: 'Snap',
  linkedin: 'LinkedIn',
  reddit: 'Reddit',
  x: 'X',
};

/** Display names for an item's platforms, without the catch-all "other". */
export function platformLabels(platforms: string[]): string[] {
  return platforms.map((p) => PLATFORM_LABELS[p]).filter((label): label is string => Boolean(label));
}
