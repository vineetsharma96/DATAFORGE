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
  FileSpreadsheet,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Welcome */}
      <div>
        <div style={{ fontSize: '13px', color: 'var(--accent-cyan)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Intelligence Command Center
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
          Autonomous Data Intelligence Workspace
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Ask a business question in natural language. Get an evidence-backed, traceable, living dataset.
        </p>
      </div>

      {/* Hero Research Prompt Input (DESIGN.md Section 18) */}
      <div
        className="dataforge-card"
        style={{
          background: 'linear-gradient(180deg, #11161B 0%, #0D1115 100%)',
          borderColor: 'var(--border-strong)',
          padding: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            WHAT DO YOU NEED TO KNOW?
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-cyan)' }}>
            <Sparkles size={13} />
            <span>AI Autonomous Research Engine Ready</span>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe a business data requirement in plain English... e.g. Find Indian SaaS companies that raised funding recently, have 50–500 employees, are actively hiring, and show cybersecurity demand signals."
            rows={3}
            style={{
              width: '100%',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              fontSize: '15px',
              lineHeight: 1.5,
              resize: 'none',
              outline: 'none',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-cyan)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-primary)')}
          />
        </div>

        {/* Action Controls & Suggested Scenarios */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Suggested Scenarios:</span>
            {DEMO_SCENARIOS.slice(0, 3).map((sc) => (
              <button
                key={sc.id}
                onClick={() => {
                  setPrompt(sc.prompt);
                  setSelectedScenario(sc.id);
                }}
                style={{
                  fontSize: '11px',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: selectedScenario === sc.id ? 'var(--accent-cyan-subtle)' : 'var(--bg-elevated)',
                  border: selectedScenario === sc.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-primary)',
                  color: selectedScenario === sc.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                }}
              >
                {sc.title}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleStartResearch()}
            disabled={isSubmitting || !prompt.trim()}
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: '14px' }}
          >
            <Search size={16} />
            <span>{isSubmitting ? 'Planning...' : 'Run Autonomous Research'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (DESIGN.md Section 17) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <div className="dataforge-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              DATASETS
            </span>
            <Database size={16} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginTop: '8px' }}>{datasets.length || 1}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-verified)', marginTop: '4px' }}>
            ● Living & Monitored
          </div>
        </div>

        <div className="dataforge-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              VERIFIED RECORDS
            </span>
            <CheckCircle2 size={16} color="var(--color-verified)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginTop: '8px' }}>
            {primaryDataset?.recordsCount || 24}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            100% Provenance-Backed
          </div>
        </div>

        <div className="dataforge-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              OVERALL QUALITY
            </span>
            <ShieldCheck size={16} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginTop: '8px' }}>
            {Math.round((primaryDataset?.quality?.overallScore || 0.93) * 100)}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-verified)', marginTop: '4px' }}>
            High Enterprise Trust
          </div>
        </div>

        <div className="dataforge-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              CONFLICTS RESOLVED
            </span>
            <AlertTriangle size={16} color="var(--color-conflict)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginTop: '8px' }}>
            2 / 2
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Multi-Source Consensus
          </div>
        </div>

        <div className="dataforge-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              SOURCES MONITORED
            </span>
            <Activity size={16} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginTop: '8px' }}>5</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Registries, Domains, Feeds
          </div>
        </div>
      </div>

      {/* Main Grid: Dataset Overview & Quality Center */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Left: Active Intelligence Datasets */}
        <div className="dataforge-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Active Living Datasets</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Structured datasets generated from natural language research.
              </p>
            </div>
            <Link href="/datasets" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
              <span>View All Datasets</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {datasets.map((d) => (
              <div
                key={d.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{d.name}</span>
                    <span className="badge badge-verified">● {d.status}</span>
                    <span className="badge badge-synthetic">SYNTHETIC</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '560px' }}>
                    {d.description}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    <span>Records: <strong style={{ color: 'var(--text-primary)' }}>{d.recordsCount}</strong></span>
                    <span>Version: <strong style={{ color: 'var(--accent-cyan)' }}>{d.currentVersion}</strong></span>
                    <span>Check Frequency: <strong style={{ color: 'var(--text-primary)' }}>{d.monitoring.frequency}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link href={`/datasets?id=${d.id}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Explorer
                  </Link>
                  <Link href={`/intelligence?datasetId=${d.id}`} className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Graph
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quality & Trust Metrics (DESIGN.md Section 34) */}
        <div className="dataforge-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Data Quality Center</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            System confidence & multi-source validation metrics.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Evidence Coverage</span>
                <span className="font-mono" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>95%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '95%', height: '100%', background: 'var(--accent-cyan)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Field Completeness</span>
                <span className="font-mono" style={{ color: 'var(--color-verified)', fontWeight: 600 }}>88%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '88%', height: '100%', background: 'var(--color-verified)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Cross-Source Consistency</span>
                <span className="font-mono" style={{ color: 'var(--color-verified)', fontWeight: 600 }}>93%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '93%', height: '100%', background: 'var(--color-verified)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Source Freshness</span>
                <span className="font-mono" style={{ color: 'var(--color-warning)', fontWeight: 600 }}>89%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '89%', height: '100%', background: 'var(--color-warning)' }} />
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '20px',
              padding: '12px',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
            }}
          >
            <strong style={{ color: 'var(--text-primary)' }}>Trust Principle:</strong> Confidence is calculated from multi-source agreement, authoritative registries (ROC/MCA), and observation recency. Unsupported values are marked unknown.
          </div>
        </div>
      </div>
    </div>
  );
}
