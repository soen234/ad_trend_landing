'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import { CONTACT_EMAIL, TERMS_URL } from '@/lib/site';

const linkClass = 'text-sm text-subtle transition-colors hover:text-signal-text';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-16 border-t border-line pt-10 pb-6">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2.5 text-fg">
            <Image src="/mark.svg" alt="" width={28} height={28} className="rounded-md" unoptimized />
            <span className="font-bold">Today Ad Trend</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-subtle">{t('footer.tagline')}</p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3">
          <Link href="/brief" className={linkClass}>{t('nav.brief')}</Link>
          <Link href="/pulse" className={linkClass}>{t('nav.pulse')}</Link>
          <Link href="/guide" className={linkClass}>{t('footer.userGuide')}</Link>
          <Link href="/blog" className={linkClass}>{t('nav.blog')}</Link>
          <Link href="/privacy" className={linkClass}>{t('footer.privacyPolicy')}</Link>
          <a href={TERMS_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {t('footer.termsOfService')}
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            {t('footer.contact')}
          </a>
        </nav>
      </div>

      <p className="mt-10 text-xs text-faint">
        &copy; 2026 Today Ad Trend (TAT). {t('footer.rights')}
      </p>
    </footer>
  );
}
