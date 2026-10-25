import type { Metadata } from 'next';
import Link from 'next/link';
import { getEdition, getFeed, getLatest } from '@/lib/tat/client';
import { DEFAULT_ROLE, ROLE_META, isRole } from '@/lib/tat/labels';
import type { Item, Role, Section } from '@/lib/tat/types';
import { formatLongDate } from '@/lib/format';
import BriefItem from '@/components/brief/BriefItem';
import RoleSwitcher, { briefHref } from '@/components/brief/RoleSwitcher';
import EmptyState from '@/components/brief/EmptyState';
import FeedList from '@/components/brief/FeedList';
import StoreButtons from '@/components/StoreButtons';
import AdBanner from '@/components/ads/AdBanner';
import { CheckIcon } from '@/components/icons';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const EXPLORE_SECTIONS: Section[] = ['platform', 'news', 'expert'];
const EXPLORE_LIMIT = 4;

function readRole(value: string | string[] | undefined): Role {
  const raw = Array.isArray(value) ? value[0] : value;
  return isRole(raw) ? raw : DEFAULT_ROLE;
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const role = readRole((await searchParams).role);
  const title = `Today's ad briefing for ${ROLE_META[role].audience}`;
  const description = `The 5 to 7 advertising stories that matter today for ${ROLE_META[role].audience}, each with a short "so what" for your role. Updated daily.`;
  return {
    title,
    description,
    alternates: { canonical: briefHref(role) },
    openGraph: { title, description, url: briefHref(role) },
  };
}

export default async function BriefPage({ searchParams }: { searchParams: SearchParams }) {
  const role = readRole((await searchParams).role);
  const latest = await getLatest();
  const [edition, feeds] = await Promise.all([
    getEdition(role, latest),
    Promise.all(EXPLORE_SECTIONS.map((section) => (latest ? getFeed(section, latest) : null))),
  ]);

  const inEdition = new Set(edition?.items.map((item) => item.id) ?? []);
  const explore = EXPLORE_SECTIONS.map((section, i) => ({
    section,
    items: (feeds[i]?.items ?? []).filter((item: Item) => !inEdition.has(item.id)).slice(0, EXPLORE_LIMIT),
  }));
  const hasExplore = explore.some((group) => group.items.length > 0);
  const meta = ROLE_META[role];

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-signal-text">Daily brief</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-fg sm:text-4xl">Today&apos;s ad briefing</h1>
        <p className="mt-2 text-[15px] text-subtle">
          {edition ? (
            <>
              <time dateTime={edition.date}>{formatLongDate(edition.date)}</time>
              {' · '}
              {edition.items.length} stories · about 3 minutes
            </>
          ) : (
            'Pick your edition. Each one is chosen and explained for a different marketing role.'
          )}
        </p>
      </header>

      <RoleSwitcher active={role} />
      <p className="mt-3 text-sm text-faint">
        <span className="font-semibold text-subtle">{meta.label}:</span> {meta.description}
      </p>

      {edition ? (
        <>
          {edition.headline && (
            <p className="mt-8 border-l-2 border-signal pl-4 text-lg font-medium leading-relaxed text-fg sm:text-xl">
              {edition.headline}
            </p>
          )}

          <ol className="mt-8 flex flex-col gap-4 p-0" aria-label={`${meta.label} edition`}>
            {edition.items.map((item, i) => (
              <BriefItem key={item.id} item={item} role={role} index={i + 1} />
            ))}
          </ol>

          <section
            aria-label="Done for today"
            className="mt-8 rounded-2xl border border-signal/40 bg-signal/10 p-6 text-center"
          >
            <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-signal text-ink">
              <CheckIcon className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-fg">That&apos;s today&apos;s brief</h2>
            <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-subtle">
              Get tomorrow&apos;s edition with a morning reminder, track your streak and save stories in the app.
            </p>
            <StoreButtons className="mt-5" align="center" />
          </section>
        </>
      ) : (
        <div className="mt-8">
          <EmptyState
            title={latest ? `No ${meta.label.toLowerCase()} edition yet` : "Today's brief is on its way"}
            description={
              latest
                ? 'This edition is not available right now. Try another role, or check back later today.'
                : 'We could not load the latest edition right now. New editions are published every day around 21:00 UTC, so please check back soon.'
            }
          />
        </div>
      )}

      {hasExplore && (
        <>
          <AdBanner slot="1234567890" />
          <section aria-labelledby="explore-heading" className="mt-4">
            <h2 id="explore-heading" className="text-2xl font-bold text-fg">
              Explore
            </h2>
            <p className="mt-1 mb-5 text-[15px] text-subtle">
              More platform updates, news and expert takes from the last two weeks.
            </p>
            <div className="grid gap-4">
              {explore.map((group) => (
                <FeedList key={group.section} section={group.section} items={group.items} />
              ))}
            </div>
            <p className="mt-6 text-sm text-subtle">
              Want this every morning?{' '}
              <Link href="/#download" className="font-semibold text-signal-text hover:underline">
                Get the app
              </Link>
              . Curious what advertisers launch?{' '}
              <Link href="/pulse" className="font-semibold text-signal-text hover:underline">
                See Creative Pulse
              </Link>
              .
            </p>
          </section>
        </>
      )}
    </div>
  );
}
