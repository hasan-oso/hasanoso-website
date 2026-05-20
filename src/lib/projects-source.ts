import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { getFirebaseDb, hasFirebaseConfig } from '@/lib/firebase/config';
import {
  projects as staticProjects,
  type Project,
} from '@/app/[locale]/projects/_data/projects';
import type { AdminProject } from '@/lib/types/admin';

const FETCH_TIMEOUT_MS = 5000;

function adminToPublic(p: AdminProject): Project {
  const {
    id: _id,
    published: _published,
    createdAt: _c,
    updatedAt: _u,
    ...rest
  } = p;
  void _id;
  void _published;
  void _c;
  void _u;
  return rest as Project;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race<T>([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore timeout')), ms),
    ),
  ]);
}

async function fetchPublishedAdminProjects(): Promise<AdminProject[] | null> {
  if (!hasFirebaseConfig()) return null;
  const db = getFirebaseDb();
  if (!db) return null;
  try {
    const snap = await withTimeout(
      getDocs(
        query(
          collection(db, 'projects'),
          where('published', '==', true),
          orderBy('displayOrder', 'asc'),
        ),
      ),
      FETCH_TIMEOUT_MS,
    );
    return snap.docs.map(
      (d) => ({ id: d.id, ...(d.data() as Omit<AdminProject, 'id'>) }),
    );
  } catch {
    return null;
  }
}

/**
 * Returns the published project list, with the static TS data as fallback
 * when Firestore is unconfigured, unreachable, or empty.
 */
export async function fetchProjects(): Promise<Project[]> {
  const remote = await fetchPublishedAdminProjects();
  if (remote && remote.length > 0) {
    return remote
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(adminToPublic);
  }
  return [...staticProjects].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
}

export async function fetchProjectBySlug(
  slug: string,
): Promise<Project | null> {
  const remote = await fetchPublishedAdminProjects();
  if (remote) {
    const match = remote.find((p) => p.slug === slug);
    if (match) return adminToPublic(match);
  }
  return staticProjects.find((p) => p.slug === slug) ?? null;
}

export async function fetchAdjacentProjects(slug: string): Promise<{
  prev: Project | null;
  next: Project | null;
}> {
  const list = await fetchProjects();
  const idx = list.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? list[idx - 1] ?? null : null,
    next: idx >= 0 && idx < list.length - 1 ? list[idx + 1] ?? null : null,
  };
}

export async function fetchAllProjectSlugs(): Promise<string[]> {
  const list = await fetchProjects();
  return list.map((p) => p.slug);
}
