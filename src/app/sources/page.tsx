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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
          SOURCE TRANSPARENCY & CONNECTORS
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginTop: '2px' }}>Source Registry & Connectors</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Inspect authorized corporate registries, job telemetry feeds, and regulatory sources powering dataset provenance.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {sources.map((src) => (
          <div
            key={src.id}
            className="dataforge-card"
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <span className="font-mono text-muted" style={{ fontSize: '10px' }}>{src.id}</span>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {src.name}
                </h3>
              </div>
              <span className="badge badge-verified">● {src.status}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Type:</span>
                <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                  {src.type.replace('_', ' ')}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Reliability:</span>
                <span style={{ color: src.reliability === 'High' ? 'var(--color-verified)' : 'var(--color-warning)', fontWeight: 600 }}>
                  {src.reliability}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Domain:</span>
                <span className="font-mono text-cyan" style={{ fontSize: '11px' }}>{src.domain}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Data Mode:</span>
                <span className="badge badge-synthetic">SYNTHETIC DEMO</span>
              </div>
            </div>

            {src.metadata && (
              <div
                style={{
                  marginTop: 'auto',
                  padding: '10px 12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                }}
              >
                {Object.entries(src.metadata).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{k}:</span>
                    <span>{String(v)}</span>
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
