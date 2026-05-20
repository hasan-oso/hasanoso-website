import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage';
import { getFirebaseStorage } from './config';

function storage() {
  const s = getFirebaseStorage();
  if (!s) throw new Error('Firebase Storage is not configured.');
  return s;
}

export async function uploadImage(
  folder: string,
  file: File,
): Promise<{ url: string; path: string }> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${Date.now()}-${safeName}`;
  const ref = storageRef(storage(), path);
  await uploadBytes(ref, file, { contentType: file.type });
  const url = await getDownloadURL(ref);
  return { url, path };
}

export async function deleteByPath(path: string): Promise<void> {
  await deleteObject(storageRef(storage(), path));
}
