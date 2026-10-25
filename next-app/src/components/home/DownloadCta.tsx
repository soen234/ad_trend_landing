'use client';

import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import StoreButtons from '@/components/StoreButtons';

export default function DownloadCta() {
  const { t } = useLanguage();

  return (
    <section
      id="download"
      aria-labelledby="download-heading"
      className="my-8 scroll-mt-24 rounded-3xl border border-signal/30 bg-gradient-to-br from-signal/15 via-panel to-sky/10 p-6 text-center sm:p-10"
    >
      <Image src="/icon.svg" alt="" width={72} height={72} className="mx-auto rounded-[18px]" unoptimized />
      <h2 id="download-heading" className="mx-auto mt-5 max-w-2xl text-2xl font-bold tracking-tight text-fg sm:text-3xl">
        {t('home.downloadTitle')}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-subtle">{t('home.downloadDesc')}</p>
      <StoreButtons className="mt-7" align="center" />
      <p className="mt-4 text-sm text-faint">{t('home.downloadNote')}</p>
    </section>
  );
}
