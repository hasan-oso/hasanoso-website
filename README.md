# Hasan Oso — Personal Website

A trilingual personal website (English, Arabic, Turkish) for Hasan Oso, AI Engineer.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and `next-intl`. Targets static export for Cloudflare Pages.

## Languages

- **English** — `/en/` (default)
- **Arabic** — `/ar/` (RTL)
- **Turkish** — `/tr/`

On first visit the root path detects the browser's preferred language and redirects to the matching locale. The choice is remembered in the `NEXT_LOCALE` cookie.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14.2 (App Router, `output: 'export'`) |
| Language | TypeScript 5.6, `strict` mode |
| Styling | Tailwind CSS 3.4 |
| Animation | Framer Motion (used sparingly) |
| Icons | Lucide React |
| i18n | next-intl 3 |
| Forms | React Hook Form + Zod |
| Fonts | Playfair Display, Inter, IBM Plex Sans Arabic, JetBrains Mono (via `next/font/google`) |
| Admin / data | Firebase (Auth + Firestore + Storage), react-hot-toast, date-fns |

## Local Development

Prerequisites: **Node.js 20+** and **npm 10+**.

```bash
npm install
cp .env.local.example .env.local   # optional — fill in Firebase keys if you have them
npm run dev
```

Open <http://localhost:3000>. You will be redirected to `/en/`, `/ar/`, or `/tr/` based on your browser's `Accept-Language`.

The site builds and runs perfectly fine without any Firebase config — it
falls back to the static project data in `src/app/[locale]/projects/_data/projects.ts`
and the contact form falls back to a `mailto:` link. The `/admin` route
will show a "Firebase not configured" screen.

Once Firebase is set up, see [FIREBASE.md](./FIREBASE.md) for the full
admin walkthrough.

### Useful scripts

```bash
npm run dev          # start dev server on :3000
npm run build        # build + static export to /out
npm run type-check   # run tsc --noEmit
npm run lint         # run next lint
```

## Project Structure

```
src/
  app/
    layout.tsx              # passthrough root layout (Next.js requirement)
    page.tsx                # client-side language redirector for `/`
    not-found.tsx           # 404 fallback (no locale)
    icon.tsx                # generated favicon (PNG, 64×64)
    apple-icon.tsx          # generated Apple touch icon (180×180)
    opengraph-image.tsx     # generated OG image (1200×630)
    sitemap.ts              # static sitemap.xml generator
    globals.css             # Tailwind base + design tokens
    [locale]/
      layout.tsx            # html/body, fonts, NextIntlClientProvider, dir
      page.tsx              # Home
      about/page.tsx        # About
      projects/page.tsx     # Projects
      contact/page.tsx      # Contact
      not-found.tsx         # localized 404
  components/
    layout/                 # Header, Footer, LanguageSwitcher, MobileMenu
    ui/                     # Card, Button, SectionHeader, Avatar,
                            # CornerBrackets, ChipIllustration, ProjectCard
    sections/               # Hero, AboutContent, ProjectsList, ContactForm
    effects/                # CircuitBackground
  i18n/
    settings.ts             # locales, direction map, display names
    request.ts              # next-intl request config
    navigation.ts           # locale-aware Link / useRouter
    messages/en.json
    messages/ar.json
    messages/tr.json
  lib/utils.ts              # cn() helper
  middleware.ts             # locale detection (dev-time only)
public/
  robots.txt
  _headers                  # Cloudflare Pages security/cache headers
  _redirects                # Cloudflare Pages redirect rules
```

## Design System

Colors, typography, and spacing match the printed business card:

| Token | Value |
| --- | --- |
| `navy` | `#0F1B2D` |
| `navy-light` | `#1A2D4D` |
| `navy-dark` | `#0A1525` |
| `gold` | `#C9A961` |
| `gold-warm` | `#D4AF37` |
| `cream` | `#F4EDE0` |
| `cream-dark` | `#E5D9B8` |

Fonts are loaded with `display: 'swap'` via `next/font/google`:

- Playfair Display — serif headings (Latin)
- Inter — sans body (Latin)
- Cairo — Arabic body & headings
- JetBrains Mono — labels and technical chips

## i18n Notes

