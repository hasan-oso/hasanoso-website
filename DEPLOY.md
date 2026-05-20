# Deploying to Cloudflare Pages

This site is a fully static Next.js export. Cloudflare Pages serves the contents of the `out/` directory directly.

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Hasan Oso personal website"
gh repo create hasanoso/website --public --source=. --remote=origin --push
# or, manually:
#   git remote add origin git@github.com:hasanoso/website.git
#   git branch -M main
#   git push -u origin main
```

> `gh` is the GitHub CLI; install from <https://cli.github.com> if you don't have it.

## 2. Create the Pages project

1. Sign in to <https://dash.cloudflare.com>.
2. Open **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Authorize Cloudflare to access your GitHub account if you haven't already.
4. Pick the `hasanoso/website` repository and click **Begin setup**.

## 3. Build settings

Use these exact values:

| Setting | Value |
| --- | --- |
| Project name | `hasanoso` *(this becomes `hasanoso.pages.dev`)* |
| Production branch | `main` |
| Framework preset | **None** |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | *(leave empty)* |

### Environment variables

| Variable | Value |
| --- | --- |
| `NODE_VERSION` | `20` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | from Firebase console *(optional)* |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | from Firebase console *(optional)* |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | from Firebase console *(optional)* |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | from Firebase console *(optional)* |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | from Firebase console *(optional)* |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | from Firebase console *(optional)* |

Only `NODE_VERSION` is strictly required. Without the Firebase keys the
site still builds and runs — the public pages fall back to the static
project data, the contact form falls back to a `mailto:` draft, and the
`/admin` route shows a "Firebase not configured" screen.

When you're ready to enable the admin and Firestore-backed projects,
follow [FIREBASE.md](./FIREBASE.md) for the Firebase Console steps,
then paste the same `NEXT_PUBLIC_*` values here. Add them for **both
Production and Preview** environments.

Click **Save and Deploy**. The first build takes about 1–2 minutes.

## 4. Verify the deployment

After the build finishes Cloudflare shows a preview URL like `https://hasanoso.pages.dev`. Open it and check:

- [ ] Root `/` redirects to `/en/` (or `/ar/`, `/tr/` if your browser prefers those).
- [ ] All four pages load: `/en/`, `/en/about/`, `/en/projects/`, `/en/contact/`.
- [ ] Arabic page (`/ar/`) is laid out right-to-left and the Cairo font is applied.
- [ ] Turkish characters render correctly on `/tr/` (ı, İ, ü, ç, ş, ö, ğ).
- [ ] The language switcher (top right on desktop, inside the mobile menu) navigates between locales while preserving the current pathname.
- [ ] The contact form's "Send" either records the message in Firestore (if configured) or opens the system mail client with a pre-filled draft (fallback).
- [ ] Mobile menu opens and closes on small screens.
- [ ] Lighthouse scores in DevTools: Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100.
- [ ] (If Firebase is configured) `/admin/login` accepts the registered admin email and redirects to `/admin`.
- [ ] (If Firebase is configured) Edits in `/admin/projects` appear on the public Projects page after the next deploy.

## 5. Custom domain (optional, when ready)

Cloudflare assigns `hasanoso.pages.dev` automatically. To attach a custom domain (e.g. `hasanoso.com`):

1. In the Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter the apex (`hasanoso.com`) and/or `www`.
3. If the domain is already on Cloudflare DNS, the CNAME is created automatically. Otherwise add the CNAME shown to your DNS provider:
   `hasanoso.com CNAME hasanoso.pages.dev`
4. Wait for SSL provisioning (typically <5 minutes).
5. Update these references in the codebase to the new origin and redeploy:
   - `src/app/layout.tsx` — `metadataBase`
   - `src/app/[locale]/layout.tsx` — `metadataBase`
   - `src/app/sitemap.ts` — `BASE_URL`
   - `src/app/[locale]/page.tsx` — Person JSON-LD `url`
   - `public/robots.txt` — `Sitemap:` URL
   - `README.md` — references

## 6. Subsequent deploys

Every push to `main` triggers a production deploy. Pull requests get preview deploys at unique URLs that survive until the PR is closed.

## Notes on Cloudflare Pages specifics

- **`public/_headers`** is honoured by Pages: it adds security headers and long-cache rules for `/_next/static/*`.
- **`public/_redirects`** is included for completeness; the primary root-to-locale redirect happens client-side in `app/page.tsx` so even cached HTML on a CDN edge node works.
- **Asset paths**: `output: 'export'` with `trailingSlash: true` produces directory-style URLs (`/en/about/`), which Pages serves without configuration.
- **Sitemap**: available at `https://hasanoso.pages.dev/sitemap.xml`.

## Rollback

If a deploy breaks something:

1. **Cloudflare dashboard** → Pages project → **Deployments**.
2. Find the last good production deploy and click **Rollback to this deployment**.

That takes effect within seconds — no rebuild required.
