# Today Ad Trend website (todayadtrend.com)

> **Legacy note:** the `supabase/` folder (Edge Functions and SQL migrations) belongs to the old
> Supabase backend. That project no longer exists, and nothing in the folder is deployed or used by
> the site. It is kept for reference only. The blog posts it stored were recovered into
> `next-app/src/content/blog/`.

The marketing site for the Today Ad Trend app ("Today Ad Trend: Ad Briefing"): *What changed in
advertising today — and what it means for you.* It lives in `next-app/` (Next.js 16 App Router,
React 19, Tailwind CSS v4) and is deployed by Vercel from GitHub.

## Pages

| Route | What it shows | Rendering |
| --- | --- | --- |
| `/` | Hero, live preview of today's performance edition, app pitch, store links | static, revalidated hourly |
| `/brief?role=performance\|ua\|brand` | Today's edition for a role, plus recent feed items | dynamic (data cached for 1 h) |
| `/pulse` | Weekly Creative Pulse | static, revalidated hourly |
| `/guide`, `/blog`, `/blog/[slug]`, `/privacy` | App guide, blog, privacy policy | static |
| `/news` | Permanent redirect to `/brief` | |

## Data

Briefing data is static JSON published by the app's pipeline to GitHub Pages:
`DATA_BASE_URL` (default `https://soen234.github.io/today_ad_trend/v1`). The contract types are in
`next-app/src/lib/tat/types.ts` and the client in `next-app/src/lib/tat/client.ts`. Requests use
ISR (`revalidate: 3600`). When the data is missing or the host is down, pages render empty states;
the build never depends on the data host. Links from the data only render if they are absolute
`http(s)` URLs (`safeHref`).

## Development

```bash
cd next-app
npm ci
npm run dev

# Against the bundled fixtures instead of the live data
python3 -m http.server 8787 --directory fixtures   # serves fixtures/v1
DATA_BASE_URL=http://localhost:8787/v1 npm run dev

npm run lint
npm run build
```

## Content and config

- Blog posts: `next-app/src/content/blog/<slug>.md` (frontmatter values are JSON literals).
- Privacy policy: `next-app/src/content/privacy.md`, served at `/privacy` and mirrored in
  `privacy-policy.md` at the repo root. Edit both together.
- Store links and site constants: `next-app/src/lib/site.ts`. `APP_STORE_URL` and `PLAY_STORE_URL`
  are marked `TODO(app-id)` until the store listings are live.
