'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ProjectForm } from '@/components/admin/ProjectForm';
import {
  deleteProject,
  getAdminProject,
  updateProject,
} from '@/lib/firebase/projects';
import type { AdminProject, AdminProjectInput } from '@/lib/types/admin';

function EditProjectInner() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get('id');
  const [project, setProject] = useState<AdminProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Missing project id.');
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const p = await getAdminProject(id);
        if (!active) return;
        if (!p) {
          setError('Project not found.');
        } else {
          setProject(p);
        }
      } catch (err) {
        if (active) setError((err as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (values: AdminProjectInput) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await updateProject(id, values);
      toast.success('Project updated.');
      router.push('/admin/projects');
    } catch (err) {
      toast.error(`Save failed: ${(err as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteProject(id);
      toast.success('Project deleted.');
      router.push('/admin/projects');
    } catch (err) {
      toast.error(`Delete failed: ${(err as Error).message}`);
    }
  };

  if (loading) {
    return <p className="text-tertiary text-sm font-mono">Loading project…</p>;
  }
  if (error) {
    return <p className="text-rose-400 text-sm font-mono">{error}</p>;
  }
  if (!project) {
    return <p className="text-tertiary text-sm font-mono">Not found.</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="serif-display text-3xl text-primary mb-1">
          Edit · {project.translations.en?.name ?? project.slug}
        </h1>
        <p className="text-secondary text-sm font-mono keep-latin">
          /{project.slug}
        </p>
      </header>
      <ProjectForm
        initial={project}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        submitting={submitting}
      />
    </div>
  );
}

export default function EditProjectPage() {
  return (
    <Suspense
      fallback={<p className="text-tertiary text-sm font-mono">Loading…</p>}
    >
      <EditProjectInner />
    </Suspense>
  );
}
