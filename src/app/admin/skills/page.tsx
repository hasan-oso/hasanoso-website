'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  createSkill,
  deleteSkill,
  listSkills,
  updateSkill,
} from '@/lib/firebase/skills';
import { AdminField, adminInputClass } from '@/components/admin/AdminField';
import type { AdminSkill, AdminSkillInput } from '@/lib/types/admin';

const DEFAULT_CATEGORIES = ['Languages', 'AI / ML', 'Mobile', 'Backend', 'Other'];

export default function SkillsPage() {
  const [skills, setSkills] = useState<AdminSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<AdminSkillInput>({
    name: '',
    category: DEFAULT_CATEGORIES[0]!,
    order: 0,
    active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setSkills(await listSkills());
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const grouped = skills.reduce<Record<string, AdminSkill[]>>((acc, s) => {
    const cat = s.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat]!.push(s);
    return acc;
  }, {});

  const categories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...Object.keys(grouped)]),
  );

  const handleAdd = async () => {
    if (!draft.name.trim()) {
      toast.error('Name is required.');
      return;
    }
    setSubmitting(true);
    try {
      await createSkill({ ...draft, name: draft.name.trim() });
      setDraft((d) => ({ ...d, name: '' }));
      toast.success('Skill added.');
      void load();
    } catch (err) {
      toast.error(`Add failed: ${(err as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: string, patch: Partial<AdminSkillInput>) => {
    try {
      await updateSkill(id, patch);
      setSkills((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      );
    } catch (err) {
      toast.error(`Update failed: ${(err as Error).message}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteSkill(id);
      toast.success(`Deleted "${name}".`);
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      toast.error(`Delete failed: ${(err as Error).message}`);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="serif-display text-3xl text-primary mb-1">Skills</h1>
        <p className="text-secondary text-sm">
          Manage the skills list (used in the About page tools section).
        </p>
      </header>

      <section className="bg-bg-elevated border border-border-subtle rounded-lg p-5">
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-gold mb-4 keep-latin">
          Add new
        </h2>
        <div className="grid gap-4 sm:grid-cols-[2fr_1.5fr_auto_auto]">
          <AdminField label="Name" htmlFor="skill-name">
            <input
              id="skill-name"
              className={adminInputClass}
              value={draft.name}
              onChange={(e) =>
                setDraft((d) => ({ ...d, name: e.target.value }))
              }
              placeholder="e.g. Python"
            />
          </AdminField>
          <AdminField label="Category" htmlFor="skill-category">
            <select
              id="skill-category"
              className={adminInputClass}
              value={draft.category}
              onChange={(e) =>
                setDraft((d) => ({ ...d, category: e.target.value }))
              }
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Order" htmlFor="skill-order">
            <input
              id="skill-order"
              type="number"
              min={0}
              className={adminInputClass + ' w-20'}
              value={draft.order}
              onChange={(e) =>
                setDraft((d) => ({ ...d, order: Number(e.target.value) }))
              }
            />
          </AdminField>
          <div className="flex items-end pb-5">
            <button
              type="button"
              onClick={handleAdd}
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-gold text-bg-base font-medium px-4 py-2 rounded-md hover:bg-gold-warm transition-colors disabled:opacity-50 text-sm"
            >
              <Plus size={14} aria-hidden="true" />
              Add
            </button>
          </div>
        </div>
      </section>

      {error ? (
        <p className="text-rose-400 text-sm font-mono">{error}</p>
      ) : null}

      <section className="space-y-6">
        {loading ? (
          <p className="text-tertiary text-sm font-mono">Loading…</p>
        ) : skills.length === 0 ? (
          <p className="text-tertiary text-sm">No skills yet.</p>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div
              key={category}
              className="bg-bg-elevated border border-border-subtle rounded-lg overflow-hidden"
            >
              <header className="px-5 py-3 bg-bg-subtle/40 border-b border-border-subtle">
                <h3 className="font-mono text-[11px] uppercase tracking-widest text-gold keep-latin">
                  {category}
                </h3>
              </header>
              <ul className="divide-y divide-border-subtle">
                {items.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-bg-subtle/30 transition-colors"
                  >
                    <input
                      type="text"
                      value={s.name}
                      onChange={(e) =>
                        setSkills((prev) =>
                          prev.map((sk) =>
                            sk.id === s.id ? { ...sk, name: e.target.value } : sk,
                          ),
                        )
                      }
                      onBlur={(e) =>
                        void handleUpdate(s.id, { name: e.target.value.trim() })
                      }
                      className="flex-1 bg-transparent text-primary text-sm focus:outline-none keep-latin"
                    />
                    <input
                      type="number"
                      value={s.order}
                      onChange={(e) =>
                        setSkills((prev) =>
                          prev.map((sk) =>
                            sk.id === s.id
                              ? { ...sk, order: Number(e.target.value) }
                              : sk,
                          ),
                        )
                      }
                      onBlur={(e) =>
                        void handleUpdate(s.id, { order: Number(e.target.value) })
                      }
                      className="w-16 bg-bg-subtle border border-border-subtle rounded text-primary text-xs px-2 py-1 focus:outline-none focus:border-gold"
                    />
                    <label className="inline-flex items-center gap-1.5 text-xs text-tertiary">
                      <input
                        type="checkbox"
                        checked={s.active}
                        onChange={(e) =>
                          void handleUpdate(s.id, { active: e.target.checked })
                        }
                        className="accent-gold"
                      />
                      active
                    </label>
                    <button
                      type="button"
                      onClick={() => void handleDelete(s.id, s.name)}
                      className="text-tertiary hover:text-rose-400 transition-colors"
                      aria-label={`Delete ${s.name}`}
                    >
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
