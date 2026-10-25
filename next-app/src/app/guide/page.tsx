'use client';

import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import AdBanner from '@/components/ads/AdBanner';
import StoreButtons from '@/components/StoreButtons';
import { BarsIcon, BulbIcon, ClockIcon, CompassIcon, UsersIcon } from '@/components/icons';

// =============================================================================
// DESIGN SYSTEM
// =============================================================================

const ds = {
  container: 'mx-auto flex max-w-4xl flex-col gap-16',
  section: 'flex flex-col',
  sectionHeader: 'mb-4 flex items-center gap-3',
  sectionTitle: 'text-2xl font-bold tracking-tight text-fg',
  sectionDesc: 'mb-6 text-[16px] leading-relaxed text-subtle',

  cardGrid: 'grid grid-cols-2 gap-3 p-0 sm:gap-4 lg:grid-cols-4',
  card: 'list-none rounded-2xl border border-line bg-panel p-4 sm:p-5',
  cardTitle: 'mt-3 text-[16px] font-semibold text-fg',
  cardDesc: 'mt-1 text-[14px] leading-relaxed text-subtle',

  stepList: 'flex flex-col gap-3 p-0',
  stepCard: 'flex list-none items-start gap-4 rounded-2xl border border-line bg-panel p-5',
  stepNumber:
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-signal text-[15px] font-bold text-ink',
  stepTitle: 'mb-1 text-[16px] font-semibold text-fg',
  stepDesc: 'text-[15px] leading-relaxed text-subtle',

  tableWrapper: 'overflow-x-auto rounded-2xl border border-line',
  table: 'w-full min-w-[560px] border-collapse',
  tableHeader: 'border-b border-line bg-panel px-5 py-4 text-left text-[14px] font-semibold text-signal-text',
  tableCell: 'border-b border-line px-5 py-4 text-[15px] text-subtle',

  callout: 'mt-6 rounded-2xl border p-5',
  calloutTitle: 'mb-1 text-[15px] font-semibold',
  calloutDesc: 'text-[15px] leading-relaxed text-subtle',
} as const;

// =============================================================================
// DATA (translation keys)
// =============================================================================

type T = (key: string) => string;

const highlights = [
  { Icon: ClockIcon, tone: 'tone-news', title: 'guide.highlightBrief', desc: 'guide.highlightBriefShort' },
  { Icon: UsersIcon, tone: 'tone-platform', title: 'guide.highlightRoles', desc: 'guide.highlightRolesShort' },
  { Icon: BulbIcon, tone: 'tone-amber', title: 'guide.highlightSoWhat', desc: 'guide.highlightSoWhatShort' },
  { Icon: BarsIcon, tone: 'tone-creative', title: 'guide.highlightPulse', desc: 'guide.highlightPulseShort' },
];

const gettingStartedSteps = [
  { title: 'guide.downloadAppTitle', desc: 'guide.downloadAppDesc' },
  { title: 'guide.chooseRoleTitle', desc: 'guide.chooseRoleDesc' },
  { title: 'guide.setTimeTitle', desc: 'guide.setTimeDesc' },
];

const todaySteps = [
  { title: 'guide.readSummaryTitle', desc: 'guide.readSummaryDesc' },
  { title: 'guide.checkSoWhatTitle', desc: 'guide.checkSoWhatDesc' },
  { title: 'guide.finishTitle', desc: 'guide.finishDesc' },
];

const roleRows = [
  ['guide.rolePerformance', 'guide.rolePerformanceWho', 'guide.rolePerformanceFocus'],
  ['guide.roleUa', 'guide.roleUaWho', 'guide.roleUaFocus'],
  ['guide.roleBrand', 'guide.roleBrandWho', 'guide.roleBrandFocus'],
];

const exploreTabs = [
  { Icon: CompassIcon, tone: 'tone-news', title: 'guide.exploreNews', desc: 'guide.exploreNewsShort' },
  { Icon: CompassIcon, tone: 'tone-platform', title: 'guide.explorePlatforms', desc: 'guide.explorePlatformsShort' },
  { Icon: CompassIcon, tone: 'tone-expert', title: 'guide.exploreExperts', desc: 'guide.exploreExpertsShort' },
  { Icon: BarsIcon, tone: 'tone-creative', title: 'guide.explorePulse', desc: 'guide.explorePulseShort' },
];

const faqs = [
  { q: 'guide.whenPublishedQ', a: 'guide.whenPublishedA' },
  { q: 'guide.noReminderQ', a: 'guide.noReminderA' },
  { q: 'guide.sourcesQ', a: 'guide.sourcesA' },
  { q: 'guide.changeRoleQ', a: 'guide.changeRoleA' },
  { q: 'guide.freeQ', a: 'guide.freeA' },
];

// =============================================================================
// COMPONENTS
// =============================================================================

function Section({ id, title, desc, children }: { id: string; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className={ds.section} aria-labelledby={id}>
      <div className={ds.sectionHeader}>
        <span aria-hidden="true" className="h-6 w-1.5 rounded-full bg-signal" />
        <h2 id={id} className={ds.sectionTitle}>
          {title}
        </h2>
      </div>
      {desc && <p className={ds.sectionDesc}>{desc}</p>}
      {children}
    </section>
  );
}

