import { ImageResponse } from 'next/og';
import { POSITIONING, SITE_NAME } from '@/lib/site';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = `${SITE_NAME}: ${POSITIONING}`;

/** The brand mark (signal bars on ink), drawn with flexbox for Satori. */
function Mark({ size }: { size: number }) {
  const u = size / 64;
  const bar = (x: number, y: number, h: number, color: string) => (
    <div
      style={{
        position: 'absolute',
        left: x * u,
        top: y * u,
        width: 8.5 * u,
        height: h * u,
        borderRadius: 2.75 * u,
        background: color,
      }}
    />
  );
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: size,
        height: size,
        borderRadius: 14 * u,
        background: '#0B1B2B',
        border: '2px solid rgba(255,255,255,0.12)',
      }}
    >
      {bar(14.5, 35.5, 14, '#24425C')}
      {bar(27.75, 27, 22.5, '#2F5D80')}
      {bar(40.75, 18.5, 31, '#12B76A')}
      <div
        style={{
          position: 'absolute',
          left: (45 - 3.6) * u,
          top: (12.25 - 3.6) * u,
          width: 7.2 * u,
          height: 7.2 * u,
          borderRadius: 9999,
          background: '#F79009',
        }}
      />
    </div>
  );
}

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(160deg, #10263B 0%, #0B1B2B 55%, #081521 100%)',
          color: '#F2F6F9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Mark size={88} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 40, fontWeight: 700 }}>{SITE_NAME}</div>
            <div style={{ fontSize: 26, color: '#32D583' }}>Daily ad briefing</div>
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, lineHeight: 1.15, maxWidth: 1000 }}>
          {POSITIONING}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, color: '#A9B8C6' }}>
          <div style={{ display: 'flex', color: '#FDB022' }}>3-minute brief</div>
          <div style={{ display: 'flex' }}>·</div>
          <div style={{ display: 'flex' }}>Performance · UA / App · Brand</div>
          <div style={{ display: 'flex', marginLeft: 'auto', color: '#F2F6F9' }}>todayadtrend.com</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
