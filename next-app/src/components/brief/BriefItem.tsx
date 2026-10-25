import Link from 'next/link';
import type { Item, Role } from '@/lib/tat/types';
import { ROLE_META, SECTION_META, platformLabels } from '@/lib/tat/labels';
import { EXTERNAL_REL, internalPath, safeHref } from '@/lib/tat/safe-href';
import { formatShortDate } from '@/lib/format';
import { ArrowUpRightIcon } from '@/components/icons';

export function SectionBadge({ section }: { section: Item['section'] }) {
  const meta = SECTION_META[section];
  return <span className={`tone-badge ${meta.tone}`}>{meta.label}</span>;
}

interface ItemLinkProps {
  item: Item;
  className?: string;
  children: React.ReactNode;
}

/** Renders the item's link, or plain text when the URL did not pass safeHref(). */
export function ItemLink({ item, className = '', children }: ItemLinkProps) {
  const href = safeHref(item.url);
  const internal = internalPath(href);
  if (internal) {
    return (
      <Link href={internal} className={className}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel={EXTERNAL_REL} className={className}>
        {children}
      </a>
    );
  }
  return <span>{children}</span>;
}

interface BriefItemProps {
  item: Item;
  role: Role;
  index: number;
}

export default function BriefItem({ item, role, index }: BriefItemProps) {
  const take = item.roles[role];
  const soWhat = take && take.relevance > 0 ? take.soWhat : '';
  const platforms = platformLabels(item.platforms);
  const date = formatShortDate(item.publishedAt);
  const href = safeHref(item.url);
  const internal = internalPath(href);

  return (
    <li className="list-none">
      <article className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-faint">
          <span
            aria-hidden="true"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-fg"
          >
            {index}
          </span>
          <SectionBadge section={item.section} />
          {item.source && <span className="text-subtle">{item.source}</span>}
          {date && <time dateTime={item.publishedAt}>{date}</time>}
        </div>

        <h3 className="mb-2 text-[18px] font-semibold leading-snug text-fg sm:text-[19px]">
          <ItemLink item={item} className="transition-colors hover:text-signal-text">
            {item.title}
          </ItemLink>
        </h3>

        {item.summary && <p className="text-[15px] leading-relaxed text-subtle">{item.summary}</p>}

        {soWhat && (
          <div className="so-what mt-4">
            <p className="so-what-label">So what for {ROLE_META[role].audience}</p>
            <p className="text-[15px] leading-relaxed text-fg">{soWhat}</p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {platforms.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5" aria-label="Platforms">
              {platforms.map((p) => (
                <li key={p} className="rounded-md border border-line px-2 py-0.5 text-xs text-subtle">
                  {p}
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}
          {href && (
            <ItemLink
              item={item}
              className="inline-flex items-center gap-1 text-sm font-semibold text-signal-text hover:underline"
            >
              {internal ? 'Open' : 'Read at'} {internal ? 'Creative Pulse' : item.source || 'source'}
              <ArrowUpRightIcon className="h-4 w-4" />
              {!internal && <span className="sr-only">(opens in a new tab)</span>}
            </ItemLink>
          )}
        </div>
      </article>
    </li>
  );
}
