# React (Next.js) 마이그레이션 계획

## 개요

현재 정적 HTML 사이트를 Next.js 14 + TypeScript + Tailwind CSS 구조로 전환합니다.
블로그 콘텐츠는 MDX 파일로 관리하여 별도 백엔드 없이 정적 생성(SSG)합니다.

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| 블로그 | MDX (Contentlayer 또는 next-mdx-remote) |
| 배포 | Vercel |
| 도메인 | todayadtrend.com (기존 유지) |

## 프로젝트 구조

```
today-ad-trend/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 루트 레이아웃 (GNB, Footer)
│   │   ├── page.tsx                # 홈페이지 (index.html)
│   │   ├── guide/
│   │   │   └── page.tsx            # 가이드 페이지
│   │   ├── blog/
│   │   │   ├── page.tsx            # 블로그 목록
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # 블로그 상세 (동적 라우팅)
│   │   └── privacy/
│   │       └── page.tsx            # 개인정보처리방침
│   │
│   ├── components/
│   │   ├── ui/                     # 공통 UI 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Container.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx          # GNB (네비게이션)
│   │   │   ├── Footer.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx            # 히어로 섹션
│   │   │   ├── Features.tsx        # 기능 카드 섹션
│   │   │   └── DownloadButtons.tsx # 앱 다운로드 버튼
│   │   ├── blog/
│   │   │   ├── BlogCard.tsx
│   │   │   └── BlogList.tsx
│   │   └── ads/
│   │       ├── AdBanner.tsx        # 배너 광고
│   │       ├── AdInArticle.tsx     # 인아티클 광고
│   │       └── AdAnchor.tsx        # 앵커 광고
│   │
│   ├── content/
│   │   └── blog/                   # MDX 블로그 포스트
│   │       ├── rewarded-ads-2025.mdx
│   │       └── banner-sizes.mdx
│   │
│   ├── lib/
│   │   ├── mdx.ts                  # MDX 유틸리티
│   │   └── i18n/
│   │       ├── index.ts            # 다국어 설정
│   │       ├── ko.json             # 한국어
│   │       └── en.json             # 영어
│   │
│   ├── hooks/
│   │   └── useLanguage.ts          # 언어 훅
│   │
│   └── styles/
│       └── globals.css             # Tailwind + 전역 스타일
│
├── public/
│   ├── logo.png
│   └── og-image.png                # OG 이미지
│
├── contentlayer.config.ts          # Contentlayer 설정
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── package.json
```

## 마이그레이션 단계

### Phase 1: 프로젝트 초기화

- [ ] Next.js 14 프로젝트 생성 (TypeScript)
- [ ] Tailwind CSS 설정
- [ ] ESLint, Prettier 설정
- [ ] 기본 디렉토리 구조 생성

### Phase 2: 공통 컴포넌트 구현

- [ ] 레이아웃 컴포넌트 (Header, Footer)
- [ ] 다국어 시스템 구현 (i18n)
- [ ] 공통 UI 컴포넌트 (Button, Card, Container)
- [ ] AdSense 광고 컴포넌트

### Phase 3: 페이지 마이그레이션

- [ ] 홈페이지 (index.html → page.tsx)
- [ ] 가이드 페이지 (guide.html → guide/page.tsx)
- [ ] 개인정보처리방침 (privacy-policy.html → privacy/page.tsx)

### Phase 4: 블로그 시스템 구축

- [ ] Contentlayer 또는 next-mdx-remote 설정
- [ ] 블로그 목록 페이지
- [ ] 블로그 상세 페이지 (동적 라우팅)
- [ ] 기존 블로그 포스트 MDX 변환
  - [ ] post-rewarded-ads-2025.html → rewarded-ads-2025.mdx
  - [ ] post-banner-sizes.html → banner-sizes.mdx

### Phase 5: 스타일링 완성

- [ ] 다크 테마 Tailwind 설정
- [ ] 반응형 디자인 적용
- [ ] 애니메이션 및 트랜지션
- [ ] 기존 디자인과 동일하게 매칭

### Phase 6: SEO 및 최적화

- [ ] 메타데이터 설정 (title, description, og:image)
- [ ] sitemap.xml 생성
- [ ] robots.txt 설정
- [ ] 이미지 최적화 (next/image)
- [ ] 성능 최적화

### Phase 7: 배포

- [ ] Vercel 프로젝트 연결
- [ ] 도메인 설정 (todayadtrend.com)
- [ ] 환경변수 설정 (AdSense ID 등)
- [ ] 최종 테스트 및 배포

## 다국어 (i18n) 구현 방식

```typescript
// src/lib/i18n/ko.json
{
  "home": {
    "hero": {
      "title": "TAT",
      "subtitle": "Today Ad Trend",
      "description": "최신 모바일 광고 트렌드를 탐색하세요"
    }
  }
}

// src/lib/i18n/en.json
{
  "home": {
    "hero": {
      "title": "TAT",
      "subtitle": "Today Ad Trend",
      "description": "Explore the latest mobile ad trends"
    }
  }
}
```

Context API를 사용하여 언어 상태 관리:

```typescript
// src/hooks/useLanguage.ts
const LanguageContext = createContext<{
  lang: 'ko' | 'en';
  setLang: (lang: 'ko' | 'en') => void;
  t: (key: string) => string;
}>(...);
```

## MDX 블로그 포스트 형식

```mdx
---
title_ko: "2025년 리워드 광고 트렌드"
title_en: "2025 Rewarded Ads Trends"
description_ko: "리워드 광고의 최신 트렌드와 전망"
description_en: "Latest trends and outlook for rewarded ads"
category: "Trend"
emoji: "🎁"
publishedAt: "2025-01-15"
---

# 콘텐츠 내용...
```

## AdSense 컴포넌트

```typescript
// src/components/ads/AdBanner.tsx
'use client';

export function AdBanner({ slot }: { slot: string }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-8143178103770527"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
```

## 참고사항

- 기존 HTML의 스타일을 최대한 유지하면서 Tailwind로 변환
- 다크 테마 색상: `#0a1929`, `#1a2744`
- 액센트 색상: Green `#4ade80`, Cyan `#22d3ee`
- 최대 너비: `max-w-[900px]`
