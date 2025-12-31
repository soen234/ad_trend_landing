import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "TAT - Today Ad Trend",
  description: "Explore the latest mobile ad trends and formats",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "TAT - Today Ad Trend",
    description: "Explore the latest mobile ad trends and formats",
    images: ["/logo.png"],
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
      </body>
    </html>
  );
}