- `next-intl` v3 is configured with `localePrefix: 'always'`, so every page lives under `/<locale>/`.
- Server components use `getTranslations({ locale, namespace })` and `unstable_setRequestLocale(locale)` to opt into static rendering.
- Client components use `useTranslations(namespace)`.
- Language switching preserves the current pathname via `next-intl`'s `useRouter().replace(pathname, { locale })`, and also writes the `NEXT_LOCALE` cookie.
- For RTL (Arabic), `dir="rtl"` is set on `<html>`, and the body switches to the `Cairo` font automatically. Latin-only blocks (e.g. the `ENGINEER · BUILDER · RESEARCHER` tagline) opt out with `.tagline-latin` / `.keep-latin`.

## Performance

Output of `npm run build`:

```
Route (app)                              Size     First Load JS
├ ● /[locale]                            ~2.4 kB         160 kB
├ ● /[locale]/about                      ~2.2 kB         147 kB
├ ● /[locale]/contact                    ~25 kB          170 kB   (form + zod)
└ ● /[locale]/projects                   ~1.8 kB         146 kB
+ First Load JS shared by all            87 kB
```

All numbers are below the 200 kB initial-JS target.

## Accessibility

- Single `<h1>` per page.
- All decorative SVGs are `aria-hidden`; informational ones have `role="img"` and `aria-label`.
- Skip-to-content link at the top of every page.
- Focus styles use a visible gold outline.
- Forms have associated `<label>` elements, `aria-invalid`, and `role="alert"` on error messages.
- Colour contrast meets WCAG AA against both the cream and navy surfaces.

## Decisions Made Without Explicit Instruction

A short log of judgement calls during the build:

1. **No actual blog or CV download** — the brief specifies four pages only.
2. **Initials avatar (HO)** is used in About and as the favicon; no portrait photo.
3. **Contact form** opens the user's default mail client (`mailto:`) on submit — no backend in v1, as requested.
4. **OG image, favicon, Apple icon** are rendered at build time using Next.js `ImageResponse`. They share the design language (navy + gold serif "HO").
5. **Root `/` page** is a client-side redirector that respects the `NEXT_LOCALE` cookie, then `navigator.languages`, then falls back to English. There is also a `<meta http-equiv="refresh">` fallback for users with JS disabled.
6. **`public/_headers` and `public/_redirects`** are included for Cloudflare Pages — security headers + long-cache for static assets.

## Known Limitations

- LinkedIn (`linkedin.com/in/hasanoso`) and GitHub (`github.com/hasanoso`) handles are placeholders. Update them when the real profiles exist.
- Project repositories are private — each project card carries an "Available upon request" footer instead of a public link.
- The custom domain `hasanoso.pages.dev` is referenced in metadata; if a custom domain is configured later (e.g. `hasanoso.com`), update `metadataBase`, the sitemap base URL, and the Person JSON-LD `url` field.

## Admin dashboard

Visit `/admin` after configuring Firebase (see [FIREBASE.md](./FIREBASE.md)).
Sign in with the email registered in Firebase Auth. The admin lives in
the same Next.js project under `src/app/admin/*` as client-rendered
pages — they hydrate into static export shells, so they cost nothing
at request time and Cloudflare Pages serves them from the edge.

What's manageable from the admin:

- **Projects** — full CRUD with per-locale rich content
  (overview / problem / approach / outcome / lessons), tech stack,
  repository visibility, featured + display order. The public Projects
  list/detail pages pick up changes on the next build.
- **Skills** — categorized list (Languages / AI · ML / Mobile / Backend).
- **Page Content** — key-value content blocks in EN/AR/TR. (Wiring on
  the public side is opt-in per block; the current site renders from
  `src/i18n/messages/*.json`.)
- **Messages** — inbox for contact-form submissions with read /
  archive / delete / reply actions.
- **Settings** — site-wide contact details, social URLs, university,
  response time.

Public ↔ admin data flow:

| Source | Used by | Update path |
| --- | --- | --- |
| `src/i18n/messages/*.json` | Translation strings | Code change → redeploy |
| `_data/projects.ts` (static) | Public Projects pages — **fallback only** | Code change → redeploy |
| Firestore `projects/*` | Public Projects pages when present | Edit in `/admin/projects` → trigger rebuild |
| Firestore `messages/*` | Contact form submissions | Live (admin reads in real time) |
| Firestore `settings/general` | (Wiring on the public side: opt-in) | Edit in `/admin/settings` |

## Deployment

See [DEPLOY.md](./DEPLOY.md) for Cloudflare Pages instructions and
Firebase env var setup.

---

© Hasan Oso. Built in Ankara.
