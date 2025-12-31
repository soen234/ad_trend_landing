'use client';

import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import AdBanner from '@/components/ads/AdBanner';

// =============================================================================
// DESIGN SYSTEM
// =============================================================================

const ds = {
  // Layout
  container: 'flex flex-col gap-20',

  // Section
  section: 'flex flex-col',
  sectionHeader: 'flex items-center gap-4 mb-8',
  sectionIcon: 'w-12 h-12 bg-gradient-to-br from-[var(--color-accent-green)] to-[var(--color-accent-cyan)] rounded-xl flex items-center justify-center text-2xl shrink-0',
  sectionTitle: 'text-2xl font-bold',
  sectionDesc: 'text-[var(--color-muted)] leading-relaxed text-[16px] mb-8',

  // Feature Grid
  featureGrid: 'grid grid-cols-2 md:grid-cols-4 gap-5',
  featureCard: 'bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 text-center hover:border-[var(--color-accent-green)] transition-colors',
  featureEmoji: 'text-[44px] mb-4',
  featureTitle: 'text-[16px] font-semibold mb-2',
  featureDesc: 'text-[14px] text-[var(--color-muted)] leading-relaxed',

  // Step List
  stepList: 'flex flex-col gap-4',
  stepCard: 'bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 flex items-start gap-5 hover:border-[var(--color-accent-green)] transition-colors',
  stepNumber: 'w-11 h-11 bg-gradient-to-br from-[var(--color-accent-green)] to-[var(--color-accent-cyan)] rounded-full flex items-center justify-center font-bold text-[16px] text-[var(--color-background)] shrink-0',
  stepContent: 'flex-1 pt-1',
  stepTitle: 'text-[17px] font-semibold mb-2',
  stepDesc: 'text-[15px] text-[var(--color-muted)] leading-relaxed',

  // Table
  tableWrapper: 'overflow-x-auto rounded-2xl border border-[var(--color-border)]',
  table: 'w-full border-collapse',
  tableHeader: 'py-5 px-6 text-left bg-[var(--color-card)] text-[var(--color-accent-green)] font-semibold text-[15px] border-b border-[var(--color-border)]',
  tableCell: 'py-5 px-6 text-[var(--color-muted)] text-[15px] border-b border-[var(--color-border)] last:border-b-0',

  // Info/Warning Box
  infoBox: 'bg-[rgba(74,222,128,0.08)] border border-[rgba(74,222,128,0.25)] rounded-2xl p-7 mt-8',
  infoBoxHeader: 'flex items-center gap-3 mb-4',
  infoBoxIcon: 'text-xl',
  infoBoxTitle: 'text-[var(--color-accent-green)] font-semibold text-[17px]',
  infoBoxDesc: 'text-[15px] text-[var(--color-muted)] leading-relaxed',

  warningBox: 'bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.25)] rounded-2xl p-7 mt-8',
  warningBoxTitle: 'text-[#fbbf24] font-semibold text-[17px]',
} as const;

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface Feature {
  emoji: string;
  titleKey: string;
  descKey: string;
}

interface Step {
  titleKey: string;
  descKey: string;
}

interface TableRow {
  cells: (string | { key: string })[];
}

interface TableData {
  headers: (string | { key: string })[];
  rows: TableRow[];
}

interface FAQ {
  questionKey: string;
  answerKey: string;
}

// =============================================================================
// DATA
// =============================================================================

const features: Feature[] = [
  { emoji: '📱', titleKey: 'guide.bannerAds', descKey: 'guide.bannerAdsShort' },
  { emoji: '📺', titleKey: 'guide.interstitial', descKey: 'guide.interstitialShort' },
  { emoji: '🎁', titleKey: 'guide.rewarded', descKey: 'guide.rewardedShort' },
  { emoji: '📸', titleKey: 'guide.screenshot', descKey: 'guide.screenshotShort' },
];

const gettingStartedSteps: Step[] = [
  { titleKey: 'guide.downloadAppTitle', descKey: 'guide.downloadAppDesc' },
  { titleKey: 'guide.launchAppTitle', descKey: 'guide.launchAppDesc' },
  { titleKey: 'guide.exploreTabsTitle', descKey: 'guide.exploreTabsDesc' },
];

const bannerTable: TableData = {
  headers: [
    { key: 'guide.bannerType' },
    { key: 'guide.size' },
    { key: 'guide.features' },
  ],
  rows: [
    { cells: ['Banner', '320x50', { key: 'guide.standardBanner' }] },
    { cells: ['Large Banner', '320x100', { key: 'guide.greaterVisibility' }] },
    { cells: ['Medium Rectangle', '300x250', { key: 'guide.idealBetweenContent' }] },
    { cells: ['Adaptive', { key: 'guide.auto' }, { key: 'guide.fitsScreenWidth' }] },
  ],
};

