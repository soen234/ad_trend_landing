'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/', key: 'nav.home' },
    { href: '/guide', key: 'nav.guide' },
    { href: '/blog', key: 'nav.blog' },
    { href: '/news', key: 'nav.news' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 glass border-b border-[var(--color-border)] z-[1000] px-5">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[60px]">
        <Link href="/" className="flex items-center gap-2.5 no-underline text-white">
          <Image
            src="/logo.png"
            alt="TAT"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="font-bold text-lg gradient-text hidden sm:inline">Today Ad Trend</span>
          <span className="font-bold text-lg gradient-text sm:hidden">TAT</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium no-underline transition-colors duration-200 ${
                pathname === item.href
                  ? 'text-[var(--color-accent-green)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-accent-green)]'
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex gap-2">
            <button
              onClick={() => setLang('ko')}
              className={`px-3 py-1.5 border-none rounded-md text-white cursor-pointer text-xs transition-colors ${
                lang === 'ko'
                  ? 'bg-[rgba(74,222,128,0.3)]'
                  : 'bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(74,222,128,0.3)]'
              }`}
            >
              KO
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 border-none rounded-md text-white cursor-pointer text-xs transition-colors ${
                lang === 'en'
                  ? 'bg-[rgba(74,222,128,0.3)]'
                  : 'bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(74,222,128,0.3)]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 bg-transparent border-none cursor-pointer gap-1.5"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-80' : 'max-h-0'}`}>
        <div className="flex flex-col py-4 border-t border-[var(--color-border)]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`py-3 px-4 text-sm font-medium no-underline transition-colors duration-200 ${
                pathname === item.href
                  ? 'text-[var(--color-accent-green)] bg-[rgba(74,222,128,0.1)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-accent-green)] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
