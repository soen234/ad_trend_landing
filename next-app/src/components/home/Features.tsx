'use client';

import { useLanguage } from '@/hooks/useLanguage';
import AdBanner from '@/components/ads/AdBanner';

const features = [
  { icon: '', titleKey: 'home.bannerAds', descKey: 'home.bannerAdsDesc' },
  { icon: '', titleKey: 'home.interstitialAds', descKey: 'home.interstitialAdsDesc' },
  { icon: '', titleKey: 'home.rewardedAds', descKey: 'home.rewardedAdsDesc' },
  { icon: '', titleKey: 'home.saveScreenshots', descKey: 'home.saveScreenshotsDesc' },
];

export default function Features() {
  const { t } = useLanguage();

  return (
    <section className="py-16">
      <h2 className="text-center text-3xl font-bold mb-12">{t('home.features')}</h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
        {features.slice(0, 2).map((feature, index) => (
          <div key={index} className="card p-7 text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-accent-green)] to-[var(--color-accent-cyan)] rounded-[14px] flex items-center justify-center mx-auto mb-4 text-3xl">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{t(feature.titleKey)}</h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">{t(feature.descKey)}</p>
          </div>
        ))}

        <div className="col-span-full">
          <AdBanner slot="2233445566" layout="in-article" />
        </div>

        {features.slice(2).map((feature, index) => (
          <div key={index + 2} className="card p-7 text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-accent-green)] to-[var(--color-accent-cyan)] rounded-[14px] flex items-center justify-center mx-auto mb-4 text-3xl">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{t(feature.titleKey)}</h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">{t(feature.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
