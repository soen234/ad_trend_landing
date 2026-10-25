import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import PulseTeaser, { type PulseTeaserData } from '@/components/home/PulseTeaser';
import DownloadCta from '@/components/home/DownloadCta';
import Support from '@/components/home/Support';
import AdBanner from '@/components/ads/AdBanner';
import type { BriefPreviewData } from '@/components/home/BriefPreview';
import { getEdition, getLatest, getPulse } from '@/lib/tat/client';
import { APP_STORE_NAME, APP_STORE_URL, PLAY_STORE_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const PREVIEW_ITEMS = 3;

export default async function Home() {
  const latest = await getLatest();
  const [edition, pulse] = await Promise.all([getEdition('performance', latest), getPulse(latest)]);

  // Only what the client components need, to keep the page payload small.
  const preview: BriefPreviewData | null = edition
    ? {
        date: edition.date,
        headline: edition.headline,
        itemCount: edition.items.length,
        items: edition.items.slice(0, PREVIEW_ITEMS),
      }
    : null;

  const topFormat = pulse?.formatMix.length
    ? pulse.formatMix.reduce((top, stat) => (stat.share > top.share ? stat : top))
    : null;
  const pulseTeaser: PulseTeaserData | null = pulse
    ? {
        weekStart: pulse.weekStart,
        topFormat: topFormat ? { label: topFormat.label, share: topFormat.share } : null,
        insight: pulse.insights[0] ?? null,
      }
    : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL, description: SITE_DESCRIPTION },
      {
        '@type': 'MobileApplication',
        name: APP_STORE_NAME,
        operatingSystem: 'iOS, Android',
        applicationCategory: 'NewsApplication',
        description: SITE_DESCRIPTION,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        sameAs: [APP_STORE_URL, PLAY_STORE_URL],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Hero preview={preview} />
      <Features />
      <AdBanner slot="1234567890" format="horizontal" />
      <PulseTeaser pulse={pulseTeaser} />
      <DownloadCta />
      <AdBanner slot="0987654321" format="rectangle" />
      <Support />
    </>
  );
}
