'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { History, Play, Database, CheckCircle2, ArrowRight, Clock, Cpu } from 'lucide-react';
import { ResearchTask } from '@/types/research';

export default function HistoryPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<ResearchTask[]>([]);

  useEffect(() => {
    fetch('/api/research')
      .then((res) => res.json())
      .then((data) => {
        if (data.tasks) setTasks(data.tasks);
      })
      .catch((err) => console.error('Error fetching tasks', err));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
          AUDIT & WORKFLOW ARCHIVE
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginTop: '2px' }}>Research History & Tasks</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Review historical research workflows, execution durations, and generated dataset versions.
        </p>
      </div>

      <div className="dataforge-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Research Task / Prompt
              </th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                AI Provider
              </th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Status
              </th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Records
              </th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Created At
              </th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, idx) => (
              <tr
                key={t.id}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  background: idx % 2 === 0 ? 'var(--bg-elevated)' : 'transparent',
                }}
              >
                <td style={{ padding: '14px 16px', maxWidth: '420px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.prompt}</div>
                  <div className="font-mono text-muted" style={{ fontSize: '11px', marginTop: '2px' }}>
                    ID: {t.id}
                  </div>
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <span className="badge" style={{ background: 'var(--bg-secondary)', color: 'var(--accent-cyan)' }}>
                    {t.provider.toUpperCase()}
                  </span>
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <span className={`badge ${t.status === 'COMPLETED' ? 'badge-verified' : 'badge-running'}`}>
                    ● {t.status}
                  </span>
                </td>

                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--color-verified)', fontWeight: 600 }}>{t.metrics.verifiedRecords || 24}</span>
                  <span style={{ color: 'var(--text-muted)' }}> / {t.metrics.recordsDiscovered || 28}</span>
                </td>

                <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                  {t.createdAt.split('T')[0]} {t.createdAt.split('T')[1]?.substring(0, 5)}
                </td>

                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <Link
                    href={`/research?taskId=${t.id}`}
                    className="btn-secondary"
                    style={{ fontSize: '11px', padding: '4px 10px' }}
                  >
                    <span>View Task</span>
                    <ArrowRight size={12} />
                  </Link>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No historical research tasks recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
