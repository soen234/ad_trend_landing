'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/site';
import { AppleIcon, PlayIcon } from '@/components/icons';

interface StoreButtonsProps {
  className?: string;
  align?: 'start' | 'center';
}

export default function StoreButtons({ className = '', align = 'start' }: StoreButtonsProps) {
  const { t } = useLanguage();

  const buttons = [
    { href: APP_STORE_URL, Icon: AppleIcon, pre: t('store.appStorePre'), name: 'App Store' },
    { href: PLAY_STORE_URL, Icon: PlayIcon, pre: t('store.playPre'), name: 'Google Play' },
  ];
  const badgeClass =
    'inline-flex min-w-[168px] items-center gap-3 rounded-xl border border-white/20 bg-black px-4 py-2.5 text-white';

  return (
    <div
      className={`flex flex-wrap gap-3 ${align === 'center' ? 'justify-center' : 'justify-start'} ${className}`}
    >
      {buttons.map(({ href, Icon, pre, name }) =>
        href ? (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${badgeClass} transition-colors hover:border-white/50`}
          >
            <Icon className="h-7 w-7 shrink-0" />
            <span className="flex flex-col leading-tight text-left">
              <span className="text-[11px] text-white/80">{pre}</span>
              <span className="text-[17px] font-semibold">{name}</span>
            </span>
          </a>
        ) : (
          <span key={name} className={`${badgeClass} opacity-80`} aria-label={`${name}: ${t('store.comingSoon')}`}>
            <Icon className="h-7 w-7 shrink-0" />
            <span className="flex flex-col leading-tight text-left">
              <span className="text-[11px] text-white/80">{t('store.comingSoon')}</span>
              <span className="text-[17px] font-semibold">{name}</span>
            </span>
          </span>
        )
      )}
    </div>
  );
}
