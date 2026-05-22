'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import {
  deleteMessage,
  listMessages,
  updateMessageStatus,
  type ContactMessage,
  type MessageStatus,
} from '@/lib/firebase/messages';

const statusOrder: MessageStatus[] = ['unread', 'read', 'archived'];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<MessageStatus | 'all'>('all');
  const [selected, setSelected] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    listMessages()
      .then(setMessages)
      .catch((err) => console.error('Failed to load messages', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered =
    filter === 'all' ? messages : messages.filter((m) => m.status === filter);

  const current = filtered.find((m) => m.id === selected) ?? null;

  async function handleStatus(id: string, status: MessageStatus) {
    try {
      await updateMessageStatus(id, status);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m)),
      );
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Could not update status.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this message? This cannot be undone.')) return;
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected === id) setSelected(null);
    } catch (err) {
      console.error('Failed to delete', err);
      alert('Could not delete message.');
    }
  }

  return (
    <AdminShell>
      <header className="border-b border-void-3 pb-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-core/80">
          Messages
        </p>
        <h1 className="mt-2 text-3xl font-display text-text-bright">
          Contact submissions
        </h1>
      </header>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {(['all', ...statusOrder] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={[
              'px-3 py-1.5 text-xs font-mono uppercase tracking-[0.2em] rounded-sm transition-colors cursor-pointer',
              filter === f
                ? 'bg-gold-core text-void-0'
                : 'border border-void-3 text-text-muted hover:border-gold-core/60 hover:text-text-bright',
            ].join(' ')}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_2fr]">
        <ul className="divide-y divide-void-3/60 border border-void-3 rounded-md bg-void-1/40 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <li className="p-6 text-text-faint text-sm">Loading…</li>
          ) : filtered.length === 0 ? (
            <li className="p-6 text-text-faint text-sm">No messages.</li>
          ) : (
            filtered.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(m.id);
                    if (m.status === 'unread') handleStatus(m.id, 'read');
                  }}
                  className={[
                    'w-full text-left p-4 transition-colors cursor-pointer',
                    selected === m.id ? 'bg-void-3/40' : 'hover:bg-void-3/20',
                  ].join(' ')}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-text-bright text-sm keep-latin">
                      {m.name}
                    </span>
                    <span
                      className={[
                        'text-[10px] font-mono uppercase tracking-[0.2em]',
                        m.status === 'unread'
                          ? 'text-gold-core'
                          : m.status === 'read'
                            ? 'text-text-muted'
                            : 'text-text-ghost',
                      ].join(' ')}
                    >
                      {m.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] font-mono text-text-ghost keep-latin">
                    {m.email}
                  </p>
                  <p className="mt-2 text-xs text-text-muted line-clamp-2">
                    {m.body}
                  </p>
                </button>
              </li>
            ))
          )}
        </ul>

        <aside className="border border-void-3 rounded-md bg-void-1/40 p-6">
          {current ? (
            <article>
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-display text-text-bright keep-latin">
                  {current.name}
                </h2>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-core/80">
                  {current.locale.toUpperCase()}
                </span>
              </div>
              <a
                href={`mailto:${current.email}?subject=Re: your message`}
                className="mt-1 inline-block text-sm text-neon-core hover:text-neon-soft transition-colors keep-latin"
              >
                {current.email}
              </a>

              <p className="mt-6 whitespace-pre-wrap text-text-primary text-pretty leading-relaxed">
                {current.body}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {statusOrder
                  .filter((s) => s !== current.status)
                  .map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleStatus(current.id, s)}
                      className="px-3 py-1.5 text-xs font-mono uppercase tracking-[0.2em] rounded-sm border border-void-3 text-text-muted hover:border-gold-core hover:text-gold-core transition-colors cursor-pointer"
                    >
                      Mark as {s}
                    </button>
                  ))}
                <button
                  type="button"
                  onClick={() => handleDelete(current.id)}
                  className="ml-auto px-3 py-1.5 text-xs font-mono uppercase tracking-[0.2em] rounded-sm border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </article>
          ) : (
            <p className="text-text-faint text-sm">
              Select a message to read it.
            </p>
          )}
        </aside>
      </div>
    </AdminShell>
  );
}
