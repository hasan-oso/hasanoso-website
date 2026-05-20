'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Wrench,
  MessageSquare,
  Eye,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import {
  collection,
  getCountFromServer,
  query,
  where,
} from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { getFirebaseDb } from '@/lib/firebase/config';
import { listRecentMessages } from '@/lib/firebase/messages';
import type { AdminMessage } from '@/lib/types/admin';
import { cn } from '@/lib/utils';

type Stats = {
  projects: number;
  skills: number;
  messages: number;
  unread: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    skills: 0,
    messages: 0,
    unread: 0,
  });
  const [recent, setRecent] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const db = getFirebaseDb();
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const [projectsSnap, skillsSnap, messagesSnap, unreadSnap, recentList] =
          await Promise.all([
            getCountFromServer(collection(db, 'projects')),
            getCountFromServer(collection(db, 'skills')),
            getCountFromServer(collection(db, 'messages')),
            getCountFromServer(
              query(collection(db, 'messages'), where('read', '==', false)),
            ),
            listRecentMessages(5),
          ]);

        if (!active) return;
        setStats({
          projects: projectsSnap.data().count,
          skills: skillsSnap.data().count,
          messages: messagesSnap.data().count,
          unread: unreadSnap.data().count,
        });
        setRecent(recentList);
      } catch (err) {
        if (active) setError((err as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="serif-display text-3xl sm:text-4xl text-primary mb-2">
          Welcome back
        </h1>
        <p className="text-secondary text-sm">
          {"Here is what is happening with your site."}
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Projects"
          value={stats.projects}
          icon={Briefcase}
          href="/admin/projects"
          loading={loading}
        />
        <StatCard
          label="Skills"
          value={stats.skills}
          icon={Wrench}
          href="/admin/skills"
          loading={loading}
        />
        <StatCard
          label="Messages"
          value={stats.messages}
          icon={MessageSquare}
          href="/admin/messages"
          loading={loading}
        />
        <StatCard
          label="Unread"
          value={stats.unread}
          icon={Eye}
          href="/admin/messages?filter=unread"
          highlight={stats.unread > 0}
          loading={loading}
        />
      </section>

      <section className="bg-bg-elevated border border-border-subtle rounded-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="serif-display text-xl text-primary">
            Recent messages
          </h2>
          <Link
            href="/admin/messages"
            className="text-xs font-mono uppercase tracking-widest text-gold hover:text-gold-warm inline-flex items-center gap-1.5"
          >
            View all
            <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </div>

        {error ? (
          <p className="text-rose-400 text-sm font-mono">
            {`Failed to load: ${error}`}
          </p>
        ) : loading ? (
          <p className="text-tertiary text-sm font-mono">Loading…</p>
        ) : recent.length === 0 ? (
          <p className="text-tertiary text-sm">No messages yet.</p>
        ) : (
          <ul className="space-y-3">
            {recent.map((msg) => (
              <li
                key={msg.id}
                className={cn(
                  'p-4 bg-bg-subtle rounded-md border border-transparent transition-colors duration-150 hover:border-border-subtle',
                  !msg.read && 'border-gold/30',
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="min-w-0">
                    <div className="text-primary text-sm font-medium truncate">
                      {msg.name}
                    </div>
                    <div className="text-xs text-tertiary font-mono keep-latin truncate">
                      {msg.email}
                    </div>
                  </div>
                  <div className="text-[11px] text-tertiary font-mono whitespace-nowrap keep-latin">
                    {msg.createdAt
                      ? formatDistanceToNow(msg.createdAt.toDate(), {
                          addSuffix: true,
                        })
                      : '—'}
                  </div>
                </div>
                <p className="text-secondary text-sm leading-relaxed mt-2 line-clamp-2">
                  {msg.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  href,
  highlight,
  loading,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  href: string;
  highlight?: boolean;
  loading?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'block p-5 rounded-lg border transition-colors duration-200',
        highlight
          ? 'bg-gold/10 border-gold/40 hover:border-gold'
          : 'bg-bg-elevated border-border-subtle hover:border-gold/30',
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon
          size={16}
          aria-hidden="true"
          className={highlight ? 'text-gold' : 'text-tertiary'}
        />
      </div>
      <div className="serif-display text-3xl text-primary tabular-nums leading-none">
        {loading ? '—' : value}
      </div>
      <div className="text-xs text-secondary mt-1.5">{label}</div>
    </Link>
  );
}
