'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Cpu, Radio, CheckCircle2, AlertTriangle, RefreshCw, Key, Shield } from 'lucide-react';
import { ProviderStatus } from '@/types/provider';

export default function SettingsPage() {
  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const [activeProvider, setActiveProvider] = useState<string>('gemini');
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchAIStatus = () => {
    fetch('/api/ai')
      .then((res) => res.json())
      .then((data) => {
        if (data.providers) setProviders(data.providers);
        if (data.activeProvider) setActiveProvider(data.activeProvider);
      })
      .catch((err) => console.error('Error fetching AI status', err));
  };

  useEffect(() => {
    fetchAIStatus();
  }, []);

  const handleSwitchProvider = async (provider: string) => {
    setIsUpdating(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();
      if (data.activeProvider) {
        setActiveProvider(data.activeProvider);
        if (data.providers) setProviders(data.providers);
        setStatusMessage(`Active AI Provider switched to ${provider.toUpperCase()}`);
      }
    } catch (err) {
      console.error('Failed to switch AI provider', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '880px' }}>
      <div>
        <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
          CONFIGURATION & PROVIDERS
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginTop: '2px' }}>System Settings</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Configure AI reasoning engines, fallback hierarchy, and data collection modes.
        </p>
      </div>

      {statusMessage && (
        <div
          style={{
            padding: '10px 14px',
            background: 'rgba(95, 227, 161, 0.1)',
            border: '1px solid rgba(95, 227, 161, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-verified)',
            fontSize: '13px',
          }}
        >
          {statusMessage}
        </div>
      )}

      {/* AI Provider Section */}
      <div className="dataforge-card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={16} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '15px', fontWeight: 600 }}>AI Provider Routing & Fallback</h2>
          </div>
          <button
            onClick={fetchAIStatus}
            className="btn-secondary"
            style={{ fontSize: '11px', padding: '4px 10px' }}
          >
            <RefreshCw size={12} />
            <span>Test Health</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {providers.map((p) => {
            const isActive = activeProvider === p.provider;

            return (
              <div
                key={p.provider}
                style={{
                  padding: '16px',
                  background: isActive ? 'var(--bg-higher)' : 'var(--bg-secondary)',
                  border: isActive ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                      {p.name}
                    </span>
                    <span className={`badge ${p.isConnected ? 'badge-verified' : 'badge-warning'}`}>
                      ● {p.isConnected ? 'Available' : 'Unavailable'}
                    </span>
                    {isActive && <span className="badge badge-running">ACTIVE PROVIDER</span>}
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Status: <strong style={{ color: p.isConnected ? 'var(--color-verified)' : 'var(--color-warning)' }}>{p.statusText}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    <span>Model: {p.model}</span>
                    {p.latencyMs !== undefined && <span>Latency: {p.latencyMs}ms</span>}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handleSwitchProvider(p.provider)}
                    disabled={isActive || isUpdating}
                    className={isActive ? 'btn-secondary' : 'btn-primary'}
                    style={{ fontSize: '12px', padding: '6px 14px' }}
                  >
                    {isActive ? 'Current Engine' : `Use ${p.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security & Credentials info (Prompt Section 36) */}
      <div className="dataforge-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Shield size={16} color="var(--color-verified)" />
          <h2 style={{ fontSize: '15px', fontWeight: 600 }}>Security & Safe Execution Architecture</h2>
        </div>

        <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <li>API keys are stored strictly in server-side environment variables and are never exposed to browser bundles.</li>
          <li>Natural language input executes only via allowlisted, schema-validated deterministic tool pipelines.</li>
          <li>All external web content is treated as untrusted observational data with HTML sanitization.</li>
          <li>Zero silent hallucination: values lacking sufficient evidence are marked explicitly unknown.</li>
        </ul>
      </div>
    </div>
  );
}
