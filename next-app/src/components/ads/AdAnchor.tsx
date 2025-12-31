'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdAnchor() {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!closed && window.scrollY > 300) {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [closed]);

  useEffect(() => {
    if (visible) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [visible]);

  if (!visible || closed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 glass border-t border-[var(--color-border)] p-2 z-[1000] text-center">
      <button
        onClick={() => {
          setClosed(true);
          document.body.style.paddingBottom = '0';
        }}
        className="absolute -top-3 right-3 w-6 h-6 bg-[#374151] border-none rounded-full text-white cursor-pointer text-sm flex items-center justify-center hover:bg-[#4b5563]"
        aria-label="Close ad"
      >
        &times;
      </button>
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '320px', height: '50px' }}
        data-ad-client="ca-pub-8143178103770527"
        data-ad-slot="4455667788"
      />
    </div>
  );
}
