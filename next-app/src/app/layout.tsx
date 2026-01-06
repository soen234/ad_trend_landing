import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://todayadtrend.com"),
  title: {
    default: "TAT - Today Ad Trend | Mobile Advertising Insights",
    template: "%s | TAT",
  },
  description: "Daily mobile advertising trends, news, and insights. Stay updated with AdTech, MarTech, and monetization strategies for app developers and marketers.",
  keywords: ["mobile advertising", "ad tech", "martech", "app monetization", "eCPM", "rewarded ads", "mobile marketing", "ad trends"],
  authors: [{ name: "TAT - Today Ad Trend" }],
  creator: "TAT",
  publisher: "TAT - Today Ad Trend",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ko_KR",
    url: "https://todayadtrend.com",
    siteName: "TAT - Today Ad Trend",
    title: "TAT - Today Ad Trend | Mobile Advertising Insights",
    description: "Daily mobile advertising trends, news, and insights for app developers and marketers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TAT - Today Ad Trend",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TAT - Today Ad Trend",
    description: "Daily mobile advertising trends, news, and insights.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Google Search Console에서 발급
  },
  other: {
    "google-adsense-account": "ca-pub-8143178103770527",
  },
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
