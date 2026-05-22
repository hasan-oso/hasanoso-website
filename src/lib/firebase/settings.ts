import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb, hasFirebaseConfig } from './config';

export type SiteSettings = {
  /** When true, the public site shows a quiet "site under maintenance" notice. */
  maintenance?: boolean;
  /** Optional override of the contact-form email destination. */
  contactEmail?: string;
  /** Outbound social links. */
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  updatedAt?: unknown;
};

const COLLECTION = 'settings';
const DOC_ID = 'site';

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!hasFirebaseConfig()) return null;
  const db = getFirebaseDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
  if (!snap.exists()) return null;
  return snap.data() as SiteSettings;
}

export async function saveSiteSettings(data: SiteSettings): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firebase not configured.');
  await setDoc(
    doc(db, COLLECTION, DOC_ID),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
}
