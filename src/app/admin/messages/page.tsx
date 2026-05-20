'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'react-hot-toast';
import {
  Archive,
  ArchiveRestore,
  Eye,
  EyeOff,
  Reply,
  Search,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import {
  deleteMessage,
  listMessages,
  type MessageFilter,
  updateMessage,
} from '@/lib/firebase/messages';
import type { AdminMessage } from '@/lib/types/admin';
import { cn } from '@/lib/utils';

function MessagesInner() {
  const params = useSearchParams();
  const initialFilter = (params.get('filter') as MessageFilter) ?? 'all';
  const [filter, setFilter] = useState<MessageFilter>(initialFilter);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (f: MessageFilter) => {
    setLoading(true);
    try {
      const list = await listMessages(f, 200);
      setMessages(list);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(filter);
  }, [filter, load]);

  const toggleRead = async (m: AdminMessage) => {
    try {
      await updateMessage(m.id, { read: !m.read });
      setMessages((prev) =>
        prev.map((x) => (x.id === m.id ? { ...x, read: !m.read } : x)),
      );
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const toggleArchive = async (m: AdminMessage) => {
    try {
      await updateMessage(m.id, { archived: !m.archived });
      toast.success(m.archived ? 'Restored.' : 'Archived.');
      setMessages((prev) =>
        filter === 'all'
          ? prev.map((x) =>
              x.id === m.id ? { ...x, archived: !m.archived } : x,
            )
          : prev.filter((x) => x.id !== m.id),
      );
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleDelete = async (m: AdminMessage) => {
    if (!window.confirm(`Delete message from ${m.name}?`)) return;
    try {
      await deleteMessage(m.id);
      toast.success('Deleted.');
      setMessages((prev) => prev.filter((x) => x.id !== m.id));
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleReply = (m: AdminMessage) => {
    const subject = encodeURIComponent(
      m.subject ? `Re: ${m.subject}` : 'Re: your message',
    );
    const body = encodeURIComponent(
      `\n\n---\nOn ${m.createdAt ? format(m.createdAt.toDate(), 'PPP') : '—'} ${m.name} wrote:\n${m.message}`,
    );
    window.location.href = `mailto:${m.email}?subject=${subject}&body=${body}`;
    if (!m.read) void toggleRead(m);
  };

  const filtered = messages.filter((m) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.subject ?? '').toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="serif-display text-3xl text-primary mb-1">Messages</h1>
          <p className="text-secondary text-sm">
            Contact form submissions, newest first.
          </p>
        </div>
      </header>

      <div className="flex items-center gap-3 flex-wrap">
        <div role="tablist" className="inline-flex bg-bg-elevated border border-border-subtle rounded-md p-0.5">
          {(['all', 'unread', 'archived'] as MessageFilter[]).map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded text-xs font-mono uppercase tracking-widest transition-colors',
                filter === f
                  ? 'bg-bg-subtle text-primary'
                  : 'text-tertiary hover:text-primary',
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search
            size={14}
            className="absolute start-3 top-1/2 -translate-y-1/2 text-tertiary"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, subject…"
            className="w-full bg-bg-elevated border border-border-subtle rounded-md ps-8 pe-3 py-2 text-primary placeholder:text-muted text-sm focus:border-gold focus:outline-none transition-colors"
          />
        </div>
      </div>

      {error ? <p className="text-rose-400 text-sm font-mono">{error}</p> : null}

      <div className="bg-bg-elevated border border-border-subtle rounded-lg overflow-hidden">
        {loading ? (
          <p className="px-6 py-10 text-center text-tertiary text-sm font-mono">
            Loading…
          </p>
        ) : filtered.length === 0 ? (
          <p className="px-6 py-10 text-center text-tertiary text-sm">
            No messages match.
          </p>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {filtered.map((m) => {
              const isOpen = expanded === m.id;
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setExpanded(isOpen ? null : m.id);
                      if (!isOpen && !m.read) void toggleRead(m);
                    }}
                    className={cn(
                      'w-full text-start px-5 py-4 flex items-start gap-4 transition-colors hover:bg-bg-subtle/40',
                      !m.read && 'bg-gold/5',
                    )}
                  >
                    {!m.read ? (
                      <span
                        className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0"
                        aria-label="Unread"
                      />
                    ) : (
                      <span className="mt-1.5 w-2 h-2 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-primary text-sm font-medium truncate">
                          {m.name}
                        </span>
                        <span className="text-[11px] text-tertiary font-mono whitespace-nowrap keep-latin">
                          {m.createdAt
                            ? formatDistanceToNow(m.createdAt.toDate(), {
                                addSuffix: true,
                              })
                            : '—'}
                        </span>
                      </div>
                      <div className="text-xs text-tertiary font-mono keep-latin truncate">
                        {m.email}
                      </div>
                      {m.subject ? (
                        <div className="text-secondary text-sm mt-1 truncate">
                          {m.subject}
                        </div>
                      ) : null}
                      <p
                        className={cn(
                          'text-secondary text-sm mt-2 leading-relaxed',
                          !isOpen && 'line-clamp-2',
                        )}
                      >
                        {m.message}
                      </p>
                      {isOpen ? (
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                          <ActionButton
                            icon={Reply}
                            label="Reply"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReply(m);
                            }}
                            tone="gold"
                          />
                          <ActionButton
                            icon={m.read ? EyeOff : Eye}
                            label={m.read ? 'Mark unread' : 'Mark read'}
                            onClick={(e) => {
                              e.stopPropagation();
                              void toggleRead(m);
                            }}
                          />
                          <ActionButton
                            icon={m.archived ? ArchiveRestore : Archive}
                            label={m.archived ? 'Restore' : 'Archive'}
                            onClick={(e) => {
                              e.stopPropagation();
                              void toggleArchive(m);
                            }}
                          />
                          <ActionButton
                            icon={Trash2}
                            label="Delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              void handleDelete(m);
                            }}
                            tone="danger"
                          />
                          {m.createdAt ? (
                            <span className="ms-auto text-tertiary font-mono keep-latin">
                              {format(m.createdAt.toDate(), 'PPpp')}
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  tone?: 'gold' | 'danger';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 font-mono uppercase tracking-widest transition-colors',
        tone === 'gold'
          ? 'text-gold hover:text-gold-warm'
          : tone === 'danger'
            ? 'text-tertiary hover:text-rose-400'
            : 'text-tertiary hover:text-primary',
      )}
    >
      <Icon size={12} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={<p className="text-tertiary text-sm font-mono">Loading…</p>}
    >
      <MessagesInner />
    </Suspense>
  );
}
