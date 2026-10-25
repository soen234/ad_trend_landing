import type { PulseStat } from '@/lib/tat/types';
import { formatDeltaPt, formatShare } from '@/lib/format';

/** "VIDEO" -> "Video"; mixed-case labels are kept as they are. */
export function prettyLabel(label: string): string {
  return label === label.toUpperCase() ? label.charAt(0) + label.slice(1).toLowerCase() : label;
}

interface ShareBarsProps {
  title: string;
  description: string;
  stats: PulseStat[];
}

/**
 * Single-series share bars. Every bar is labelled with its value and week-over-week change,
 * so the color only carries the section identity and the list doubles as the table view.
 */
export default function ShareBars({ title, description, stats }: ShareBarsProps) {
  return (
    <section className="tone-creative rounded-2xl border border-line bg-panel p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-fg">{title}</h2>
      <p className="mt-1 mb-5 text-sm text-subtle">{description}</p>
      {stats.length === 0 ? (
        <p className="text-sm text-subtle">No data this week.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {stats.map((stat) => {
            const pct = Math.round(stat.share * 1000) / 10;
            const delta = formatDeltaPt(stat.deltaPt);
            const direction = stat.deltaPt > 0.05 ? 'up' : stat.deltaPt < -0.05 ? 'down' : 'flat';
            return (
              <li key={stat.label}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[15px]">
                  <span className="text-fg">{prettyLabel(stat.label)}</span>
                  <span className="whitespace-nowrap tabular-nums">
                    <span className="font-semibold text-fg">{formatShare(stat.share)}</span>
                    {delta && (
                      <span className="ml-2 text-[13px] text-subtle">
                        <span aria-hidden="true">{direction === 'up' ? '▲' : direction === 'down' ? '▼' : '•'}</span>{' '}
                        {delta}
                        <span className="sr-only"> vs prior week</span>
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10" aria-hidden="true">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${Math.max(pct, pct > 0 ? 1.5 : 0)}%`, background: 'var(--brand-rose)' }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
