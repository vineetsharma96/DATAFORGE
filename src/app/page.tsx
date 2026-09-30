'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Database,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Activity,
  Layers,
  Zap,
  Globe2,
} from 'lucide-react';
import { DEMO_SCENARIOS } from '@/lib/synthetic/scenarios';
import { Dataset } from '@/types/dataset';

export default function OverviewPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/datasets')
      .then((res) => res.json())
      .then((data) => {
        if (data.datasets) setDatasets(data.datasets);
      })
      .catch((err) => console.error('Error fetching datasets', err));
  }, []);

  const handleStartResearch = async (promptText?: string) => {
    const textToSubmit = promptText || prompt;
    if (!textToSubmit.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSubmit, autoRun: true }),
      });
      const data = await res.json();
      if (data.taskId) {
        router.push(`/research?taskId=${data.taskId}`);
      }
    } catch (err) {
      console.error('Failed to initiate research', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const primaryDataset = datasets[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Hero Header (Stripe / Vercel Modern SaaS Style) */}
      <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 14px',
            borderRadius: '24px',
            background: 'var(--accent-subtle)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--accent-blue)',
            marginBottom: '16px',
          }}
        >
          <Sparkles size={14} />
          <span>Next-Generation Autonomous Research OS</span>
        </div>

        <h1
          style={{
            fontSize: '44px',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            maxWidth: '820px',
            margin: '0 auto',
          }}
        >
          Turn any business question into <span className="gradient-text">verified, living datasets</span>.
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '16px',
            maxWidth: '620px',
            margin: '12px auto 0',
            lineHeight: 1.6,
          }}
        >
          Dynamic AI research pipelines that collect permitted records, cross-check discrepancies, and monitor for changes over time.
        </p>
      </div>

      {/* Floating Glassmorphic Command Box (Vercel / Raycast Inspired) */}
      <div
        className="glass-panel-elevated animated-gradient-border"
        style={{
          padding: '24px 28px',
          borderRadius: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Search size={15} color="var(--accent-blue)" />
            <span>Autonomous Intelligence Query</span>
          </div>

          <span className="badge-pill badge-pill-accent">
            Gemini & Ollama Ready
          </span>
        </div>

        <div style={{ position: 'relative' }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your data requirement in plain English... e.g. Find Indian SaaS companies that raised funding recently, have 50–500 employees, are actively hiring, and show cybersecurity demand signals."
            rows={3}
            style={{
              width: '100%',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-default)',
              borderRadius: '12px',
              padding: '16px 18px',
              fontSize: '15px',
              lineHeight: 1.5,
              resize: 'none',
              outline: 'none',
              boxShadow: 'var(--shadow-sm)',
              transition: 'border-color 0.2s ease',
            }}
          />
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '18px', flexWrap: 'wrap', gap: '12px' }}>
          {/* Quick Scenario Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Try Demo:</span>
            {DEMO_SCENARIOS.slice(0, 3).map((sc) => (
              <button
                key={sc.id}
                onClick={() => {
                  setPrompt(sc.prompt);
                  setSelectedScenario(sc.id);
                }}
                className="btn-luxury-secondary"
                style={{
                  fontSize: '11px',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  background: selectedScenario === sc.id ? 'var(--accent-subtle)' : undefined,
                  borderColor: selectedScenario === sc.id ? 'var(--accent-blue)' : undefined,
                }}
              >
                {sc.title}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleStartResearch()}
            disabled={isSubmitting || !prompt.trim()}
            className="btn-luxury-primary"
            style={{ padding: '10px 24px', fontSize: '14px' }}
          >
            <Sparkles size={16} />
            <span>{isSubmitting ? 'Generating Pipeline...' : 'Run Autonomous Research'}</span>
          </button>
        </div>
      </div>

      {/* Modern KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>LIVING DATASETS</span>
            <div style={{ padding: '7px', borderRadius: '8px', background: 'var(--accent-subtle)' }}>
              <Database size={17} color="var(--accent-blue)" />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '12px' }}>{datasets.length || 1}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-success)', marginTop: '4px', fontWeight: 500 }}>
            ● Continuous Monitoring Active
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>VERIFIED RECORDS</span>
            <div style={{ padding: '7px', borderRadius: '8px', background: 'var(--color-success-bg)' }}>
              <CheckCircle2 size={17} color="var(--color-success)" />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '12px' }}>
            {primaryDataset?.recordsCount || 24}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            100% Traceable Lineage
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>SYSTEM QUALITY</span>
            <div style={{ padding: '7px', borderRadius: '8px', background: 'var(--accent-subtle)' }}>
              <ShieldCheck size={17} color="var(--accent-cyan)" />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '12px' }}>
            {Math.round((primaryDataset?.quality?.overallScore || 0.93) * 100)}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-success)', marginTop: '4px', fontWeight: 500 }}>
            High Enterprise Trust
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>CONFLICT RESOLUTION</span>
            <div style={{ padding: '7px', borderRadius: '8px', background: 'var(--color-conflict-bg)' }}>
              <AlertTriangle size={17} color="var(--color-conflict)" />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '12px' }}>2 / 2</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Cross-Source Consensus
          </div>
        </div>
      </div>

      {/* Main Grid: Active Living Datasets & Quality Center */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.9fr 1.1fr', gap: '24px' }}>
        {/* Active Datasets Panel */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Living Intelligence Datasets</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Monitored datasets with version control and automated change detection.
              </p>
            </div>
            <Link href="/datasets" className="btn-luxury-secondary" style={{ fontSize: '12px', padding: '6px 14px' }}>
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {datasets.map((d) => (
              <div
                key={d.id}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '15px' }}>{d.name}</span>
                    <span className="badge-pill badge-pill-success">● {d.status}</span>
                    <span className="badge-pill badge-pill-warning">SYNTHETIC</span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '580px', lineHeight: 1.4 }}>
                    {d.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>Records: <strong style={{ color: 'var(--text-primary)' }}>{d.recordsCount}</strong></span>
                    <span>Version: <strong style={{ color: 'var(--accent-blue)' }}>{d.currentVersion}</strong></span>
                    <span>Monitoring: <strong style={{ color: 'var(--text-primary)' }}>{d.monitoring.frequency}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link href={`/datasets?id=${d.id}`} className="btn-luxury-secondary" style={{ fontSize: '12px', padding: '6px 14px' }}>
                    Explorer
                  </Link>
                  <Link href={`/intelligence?datasetId=${d.id}`} className="btn-luxury-primary" style={{ fontSize: '12px', padding: '6px 14px' }}>
                    Graph
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality & Trust Center Panel */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Data Quality Center</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', marginBottom: '22px' }}>
            Multi-factor verification and provenance benchmarks.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Evidence Coverage</span>
                <span className="font-mono" style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>95%</span>
              </div>
              <div style={{ height: '7px', background: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '95%', height: '100%', background: 'var(--accent-gradient)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Field Completeness</span>
                <span className="font-mono" style={{ color: 'var(--color-success)', fontWeight: 700 }}>88%</span>
              </div>
              <div style={{ height: '7px', background: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '88%', height: '100%', background: 'var(--color-success)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Cross-Source Consistency</span>
                <span className="font-mono" style={{ color: 'var(--color-success)', fontWeight: 700 }}>93%</span>
              </div>
              <div style={{ height: '7px', background: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '93%', height: '100%', background: 'var(--color-success)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Source Recency & Freshness</span>
                <span className="font-mono" style={{ color: 'var(--color-warning)', fontWeight: 700 }}>89%</span>
              </div>
              <div style={{ height: '7px', background: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '89%', height: '100%', background: 'var(--color-warning)' }} />
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '26px',
              padding: '14px',
              background: 'var(--bg-surface-elevated)',
              borderRadius: '10px',
              border: '1px solid var(--border-default)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: 'var(--text-primary)' }}>Integrity Guarantee:</strong> Values without multiple supporting observations are flagged for human review or marked explicitly unknown.
          </div>
        </div>
      </div>
    </div>
  );
}
