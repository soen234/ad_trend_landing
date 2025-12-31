'use client';

import { useLanguage } from '@/hooks/useLanguage';

export default function Support() {
  const { t } = useLanguage();

  return (
    <section className="support">
      <h2>{t('support.title')}</h2>
      <p>{t('support.description')}</p>
      <a href="mailto:soen234@gmail.com?subject=[TAT] Support" className="btn-gradient">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        soen234@gmail.com
      </a>
    </section>
  );
}
