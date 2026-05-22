'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { listMessages, type ContactMessage } from '@/lib/firebase/messages';
import { projects } from '@/data/projects';

export default function AdminDashboardPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    listMessages()
      .then((m) => {
        if (alive) setMessages(m);
      })
      .catch((err) => console.error('Failed to load messages', err))
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const unread = messages.filter((m) => m.status === 'unread').length;

  return (
    <AdminShell>
      <header className="border-b border-void-3 pb-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-core/80">
          لوحة التحكم
        </p>
        <h1 className="mt-2 text-3xl font-display text-text-bright">
          مرحباً بعودتك.
        </h1>
      </header>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <StatCard
          label="رسائل غير مقروءة"
          value={loading ? '—' : unread.toString()}
          href="/admin/messages"
          accent="gold"
        />
        <StatCard
          label="إجمالي الرسائل"
          value={loading ? '—' : messages.length.toString()}
          href="/admin/messages"
          accent="neon"
        />
        <StatCard
          label="المشاريع"
          value={projects.length.toString()}
          accent="violet"
        />
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-gold-core/80">
          آخر الرسائل
        </h2>
        <ul className="mt-4 divide-y divide-void-3/60 border-t border-void-3/60">
          {loading ? (
            <li className="py-6 text-text-faint text-sm">جارٍ التحميل…</li>
          ) : messages.length === 0 ? (
            <li className="py-6 text-text-faint text-sm">
              لا توجد رسائل بعد — عندما يرسل زائر من نموذج التواصل ستظهر هنا.
            </li>
          ) : (
            messages.slice(0, 5).map((m) => (
              <li key={m.id} className="py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-text-bright text-sm keep-latin">
                    {m.name}
                  </p>
                  <span
                    className={[
                      'text-[10px] font-mono uppercase tracking-[0.2em]',
                      m.status === 'unread'
                        ? 'text-gold-core'
                        : 'text-text-ghost',
                    ].join(' ')}
                  >
                    {m.status === 'unread' ? 'غير مقروءة' : m.status === 'read' ? 'مقروءة' : 'مؤرشفة'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-text-faint keep-latin">
                  {m.email}
                </p>
                <p className="mt-2 text-sm text-text-muted line-clamp-2">
                  {m.body}
                </p>
              </li>
            ))
          )}
        </ul>
        {messages.length > 5 ? (
          <Link
            href="/admin/messages"
            className="mt-4 inline-block text-xs font-mono uppercase tracking-[0.2em] text-text-faint hover:text-gold-core transition-colors"
          >
            ← عرض الكل
          </Link>
        ) : null}
      </section>
    </AdminShell>
  );
}

function StatCard({
  label,
  value,
  href,
  accent,
}: {
  label: string;
  value: string;
  href?: string;
  accent: 'gold' | 'neon' | 'violet';
}) {
  const border = {
    gold: 'border-gold-core/40',
    neon: 'border-neon-core/40',
    violet: 'border-violet-core/40',
  }[accent];
  const text = {
    gold: 'text-gold-core',
    neon: 'text-neon-core',
    violet: 'text-violet-core',
  }[accent];

  const inner = (
    <div className={`rounded-md border ${border} bg-void-1/60 p-6`}>
      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-text-faint">
        {label}
      </p>
      <p className={`mt-3 text-3xl font-display ${text} keep-latin`}>{value}</p>
    </div>
  );

  return href ? (
    <Link href={href} className="block transition-opacity hover:opacity-90">
      {inner}
    </Link>
  ) : (
    inner
  );
}
