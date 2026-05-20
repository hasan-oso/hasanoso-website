# Firebase Setup

The admin dashboard at `/admin` is powered by Firebase. The public site
also reads projects from Firestore at **build time** (with the static TS
file in `src/app/[locale]/projects/_data/projects.ts` as fallback when
Firestore is empty or unreachable).

## 1. Create the Firebase project

1. Go to <https://console.firebase.google.com>.
2. **Create project**: `hasanoso-website`.
3. Region: `europe-west` (or anything close to Syria/Türkiye).
4. **Build → Firestore Database** → start in **production mode**.
5. **Build → Authentication** → enable **Email/Password** provider.
6. **Build → Storage** → enable.
7. **Project settings → Your apps → Add app → Web** → copy the config.

## 2. Add the admin user

**Authentication → Users → Add user**

- Email: `osohasan.ai@gmail.com`
- Password: a strong, saved-securely password.

## 3. Firestore security rules

In **Firestore Database → Rules**, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null
        && request.auth.token.email == 'osohasan.ai@gmail.com';
    }

    match /projects/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /skills/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /content/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /settings/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /messages/{document=**} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
  }
}
```

Click **Publish**.

## 4. Storage security rules

In **Storage → Rules**, paste:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.token.email == 'osohasan.ai@gmail.com';
    }
  }
}
```

## 5. Local env vars

Copy `.env.local.example` to `.env.local` and fill in the values from
**Project settings → Your apps → Web app → Firebase SDK snippet → Config**:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=…
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=…
NEXT_PUBLIC_FIREBASE_PROJECT_ID=…
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=…
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=…
NEXT_PUBLIC_FIREBASE_APP_ID=…
```

Restart `npm run dev`.

> These keys are **public** by design (NEXT_PUBLIC_*). Security is enforced
> by the Firestore rules above — the admin email check prevents writes
> from anyone except the signed-in owner.

## 6. Cloudflare Pages

In your Pages project, **Settings → Environment variables → Add** the
same six `NEXT_PUBLIC_*` vars for both **Production** and **Preview**.

Without those, the site still builds and runs — it falls back to the
static TS project data and the contact form falls back to a `mailto:`
draft. The admin dashboard shows a "Firebase not configured" screen.

## 7. First-time content

When you sign in at `/admin/login` for the first time:

1. **Projects** → click *New project* and add NeuralCheck / ETMA / MolGuard.
   The static TS file in `_data/projects.ts` is a good reference for the
   content shape. Once a project is `published: true`, it will appear on
   the public site after the next build.
2. **Settings** → fill in email / phone / location / social URLs.
3. **Page content** → click *Seed defaults* to create the editable copy
   keys, then fill them in three languages.
4. **Skills** → add the tools you use, grouped by category.

## How the public site picks up admin changes

The public site is statically exported. Admin edits don't appear live —
they appear on the **next build**. Two ways to trigger a rebuild:

- **Manual:** push any commit to `main` (a docs typo, README touch, etc.)
  Cloudflare Pages will rebuild and redeploy in ~1 minute.
- **Automatic:** Cloudflare Pages → **Deploy hooks** → create a hook.
  Then add a small "Publish changes" button to the admin (future work)
  that POSTs to that hook URL after the admin saves.

## Backup

Cloud Firestore data lives in your Firebase project. To export:

1. Firebase Console → Firestore → **⋮ → Export data**
2. Choose a Cloud Storage bucket destination
3. Either trigger manually or schedule daily via Cloud Functions

## Cost

The free Spark tier is comfortably enough for a single-admin portfolio
site (~50K reads/day, ~20K writes/day, 1 GiB stored). You should never
hit the limits unless the contact form is being abused — in which case
add Firebase App Check + reCAPTCHA Enterprise.
