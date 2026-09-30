'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  X,
  RefreshCw,
  Clock,
  Layers,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { Dataset, DatasetRecord, EvidenceItem, Conflict } from '@/types/dataset';

function DatasetContent() {
  const searchParams = useSearchParams();
  const datasetIdParam = searchParams.get('id');

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [records, setRecords] = useState<DatasetRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minConfidence, setMinConfidence] = useState(0);
  const [conflictsOnly, setConflictsOnly] = useState(false);
  const [nlFilter, setNlFilter] = useState('');

  // Selected modals/drawers
  const [selectedRecord, setSelectedRecord] = useState<DatasetRecord | null>(null);
  const [selectedFieldEvidence, setSelectedFieldEvidence] = useState<{
    fieldName: string;
    value: any;
    confidence: number;
    evidence: EvidenceItem[];
    resolutionReason?: string;
  } | null>(null);
  const [selectedWhyIncluded, setSelectedWhyIncluded] = useState<DatasetRecord | null>(null);

  // Monitoring Simulation
  const [isSimulatingMonitoring, setIsSimulatingMonitoring] = useState(false);
  const [monitoringMessage, setMonitoringMessage] = useState<string | null>(null);

  const fetchDatasetData = () => {
    const id = datasetIdParam || 'dataset_flagship_demo';
    let url = `/api/datasets/${id}?search=${encodeURIComponent(searchTerm)}&minConfidence=${minConfidence}`;
    if (conflictsOnly) url += '&conflictsOnly=true';

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.dataset) setDataset(data.dataset);
        if (data.records) setRecords(data.records);
      })
      .catch((err) => console.error('Error fetching dataset', err));
  };

  useEffect(() => {
    fetchDatasetData();
  }, [datasetIdParam, searchTerm, minConfidence, conflictsOnly]);

  const handleApplyNlFilter = () => {
    if (!nlFilter.trim()) return;
    const lower = nlFilter.toLowerCase();
    if (lower.includes('100') || lower.includes('>100')) {
      setRecords((prev) => prev.filter((r) => (r.employees.value || 0) > 100));
    } else if (lower.includes('high') || lower.includes('90')) {
      setMinConfidence(0.9);
    } else if (lower.includes('conflict')) {
      setConflictsOnly(true);
    } else {
      setSearchTerm(nlFilter);
    }
  };

  const handleSimulateMonitoring = async () => {
    if (!dataset) return;
    setIsSimulatingMonitoring(true);
    setMonitoringMessage(null);

    try {
      const res = await fetch(`/api/datasets/${dataset.id}/monitoring`, { method: 'POST' });
      const data = await res.json();
      setMonitoringMessage(data.message);
      fetchDatasetData(); // reload
    } catch (err) {
      console.error('Monitoring check failed', err);
    } finally {
      setIsSimulatingMonitoring(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Dataset Header (DESIGN.md Section 26) */}
      <div className="dataforge-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 600 }}>{dataset?.name || 'Dataset Explorer'}</h1>
              <span className="badge badge-verified">● {dataset?.status || 'ACTIVE'}</span>
              <span className="badge badge-synthetic">SYNTHETIC DATA</span>
              <span className="font-mono text-cyan" style={{ fontSize: '12px' }}>
                Version: {dataset?.currentVersion || 'v1.0'}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {dataset?.description || 'Autonomous multi-source intelligence dataset with verified provenance.'}
            </p>
          </div>

          {/* Action buttons: Monitoring, CSV, JSON */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleSimulateMonitoring}
              disabled={isSimulatingMonitoring}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '6px 14px' }}
              title="Detects changes in previously collected data (headcount growth, new funding, new jobs)"
            >
              <RefreshCw size={13} className={isSimulatingMonitoring ? 'animate-spin' : ''} />
              <span>{isSimulatingMonitoring ? 'Scanning...' : 'Check Monitoring (Simulate)'}</span>
            </button>

            <a
              href={`/api/datasets/${dataset?.id || 'dataset_flagship_demo'}/export?format=csv`}
              download
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              <Download size={13} />
              <span>Export CSV</span>
            </a>

            <a
              href={`/api/datasets/${dataset?.id || 'dataset_flagship_demo'}/export?format=json`}
              download
              className="btn-primary"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              <Download size={13} />
              <span>Export JSON</span>
            </a>
          </div>
        </div>

        {/* Change alert banner if monitoring check detected updates */}
        {monitoringMessage && (
          <div
            style={{
              marginTop: '16px',
              padding: '10px 14px',
              background: 'rgba(95, 227, 161, 0.1)',
              border: '1px solid rgba(95, 227, 161, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-verified)',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{monitoringMessage}</span>
          </div>
        )}
      </div>

      {/* Toolbar & Filters (DESIGN.md Section 26) */}
      <div
        className="dataforge-card"
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          {/* Keyword Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 12px',
              flex: 1,
            }}
          >
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search companies, cities, industries, signals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '13px' }}
            />
          </div>

          {/* Natural Language Filter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 10px',
              flex: 1,
            }}
          >
            <Sparkles size={13} color="var(--accent-cyan)" />
            <input
              type="text"
              placeholder="AI Filter: e.g. Only companies >100 employees"
              value={nlFilter}
              onChange={(e) => setNlFilter(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyNlFilter()}
              style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '12px' }}
            />
            <button
              onClick={handleApplyNlFilter}
              style={{ fontSize: '11px', color: 'var(--accent-cyan)', background: 'transparent' }}
            >
              Apply
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={conflictsOnly}
              onChange={(e) => setConflictsOnly(e.target.checked)}
            />
            <span>Conflicts Only</span>
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Confidence:</span>
            <select
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 8px',
                fontSize: '11px',
                color: 'var(--text-primary)',
              }}
            >
              <option value="0">All Confidence</option>
              <option value="0.80">&gt; 80% High</option>
              <option value="0.90">&gt; 90% Very High</option>
            </select>
          </div>

          <span className="font-mono text-muted" style={{ fontSize: '12px' }}>
            Showing <strong>{records.length}</strong> records
          </span>
        </div>
      </div>

      {/* High-Density Data Table (DESIGN.md Section 27) */}
      <div
        className="dataforge-card"
        style={{ padding: 0, overflowX: 'auto', border: '1px solid var(--border-primary)' }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Company
              </th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Industry
              </th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Location
              </th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Employees
              </th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Funding Total
              </th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Signals & Jobs
              </th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Confidence
              </th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
                Why Included?
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr
                key={r.id}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  background: i % 2 === 0 ? 'var(--bg-elevated)' : 'transparent',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(77, 220, 255, 0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? 'var(--bg-elevated)' : 'transparent')}
              >
                {/* Company Name & Link */}
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedRecord(r)}
                      style={{
                        fontWeight: 600,
                        color: 'var(--accent-cyan)',
                        textAlign: 'left',
                        background: 'transparent',
                        fontSize: '13px',
                      }}
                    >
                      {r.companyName.value}
                    </button>
                    <a href={r.website.value} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Est. {r.foundedYear.value}
                  </div>
                </td>

                {/* Industry */}
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                  {r.industry.value}
                </td>

                {/* Location */}
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                  {r.city.value}, {r.country.value}
                </td>

                {/* Employees (Clickable for Evidence & Conflict Details) */}
                <td style={{ padding: '12px 16px' }}>
                  <button
                    onClick={() =>
                      setSelectedFieldEvidence({
                        fieldName: 'Employee Headcount',
                        value: r.employees.value,
                        confidence: r.employees.confidence,
                        evidence: r.employees.evidence,
                        resolutionReason: r.employees.confidenceReason,
                      })
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'var(--bg-secondary)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      border: r.employees.hasConflict ? '1px solid var(--color-conflict)' : '1px solid var(--border-subtle)',
                      color: r.employees.hasConflict ? 'var(--color-conflict)' : 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                    }}
                    title="Click to view multi-source observation evidence & conflict resolution"
                  >
                    <span>{r.employees.value}</span>
                    {r.employees.hasConflict && <AlertTriangle size={12} color="var(--color-conflict)" />}
                  </button>
                </td>

                {/* Funding Total (Clickable for Evidence) */}
                <td style={{ padding: '12px 16px' }}>
                  <button
                    onClick={() =>
                      setSelectedFieldEvidence({
                        fieldName: 'Venture Capital Funding',
                        value: `${r.fundingTotal.value} (${r.lastFundingRound.value})`,
                        confidence: r.fundingTotal.confidence,
                        evidence: r.fundingTotal.evidence,
                        resolutionReason: r.fundingTotal.confidenceReason,
                      })
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'transparent',
                      color: 'var(--color-verified)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                    }}
                    title="Click to view funding filings & wire observations"
                  >
                    <span>{r.fundingTotal.value}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({r.lastFundingRound.value})</span>
                  </button>
                </td>

                {/* Signals & Open Roles */}
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                      <strong>{r.openJobsCount.value}</strong> open roles
                    </div>
                    {r.demandSignals.value.length > 0 && (
                      <span style={{ fontSize: '11px', color: 'var(--color-warning)' }}>
                        {r.demandSignals.value[0]?.substring(0, 38)}...
                      </span>
                    )}
                  </div>
                </td>

                {/* Confidence Badge */}
                <td style={{ padding: '12px 16px' }}>
                  <span
                    className={`badge ${
                      r.overallConfidence >= 0.85
                        ? 'badge-verified'
                        : r.overallConfidence >= 0.7
                        ? 'badge-warning'
                        : 'badge-conflict'
                    }`}
                  >
                    ● {Math.round(r.overallConfidence * 100)}%
                  </span>
                </td>

                {/* Why Included? Button (DESIGN.md Section 30) */}
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <button
                    onClick={() => setSelectedWhyIncluded(r)}
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '11px' }}
                  >
                    <span>Why Included?</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Field-Level Evidence Modal / Drawer (DESIGN.md Section 31) */}
      {selectedFieldEvidence && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            className="dataforge-card"
            style={{
              width: '100%',
              maxWidth: '560px',
              background: 'var(--bg-elevated)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  FIELD PROVENANCE TRACEABILITY
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedFieldEvidence.fieldName}
                </h3>
              </div>
              <button onClick={() => setSelectedFieldEvidence(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CURRENT RESOLVED VALUE</div>
                <div className="font-mono" style={{ fontSize: '20px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  {String(selectedFieldEvidence.value)}
                </div>
              </div>
              <span className="badge badge-verified">
                ● {Math.round(selectedFieldEvidence.confidence * 100)}% Confidence
              </span>
            </div>

            {/* Resolution Explanation */}
            {selectedFieldEvidence.resolutionReason && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}
              >
                <strong style={{ color: 'var(--text-primary)' }}>Consensus Resolution:</strong> {selectedFieldEvidence.resolutionReason}
              </div>
            )}

            {/* Contributing Evidence Observations */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Multi-Source Observations ({selectedFieldEvidence.evidence.length})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedFieldEvidence.evidence.map((ev, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ev.sourceName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Observed: <strong style={{ color: 'var(--accent-cyan)' }}>{String(ev.observedValue)}</strong> • Collected: {ev.collectedAt.split('T')[0]}
                      </div>
                    </div>
                    <span className="font-mono" style={{ color: 'var(--color-verified)', fontSize: '11px' }}>
                      {Math.round(ev.confidence * 100)}% match
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button onClick={() => setSelectedFieldEvidence(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Why Included?" Modal (DESIGN.md Section 30) */}
      {selectedWhyIncluded && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            className="dataforge-card"
            style={{
              width: '100%',
              maxWidth: '580px',
              background: 'var(--bg-elevated)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  MATCH EXPLAINABILITY & CRITERIA AUDIT
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedWhyIncluded.companyName.value}
                </h3>
              </div>
              <button onClick={() => setSelectedWhyIncluded(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginTop: '16px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {selectedWhyIncluded.whyIncluded.summary}
              </p>
            </div>

            {/* Criteria breakdown checklist */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedWhyIncluded.whyIncluded.matches.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 12px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {m.status === 'MET' ? (
                      <CheckCircle2 size={16} color="var(--color-verified)" />
                    ) : (
                      <AlertTriangle size={16} color="var(--color-warning)" />
                    )}
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{m.criterion}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.detail}</div>
                    </div>
                  </div>

                  <span
                    className="badge"
                    style={{
                      background: m.status === 'MET' ? 'var(--color-verified-bg)' : 'var(--color-warning-bg)',
                      color: m.status === 'MET' ? 'var(--color-verified)' : 'var(--color-warning)',
                    }}
                  >
                    {m.status}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="font-mono text-muted" style={{ fontSize: '12px' }}>
                Overall Record Confidence: <strong style={{ color: 'var(--accent-cyan)' }}>{Math.round(selectedWhyIncluded.overallConfidence * 100)}%</strong>
              </span>
              <button onClick={() => setSelectedWhyIncluded(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Inspector Drawer (DESIGN.md Section 29) */}
      {selectedRecord && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '480px',
            background: 'var(--bg-elevated)',
            borderLeft: '1px solid var(--border-strong)',
            boxShadow: '-8px 0 24px rgba(0,0,0,0.5)',
            zIndex: 90,
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                RECORD INSPECTOR • {selectedRecord.id}
              </span>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                {selectedRecord.companyName.value}
              </h2>
            </div>
            <button onClick={() => setSelectedRecord(null)} style={{ color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>INDUSTRY & HEADQUARTERS</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 500, marginTop: '2px' }}>
                {selectedRecord.industry.value} — {selectedRecord.city.value}, {selectedRecord.country.value}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>VENTURE FUNDING</div>
              <div className="font-mono text-green" style={{ fontSize: '15px', fontWeight: 600, marginTop: '2px' }}>
                {selectedRecord.fundingTotal.value} ({selectedRecord.lastFundingRound.value}, {selectedRecord.lastFundingDate.value})
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>VERIFIED HEADCOUNT</div>
              <div className="font-mono" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--accent-cyan)', marginTop: '2px' }}>
                {selectedRecord.employees.value} employees
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ACTIVE RECRUITMENT</div>
              <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginTop: '2px' }}>
                {selectedRecord.openJobsCount.value} active positions (ATS Telemetry)
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {selectedRecord.hiringSignals.value.map((h, i) => (
                  <span key={i} style={{ fontSize: '11px', padding: '2px 6px', background: 'var(--bg-secondary)', borderRadius: '3px', color: 'var(--text-secondary)' }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-warning)', fontWeight: 600 }}>
                AI-DERIVED OPPORTUNITY SIGNALS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                {selectedRecord.demandSignals.value.map((sig, i) => (
                  <div key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '6px 8px', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
                    ⚡ {sig}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
              <a
                href={selectedRecord.website.value}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{ width: '100%' }}
              >
                <span>Visit Corporate Website</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DatasetsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '32px', color: 'var(--text-muted)' }}>Loading Datasets...</div>}>
      <DatasetContent />
    </Suspense>
  );
}