function CardGrid({ items, t }: { items: typeof highlights; t: T }) {
  return (
    <ul className={ds.cardGrid}>
      {items.map(({ Icon, tone, title, desc }) => (
        <li key={title} className={ds.card}>
          <span className={`tone-icon ${tone}`}>
            <Icon className="h-5 w-5" />
          </span>
          <h3 className={ds.cardTitle}>{t(title)}</h3>
          <p className={ds.cardDesc}>{t(desc)}</p>
        </li>
      ))}
    </ul>
  );
}

function StepList({ steps, t, marker }: { steps: { title: string; desc: string }[]; t: T; marker?: string }) {
  return (
    <ol className={ds.stepList}>
      {steps.map((step, i) => (
        <li key={step.title} className={ds.stepCard}>
          <span className={ds.stepNumber} aria-hidden="true">
            {marker ?? i + 1}
          </span>
          <div className="flex-1 pt-1">
            <h3 className={ds.stepTitle}>{t(step.title)}</h3>
            <p className={ds.stepDesc}>{t(step.desc)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Callout({ tone, title, desc }: { tone: 'green' | 'amber'; title: string; desc: string }) {
  const styles =
    tone === 'green'
      ? { box: 'border-signal/30 bg-signal/[0.08]', title: 'text-signal-text' }
      : { box: 'border-amber/30 bg-amber/[0.08]', title: 'text-amber-text' };
  return (
    <div className={`${ds.callout} ${styles.box}`}>
      <p className={`${ds.calloutTitle} ${styles.title}`}>{title}</p>
      <p className={ds.calloutDesc}>{desc}</p>
    </div>
  );
}

// =============================================================================
// PAGE
// =============================================================================

export default function GuidePage() {
  const { t } = useLanguage();

  return (
    <div className={ds.container}>
      <header className="flex flex-col gap-5 border-b border-line pb-10 sm:flex-row sm:items-center sm:gap-6">
        <Image src="/icon.svg" alt="" width={72} height={72} className="rounded-[18px]" unoptimized priority />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">{t('guide.title')}</h1>
          <p className="mt-2 text-[16px] text-subtle">{t('guide.subtitle')}</p>
        </div>
      </header>

      <Section id="intro" title={t('guide.introTitle')} desc={t('guide.introDesc')}>
        <CardGrid items={highlights} t={t} />
      </Section>

      <Section id="getting-started" title={t('guide.gettingStarted')} desc={t('guide.gettingStartedDesc')}>
        <StepList steps={gettingStartedSteps} t={t} />
        <StoreButtons className="mt-6" />
      </Section>

      <AdBanner slot="1234567890" />

      <Section id="today" title={t('guide.todayTitle')} desc={t('guide.todayDesc')}>
        <StepList steps={todaySteps} t={t} />
      </Section>

      <Section id="roles" title={t('guide.rolesTitle')} desc={t('guide.rolesDesc')}>
        <div className={ds.tableWrapper}>
          <table className={ds.table}>
            <thead>
              <tr>
                <th scope="col" className={ds.tableHeader}>{t('guide.edition')}</th>
                <th scope="col" className={ds.tableHeader}>{t('guide.whoFor')}</th>
                <th scope="col" className={ds.tableHeader}>{t('guide.soWhatFocus')}</th>
              </tr>
            </thead>
            <tbody>
              {roleRows.map(([name, who, focus]) => (
                <tr key={name} className="last:[&>*]:border-b-0">
                  <th scope="row" className={`${ds.tableCell} text-left font-semibold text-fg`}>{t(name)}</th>
                  <td className={ds.tableCell}>{t(who)}</td>
                  <td className={ds.tableCell}>{t(focus)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="explore" title={t('guide.exploreTitle')} desc={t('guide.exploreDesc')}>
        <CardGrid items={exploreTabs} t={t} />
      </Section>

      <AdBanner slot="0987654321" />

      <Section id="saved" title={t('guide.savedTitle')} desc={t('guide.savedDesc')}>
        <Callout tone="green" title={t('guide.tip')} desc={t('guide.savedTip')} />
      </Section>

      <Section id="pulse" title={t('guide.pulseTitle')} desc={t('guide.pulseDesc')}>
        <Callout tone="amber" title={t('guide.note')} desc={t('guide.pulseNote')} />
      </Section>

      <Section id="faq" title={t('guide.faq')}>
        <ul className="flex flex-col gap-3 p-0">
          {faqs.map((faq) => (
            <li key={faq.q} className="list-none">
              <details className="group rounded-2xl border border-line bg-panel p-5 open:bg-panel-hover">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-semibold text-fg [&::-webkit-details-marker]:hidden">
                  {t(faq.q)}
                  <span aria-hidden="true" className="text-xl leading-none text-subtle transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-subtle">{t(faq.a)}</p>
              </details>
            </li>
          ))}
        </ul>
      </Section>

      <AdBanner slot="1122334455" />
    </div>
  );
}
