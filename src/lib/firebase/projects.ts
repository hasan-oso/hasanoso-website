import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getFirebaseDb } from './config';
import type {
  AdminProject,
  AdminProjectInput,
} from '@/lib/types/admin';

const COLLECTION = 'projects';

function db() {
  const d = getFirebaseDb();
  if (!d) throw new Error('Firestore is not configured.');
  return d;
}

function toProject(id: string, data: Record<string, unknown>): AdminProject {
  return { id, ...(data as Omit<AdminProject, 'id'>) };
}

export async function listAdminProjects(): Promise<AdminProject[]> {
  const snap = await getDocs(
    query(collection(db(), COLLECTION), orderBy('displayOrder', 'asc')),
  );
  return snap.docs.map((d) => toProject(d.id, d.data()));
}

export async function listPublishedProjects(): Promise<AdminProject[]> {
  const snap = await getDocs(
    query(
      collection(db(), COLLECTION),
      where('published', '==', true),
      orderBy('displayOrder', 'asc'),
    ),
  );
  return snap.docs.map((d) => toProject(d.id, d.data()));
}

export async function getAdminProject(id: string): Promise<AdminProject | null> {
  const ref = doc(db(), COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return toProject(snap.id, snap.data());
}

export async function getProjectBySlug(slug: string): Promise<AdminProject | null> {
  const snap = await getDocs(
    query(collection(db(), COLLECTION), where('slug', '==', slug)),
  );
  if (snap.empty) return null;
  const first = snap.docs[0]!;
  return toProject(first.id, first.data());
}

export async function createProject(input: AdminProjectInput): Promise<string> {
  const ref = await addDoc(collection(db(), COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(
  id: string,
  patch: Partial<AdminProjectInput>,
): Promise<void> {
  await updateDoc(doc(db(), COLLECTION, id), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db(), COLLECTION, id));
}