const interstitialSteps: Step[] = [
  { titleKey: 'guide.selectInterstitialTabTitle', descKey: 'guide.selectInterstitialTabDesc' },
  { titleKey: 'guide.waitForAdLoadingTitle', descKey: 'guide.waitForAdLoadingDesc' },
  { titleKey: 'guide.viewTheAdTitle', descKey: 'guide.viewTheAdDesc' },
];

const rewardedSteps: Step[] = [
  { titleKey: 'guide.selectRewardedTabTitle', descKey: 'guide.selectRewardedTabDesc' },
  { titleKey: 'guide.watchTheAdTitle', descKey: 'guide.watchTheAdDesc' },
  { titleKey: 'guide.checkRewardsTitle', descKey: 'guide.checkRewardsDesc' },
];

const screenshotSteps: Step[] = [
  { titleKey: 'guide.findSaveButtonTitle', descKey: 'guide.findSaveButtonDesc' },
  { titleKey: 'guide.grantPermissionTitle', descKey: 'guide.grantPermissionDesc' },
  { titleKey: 'guide.saveCompleteTitle', descKey: 'guide.saveCompleteDesc' },
];

const comparisonTable: TableData = {
  headers: [
    { key: 'guide.format' },
    { key: 'guide.userExperience' },
    'eCPM',
    { key: 'guide.recommendedFor' },
  ],
  rows: [
    { cells: ['Banner', { key: 'guide.lowDisruption' }, { key: 'guide.low' }, { key: 'guide.continuousExposure' }] },
    { cells: ['Interstitial', { key: 'guide.mediumDisruption' }, { key: 'guide.medium' }, { key: 'guide.screenTransitions' }] },
    { cells: ['Rewarded', { key: 'guide.userChoice' }, { key: 'guide.high' }, { key: 'guide.whenOfferingRewards' }] },
  ],
};

const faqs: FAQ[] = [
  { questionKey: 'guide.adsWontLoadQ', answerKey: 'guide.adsWontLoadA' },
  { questionKey: 'guide.noRewardQ', answerKey: 'guide.noRewardA' },
  { questionKey: 'guide.cantSaveScreenshotQ', answerKey: 'guide.cantSaveScreenshotA' },
];

// =============================================================================
// COMPONENTS
// =============================================================================

function SectionHeader({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className={ds.sectionHeader}>
      <span className={ds.sectionIcon}>{emoji}</span>
      <h2 className={ds.sectionTitle}>{title}</h2>
    </div>
  );
}

function FeatureGrid({ items, t }: { items: Feature[]; t: (key: string) => string }) {
  return (
    <div className={ds.featureGrid}>
      {items.map((item, i) => (
        <div key={i} className={ds.featureCard}>
          <div className={ds.featureEmoji}>{item.emoji}</div>
          <h4 className={ds.featureTitle}>{t(item.titleKey)}</h4>
          <p className={ds.featureDesc}>{t(item.descKey)}</p>
        </div>
      ))}
    </div>
  );
}

