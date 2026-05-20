import type { Timestamp } from 'firebase/firestore';
import type { Locale } from '@/i18n/settings';
import type {
  Project,
  ProjectStatus,
  ProjectTranslation,
} from '@/app/[locale]/projects/_data/projects';

/** Per-locale plain string record (the canonical multi-lang shape). */
export type LocalizedString = Record<Locale, string>;

/* ────────────────────────────────────────────── Projects (admin layer) */

/**
 * Firestore-augmented project: same shape as the public Project type,
 * plus an `id` (Firestore doc id) and optional admin/publishing fields.
 */
export interface AdminProject extends Omit<Project, 'slug'> {
  id: string;
  slug: string;
  published: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type AdminProjectInput = Omit<
  AdminProject,
  'id' | 'createdAt' | 'updatedAt'
>;

export type { Project, ProjectStatus, ProjectTranslation };

/* ──────────────────────────────────────────────────────────────── Skills */

export interface AdminSkill {
  id: string;
  name: string;
  category: string;
  order: number;
  active: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type AdminSkillInput = Omit<
  AdminSkill,
  'id' | 'createdAt' | 'updatedAt'
>;

/* ───────────────────────────────────────────────────────── Content blocks */

export interface AdminContentBlock {
  id: string;
  page: string;
  section: string;
  field: string;
  values: LocalizedString;
  description?: string;
  updatedAt?: Timestamp;
}

export type AdminContentBlockInput = Omit<
  AdminContentBlock,
  'id' | 'updatedAt'
>;

/* ──────────────────────────────────────────────────────── Contact messages */

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  archived: boolean;
  createdAt?: Timestamp;
  userAgent?: string;
}

export type AdminMessageInput = Omit<
  AdminMessage,
  'id' | 'createdAt' | 'read' | 'archived'
>;

/* ─────────────────────────────────────────────────────────────── Settings */

export interface AdminSettings {
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  university: string;
  responseTime: number;
  updatedAt?: Timestamp;
}
