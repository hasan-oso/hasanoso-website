# Hasan Oso · Personal OS

Trilingual (EN / AR / TR) personal site with a 3D hero, an editorial public site, and a Firebase-backed admin dashboard. Static export, deployable to any static host (built for Cloudflare Pages).

```
Stack — Next.js 15 · React 19 · Tailwind 4 · TypeScript strict
3D    — Three.js + @react-three/fiber + drei + postprocessing
i18n  — next-intl 3.26
Data  — Firebase 11 (Auth + Firestore + Storage), client-side only
```

The previous site lives, untouched, in [`legacy/`](./legacy/) as a snapshot/fallback.

---

## Commands

```bash
npm install              # one-time
npm run dev              # localhost:3000, locale-detected redirect
npm run build            # produces /out as a static export
npm run preview          # serves /out at localhost:3000
npm run type-check       # tsc --noEmit
npx next lint            # ESLint
```

## Environment

Copy `.env.local.example` → `.env.local` and fill in the Firebase web config.

```
NEXT_PUBLIC_FIREBASE_API_KEY=…
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=…
NEXT_PUBLIC_FIREBASE_PROJECT_ID=…
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=…
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=…
NEXT_PUBLIC_FIREBASE_APP_ID=…
```

These are public client keys; security comes from Firestore rules + the single-admin email gate (`osohasan.ai@gmail.com` in [`src/lib/firebase/config.ts`](./src/lib/firebase/config.ts)).

**Do not** import the Firebase Admin SDK from any client-reachable module.

---

## Architecture

### Routes

```
/                        client redirect to /<best locale>/
/en/  /ar/  /tr/         home (hero + manifesto + currently + selected work + stack)
/<l>/about/              editorial about + timeline
/<l>/work/               sortable project archive
/<l>/work/<slug>/        project detail (15 generated: 5 projects × 3 locales)
/<l>/contact/            neon contact form → Firestore `messages`

/admin/                  dashboard (auth-gated)
/admin/login             Google sign-in
/admin/messages          read / archive / delete contact messages
/admin/content           live text overrides per locale
/admin/settings          site-level toggles
/robots.txt              blocks /admin/*
/sitemap.xml             every public locale route + project slug
```

### Key directories

```
src/
├─ app/
│  ├─ [locale]/          public locale tree (Server Components + LiveContent)
│  ├─ admin/             admin tree, own html/body, AuthProvider + AdminGuard
│  ├─ robots.ts          static robots.txt
│  ├─ sitemap.ts         static sitemap.xml
│  └─ layout.tsx         root passthrough — locale + admin own their own html/body
├─ components/
│  ├─ three/             HeroScene (Canvas + Bloom + ChromaticAberration), BusinessCard3D, ParticleField, GoldRayLights
│  ├─ sections/          Manifesto, Currently, SelectedWork, Stack, SectionLabel
│  ├─ chrome/            Header, Footer, LanguageSwitcher
│  ├─ live/              LiveContentProvider + <LiveText/> for admin-edited copy
│  ├─ admin/             AuthContext, AdminGuard, AdminShell
│  ├─ fx/                CursorGlow, SmoothScroll (Lenis), PageFadeIn
│  └─ ui/                Container, Heading, Button, Reveal
├─ i18n/                 settings, request, navigation, messages/{en,ar,tr}.json
├─ data/projects.ts      static project archive (trilingual)
├─ hooks/                useReducedMotion, useMediaQuery
└─ lib/firebase/         config, auth, messages, content, settings
```

### 3D hero — when does it render?

Defensively. The Canvas only mounts when **both**:

1. viewport is `≥ md` (768px+)
2. `prefers-reduced-motion` is **not** set

Otherwise the page shows [`HeroFallback`](./src/components/three/HeroFallback.tsx), a static SVG. The 3D bundle is loaded with `dynamic({ ssr: false })` so it never appears in the static export HTML.

### Live content overrides

Admin → Content writes to Firestore at `content/overrides`. The public site mounts [`LiveContentProvider`](./src/components/live/LiveContentProvider.tsx) which fetches the doc once and exposes `useLiveOverride(locale, path)`. The [`<LiveText />`](./src/components/live/LiveText.tsx) component renders the override if present, otherwise the server-rendered fallback from the message JSON. Fields supported today: `hero.{topbar,name,subtitle,intro}`, `manifesto.{title,body,signature}`, `about.{title,lede}`.

### Admin security

* Single-email gate: `osohasan.ai@gmail.com` in `src/lib/firebase/config.ts` — `isAdmin()` requires `email === ADMIN_EMAIL` AND `emailVerified`.
* `AdminGuard` enforces it client-side; you must also enforce it server-side via Firestore rules.
* `/admin/*` routes ship `<meta name="robots" content="noindex, nofollow">` and are blocked in `/robots.txt`. Belt + braces.
* Never add the Firebase Admin SDK to this project; all data access is via the client SDK.

---

## Deploy (Cloudflare Pages)

```
Build command:    npm run build
Build output:     out
Node:             20+
Env vars:         NEXT_PUBLIC_FIREBASE_*
```

The export is a flat static tree under `out/`. Drop it onto any static host (Pages, Vercel static, Netlify, S3+CloudFront, GitHub Pages with a base path tweak, etc.).

### Firestore rules

Suggested (not in this repo — apply in the Firebase console):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function isAdmin() {
      return request.auth != null
        && request.auth.token.email_verified == true
        && request.auth.token.email == 'osohasan.ai@gmail.com';
    }

    // Anyone may submit a contact message; only admin may read/manage them.
    match /messages/{id} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }

    // Content + settings: admin write, anyone read (public site needs to render them).
    match /content/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /settings/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

---

## Conventions

* **Server Components by default.** Anything that needs `window`, state, or context is explicitly `'use client'`.
* **Reduced-motion first.** Any motion ships with a static counterpart and a `useReducedMotion` check.
* **Type strictness.** `strict` + `noUncheckedIndexedAccess`. Don't silence with `any`; narrow it.
* **Localisation parity.** Every key in `en.json` must exist in `ar.json` and `tr.json`. RTL is handled by `dir="rtl"` on the `<html>` and `keep-latin` for any island of Latin script inside Arabic copy.
* **No Firebase Admin SDK in this project.** Ever. Use client SDK + Firestore rules.

---

## Roadmap (post-Phase 6)

* OG image generator (static PNG in `/public/og-default.png`).
* Service worker / offline first for slow connections — already a stated value in the manifesto.
* Build-time read of `content/overrides` so override text ships pre-rendered (currently swapped on client).
