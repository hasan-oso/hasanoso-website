'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { createProject } from '@/lib/firebase/projects';
import type { AdminProjectInput } from '@/lib/types/admin';

export default function NewProjectPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: AdminProjectInput) => {
    setSubmitting(true);
    try {
      await createProject(values);
      toast.success('Project created.');
      router.push('/admin/projects');
    } catch (err) {
      toast.error(`Create failed: ${(err as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="serif-display text-3xl text-primary mb-1">
          New project
        </h1>
        <p className="text-secondary text-sm">
          Fill in all three languages. Save when ready.
        </p>
      </header>
      <ProjectForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
