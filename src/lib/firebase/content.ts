import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb, hasFirebaseConfig } from './config';
import type { Locale } from '@/i18n/settings';

/**
 * Live content overrides — stored in Firestore so the admin can edit
 * any text on the public site without redeploying.
 *
 * Empty fields fall through to the JSON message files baked into the build.
 * Structure mirrors the i18n message keys exactly.
 */
export type ContentOverride = {
  meta?: {
    name?: string;
    title?: string;
    description?: string;
  };
  nav?: {
    home?: string;
    about?: string;
    work?: string;
    contact?: string;
  };
  footer?: {
    tagline?: string;
    rights?: string;
    builtWith?: string;
  };
  hero?: {
    topbar?: string;
    name?: string;
    subtitle?: string;
    intro?: string;
  };
  manifesto?: {
    title?: string;
    body?: string;
    signature?: string;
  };
  currently?: {
    label?: string;
    title?: string;
    'items.one.title'?: string;
    'items.one.summary'?: string;
    'items.one.status'?: string;
    'items.two.title'?: string;
    'items.two.summary'?: string;
    'items.two.status'?: string;
    'items.three.title'?: string;
    'items.three.summary'?: string;
    'items.three.status'?: string;
  };
  selected?: {
    label?: string;
    title?: string;
    subtitle?: string;
    viewAll?: string;
  };
  stack?: {
    label?: string;
    title?: string;
    'groups.lang'?: string;
    'groups.ml'?: string;
    'groups.infra'?: string;
    'groups.ui'?: string;
  };
  about?: {
    label?: string;
    title?: string;
    lede?: string;
    'sections.background.heading'?: string;
    'sections.background.body'?: string;
    'sections.now.heading'?: string;
    'sections.now.body'?: string;
    'sections.approach.heading'?: string;
    'sections.approach.body'?: string;
    'timeline.items.one.year'?: string;
    'timeline.items.one.text'?: string;
    'timeline.items.two.year'?: string;
    'timeline.items.two.text'?: string;
    'timeline.items.three.year'?: string;
    'timeline.items.three.text'?: string;
    'timeline.items.four.year'?: string;
    'timeline.items.four.text'?: string;
  };
  work?: {
    label?: string;
    title?: string;
    subtitle?: string;
    all?: string;
    empty?: string;
  };
  contact?: {
    label?: string;
    title?: string;
    lede?: string;
    'form.name'?: string;
    'form.email'?: string;
    'form.message'?: string;
    'form.submit'?: string;
    'form.namePlaceholder'?: string;
    'form.emailPlaceholder'?: string;
    'form.messagePlaceholder'?: string;
    'direct.label'?: string;
    'direct.email'?: string;
  };
  projectDetail?: {
    role?: string;
    year?: string;
    stack?: string;
    links?: string;
    live?: string;
    repo?: string;
    backToWork?: string;
    summary?: string;
    challenge?: string;
    approach?: string;
    outcome?: string;
  };
  common?: {
    viewWork?: string;
    getInTouch?: string;
    readMore?: string;
    viewProject?: string;
    back?: string;
    scroll?: string;
    loading?: string;
    submitting?: string;
    sent?: string;
    error?: string;
  };
};

export type ContentDoc = Partial<Record<Locale, ContentOverride>> & {
  updatedAt?: unknown;
};

const COLLECTION = 'content';
const DOC_ID = 'overrides';

export async function getContentOverrides(): Promise<ContentDoc | null> {
  if (!hasFirebaseConfig()) return null;
  const db = getFirebaseDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
  if (!snap.exists()) return null;
  return snap.data() as ContentDoc;
}

export async function saveContentOverrides(data: ContentDoc): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firebase not configured.');
  await setDoc(
    doc(db, COLLECTION, DOC_ID),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
}
