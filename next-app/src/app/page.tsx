import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Support from '@/components/home/Support';
import NewsPreview from '@/components/home/NewsPreview';
import AdBanner from '@/components/ads/AdBanner';

export default function Home() {
  return (
    <>
      <Hero />
      <AdBanner slot="1234567890" format="horizontal" />
      <Features />
      <AdBanner slot="0987654321" format="rectangle" />
      <NewsPreview />
      <Support />
      <div className="ad-container">
        <div className="ad-label">Recommended for you</div>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-format="autorelaxed"
          data-ad-client="ca-pub-8143178103770527"
          data-ad-slot="3344556677"
        />
      </div>
    </>
  );
}
