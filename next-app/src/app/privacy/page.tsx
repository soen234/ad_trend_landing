import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description:
    'How the Today Ad Trend app and todayadtrend.com handle your information: no accounts, on-device storage, local reminders and non-personalized in-app ads.',
  alternates: { canonical: '/privacy' },
};

// The policy text lives in src/content/privacy.md (mirrored in /privacy-policy.md at the repo root).
const POLICY_FILE = path.join(process.cwd(), 'src/content/privacy.md');

const components: Components = {
  h1: ({ children }) => <h1 className="mb-3 text-3xl font-bold tracking-tight text-fg sm:text-4xl">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-10 mb-3 text-xl font-bold text-fg sm:text-2xl">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-6 mb-2 text-lg font-semibold text-fg">{children}</h3>,
  p: ({ children }) => <p className="mb-4 text-[16px] leading-relaxed text-subtle">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 list-disc space-y-2 pl-6 text-[16px] leading-relaxed text-subtle">{children}</ul>,
  strong: ({ children }) => <strong className="font-semibold text-fg">{children}</strong>,
  a: ({ href, children }) => {
    const external = typeof href === 'string' && /^https?:/.test(href);
    return (
      <a
        href={href}
        className="font-medium text-signal-text underline underline-offset-2 hover:no-underline"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  },
};

export default function PrivacyPage() {
  const policy = fs.readFileSync(POLICY_FILE, 'utf8');

  return (
    <article className="mx-auto max-w-3xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {policy}
      </ReactMarkdown>
    </article>
  );
}
