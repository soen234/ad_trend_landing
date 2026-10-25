import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import ClientLayout from './ClientLayout';
import { POSITIONING, SEO_KEYWORDS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

const DEFAULT_TITLE = `${SITE_NAME}: Daily ad briefing for marketers`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: `${POSITIONING} ${SITE_DESCRIPTION}`,
  keywords: SEO_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  icons: {
    icon: [{ url: '/mark.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ko_KR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: POSITIONING,
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: POSITIONING,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-8143178103770527',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B1B2B',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8143178103770527"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
