import type { Metadata } from 'next';
import Link from 'next/link';
import { getPulse } from '@/lib/tat/client';
import { EXTERNAL_REL, safeHref } from '@/lib/tat/safe-href';
import { daysBetween, formatCount, formatPostDate } from '@/lib/format';
import ShareBars, { prettyLabel } from '@/components/pulse/ShareBars';
import EmptyState from '@/components/brief/EmptyState';
import AdBanner from '@/components/ads/AdBanner';
import { ArrowUpRightIcon } from '@/components/icons';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Creative Pulse: weekly creative trends',
  description:
    'What advertisers launched this week: format mix, audience approaches, top launchers and long-running ads, estimated from a random sample of the Google Ads Transparency Center.',
  alternates: { canonical: '/pulse' },
};

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  const safe = safeHref(href);
  if (!safe) return <span className="text-faint">{children}</span>;
  return (
    <a
      href={safe}
      target="_blank"
      rel={EXTERNAL_REL}
      className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-rose-text hover:underline"
    >
      {children}
      <ArrowUpRightIcon className="h-4 w-4" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export default async function PulsePage() {
  const pulse = await getPulse();

  const header = (
    <header className="mb-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-rose-text">Weekly · Creative Pulse</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-fg sm:text-4xl">What advertisers launched this week</h1>
      {pulse && (
        <p className="mt-2 text-[15px] text-subtle">
          {formatPostDate(pulse.weekStart)} – {formatPostDate(pulse.weekEnd)}
        </p>
      )}
    </header>
  );

  if (!pulse) {
    return (
      <div className="mx-auto max-w-3xl">
        {header}
        <EmptyState
          title="Creative Pulse is being prepared"
          description="We could not load this week's Creative Pulse right now. It is rebuilt every Monday from the Google Ads Transparency Center, so please check back soon."
        />
      </div>
    );
  }

  const { sample } = pulse;
  const change =
    sample.newPriorWeek > 0 ? Math.round(((sample.newThisWeek - sample.newPriorWeek) / sample.newPriorWeek) * 100) : null;

  return (
    <div className="mx-auto max-w-4xl">
      {header}

      <p className="rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-[15px] leading-relaxed text-fg">
        Estimated from a random sample of {formatCount(sample.creatives)} creatives in the Google Ads Transparency
        Center (EEA and Turkey).
        <span className="mt-1 block text-sm text-subtle">
          {formatCount(sample.newThisWeek)} were first shown this week
          {change !== null && ` (${change >= 0 ? '+' : '−'}${Math.abs(change)}% vs the prior week)`}
          {sample.totalShards > 0 && ` · ${sample.shards} of ${sample.totalShards} data shards sampled`}.
        </span>
      </p>

      {pulse.insights.length > 0 && (
        <section aria-labelledby="insights-heading" className="mt-8">
          <h2 id="insights-heading" className="mb-4 text-xl font-bold text-fg">
            This week in three lines
          </h2>
          <ol className="grid gap-3 p-0 md:grid-cols-3">
            {pulse.insights.map((insight, i) => (
              <li key={i} className="list-none rounded-2xl border border-line bg-panel p-5">
                <span className="tone-creative tone-badge mb-3">Insight {i + 1}</span>
                <p className="text-[15px] leading-relaxed text-fg">{insight}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <ShareBars
          title="Format mix"
          description="Share of creatives first shown this week, by format."
          stats={pulse.formatMix}
        />
        <ShareBars
          title="Audience signals"
          description="Share of new creatives using each audience approach."
          stats={pulse.audienceSignals}
        />
      </div>

      <AdBanner slot="0987654321" />

      <div className="grid gap-4 md:grid-cols-2">
        <section aria-labelledby="launchers-heading" className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
          <h2 id="launchers-heading" className="text-lg font-semibold text-fg">
            Top launchers
          </h2>
          <p className="mt-1 mb-4 text-sm text-subtle">Advertisers with the most new creatives in the sample.</p>
          {pulse.topLaunchers.length === 0 ? (
            <p className="text-sm text-subtle">No data this week.</p>
          ) : (
            <ol className="flex flex-col divide-y divide-white/10 p-0">
              {pulse.topLaunchers.map((launcher, i) => (
                <li key={`${launcher.advertiser}-${i}`} className="flex list-none items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="w-5 shrink-0 text-sm font-semibold tabular-nums text-faint">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium text-fg">{launcher.advertiser}</p>
                    <p className="text-[13px] text-subtle">{formatCount(launcher.newCreatives)} new creatives</p>
                  </div>
                  <ExternalLink href={launcher.exampleUrl}>See ads</ExternalLink>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section aria-labelledby="runners-heading" className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
          <h2 id="runners-heading" className="text-lg font-semibold text-fg">
            Long runners
          </h2>
          <p className="mt-1 mb-4 text-sm text-subtle">Ads still running long after they first appeared.</p>
          {pulse.longRunners.length === 0 ? (
            <p className="text-sm text-subtle">No data this week.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-white/10 p-0">
              {pulse.longRunners.map((runner, i) => {
                const days = daysBetween(runner.firstShown, pulse.weekEnd);
                return (
                  <li key={`${runner.advertiser}-${i}`} className="flex list-none items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-medium text-fg">{runner.advertiser}</p>
                      <p className="text-[13px] text-subtle">
                        {runner.format && <>{prettyLabel(runner.format)} · </>}
                        since {formatPostDate(runner.firstShown)}
                        {days !== null && days > 0 && ` (${formatCount(days)} days)`}
                      </p>
                    </div>
                    <ExternalLink href={runner.url}>View ad</ExternalLink>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <section aria-labelledby="method-heading" className="mt-10 rounded-2xl border border-line p-5 sm:p-6">
        <h2 id="method-heading" className="text-lg font-semibold text-fg">
          How Creative Pulse works
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-subtle">
          Every week we sample shards of the public Google Ads Transparency Center dataset and count the creatives
          first shown during the week. Shares are estimates from that random sample, not a full count, and the dataset
          only covers ads shown in the EEA and Turkey. Advertiser links open the Transparency Center, where you can
          see the ads themselves. The three insights are written by AI from the numbers on this page.
        </p>
        <p className="mt-3 text-sm text-faint">
          Updated {formatPostDate(pulse.generatedAt)} ·{' '}
          <Link href="/brief" className="font-semibold text-signal-text hover:underline">
            Read today&apos;s brief
          </Link>
        </p>
      </section>
    </div>
  );
}
