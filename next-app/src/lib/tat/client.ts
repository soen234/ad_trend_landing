// Reads the Today Ad Trend /v1 static JSON (GitHub Pages) with ISR caching.
//
// Every function returns null (or an empty result) when the data is missing, malformed or the
// host is unreachable. Pages render an empty state in that case; the build never fails because
// of the data host.

import { ROLES, SECTIONS, isRole, isSection } from './labels';
import { safeHref } from './safe-href';
import type { CreativePulse, Edition, Feed, Item, Latest, PulseStat, Role, RoleTake, Section } from './types';

export const DEFAULT_DATA_BASE_URL = 'https://soen234.github.io/today_ad_trend/v1';
export const REVALIDATE_SECONDS = 3600;
const FETCH_TIMEOUT_MS = 10_000;

export function dataBaseUrl(): string {
  return (process.env.DATA_BASE_URL || DEFAULT_DATA_BASE_URL).replace(/\/+$/, '');
}

function resolveDataUrl(pathOrUrl: string): string | null {
  try {
    const url = new URL(pathOrUrl, `${dataBaseUrl()}/`);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

async function fetchJson(pathOrUrl: string): Promise<unknown | null> {
  const url = resolveDataUrl(pathOrUrl);
  if (!url) return null;
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.warn(`[tat-data] ${res.status} for ${url}`);
      return null;
    }
    return (await res.json()) as unknown;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(`[tat-data] could not load ${url}: ${reason}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Defensive normalisation: the UI only ever sees well-formed values.
// ---------------------------------------------------------------------------

type Obj = Record<string, unknown>;

function isObj(value: unknown): value is Obj {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function strArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}

function clampInt<T extends number>(value: unknown, min: number, max: number, fallback: T): T {
  const n = Math.round(num(value, fallback));
  return Math.min(max, Math.max(min, n)) as T;
}

function normalizeRoleTake(value: unknown): RoleTake {
  if (!isObj(value)) return { relevance: 0, soWhat: '' };
  return {
    relevance: clampInt<RoleTake['relevance']>(value.relevance, 0, 3, 0),
    soWhat: str(value.soWhat).trim(),
  };
}

function normalizeItem(value: unknown): Item | null {
  if (!isObj(value)) return null;
  const title = str(value.title).trim();
  if (!title || !isSection(value.section)) return null;
  // An unsafe or missing link is dropped, not the item: the UI renders its title as plain text.
  const url = safeHref(value.url) ?? '';

  const roles = isObj(value.roles) ? value.roles : {};
  const imageUrl = safeHref(value.imageUrl);

  return {
    id: str(value.id) || url || title,
    section: value.section,
    title,
    url,
    source: str(value.source).trim(),
    publishedAt: str(value.publishedAt),
    summary: str(value.summary).trim(),
    platforms: strArray(value.platforms),
    tags: strArray(value.tags).slice(0, 4),
    importance: clampInt<Item['importance']>(value.importance, 1, 5, 3),
    roles: Object.fromEntries(ROLES.map((r) => [r, normalizeRoleTake(roles[r])])) as Record<Role, RoleTake>,
    ...(imageUrl ? { imageUrl } : {}),
    enriched: value.enriched === true,
  };
}

function normalizeItems(value: unknown): Item[] {
  if (!Array.isArray(value)) return [];
  return value.map(normalizeItem).filter((item): item is Item => item !== null);
}

function normalizeLatest(value: unknown): Latest | null {
  if (!isObj(value) || value.version !== 1) return null;
  const editions = isObj(value.editions) ? value.editions : {};
  const feeds = isObj(value.feeds) ? value.feeds : {};
  return {
    version: 1,
    generatedAt: str(value.generatedAt),
    editionDate: typeof value.editionDate === 'string' ? value.editionDate : null,
    editions: Object.fromEntries(
      ROLES.map((r) => [r, typeof editions[r] === 'string' ? editions[r] : null]),
    ) as Record<Role, string | null>,
    feeds: Object.fromEntries(
      SECTIONS.map((s) => [s, typeof feeds[s] === 'string' ? feeds[s] : `feed/${s}.json`]),
    ) as Record<Section, string>,
    pulse: typeof value.pulse === 'string' ? value.pulse : null,
    sources: Array.isArray(value.sources)
      ? value.sources
          .filter(isObj)
          .map((s) => ({ name: str(s.name), section: s.section, url: safeHref(s.url) ?? '' }))
          .filter((s): s is Latest['sources'][number] => Boolean(s.name) && isSection(s.section))
      : [],
  };
}

function normalizeEdition(value: unknown, expectedRole: Role): Edition | null {
  if (!isObj(value) || value.version !== 1) return null;
  const items = normalizeItems(value.items);
  if (items.length === 0) return null;
  return {
    version: 1,
    date: str(value.date),
    role: isRole(value.role) ? value.role : expectedRole,
    generatedAt: str(value.generatedAt),
    headline: str(value.headline).trim(),
    items,
  };
}

function normalizeStats(value: unknown): PulseStat[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isObj)
    .map((s) => ({ label: str(s.label).trim(), share: Math.min(1, Math.max(0, num(s.share))), deltaPt: num(s.deltaPt) }))
    .filter((s) => s.label);
}

function normalizePulse(value: unknown): CreativePulse | null {
  if (!isObj(value) || value.version !== 1) return null;
  const sample = isObj(value.sample) ? value.sample : {};
  return {
    version: 1,
    generatedAt: str(value.generatedAt),
    weekStart: str(value.weekStart),
    weekEnd: str(value.weekEnd),
    sample: {
      shards: num(sample.shards),
      totalShards: num(sample.totalShards),
      creatives: num(sample.creatives),
      newThisWeek: num(sample.newThisWeek),
      newPriorWeek: num(sample.newPriorWeek),
    },
    formatMix: normalizeStats(value.formatMix),
    audienceSignals: normalizeStats(value.audienceSignals),
    topLaunchers: Array.isArray(value.topLaunchers)
      ? value.topLaunchers
          .filter(isObj)
          .map((l) => ({
            advertiser: str(l.advertiser).trim(),
            newCreatives: num(l.newCreatives),
            exampleUrl: safeHref(l.exampleUrl) ?? '',
          }))
          .filter((l) => l.advertiser)
      : [],
    longRunners: Array.isArray(value.longRunners)
      ? value.longRunners
          .filter(isObj)
          .map((l) => ({
            advertiser: str(l.advertiser).trim(),
            format: str(l.format).trim(),
            firstShown: str(l.firstShown),
            url: safeHref(l.url) ?? '',
          }))
          .filter((l) => l.advertiser)
      : [],
    insights: strArray(value.insights).map((s) => s.trim()).filter(Boolean),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getLatest(): Promise<Latest | null> {
  return normalizeLatest(await fetchJson('latest.json'));
}

export async function getEdition(role: Role, latest?: Latest | null): Promise<Edition | null> {
  const index = latest === undefined ? await getLatest() : latest;
  const path = index?.editions[role];
  if (!path) return null;
  return normalizeEdition(await fetchJson(path), role);
}

/** All three editions for the current edition date. */
export async function getEditions(latest?: Latest | null): Promise<Record<Role, Edition | null>> {
  const index = latest === undefined ? await getLatest() : latest;
  const editions = await Promise.all(ROLES.map((role) => getEdition(role, index)));
  return Object.fromEntries(ROLES.map((role, i) => [role, editions[i]])) as Record<Role, Edition | null>;
}

export async function getFeed(section: Section, latest?: Latest | null): Promise<Feed | null> {
  const index = latest === undefined ? await getLatest() : latest;
  const raw = await fetchJson(index?.feeds[section] ?? `feed/${section}.json`);
  if (!isObj(raw) || raw.version !== 1) return null;
  return { version: 1, generatedAt: str(raw.generatedAt), items: normalizeItems(raw.items) };
}

export async function getPulse(latest?: Latest | null): Promise<CreativePulse | null> {
  const index = latest === undefined ? await getLatest() : latest;
  const path = index ? index.pulse : 'pulse/latest.json';
  if (!path) return null;
  return normalizePulse(await fetchJson(path));
}
