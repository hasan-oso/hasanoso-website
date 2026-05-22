import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb, hasFirebaseConfig } from './config';
import type { Locale } from '@/i18n/settings';

/**
 * Live content overrides — a single Firestore doc the admin edits and the
 * public site optionally merges into next-intl messages on the client.
 *
 * Schema is intentionally narrow. Anything not present in this map falls
 * through to the JSON message files baked into the build.
 */
export type ContentOverride = {
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
  about?: {
    title?: string;
    lede?: string;
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
