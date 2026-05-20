'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Save, Plus, Trash2 } from 'lucide-react';
import {
  createContentBlock,
  deleteContentBlock,
  listContentBlocks,
  upsertContentBlock,
} from '@/lib/firebase/content';
import {
  AdminField,
  adminInputClass,
  adminTextareaClass,
} from '@/components/admin/AdminField';
import type { AdminContentBlock, LocalizedString } from '@/lib/types/admin';
import { locales, type Locale } from '@/i18n/settings';

const SEED_BLOCKS: Array<{
  page: string;
  section: string;
  field: string;
  description: string;
}> = [
  {
    page: 'home',
    section: 'hero',
    field: 'subtitle',
    description: 'Main hero subtitle line under the name.',
  },
  {
    page: 'home',
    section: 'hero',
    field: 'intro',
    description: 'Short intro paragraph on home.',
  },
  {
    page: 'about',
    section: 'now',
    field: 'text',
    description: 'The "Now" card on About.',
  },
  {
    page: 'footer',
    section: 'main',
    field: 'tagline',
    description: 'Footer tagline next to the name.',
  },
];

export default function ContentPage() {
  const [blocks, setBlocks] = useState<AdminContentBlock[]>([]);
  const [drafts, setDrafts] = useState<
    Record<string, { values: LocalizedString; description: string }>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newDraft, setNewDraft] = useState({
    page: '',
    section: '',
    field: '',
    description: '',
    values: { en: '', ar: '', tr: '' } as LocalizedString,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listContentBlocks();
      setBlocks(list);
      const next: typeof drafts = {};
      for (const b of list) {
        next[b.id] = {
          values: { ...b.values },
          description: b.description ?? '',
        };
      }
      setDrafts(next);
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

  const handleSave = async (b: AdminContentBlock) => {
    const draft = drafts[b.id];
    if (!draft) return;
    try {
      await upsertContentBlock(b.id, {
        page: b.page,
        section: b.section,
        field: b.field,
        description: draft.description,
        values: draft.values,
      });
      toast.success(`Saved ${b.page}/${b.section}/${b.field}.`);
      setBlocks((prev) =>
        prev.map((x) =>
          x.id === b.id
            ? { ...x, values: draft.values, description: draft.description }
            : x,
        ),
      );
    } catch (err) {
      toast.error(`Save failed: ${(err as Error).message}`);
    }
  };

  const handleDelete = async (b: AdminContentBlock) => {
    if (!window.confirm(`Delete ${b.page}/${b.section}/${b.field}?`)) return;
    try {
      await deleteContentBlock(b.id);
      toast.success('Deleted.');
      void load();
    } catch (err) {
      toast.error(`Delete failed: ${(err as Error).message}`);
    }
  };

  const handleCreate = async () => {
    if (!newDraft.page || !newDraft.section || !newDraft.field) {
      toast.error('page, section, and field are required.');
      return;
    }
    try {
      await createContentBlock(newDraft);
      toast.success('Created.');
      setShowNew(false);
      setNewDraft({
        page: '',
        section: '',
        field: '',
        description: '',
        values: { en: '', ar: '', tr: '' },
      });
      void load();
    } catch (err) {
      toast.error(`Create failed: ${(err as Error).message}`);
    }
  };

  const seedAll = async () => {
    try {
      await Promise.all(
        SEED_BLOCKS.map((s) =>
          upsertContentBlock(`${s.page}_${s.section}_${s.field}`, {
            ...s,
            values: { en: '', ar: '', tr: '' },
          }),
        ),
      );
      toast.success('Seeded default content keys.');
      void load();
    } catch (err) {
      toast.error(`Seed failed: ${(err as Error).message}`);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="serif-display text-3xl text-primary mb-1">
            Page content
          </h1>
          <p className="text-secondary text-sm max-w-xl">
            Editable copy blocks in all three languages. Changes save to
            Firestore. The public site reads these at build time on next
            deploy.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => void seedAll()}
            className="text-xs font-mono uppercase tracking-widest text-tertiary hover:text-primary px-3 py-2 border border-border-subtle rounded-md"
          >
            Seed defaults
          </button>
          <button
            type="button"
            onClick={() => setShowNew((s) => !s)}
            className="inline-flex items-center gap-2 bg-gold text-bg-base font-medium px-4 py-2 rounded-md hover:bg-gold-warm transition-colors text-sm"
          >
            <Plus size={14} aria-hidden="true" />
            {showNew ? 'Cancel' : 'New block'}
          </button>
        </div>
      </header>

      {showNew ? (
        <section className="bg-bg-elevated border border-border-subtle rounded-lg p-5 space-y-4">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-gold keep-latin">
            New block
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <AdminField label="Page">
              <input
                className={adminInputClass}
                value={newDraft.page}
                onChange={(e) =>
                  setNewDraft((d) => ({ ...d, page: e.target.value }))
                }
                placeholder="home"
              />
            </AdminField>
            <AdminField label="Section">
              <input
                className={adminInputClass}
                value={newDraft.section}
                onChange={(e) =>
                  setNewDraft((d) => ({ ...d, section: e.target.value }))
                }
                placeholder="hero"
              />
            </AdminField>
            <AdminField label="Field">
              <input
                className={adminInputClass}
                value={newDraft.field}
                onChange={(e) =>
                  setNewDraft((d) => ({ ...d, field: e.target.value }))
                }
                placeholder="subtitle"
              />
            </AdminField>
          </div>
          <AdminField label="Description (optional)">
            <input
              className={adminInputClass}
              value={newDraft.description}
              onChange={(e) =>
                setNewDraft((d) => ({ ...d, description: e.target.value }))
              }
              placeholder="What this block controls"
            />
          </AdminField>
          {locales.map((loc) => (
            <AdminField key={loc} label={`Value (${loc.toUpperCase()})`}>
              <textarea
                rows={2}
                dir={loc === 'ar' ? 'rtl' : 'ltr'}
                className={adminTextareaClass}
                value={newDraft.values[loc]}
                onChange={(e) =>
                  setNewDraft((d) => ({
                    ...d,
                    values: { ...d.values, [loc]: e.target.value },
                  }))
                }
              />
            </AdminField>
          ))}
          <button
            type="button"
            onClick={() => void handleCreate()}
            className="inline-flex items-center gap-2 bg-gold text-bg-base font-medium px-4 py-2 rounded-md hover:bg-gold-warm transition-colors text-sm"
          >
            <Save size={14} aria-hidden="true" />
            Create block
          </button>
        </section>
      ) : null}

      {error ? <p className="text-rose-400 text-sm font-mono">{error}</p> : null}

      {loading ? (
        <p className="text-tertiary text-sm font-mono">Loading…</p>
      ) : blocks.length === 0 ? (
        <p className="text-tertiary text-sm">
          No content blocks yet. Click <span className="text-gold">Seed defaults</span> to
          populate a starter set.
        </p>
      ) : (
        <div className="space-y-5">
          {blocks.map((b) => (
            <article
              key={b.id}
              className="bg-bg-elevated border border-border-subtle rounded-lg p-5 space-y-4"
            >
              <header className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-widest text-gold keep-latin">
                    {b.page} / {b.section} / {b.field}
                  </div>
                  <input
                    type="text"
                    value={drafts[b.id]?.description ?? ''}
                    onChange={(e) =>
                      setDrafts((d) => ({
                        ...d,
                        [b.id]: { ...d[b.id]!, description: e.target.value },
                      }))
                    }
                    placeholder="What this block controls"
                    className="mt-1 bg-transparent text-tertiary text-xs focus:outline-none focus:text-primary w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void handleSave(b)}
                    className="inline-flex items-center gap-1.5 text-gold hover:text-gold-warm text-xs font-mono"
                  >
                    <Save size={12} aria-hidden="true" />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(b)}
                    className="text-tertiary hover:text-rose-400"
                    aria-label="Delete block"
                  >
                    <Trash2 size={13} aria-hidden="true" />
                  </button>
                </div>
              </header>
              <div className="grid gap-3 md:grid-cols-3">
                {locales.map((loc) => (
                  <AdminField key={loc} label={`${loc.toUpperCase()}`}>
                    <textarea
                      rows={3}
                      dir={loc === 'ar' ? 'rtl' : 'ltr'}
                      className={adminTextareaClass}
                      value={drafts[b.id]?.values[loc] ?? ''}
                      onChange={(e) =>
                        setDrafts((d) => {
                          const current = d[b.id];
                          if (!current) return d;
                          return {
                            ...d,
                            [b.id]: {
                              ...current,
                              values: {
                                ...current.values,
                                [loc as Locale]: e.target.value,
                              },
                            },
                          };
                        })
                      }
                    />
                  </AdminField>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
