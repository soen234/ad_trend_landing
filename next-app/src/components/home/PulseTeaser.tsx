'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { formatPostDate, formatShare } from '@/lib/format';
import { BarsIcon } from '@/components/icons';

export interface PulseTeaserData {
  weekStart: string;
  topFormat: { label: string; share: number } | null;
  insight: string | null;
}

export default function PulseTeaser({ pulse }: { pulse: PulseTeaserData | null }) {
  const { t, lang } = useLanguage();
  const formatLabel = (label: string) =>
    label === label.toUpperCase() ? label.charAt(0) + label.slice(1).toLowerCase() : label;

  return (
    <section
      aria-labelledby="pulse-heading"
      className="tone-creative my-8 grid gap-6 rounded-3xl border border-rose/30 bg-rose/[0.06] p-6 sm:p-8 md:grid-cols-[1.2fr_1fr] md:items-center"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-rose-text">{t('home.pulseEyebrow')}</p>
        <h2 id="pulse-heading" className="mt-2 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
          {t('home.pulseTitle')}
        </h2>
        <p className="mt-3 text-[16px] leading-relaxed text-subtle">{t('home.pulseDesc')}</p>
        <Link href="/pulse" className="mt-5 inline-flex items-center gap-1 font-semibold text-rose-text hover:underline">
          {t('home.pulseCta')} &rarr;
        </Link>
      </div>

      {pulse && (pulse.topFormat || pulse.insight) ? (
        <div className="rounded-2xl border border-line bg-ink/60 p-5">
          <p className="text-xs text-faint">
            {t('home.pulseWeek').replace('{date}', formatPostDate(pulse.weekStart, lang))}
          </p>
          {pulse.topFormat && (
            <div className="mt-3">
              <p className="text-sm text-subtle">{t('home.pulseTopFormat')}</p>
              <p className="mt-1 text-3xl font-bold text-fg">
                {formatLabel(pulse.topFormat.label)}{' '}
                <span className="text-rose-text">{formatShare(pulse.topFormat.share)}</span>
              </p>
            </div>
          )}
          {pulse.insight && <p className="mt-4 text-[15px] leading-relaxed text-fg">{pulse.insight}</p>}
        </div>
      ) : (
        <div className="hidden md:flex items-center justify-center text-rose-text/70" aria-hidden="true">
          <BarsIcon className="h-24 w-24" />
        </div>
      )}
    </section>
  );
}
