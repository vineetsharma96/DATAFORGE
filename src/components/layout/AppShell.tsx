'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  Search,
  Database,
  Network,
  Radio,
  History,
  Settings,
  Sparkles,
  Cpu,
  Layers,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [activeProvider, setActiveProvider] = useState<string>('gemini');
  const [providerStatus, setProviderStatus] = useState<string>('Connected');
  const [isLaunchingDemo, setIsLaunchingDemo] = useState(false);

  useEffect(() => {
    fetch('/api/ai')
      .then((res) => res.json())
      .then((data) => {
        if (data.activeProvider) {
          setActiveProvider(data.activeProvider);
          const active = data.providers?.find((p: any) => p.provider === data.activeProvider);
          if (active) setProviderStatus(active.statusText);
        }
      })
      .catch((err) => console.warn('Could not fetch AI status', err));
  }, []);

  const handleLaunchDemo = async () => {
    setIsLaunchingDemo(true);
    try {
      const res = await fetch('/api/demo', { method: 'POST' });
      const data = await res.json();
      if (data.taskId) {
        router.push(`/research?taskId=${data.taskId}`);
      }
    } catch (err) {
      console.error('Demo launch error', err);
    } finally {
      setIsLaunchingDemo(false);
    }
  };

  const navItems = [
    { label: 'Overview', href: '/', icon: Compass },
    { label: 'Research', href: '/research', icon: Search },
    { label: 'Datasets', href: '/datasets', icon: Database },
    { label: 'Intelligence', href: '/intelligence', icon: Network },
    { label: 'Sources', href: '/sources', icon: Radio },
    { label: 'History', href: '/history', icon: History },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 'var(--sidebar-width)',
          borderRight: '1px solid var(--border-subtle)',
          background: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
        }}
      >
        {/* Brand */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-cyan-subtle)',
                border: '1px solid rgba(77, 220, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)',
              }}
            >
              <Cpu size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
                DATAFORGE
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Autonomous Intelligence
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-cyan-subtle)' : 'transparent',
                  border: isActive ? '1px solid rgba(77, 220, 255, 0.25)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Launch Demo in Sidebar */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={handleLaunchDemo}
            disabled={isLaunchingDemo}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              background: 'linear-gradient(135deg, rgba(77, 220, 255, 0.15), rgba(95, 227, 161, 0.15))',
              border: '1px solid rgba(77, 220, 255, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--accent-cyan)',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            <Play size={14} fill="currentColor" />
            <span>{isLaunchingDemo ? 'Launching...' : 'Run Flagship Demo'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Synthetic Demonstration Mode Banner (DESIGN.md Section 45) */}
        <div
          style={{
            background: 'rgba(245, 196, 81, 0.08)',
            borderBottom: '1px solid rgba(245, 196, 81, 0.2)',
            padding: '6px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#F5C451',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#F5C451',
              }}
            />
            <span>SYNTHETIC DEMONSTRATION DATA MODE ACTIVE</span>
            <span style={{ color: 'var(--text-muted)' }}>— 100% Deterministic, Provable Provenance & Offline Verification</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Model Routing: Gemini 2.5 Flash / Ollama Local</span>
          </div>
        </div>

        {/* Top Bar */}
        <header
          style={{
            height: 'var(--topbar-height)',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          {/* Breadcrumb / Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-muted)' }}>DATAFORGE</span>
            <span style={{ color: 'var(--border-strong)' }}>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500, textTransform: 'capitalize' }}>
              {pathname === '/' ? 'Intelligence Overview' : pathname.replace('/', '')}
            </span>
          </div>

          {/* Center Data Flow Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}
          >
            <span>PROMPT</span>
            <span style={{ color: 'var(--accent-cyan)' }}>→</span>
            <span>AI PLAN</span>
            <span style={{ color: 'var(--accent-cyan)' }}>→</span>
            <span>EVIDENCE</span>
            <span style={{ color: 'var(--color-verified)' }}>→</span>
            <span style={{ color: 'var(--color-verified)' }}>LIVING DATASET</span>
          </div>

          {/* Right Provider Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/settings"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: activeProvider === 'gemini' ? 'var(--accent-cyan)' : 'var(--color-verified)',
                }}
              />
              <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{activeProvider}</span>
              <span style={{ color: 'var(--text-muted)' }}>({providerStatus})</span>
            </Link>

            <button
              onClick={handleLaunchDemo}
              disabled={isLaunchingDemo}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              <Sparkles size={14} />
              <span>{isLaunchingDemo ? 'Processing...' : 'Launch Demo'}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
