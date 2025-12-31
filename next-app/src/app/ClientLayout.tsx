'use client';

import { LanguageProvider } from '@/hooks/useLanguage';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdAnchor from '@/components/ads/AdAnchor';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Header />
      <main className="pt-[100px] px-6 md:px-8 pb-10">
        {children}
        <Footer />
      </main>
      <AdAnchor />
    </LanguageProvider>
  );
}
