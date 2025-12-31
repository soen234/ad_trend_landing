'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="text-center py-10 border-t border-[var(--color-border)] mt-10">
      <p className="text-[var(--color-muted-dark)] text-sm mb-4">
        &copy; 2025 TAT (Today Ad Trend). All rights reserved.
      </p>
      <div className="flex gap-6 justify-center flex-wrap">
        <Link
          href="/guide"
          className="text-[var(--color-muted)] no-underline text-sm transition-colors hover:text-[var(--color-accent-green)]"
        >
          {t('footer.userGuide')}
        </Link>
        <a
          href="https://brave-lifter-325.notion.site/Privacy-Policy-for-TAT-Today-Ad-Trend-2d8662e222b880f4be19c5d43d33de85"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-muted)] no-underline text-sm transition-colors hover:text-[var(--color-accent-green)]"
        >
          {t('footer.privacyPolicy')}
        </a>
        <a
          href="https://brave-lifter-325.notion.site/Terms-of-Service-for-TAT-Today-Ad-Trend-2d8662e222b880b098b6f8e5e4278f6d"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-muted)] no-underline text-sm transition-colors hover:text-[var(--color-accent-green)]"
        >
          {t('footer.termsOfService')}
        </a>
      </div>
    </footer>
  );
}
