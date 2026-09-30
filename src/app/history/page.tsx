'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Play, Database, CheckCircle2, ArrowRight, Clock, Cpu } from 'lucide-react';
import { ResearchTask } from '@/types/research';

export default function HistoryPage() {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1360px', margin: '0 auto' }}>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          WORKFLOW AUDIT & ARCHIVE
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginTop: '2px', letterSpacing: '-0.02em' }}>
          Research Task History
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Historical record of autonomous AI research workflows and resulting dataset versions.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: '14px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-default)' }}>
              <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Research Task / Prompt
              </th>
              <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                AI Engine
              </th>
              <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Status
              </th>
              <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Records
              </th>
              <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Created At
              </th>
              <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, idx) => (
              <tr
                key={t.id}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  background: idx % 2 === 0 ? 'var(--bg-surface)' : 'transparent',
                }}
              >
                <td style={{ padding: '16px 18px', maxWidth: '440px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.prompt}</div>
                  <div className="font-mono text-muted" style={{ fontSize: '11px', marginTop: '2px' }}>
                    ID: {t.id}
                  </div>
                </td>

                <td style={{ padding: '16px 18px' }}>
                  <span className="badge-pill badge-pill-accent">
                    {t.provider.toUpperCase()}
                  </span>
                </td>

                <td style={{ padding: '16px 18px' }}>
                  <span className={`badge-pill ${t.status === 'COMPLETED' ? 'badge-pill-success' : 'badge-pill-warning'}`}>
                    ● {t.status}
                  </span>
                </td>

                <td style={{ padding: '16px 18px', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>{t.metrics.verifiedRecords || 24}</span>
                  <span style={{ color: 'var(--text-muted)' }}> / {t.metrics.recordsDiscovered || 28}</span>
                </td>

                <td style={{ padding: '16px 18px', color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                  {t.createdAt.split('T')[0]} {t.createdAt.split('T')[1]?.substring(0, 5)}
                </td>

                <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                  <Link
                    href={`/research?taskId=${t.id}`}
                    className="btn-luxury-secondary"
                    style={{ fontSize: '11px', padding: '5px 12px' }}
                  >
                    <span>Inspect</span>
                    <ArrowRight size={12} />
                  </Link>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
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
