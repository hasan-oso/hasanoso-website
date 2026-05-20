'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  deleteProject,
  listAdminProjects,
} from '@/lib/firebase/projects';
import type { AdminProject } from '@/lib/types/admin';
import { cn } from '@/lib/utils';

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listAdminProjects();
      setProjects(list);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProject(id);
      toast.success(`Deleted "${name}".`);
      void load();
    } catch (err) {
      toast.error(`Delete failed: ${(err as Error).message}`);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="serif-display text-3xl text-primary mb-1">Projects</h1>
          <p className="text-secondary text-sm">
            {projects.length === 0
              ? 'No projects yet.'
              : `${projects.length} project${projects.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-gold text-bg-base font-medium px-4 py-2 rounded-md hover:bg-gold-warm transition-colors text-sm"
        >
          <Plus size={14} aria-hidden="true" />
          New project
        </Link>
      </header>

      {error ? (
        <p className="text-rose-400 text-sm font-mono">{error}</p>
      ) : null}

      <div className="bg-bg-elevated border border-border-subtle rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-subtle/40 text-tertiary text-[11px] uppercase tracking-widest">
            <tr>
              <th className="text-start font-medium px-4 py-3 w-12">#</th>
              <th className="text-start font-medium px-4 py-3">Name</th>
              <th className="text-start font-medium px-4 py-3 hidden sm:table-cell">
                Status
              </th>
              <th className="text-start font-medium px-4 py-3 hidden md:table-cell">
                Year
              </th>
              <th className="text-start font-medium px-4 py-3 hidden lg:table-cell">
                State
              </th>
              <th className="text-end font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-tertiary font-mono text-sm">
                  Loading…
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-tertiary text-sm">
                  Click <span className="text-gold">New project</span> to add one.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-border-subtle hover:bg-bg-subtle/30 transition-colors"
                >
                  <td className="px-4 py-3 text-tertiary font-mono tabular-nums">
                    {p.displayOrder}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">
                        {p.translations.en?.name ?? p.slug}
                      </span>
                      {p.featured ? (
                        <Star
                          size={12}
                          className="text-gold fill-gold"
                          aria-label="Featured"
                        />
                      ) : null}
                    </div>
                    <div className="text-xs text-tertiary font-mono keep-latin">
                      /{p.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-secondary hidden sm:table-cell">
                    <span className="font-mono text-xs uppercase tracking-widest">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-secondary font-mono text-xs hidden md:table-cell keep-latin">
                    {p.year}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded-sm',
                        p.published
                          ? 'bg-gold/10 text-gold'
                          : 'bg-bg-subtle text-tertiary',
                      )}
                    >
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/admin/projects/edit?id=${p.id}`}
                        className="inline-flex items-center gap-1 text-secondary hover:text-gold transition-colors text-xs font-mono"
                      >
                        <Edit2 size={13} aria-hidden="true" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          void handleDelete(
                            p.id,
                            p.translations.en?.name ?? p.slug,
                          )
                        }
                        className="inline-flex items-center gap-1 text-tertiary hover:text-rose-400 transition-colors text-xs font-mono"
                        aria-label={`Delete ${p.slug}`}
                      >
                        <Trash2 size={13} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
