'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();

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
          <span className="font-bold text-lg gradient-text">Today Ad Trend</span>
        </Link>

        <div className="flex gap-8">
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
      </div>
    </nav>
  );
}
