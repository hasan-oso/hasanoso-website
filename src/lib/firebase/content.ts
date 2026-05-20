import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { getFirebaseDb } from './config';
import type {
  AdminContentBlock,
  AdminContentBlockInput,
} from '@/lib/types/admin';

const COLLECTION = 'content';

function db() {
  const d = getFirebaseDb();
  if (!d) throw new Error('Firestore is not configured.');
  return d;
}

export async function listContentBlocks(): Promise<AdminContentBlock[]> {
  const snap = await getDocs(
    query(collection(db(), COLLECTION), orderBy('page'), orderBy('section'), orderBy('field')),
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<AdminContentBlock, 'id'>),
  }));
}

export async function createContentBlock(
  input: AdminContentBlockInput,
): Promise<string> {
  const ref = await addDoc(collection(db(), COLLECTION), {
    ...input,
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Upsert (create-or-update) a content block by id. Useful for seeding
 * known content keys without checking existence first.
 */
export async function upsertContentBlock(
  id: string,
  input: AdminContentBlockInput,
): Promise<void> {
  await setDoc(
    doc(db(), COLLECTION, id),
    { ...input, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function deleteContentBlock(id: string): Promise<void> {
  await deleteDoc(doc(db(), COLLECTION, id));
}
