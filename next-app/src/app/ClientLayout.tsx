'use client';

import { LanguageProvider } from '@/hooks/useLanguage';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdAnchor from '@/components/ads/AdAnchor';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Header />
      <main className="mx-auto w-full max-w-[1120px] px-4 pt-[84px] pb-10 sm:px-6">
        {children}
        <Footer />
      </main>
      <AdAnchor />
    </LanguageProvider>
  );
}
