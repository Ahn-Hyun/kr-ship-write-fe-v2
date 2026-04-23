# ai_blog_v1_astro — Astro Static Blog

**Role:** Publishing layer only. Reads AI-generated MDX → renders static HTML → deploys to Cloudflare Pages. No LLM calls here.

## STRUCTURE

```
ai_blog_v1_astro/
├── src/
│   ├── content/blog/*.mdx       # AI-generated posts (YYYY-MM-DD-slug.mdx naming)
│   ├── content.config.ts        # Zod schema — ALL fields validated at build
│   ├── consts.ts                # SITE_TITLE, SITE_DESCRIPTION
│   ├── lib/blog.ts              # getPublishedPosts, getPostsByCategory, getAllTags, etc.
│   ├── pages/
│   │   ├── index.astro          # homepage: 3 stocks + 3 real-estate posts
│   │   ├── blog/[...slug].astro # post detail
│   │   ├── category/[category].astro
│   │   ├── tags/[tag].astro
│   │   ├── rss.xml.js
│   │   └── about, contact, terms, privacy
│   ├── layouts/
│   │   ├── BlogPost.astro
│   │   └── Page.astro
│   ├── components/
│   │   ├── BaseHead.astro       # canonical, OG, Twitter Card, AdSense script
│   │   ├── Header.astro / Footer.astro / HeaderLink.astro
│   │   ├── TableOfContents.astro
│   │   ├── References.astro
│   │   ├── ViewCounter.astro    # calls /api/views KV endpoint
│   │   └── AdSlot.astro
│   └── styles/global.css        # single global stylesheet (no CSS framework)
├── public/
│   ├── images/posts/<slug>/hero.jpg  # written by AI pipeline
│   ├── robots.txt, ads.txt, favicon
│   └── fonts/
├── functions/api/views.ts        # Cloudflare Pages Function: KV-backed GET/POST view counter
├── scripts/                      # tsx dev helpers (never called in CI)
│   ├── generate_post.ts          # scaffold draft MDX
│   ├── generate_image.ts         # copy placeholder hero image
│   └── quality_gate.ts           # content validator (exits 1 on failure)
├── .ai_state/published.json      # committed de-dupe guard (written by AI pipeline)
└── astro.config.mjs              # site=https://ship-write.com, integrations: mdx + sitemap
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add/edit MDX schema fields | `src/content.config.ts` |
| Data fetching / filtering | `src/lib/blog.ts` |
| Homepage layout | `src/pages/index.astro` |
| SEO / meta tags | `src/components/BaseHead.astro` |
| View counter API | `functions/api/views.ts` |
| Site-wide constants | `src/consts.ts` |
| Validate post quality | `npm run quality:gate` |
| Main Entry Points | `src/pages/index.astro`, `src/pages/blog/[...slug].astro`, `src/pages/rss.xml.js` |

## MDX FRONTMATTER SCHEMA (Zod — enforced at `astro build`)

```yaml
title: string                          # REQUIRED
description: string                    # REQUIRED
pubDate: date                          # REQUIRED
category: ["stocks"] | ["real-estate"] # REQUIRED — exactly 1 item, hard-locked enum
tags: [string]                         # optional, default []
references: [url]                      # optional — each must be a valid URL
draft: boolean                         # optional, default false — false = live immediately
heroImage:
  src: string                          # optional
  alt: string                          # optional
seo:
  canonical: url                       # optional
  ogTitle: string                      # optional
  ogDescription: string                # optional
```

## CONVENTIONS

- TypeScript strict mode: extends `astro/tsconfigs/strict` + `strictNullChecks: true`
- ES modules throughout: `"type": "module"` in `package.json`
- No linter — no ESLint, Prettier, Biome, EditorConfig; enforce style manually
- No CSS framework — raw `global.css` only
- Dev scripts run via `tsx` (no compile step)
- Post filenames: `YYYY-MM-DD-kebab-slug.mdx`
- Hero images: `public/images/posts/<slug>/hero.jpg` at 1200×630

## ANTI-PATTERNS (THIS REPO)

- **Adding a new category**: must update BOTH `z.enum(...)` in `content.config.ts` AND the homepage split logic in `pages/index.astro` — schema change alone is not enough
- **`draft: false` is the default** — any post without `draft: true` goes live on next build; set explicitly when scaffolding
- **Never reset `.ai_state/published.json`** — it's the pipeline's de-dupe guard; deleting it causes duplicate posts on next CI run
- **`functions/api/views.ts` requires `VIEW_COUNTERS` KV binding** — not available in `npm run dev`; view counter silently fails locally
- **`npm run quality:gate` is never called in CI** — run it manually before pushing content changes; exits 1 if any post fails
- **No CI for this repo** — Cloudflare Pages auto-deploys on push to `main`; there is no PR build check
- **Editor Settings**: `.vscode/*` configs exist which are nonstandard in a runtime-focused Astro project.

## COMMANDS

```bash
npm run dev           # http://localhost:4321
npm run build         # static build → dist/
npm run preview       # serve dist/ locally

npm run quality:gate  # validate all published posts — run before pushing
npm run generate:post # scaffold a new draft MDX
npm run generate:image # copy placeholder hero image into public/images/posts/<slug>/
```
