'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { BarsIcon, BellIcon, BulbIcon, ClockIcon, CompassIcon, UsersIcon } from '@/components/icons';

const FEATURES = [
  { Icon: ClockIcon, tone: 'tone-news', key: 'Brief' },
  { Icon: UsersIcon, tone: 'tone-platform', key: 'Roles' },
  { Icon: BulbIcon, tone: 'tone-amber', key: 'SoWhat' },
  { Icon: CompassIcon, tone: 'tone-expert', key: 'Explore' },
  { Icon: BarsIcon, tone: 'tone-creative', key: 'Pulse' },
  { Icon: BellIcon, tone: 'tone-news', key: 'Reminder' },
];

export default function Features() {
  const { t } = useLanguage();

  return (
    <section aria-labelledby="features-heading" className="py-12">
      <h2 id="features-heading" className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
        {t('home.featuresTitle')}
      </h2>
      <p className="mt-2 max-w-2xl text-[16px] text-subtle">{t('home.featuresSubtitle')}</p>

      <ul className="mt-8 grid gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ Icon, tone, key }) => (
          <li key={key} className="list-none rounded-2xl border border-line bg-panel p-6">
            <span className={`tone-icon ${tone}`}>
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-[17px] font-semibold text-fg">{t(`home.feature${key}Title`)}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-subtle">{t(`home.feature${key}Desc`)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
