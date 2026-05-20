import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getFirebaseDb } from './config';
import type { AdminSkill, AdminSkillInput } from '@/lib/types/admin';

const COLLECTION = 'skills';

function db() {
  const d = getFirebaseDb();
  if (!d) throw new Error('Firestore is not configured.');
  return d;
}

export async function listSkills(): Promise<AdminSkill[]> {
  const snap = await getDocs(
    query(collection(db(), COLLECTION), orderBy('category', 'asc'), orderBy('order', 'asc')),
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AdminSkill, 'id'>) }));
}

export async function createSkill(input: AdminSkillInput): Promise<string> {
  const ref = await addDoc(collection(db(), COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateSkill(
  id: string,
  patch: Partial<AdminSkillInput>,
): Promise<void> {
  await updateDoc(doc(db(), COLLECTION, id), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteSkill(id: string): Promise<void> {
  await deleteDoc(doc(db(), COLLECTION, id));
}
