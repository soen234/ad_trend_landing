'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import type { Item } from '@/lib/tat/types';
import { SECTION_META } from '@/lib/tat/labels';
import { EXTERNAL_REL, internalPath, safeHref } from '@/lib/tat/safe-href';
import { formatLongDate } from '@/lib/format';

export interface BriefPreviewData {
  date: string;
  headline: string;
  itemCount: number;
  items: Item[];
}

function PreviewTitle({ item }: { item: Item }) {
  const href = safeHref(item.url);
  const internal = internalPath(href);
  if (internal) {
    return (
      <Link href={internal} className="hover:text-signal-text">
        {item.title}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel={EXTERNAL_REL} className="hover:text-signal-text">
        {item.title}
      </a>
    );
  }
  return <>{item.title}</>;
}

/** Card with the first items of today's performance edition. Content is English (from the data). */
export default function BriefPreview({ preview }: { preview: BriefPreviewData | null }) {
  const { t } = useLanguage();

  return (
    <div className="relative rounded-3xl border border-line bg-[#0f2236] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-signal-text">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
          </span>
          {t('home.previewLabel')}
        </span>
        <span className="text-xs text-faint">{t('home.previewEdition')}</span>
      </div>

      {preview ? (
        <>
          <p className="text-[13px] text-faint">
            <time dateTime={preview.date}>{formatLongDate(preview.date)}</time>
          </p>
          {preview.headline && (
            <p className="mt-1 text-[17px] font-semibold leading-snug text-fg">{preview.headline}</p>
          )}

          <ol className="mt-4 flex flex-col gap-3 p-0">
            {preview.items.map((item, i) => {
              const soWhat = item.roles.performance.relevance > 0 ? item.roles.performance.soWhat : '';
              const section = SECTION_META[item.section];
              return (
                <li key={item.id} className="list-none rounded-2xl border border-line bg-panel p-4">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs text-faint">
                    <span className="font-bold text-subtle">{i + 1}</span>
                    <span className={`tone-badge ${section.tone}`}>{section.label}</span>
                    {item.source && <span>{item.source}</span>}
                  </div>
                  <p className="text-[15px] font-semibold leading-snug text-fg">
                    <PreviewTitle item={item} />
                  </p>
                  {soWhat && (
                    <p className="mt-2 text-[13px] leading-relaxed text-subtle">
                      <span className="font-bold text-amber-text">{t('home.previewSoWhat')}: </span>
                      {soWhat}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>

          <Link
            href="/brief"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-signal-text hover:underline"
          >
            {t('home.previewSeeAll').replace('{count}', String(preview.itemCount))} &rarr;
          </Link>
        </>
      ) : (
        <div className="py-6">
          <p className="text-lg font-semibold text-fg">{t('home.previewEmptyTitle')}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-subtle">{t('home.previewEmptyDesc')}</p>
        </div>
      )}
    </div>
  );
}
