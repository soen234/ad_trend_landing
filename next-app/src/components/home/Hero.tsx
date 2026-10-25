'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import StoreButtons from '@/components/StoreButtons';
import BriefPreview, { type BriefPreviewData } from './BriefPreview';

export default function Hero({ preview }: { preview: BriefPreviewData | null }) {
  const { t } = useLanguage();

  return (
    <section className="grid items-center gap-10 pt-4 pb-12 md:pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-16">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-signal-text">{t('home.eyebrow')}</p>
        <h1 className="mt-3 text-[34px] font-bold leading-[1.12] tracking-tight text-fg sm:text-5xl lg:text-[52px]">
          {t('home.title')}
        </h1>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-subtle sm:text-lg">{t('home.subtitle')}</p>

        <StoreButtons className="mt-8" />
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Link href="/brief" className="font-semibold text-signal-text hover:underline">
            {t('home.readBrief')} &rarr;
          </Link>
          <span className="text-faint">{t('home.freeNote')}</span>
        </div>
      </div>

      <BriefPreview preview={preview} />
    </section>
  );
}
