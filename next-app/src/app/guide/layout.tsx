import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User guide',
  description:
    'How to use the Today Ad Trend app: choose your role, set your brief time, read your 3-minute daily ad briefing and explore Creative Pulse.',
  alternates: { canonical: '/guide' },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
