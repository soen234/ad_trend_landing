'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';

const NAV_ITEMS = [
  { href: '/brief', key: 'nav.brief' },
  { href: '/pulse', key: 'nav.pulse' },
  { href: '/guide', key: 'nav.guide' },
  { href: '/blog', key: 'nav.blog' },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname() ?? '/';
  const { lang, setLang, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const langButton = (code: 'ko' | 'en', label: string) => (
    <button
      type="button"
      onClick={() => setLang(code)}
      aria-pressed={lang === code}
      className={`px-2.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
        lang === code ? 'bg-signal/25 text-fg' : 'bg-white/5 text-subtle hover:bg-white/10 hover:text-fg'
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] glass border-b border-line">
      <div className="mx-auto flex h-[60px] max-w-[1120px] items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-fg" onClick={() => setIsMenuOpen(false)}>
          <Image src="/mark.svg" alt="" width={32} height={32} className="rounded-lg" unoptimized priority />
          <span className="font-bold text-[17px] tracking-tight">
            <span className="hidden sm:inline">Today Ad Trend</span>
            <span className="sm:hidden">TAT</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? 'page' : undefined}
              className={`text-sm font-medium transition-colors ${
                isActive(pathname, item.href) ? 'text-signal-text' : 'text-subtle hover:text-fg'
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex gap-1" role="group" aria-label="Language">
            {langButton('ko', 'KO')}
            {langButton('en', 'EN')}
          </div>

          <Link
            href="/#download"
            className="hidden md:inline-flex items-center rounded-lg bg-signal px-3.5 py-2 text-sm font-bold text-ink transition-colors hover:bg-signal-text"
          >
            {t('nav.getApp')}
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex h-10 w-10 flex-col items-center justify-center gap-1.5 bg-transparent cursor-pointer"
            aria-label={t('nav.menu')}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className={`block h-0.5 w-5 bg-fg transition-all duration-300 ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-fg transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-fg transition-all duration-300 ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-menu"
        className={`md:hidden grid transition-all duration-300 ${isMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="min-h-0 overflow-hidden">
          <nav aria-label="Main" className="flex flex-col border-t border-line py-2">
            {[{ href: '/', key: 'nav.home' }, ...NAV_ITEMS].map((item) => {
              const active = item.href === '/' ? pathname === '/' : isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={isMenuOpen ? undefined : -1}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`px-4 py-3 text-[15px] font-medium transition-colors ${
                    active ? 'bg-signal/10 text-signal-text' : 'text-subtle hover:bg-white/5 hover:text-fg'
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
            <Link
              href="/#download"
              tabIndex={isMenuOpen ? undefined : -1}
              onClick={() => setIsMenuOpen(false)}
              className="mx-4 my-2 rounded-lg bg-signal px-4 py-2.5 text-center text-[15px] font-bold text-ink"
            >
              {t('nav.getApp')}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
