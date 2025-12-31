'use client';

import { useLanguage } from '@/hooks/useLanguage';
import AdBanner from '@/components/ads/AdBanner';

const features = [
  { icon: '📱', titleKey: 'home.bannerAds', descKey: 'home.bannerAdsDesc' },
  { icon: '📺', titleKey: 'home.interstitialAds', descKey: 'home.interstitialAdsDesc' },
  { icon: '🎁', titleKey: 'home.rewardedAds', descKey: 'home.rewardedAdsDesc' },
  { icon: '📸', titleKey: 'home.saveScreenshots', descKey: 'home.saveScreenshotsDesc' },
];

export default function Features() {
  const { t } = useLanguage();

  return (
    <section className="py-16">
      <h2 className="text-center text-3xl font-bold mb-12">{t('home.features')}</h2>

      <div className="features-grid">
        {features.slice(0, 2).map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{t(feature.titleKey)}</h3>
            <p>{t(feature.descKey)}</p>
          </div>
        ))}

        <div style={{ gridColumn: '1 / -1' }}>
          <AdBanner slot="2233445566" layout="in-article" />
        </div>

        {features.slice(2).map((feature, index) => (
          <div key={index + 2} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{t(feature.titleKey)}</h3>
            <p>{t(feature.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