function StepList({ steps, t }: { steps: Step[]; t: (key: string) => string }) {
  return (
    <div className={ds.stepList}>
      {steps.map((step, i) => (
        <div key={i} className={ds.stepCard}>
          <span className={ds.stepNumber}>{i + 1}</span>
          <div className={ds.stepContent}>
            <h4 className={ds.stepTitle}>{t(step.titleKey)}</h4>
            <p className={ds.stepDesc}>{t(step.descKey)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DataTable({ data, t }: { data: TableData; t: (key: string) => string }) {
  const renderCell = (cell: string | { key: string }) => {
    return typeof cell === 'string' ? cell : t(cell.key);
  };

  return (
    <div className={ds.tableWrapper}>
      <table className={ds.table}>
        <thead>
          <tr>
            {data.headers.map((header, i) => (
              <th key={i} className={ds.tableHeader}>
                {renderCell(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i}>
              {row.cells.map((cell, j) => (
                <td key={j} className={ds.tableCell}>
                  {renderCell(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoBox({ icon, titleKey, descKey, t }: { icon: string; titleKey: string; descKey: string; t: (key: string) => string }) {
  return (
    <div className={ds.infoBox}>
      <div className={ds.infoBoxHeader}>
        <span className={ds.infoBoxIcon}>{icon}</span>
        <h4 className={ds.infoBoxTitle}>{t(titleKey)}</h4>
      </div>
      <p className={ds.infoBoxDesc}>{t(descKey)}</p>
    </div>
  );
}

function WarningBox({ icon, titleKey, descKey, t }: { icon: string; titleKey: string; descKey: string; t: (key: string) => string }) {
  return (
    <div className={ds.warningBox}>
      <div className={ds.infoBoxHeader}>
        <span className={ds.infoBoxIcon}>{icon}</span>
        <h4 className={ds.warningBoxTitle}>{t(titleKey)}</h4>
      </div>
      <p className={ds.infoBoxDesc}>{t(descKey)}</p>
    </div>
  );
}

function FAQList({ items, t }: { items: FAQ[]; t: (key: string) => string }) {
  return (
    <div className={ds.stepList}>
      {items.map((item, i) => (
        <div key={i} className={ds.stepCard}>
          <span className={ds.stepNumber}>Q</span>
          <div className={ds.stepContent}>
            <h4 className={ds.stepTitle}>{t(item.questionKey)}</h4>
            <p className={ds.stepDesc}>{t(item.answerKey)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function GuidePage() {
  const { t } = useLanguage();

  return (
    <div className={ds.container}>
      {/* Header */}
      <header className="flex items-center gap-6 pb-10 border-b border-[var(--color-border)]">
        <Image
          src="/logo.png"
          alt="TAT Logo"
          width={80}
          height={80}
          className="rounded-2xl"
        />
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">{t('guide.title')}</h1>
          <p className="text-[var(--color-muted)] text-[16px]">{t('guide.subtitle')}</p>
        </div>
      </header>

      <AdBanner slot="1234567890" />

      {/* Introduction */}
      <section className={ds.section}>
        <SectionHeader emoji="📖" title={t('guide.introTitle')} />
        <p className={ds.sectionDesc}>{t('guide.introDesc')}</p>
        <FeatureGrid items={features} t={t} />
      </section>

      {/* Getting Started */}
      <section className={ds.section}>
        <SectionHeader emoji="🚀" title={t('guide.gettingStarted')} />
        <p className={ds.sectionDesc}>{t('guide.gettingStartedDesc')}</p>
        <StepList steps={gettingStartedSteps} t={t} />
      </section>

      <AdBanner slot="0987654321" />

      {/* Banner Ads */}
      <section className={ds.section}>
        <SectionHeader emoji="📱" title={t('guide.usingBannerAds')} />
        <p className={ds.sectionDesc}>{t('guide.bannerAdsDesc')}</p>
        <DataTable data={bannerTable} t={t} />
        <InfoBox icon="💡" titleKey="guide.tip" descKey="guide.bannerTip" t={t} />
      </section>

      {/* Interstitial Ads */}
      <section className={ds.section}>
        <SectionHeader emoji="📺" title={t('guide.usingInterstitialAds')} />
        <p className={ds.sectionDesc}>{t('guide.interstitialAdsDesc')}</p>
        <StepList steps={interstitialSteps} t={t} />
        <WarningBox icon="⚠️" titleKey="guide.note" descKey="guide.interstitialNote" t={t} />
      </section>

      {/* Rewarded Ads */}
      <section className={ds.section}>
        <SectionHeader emoji="🎁" title={t('guide.usingRewardedAds')} />
        <p className={ds.sectionDesc}>{t('guide.rewardedAdsDesc')}</p>
        <StepList steps={rewardedSteps} t={t} />
        <InfoBox icon="💡" titleKey="guide.rewardedBenefits" descKey="guide.rewardedBenefitsDesc" t={t} />
      </section>

      {/* Screenshot Feature */}
      <section className={ds.section}>
        <SectionHeader emoji="📸" title={t('guide.screenshotFeature')} />
        <p className={ds.sectionDesc}>{t('guide.screenshotFeatureDesc')}</p>
        <StepList steps={screenshotSteps} t={t} />
      </section>

      <AdBanner slot="5566778899" />

      {/* Ad Format Comparison */}
      <section className={ds.section}>
        <SectionHeader emoji="📊" title={t('guide.adFormatComparison')} />
        <p className={ds.sectionDesc}>{t('guide.adFormatComparisonDesc')}</p>
        <DataTable data={comparisonTable} t={t} />
      </section>

      {/* FAQ */}
      <section className={ds.section}>
        <SectionHeader emoji="❓" title={t('guide.faq')} />
        <FAQList items={faqs} t={t} />
      </section>

      <AdBanner slot="1122334455" />
    </div>
  );
}
