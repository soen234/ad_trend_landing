'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { CONTACT_EMAIL } from '@/lib/site';

export default function Support() {
  const { t } = useLanguage();

  return (
    <section className="my-8 rounded-3xl border border-line bg-panel p-6 text-center sm:p-10">
      <h2 className="text-2xl font-bold text-fg">{t('support.title')}</h2>
      <p className="mx-auto mt-3 mb-6 max-w-md text-subtle">{t('support.description')}</p>
      <a href={`mailto:${CONTACT_EMAIL}?subject=[TAT] Feedback`} className="btn-gradient">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        {CONTACT_EMAIL}
      </a>
    </section>
  );
}
