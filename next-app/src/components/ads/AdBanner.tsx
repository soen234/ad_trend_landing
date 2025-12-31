'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'rectangle' | 'vertical';
  layout?: 'in-article';
  className?: string;
}

export default function AdBanner({ slot, format = 'auto', layout, className = '' }: AdBannerProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  if (layout === 'in-article') {
    return (
      <div className={`ad-container ${className}`}>
        <div className="ad-label">Advertisement</div>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-8143178103770527"
          data-ad-slot={slot}
        />
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`}>
      <div className="ad-label">Advertisement</div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8143178103770527"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
