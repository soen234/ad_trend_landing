import type { Item, Section } from '@/lib/tat/types';
import { SECTION_META } from '@/lib/tat/labels';
import { formatShortDate } from '@/lib/format';
import { ItemLink } from './BriefItem';

interface FeedListProps {
  section: Section;
  items: Item[];
}

/** Compact list of recent feed items (title, source, date). */
export default function FeedList({ section, items }: FeedListProps) {
  const meta = SECTION_META[section];
  return (
    <section aria-labelledby={`feed-${section}`} className={`${meta.tone} rounded-2xl border border-line bg-panel p-5`}>
      <h3 id={`feed-${section}`} className="mb-3 flex items-center gap-2 text-base font-semibold text-fg">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--tone)' }} />
        {meta.heading}
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-subtle">Nothing new here in the last two weeks.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-white/10">
          {items.map((item) => (
            <li key={item.id} className="py-3 first:pt-0 last:pb-0">
              <p className="text-[15px] font-medium leading-snug text-fg">
                <ItemLink item={item} className="hover:text-signal-text">
                  {item.title}
                </ItemLink>
              </p>
              <p className="mt-1 text-[13px] text-faint">
                {[item.source, formatShortDate(item.publishedAt)].filter(Boolean).join(' · ')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
