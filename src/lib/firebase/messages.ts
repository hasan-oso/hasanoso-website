import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  type Timestamp,
} from 'firebase/firestore';
import { getFirebaseDb, hasFirebaseConfig } from './config';

export type MessageStatus = 'unread' | 'read' | 'archived';

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  body: string;
  locale: string;
  status: MessageStatus;
  createdAt?: Timestamp | null;
  userAgent?: string;
};

export type SubmitMessageInput = {
  name: string;
  email: string;
  body: string;
  locale: string;
};

const COLLECTION = 'messages';

/**
 * Persists a contact-form submission to Firestore. Returns `'no-config'`
 * when Firebase isn't configured so the UI can fall back to a mailto.
 */
export async function submitMessage(
  input: SubmitMessageInput,
): Promise<'ok' | 'no-config'> {
  if (!hasFirebaseConfig()) return 'no-config';
  const db = getFirebaseDb();
  if (!db) return 'no-config';

  await addDoc(collection(db, COLLECTION), {
    name: input.name.slice(0, 200),
    email: input.email.slice(0, 200),
    body: input.body.slice(0, 5000),
    locale: input.locale,
    status: 'unread' satisfies MessageStatus,
    createdAt: serverTimestamp(),
    userAgent:
      typeof navigator === 'undefined' ? '' : navigator.userAgent.slice(0, 300),
  });
  return 'ok';
}

/** Admin-only: list messages newest first. */
export async function listMessages(): Promise<ContactMessage[]> {
  const db = getFirebaseDb();
  if (!db) return [];
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: String(data.name ?? ''),
      email: String(data.email ?? ''),
      body: String(data.body ?? ''),
      locale: String(data.locale ?? 'en'),
      status: (data.status as MessageStatus) ?? 'unread',
      createdAt: (data.createdAt as Timestamp) ?? null,
      userAgent: String(data.userAgent ?? ''),
    };
  });
}

export async function updateMessageStatus(
  id: string,
  status: MessageStatus,
): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firebase not configured.');
  await updateDoc(doc(db, COLLECTION, id), { status });
}

export async function deleteMessage(id: string): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firebase not configured.');
  await deleteDoc(doc(db, COLLECTION, id));
}
