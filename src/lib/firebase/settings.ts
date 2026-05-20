import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { getFirebaseDb } from './config';
import type { AdminSettings } from '@/lib/types/admin';

const COLLECTION = 'settings';
const DOC_ID = 'general';

function db() {
  const d = getFirebaseDb();
  if (!d) throw new Error('Firestore is not configured.');
  return d;
}

export const DEFAULT_SETTINGS: AdminSettings = {
  email: 'osohasan.ai@gmail.com',
  phone: '+90 538 074 88 46',
  location: 'Aleppo · Ankara',
  github: 'https://github.com/hasanoso',
  linkedin: 'https://linkedin.com/in/hasanoso',
  university: 'OSTİM Technical University · Ankara',
  responseTime: 48,
};

export async function getSettings(): Promise<AdminSettings> {
  const snap = await getDoc(doc(db(), COLLECTION, DOC_ID));
  if (!snap.exists()) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...(snap.data() as Partial<AdminSettings>) };
}

export async function saveSettings(settings: AdminSettings): Promise<void> {
  await setDoc(
    doc(db(), COLLECTION, DOC_ID),
    { ...settings, updatedAt: serverTimestamp() },
    { merge: true },
  );
}
