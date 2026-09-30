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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '920px', margin: '0 auto' }}>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          CONFIGURATION & PROVIDER CONTROLS
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginTop: '2px', letterSpacing: '-0.02em' }}>
          System & AI Engine Settings
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Configure AI reasoning models, local fallback endpoints, and security guarantees.
        </p>
      </div>

      {statusMessage && (
        <div
          style={{
            padding: '12px 16px',
            background: 'var(--color-success-bg)',
            border: '1px solid var(--color-success-border)',
            borderRadius: '10px',
            color: 'var(--color-success)',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          {statusMessage}
        </div>
      )}

      {/* AI Provider Section */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={18} color="var(--accent-blue)" />
            <h2 style={{ fontSize: '16px', fontWeight: 700 }}>AI Provider Routing & Status</h2>
          </div>
          <button
            onClick={fetchAIStatus}
            className="btn-luxury-secondary"
            style={{ fontSize: '12px', padding: '5px 12px' }}
          >
            <RefreshCw size={12} />
            <span>Test Health</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {providers.map((p) => {
            const isActive = activeProvider === p.provider;

            return (
              <div
                key={p.provider}
                style={{
                  padding: '18px 20px',
                  background: isActive ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                  border: isActive ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '15px' }}>
                      {p.name}
                    </span>
                    <span className={`badge-pill ${p.isConnected ? 'badge-pill-success' : 'badge-pill-warning'}`}>
                      ● {p.isConnected ? 'Available' : 'Unavailable'}
                    </span>
                    {isActive && <span className="badge-pill badge-pill-accent">ACTIVE PROVIDER</span>}
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Status: <strong style={{ color: p.isConnected ? 'var(--color-success)' : 'var(--color-warning)' }}>{p.statusText}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    <span>Model: {p.model}</span>
                    {p.latencyMs !== undefined && <span>Latency: {p.latencyMs}ms</span>}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handleSwitchProvider(p.provider)}
                    disabled={isActive || isUpdating}
                    className={isActive ? 'btn-luxury-secondary' : 'btn-luxury-primary'}
                    style={{ fontSize: '12px', padding: '7px 16px' }}
                  >
                    {isActive ? 'Current Engine' : `Use ${p.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security & Credentials */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <Shield size={18} color="var(--color-success)" />
          <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Security & Safe Execution Architecture</h2>
        </div>

        <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <li>API keys are stored strictly in server-side environment variables and are never bundled into client code.</li>
          <li>Natural language requests translate into controlled, schema-validated deterministic tool workflows.</li>
          <li>External web content is treated as untrusted data with strict content sanitization.</li>
          <li>Zero silent hallucination: values lacking sufficient evidence are marked explicitly unknown.</li>
        </ul>
      </div>
    </div>
  );
}
