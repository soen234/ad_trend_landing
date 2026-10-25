// Today Ad Trend data contract, /v1 (all JSON, UTF-8).
// Copied verbatim from today_ad_trend/docs/superpowers/specs/2026-10-25-daily-briefing-design.md §4.
// Keep in sync with the pipeline; only the `export` keywords and the Feed type below are additions.

export type Role = 'performance' | 'ua' | 'brand';
export type Section = 'news' | 'platform' | 'expert' | 'creative';

export interface RoleTake { relevance: 0 | 1 | 2 | 3; soWhat: string }   // soWhat ≤ 160 chars, '' if relevance 0

export interface Item {
  id: string;              // sha1(canonical url).slice(0, 12)
  section: Section;
  title: string;
  url: string;
  source: string;          // publisher or expert display name
  publishedAt: string;     // ISO 8601 UTC
  summary: string;         // ≤ 280 chars, our words
  platforms: string[];     // subset of meta|google|youtube|tiktok|apple|amazon|microsoft|snap|linkedin|reddit|x|other
  tags: string[];          // ≤ 4 short lowercase topics
  importance: 1 | 2 | 3 | 4 | 5;
  roles: Record<Role, RoleTake>;
  imageUrl?: string;
  enriched: boolean;       // false = fallback summary, no AI takes
}

export interface Edition {
  version: 1; date: string /* YYYY-MM-DD */; role: Role; generatedAt: string;
  headline: string;        // one sentence framing today's brief for the role
  items: Item[];           // 5–7, ordered
}

export interface PulseStat { label: string; share: number; deltaPt: number }   // share 0..1, delta in points vs prior week
export interface CreativePulse {
  version: 1; generatedAt: string; weekStart: string; weekEnd: string;
  sample: { shards: number; totalShards: number; creatives: number; newThisWeek: number; newPriorWeek: number };
  formatMix: PulseStat[];          // VIDEO / IMAGE / TEXT share of creatives first shown this week
  audienceSignals: PulseStat[];    // share of new creatives using each audience approach
  topLaunchers: { advertiser: string; newCreatives: number; exampleUrl: string }[];
  longRunners: { advertiser: string; format: string; firstShown: string; url: string }[];
  insights: string[];              // 3 plain sentences, LLM-written from the numbers above
}

export interface Latest {
  version: 1; generatedAt: string; editionDate: string | null;
  editions: Record<Role, string | null>;   // relative paths
  feeds: Record<Section, string>;          // relative paths
  pulse: string | null;
  sources: { name: string; section: Section; url: string }[];
}

// `feed/<section>.json` = `{ version: 1, generatedAt, items: Item[] }`, newest first, last 14 days, max 200.
export interface Feed {
  version: 1;
  generatedAt: string;
  items: Item[];
}
