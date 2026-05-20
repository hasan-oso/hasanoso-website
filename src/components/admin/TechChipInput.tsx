'use client';

import { useState, type KeyboardEvent } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TechChipInput({
  value,
  onChange,
  label = 'Tech stack',
  placeholder = 'Add technology (Enter or comma to confirm)',
}: {
  value: string[];
  onChange: (next: string[]) => void;
  label?: string;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) {
      setDraft('');
      return;
    }
    onChange([...value, trimmed]);
    setDraft('');
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && draft === '' && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  const remove = (tech: string) =>
    onChange(value.filter((t) => t !== tech));

  return (
    <div>
      <label className="block font-mono text-[11px] uppercase tracking-widest text-tertiary mb-2 keep-latin">
        {label}
      </label>
      <div
        className={cn(
          'flex flex-wrap items-center gap-2 bg-bg-elevated border border-border-subtle rounded-md p-2 focus-within:border-gold/60 transition-colors',
        )}
      >
        {value.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-1.5 bg-bg-subtle border border-border-subtle text-primary px-2 py-1 rounded text-xs font-mono keep-latin"
          >
            {tech}
            <button
              type="button"
              onClick={() => remove(tech)}
              className="text-tertiary hover:text-rose-400 transition-colors"
              aria-label={`Remove ${tech}`}
            >
              <X size={11} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={commit}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[180px] bg-transparent border-0 text-primary placeholder:text-muted text-sm focus:outline-none keep-latin px-1 py-1"
        />
        {draft.trim() ? (
          <button
            type="button"
            onClick={commit}
            className="text-tertiary hover:text-gold transition-colors p-1"
            aria-label="Add"
          >
            <Plus size={14} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
