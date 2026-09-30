'use client';

import React, { useState, useEffect } from 'react';
import { Radio, ShieldCheck, CheckCircle2, Globe, FileText, Briefcase, ExternalLink, Activity } from 'lucide-react';
import { Source } from '@/types/dataset';

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);

  useEffect(() => {
    fetch('/api/datasets/dataset_flagship_demo')
      .then((res) => res.json())
      .then((data) => {
        if (data.sources) setSources(data.sources);
      })
      .catch((err) => console.error('Error fetching sources', err));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1360px', margin: '0 auto' }}>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          DATA INGESTION & REGISTRY
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginTop: '2px', letterSpacing: '-0.02em' }}>
          Source Registry & Connectors
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Inspect authorized corporate registries, job telemetry feeds, and regulatory filings powering dataset provenance.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {sources.map((src) => (
          <div
            key={src.id}
            className="glass-panel"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <span className="font-mono text-muted" style={{ fontSize: '11px' }}>{src.id}</span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {src.name}
                </h3>
              </div>
              <span className="badge-pill badge-pill-success">● {src.status}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Connector Type:</span>
                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {src.type.replace('_', ' ')}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Authority & Reliability:</span>
                <span style={{ color: src.reliability === 'High' ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 700 }}>
                  {src.reliability} Trust
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Domain Host:</span>
                <span className="font-mono" style={{ color: 'var(--accent-blue)', fontSize: '12px' }}>{src.domain}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Collection Mode:</span>
                <span className="badge-pill badge-pill-warning">SYNTHETIC DEMO</span>
              </div>
            </div>

            {src.metadata && (
              <div
                style={{
                  marginTop: 'auto',
                  padding: '12px 14px',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}
              >
                {Object.entries(src.metadata).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{k}:</span>
                    <span style={{ fontWeight: 500 }}>{String(v)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
