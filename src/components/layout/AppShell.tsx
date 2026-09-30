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
  Layers,
  Play,
  Sun,
  Moon,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeProvider, setActiveProvider] = useState<string>('gemini');
  const [providerStatus, setProviderStatus] = useState<string>('Connected');
  const [isLaunchingDemo, setIsLaunchingDemo] = useState(false);

  // Initialize theme from storage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('dataforge-theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Fetch AI provider status
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

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('dataforge-theme', nextTheme);
  };

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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)', position: 'relative' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '240px',
          borderRight: '1px solid var(--border-subtle)',
          background: 'var(--bg-sidebar)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
        }}
      >
        {/* Brand */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
              }}
            >
              <Zap size={18} fill="currentColor" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                DATAFORGE
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Data Intelligence OS
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                  border: isActive ? '1px solid var(--border-default)' : '1px solid transparent',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={16} color={isActive ? 'var(--accent-blue)' : 'currentColor'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom CTA / Flagship Demo */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={handleLaunchDemo}
            disabled={isLaunchingDemo}
            className="btn-luxury-primary"
            style={{ width: '100%', fontSize: '12px', padding: '10px' }}
          >
            <Play size={13} fill="currentColor" />
            <span>{isLaunchingDemo ? 'Orchestrating...' : 'Launch Demo'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Subtle Demonstration Banner */}
        <div
          style={{
            background: 'var(--accent-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '6px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent-cyan)',
                display: 'inline-block',
              }}
            />
            <strong style={{ color: 'var(--text-primary)' }}>SYNTHETIC DEMO MODE ACTIVE</strong>
            <span>— Provable Multi-Source Provenance & Deterministic Offline Verification</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
            <span>ACTIVE ENGINE: {activeProvider.toUpperCase()}</span>
          </div>
        </div>

        {/* Top Header Bar */}
        <header
          style={{
            height: '64px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-header)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          {/* Breadcrumb Path */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-muted)' }}>DATAFORGE</span>
            <ChevronRight size={14} color="var(--text-disabled)" />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
              {pathname === '/' ? 'Overview' : pathname.replace('/', '')}
            </span>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="btn-luxury-secondary"
              style={{ padding: '7px 11px', borderRadius: '20px' }}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={15} color="#F59E0B" /> : <Moon size={15} color="#6366F1" />}
            </button>

            {/* Provider Pill */}
            <Link
              href="/settings"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: activeProvider === 'gemini' ? 'var(--accent-cyan)' : 'var(--color-success)',
                }}
              />
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                {activeProvider}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({providerStatus})</span>
            </Link>
          </div>
        </header>

        {/* Content Container */}
        <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
