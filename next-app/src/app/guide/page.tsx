'use client';

import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import AdBanner from '@/components/ads/AdBanner';

const features = [
  { emoji: '', titleKey: 'guide.bannerAds', descKey: 'guide.bannerAdsShort' },
  { emoji: '', titleKey: 'guide.interstitial', descKey: 'guide.interstitialShort' },
  { emoji: '', titleKey: 'guide.rewarded', descKey: 'guide.rewardedShort' },
  { emoji: '', titleKey: 'guide.screenshot', descKey: 'guide.screenshotShort' },
];

const bannerTypes = [
  { type: 'Banner', size: '320x50', featureKey: 'guide.standardBanner' },
  { type: 'Large Banner', size: '320x100', featureKey: 'guide.greaterVisibility' },
  { type: 'Medium Rectangle', size: '300x250', featureKey: 'guide.idealBetweenContent' },
  { type: 'Adaptive', sizeKey: 'guide.auto', featureKey: 'guide.fitsScreenWidth' },
];

const adComparison = [
  { format: 'Banner', uxKey: 'guide.lowDisruption', ecpmKey: 'guide.low', recommendKey: 'guide.continuousExposure' },
  { format: 'Interstitial', uxKey: 'guide.mediumDisruption', ecpmKey: 'guide.medium', recommendKey: 'guide.screenTransitions' },
  { format: 'Rewarded', uxKey: 'guide.userChoice', ecpmKey: 'guide.high', recommendKey: 'guide.whenOfferingRewards' },
];

export default function GuidePage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-[800px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-[var(--color-border)]">
        <Image src="/logo.png" alt="TAT Logo" width={60} height={60} className="rounded-[14px]" />
        <div>
          <h1 className="text-3xl font-bold gradient-text">{t('guide.title')}</h1>
          <p className="text-[var(--color-muted)] text-sm">{t('guide.subtitle')}</p>
        </div>
      </div>

      <AdBanner slot="1234567890" />

      {/* Introduction */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-br from-[var(--color-accent-green)] to-[var(--color-accent-cyan)] rounded-[10px] flex items-center justify-center text-xl"></span>
          {t('guide.introTitle')}
        </h2>
        <p className="text-[var(--color-muted)] mb-4">{t('guide.introDesc')}</p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-5">
          {features.map((f, i) => (
            <div key={i} className="card p-5 text-center">
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h4 className="text-base font-semibold mb-2">{t(f.titleKey)}</h4>
              <p className="text-sm text-[var(--color-muted)]">{t(f.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Getting Started */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-br from-[var(--color-accent-green)] to-[var(--color-accent-cyan)] rounded-[10px] flex items-center justify-center text-xl"></span>
          {t('guide.gettingStarted')}
        </h2>
        <p className="text-[var(--color-muted)] mb-4">{t('guide.gettingStartedDesc')}</p>

        <ul className="space-y-3">
          {['downloadApp', 'launchApp', 'exploreTabs'].map((step, i) => (
            <li key={step} className="card p-4 flex items-start gap-3">
              <span className="w-7 h-7 bg-gradient-to-br from-[var(--color-accent-green)] to-[var(--color-accent-cyan)] rounded-full flex items-center justify-center font-semibold text-sm text-[var(--color-background)] shrink-0">
                {i + 1}
              </span>
              <div>
                <h4 className="font-semibold mb-1">{t(`guide.${step}Title`)}</h4>
                <p className="text-sm text-[var(--color-muted)]">{t(`guide.${step}Desc`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <AdBanner slot="0987654321" />

      {/* Banner Ads Guide */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-br from-[var(--color-accent-green)] to-[var(--color-accent-cyan)] rounded-[10px] flex items-center justify-center text-xl"></span>
          {t('guide.usingBannerAds')}
        </h2>
        <p className="text-[var(--color-muted)] mb-4">{t('guide.bannerAdsDesc')}</p>

        <table className="w-full border-collapse my-5">
          <thead>
            <tr>
              <th className="p-3 text-left border-b border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-accent-green)] font-semibold">{t('guide.bannerType')}</th>
              <th className="p-3 text-left border-b border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-accent-green)] font-semibold">{t('guide.size')}</th>
              <th className="p-3 text-left border-b border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-accent-green)] font-semibold">{t('guide.features')}</th>
            </tr>
          </thead>
          <tbody>
            {bannerTypes.map((b, i) => (
              <tr key={i}>
                <td className="p-3 border-b border-[var(--color-border)] text-[var(--color-muted)]">{b.type}</td>
                <td className="p-3 border-b border-[var(--color-border)] text-[var(--color-muted)]">{b.sizeKey ? t(b.sizeKey) : b.size}</td>
                <td className="p-3 border-b border-[var(--color-border)] text-[var(--color-muted)]">{t(b.featureKey)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.3)] rounded-xl p-5 my-6">
          <h4 className="text-[var(--color-accent-green)] mb-2 flex items-center gap-2 font-semibold">
            {t('guide.tip')}
          </h4>
          <p className="text-sm text-[var(--color-muted)]">{t('guide.bannerTip')}</p>
        </div>
      </section>

      {/* Ad Format Comparison */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-br from-[var(--color-accent-green)] to-[var(--color-accent-cyan)] rounded-[10px] flex items-center justify-center text-xl"></span>
          {t('guide.adFormatComparison')}
        </h2>
        <p className="text-[var(--color-muted)] mb-4">{t('guide.adFormatComparisonDesc')}</p>

        <table className="w-full border-collapse my-5">
          <thead>
            <tr>
              <th className="p-3 text-left border-b border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-accent-green)] font-semibold">{t('guide.format')}</th>
              <th className="p-3 text-left border-b border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-accent-green)] font-semibold">{t('guide.userExperience')}</th>
              <th className="p-3 text-left border-b border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-accent-green)] font-semibold">eCPM</th>
              <th className="p-3 text-left border-b border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-accent-green)] font-semibold">{t('guide.recommendedFor')}</th>
            </tr>
          </thead>
          <tbody>
            {adComparison.map((row, i) => (
              <tr key={i}>
                <td className="p-3 border-b border-[var(--color-border)] text-[var(--color-muted)]">{row.format}</td>
                <td className="p-3 border-b border-[var(--color-border)] text-[var(--color-muted)]">{t(row.uxKey)}</td>
                <td className="p-3 border-b border-[var(--color-border)] text-[var(--color-muted)]">{t(row.ecpmKey)}</td>
                <td className="p-3 border-b border-[var(--color-border)] text-[var(--color-muted)]">{t(row.recommendKey)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-br from-[var(--color-accent-green)] to-[var(--color-accent-cyan)] rounded-[10px] flex items-center justify-center text-xl"></span>
          {t('guide.faq')}
        </h2>

        <ul className="space-y-3">
          {['adsWontLoad', 'noReward', 'cantSaveScreenshot'].map((faq) => (
            <li key={faq} className="card p-4 flex items-start gap-3">
              <span className="w-7 h-7 bg-gradient-to-br from-[var(--color-accent-green)] to-[var(--color-accent-cyan)] rounded-full flex items-center justify-center font-semibold text-sm text-[var(--color-background)] shrink-0">
                Q
              </span>
              <div>
                <h4 className="font-semibold mb-1">{t(`guide.${faq}Q`)}</h4>
                <p className="text-sm text-[var(--color-muted)]">{t(`guide.${faq}A`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <AdBanner slot="1122334455" />
    </div>
  );
}
