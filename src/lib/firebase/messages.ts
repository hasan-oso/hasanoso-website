import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type QueryConstraint,
} from 'firebase/firestore';
import { getFirebaseDb } from './config';
import type { AdminMessage, AdminMessageInput } from '@/lib/types/admin';

const COLLECTION = 'messages';

function db() {
  const d = getFirebaseDb();
  if (!d) throw new Error('Firestore is not configured.');
  return d;
}

function toMessage(id: string, data: Record<string, unknown>): AdminMessage {
  return { id, ...(data as Omit<AdminMessage, 'id'>) };
}

export type MessageFilter = 'all' | 'unread' | 'archived';

export async function listMessages(
  filter: MessageFilter = 'all',
  max = 100,
): Promise<AdminMessage[]> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(max)];
  if (filter === 'unread') {
    constraints.unshift(where('read', '==', false), where('archived', '==', false));
  } else if (filter === 'archived') {
    constraints.unshift(where('archived', '==', true));
  }
  const snap = await getDocs(query(collection(db(), COLLECTION), ...constraints));
  return snap.docs.map((d) => toMessage(d.id, d.data()));
}

export async function listRecentMessages(
  max = 5,
): Promise<AdminMessage[]> {
  const snap = await getDocs(
    query(collection(db(), COLLECTION), orderBy('createdAt', 'desc'), limit(max)),
  );
  return snap.docs.map((d) => toMessage(d.id, d.data()));
}

export async function updateMessage(
  id: string,
  patch: Partial<Pick<AdminMessage, 'read' | 'archived'>>,
): Promise<void> {
  await updateDoc(doc(db(), COLLECTION, id), patch);
}

export async function deleteMessage(id: string): Promise<void> {
  await deleteDoc(doc(db(), COLLECTION, id));
}

/**
 * Public-facing: anyone can submit a message via the contact form.
 * Firestore rules must allow `create` on /messages/{id}.
 */
export async function submitMessage(input: AdminMessageInput): Promise<string> {
  const d = getFirebaseDb();
  if (!d) throw new Error('Firestore is not configured.');
  const userAgent =
    typeof navigator !== 'undefined' ? navigator.userAgent : undefined;
  const ref = await addDoc(collection(d, COLLECTION), {
    ...input,
    userAgent: input.userAgent ?? userAgent,
    read: false,
    archived: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}
