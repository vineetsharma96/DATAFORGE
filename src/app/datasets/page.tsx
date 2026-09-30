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
  SlidersHorizontal,
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
      fetchDatasetData();
    } catch (err) {
      console.error('Monitoring check failed', err);
    } finally {
      setIsSimulatingMonitoring(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Dataset Header */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                {dataset?.name || 'Dataset Explorer'}
              </h1>
              <span className="badge-pill badge-pill-success">● {dataset?.status || 'ACTIVE'}</span>
              <span className="badge-pill badge-pill-warning">SYNTHETIC</span>
              <span className="font-mono" style={{ fontSize: '12px', color: 'var(--accent-blue)', fontWeight: 600 }}>
                {dataset?.currentVersion || 'v1.0'}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {dataset?.description || 'Autonomous multi-source intelligence dataset with verified provenance.'}
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleSimulateMonitoring}
              disabled={isSimulatingMonitoring}
              className="btn-luxury-secondary"
              style={{ fontSize: '12px', padding: '7px 14px' }}
              title="Detects changes in previously collected data"
            >
              <RefreshCw size={13} className={isSimulatingMonitoring ? 'animate-spin' : ''} />
              <span>{isSimulatingMonitoring ? 'Checking...' : 'Check Monitoring (Simulate)'}</span>
            </button>

            <a
              href={`/api/datasets/${dataset?.id || 'dataset_flagship_demo'}/export?format=csv`}
              download
              className="btn-luxury-secondary"
              style={{ fontSize: '12px', padding: '7px 14px' }}
            >
              <Download size={13} />
              <span>Export CSV</span>
            </a>

            <a
              href={`/api/datasets/${dataset?.id || 'dataset_flagship_demo'}/export?format=json`}
              download
              className="btn-luxury-primary"
              style={{ fontSize: '12px', padding: '7px 14px' }}
            >
              <Download size={13} />
              <span>Export JSON</span>
            </a>
          </div>
        </div>

        {/* Change alert banner */}
        {monitoringMessage && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              background: 'var(--color-success-bg)',
              border: '1px solid var(--color-success-border)',
              borderRadius: '10px',
              color: 'var(--color-success)',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <CheckCircle2 size={17} />
            <span>{monitoringMessage}</span>
          </div>
        )}
      </div>

      {/* Modern Filter Toolbar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '320px' }}>
          {/* Keyword Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-default)',
              borderRadius: '10px',
              padding: '8px 14px',
              flex: 1,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search companies, cities, industries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '13px' }}
            />
          </div>

          {/* AI Filter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-default)',
              borderRadius: '10px',
              padding: '8px 12px',
              flex: 1,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Sparkles size={14} color="var(--accent-blue)" />
            <input
              type="text"
              placeholder="AI Filter: e.g. Only companies >100 employees"
              value={nlFilter}
              onChange={(e) => setNlFilter(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyNlFilter()}
              style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '13px' }}
            />
            <button
              onClick={handleApplyNlFilter}
              style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: 600, background: 'transparent' }}
            >
              Filter
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={conflictsOnly}
              onChange={(e) => setConflictsOnly(e.target.checked)}
            />
            <span>Conflicts Only</span>
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Confidence:</span>
            <select
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '12px',
                color: 'var(--text-primary)',
              }}
            >
              <option value="0">All Confidence</option>
              <option value="0.80">&gt; 80% High</option>
              <option value="0.90">&gt; 90% Very High</option>
            </select>
          </div>

          <span className="font-mono text-muted" style={{ fontSize: '12px' }}>
            <strong>{records.length}</strong> records
          </span>
        </div>
      </div>

      {/* Modern High-Density Table */}
      <div className="glass-panel" style={{ padding: 0, overflowX: 'auto', borderRadius: '14px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-default)' }}>
              <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Company
              </th>
              <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Industry
              </th>
              <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Location
              </th>
              <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Employees
              </th>
              <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Funding
              </th>
              <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Signals
              </th>
              <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Confidence
              </th>
              <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
                Inspection
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr
                key={r.id}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  background: i % 2 === 0 ? 'var(--bg-surface)' : 'transparent',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? 'var(--bg-surface)' : 'transparent')}
              >
                {/* Company Name & Link */}
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedRecord(r)}
                      style={{
                        fontWeight: 700,
                        color: 'var(--accent-blue)',
                        textAlign: 'left',
                        background: 'transparent',
                        fontSize: '14px',
                      }}
                    >
                      {r.companyName.value}
                    </button>
                    <a href={r.website.value} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    Founded {r.foundedYear.value}
                  </div>
                </td>

                {/* Industry */}
                <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                  {r.industry.value}
                </td>

                {/* Location */}
                <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                  {r.city.value}, {r.country.value}
                </td>

                {/* Employees (Clickable for Evidence) */}
                <td style={{ padding: '14px 18px' }}>
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
                      background: 'var(--bg-surface-elevated)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: r.employees.hasConflict ? '1px solid var(--color-conflict)' : '1px solid var(--border-default)',
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
                <td style={{ padding: '14px 18px' }}>
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
                      color: 'var(--color-success)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                    title="Click to view funding filings & wire observations"
                  >
                    <span>{r.fundingTotal.value}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 400 }}>
                      ({r.lastFundingRound.value})
                    </span>
                  </button>
                </td>

                {/* Signals */}
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {r.openJobsCount.value} active positions
                    </div>
                    {r.demandSignals.value.length > 0 && (
                      <span style={{ fontSize: '11px', color: 'var(--color-warning)' }}>
                        {r.demandSignals.value[0]?.substring(0, 36)}...
                      </span>
                    )}
                  </div>
                </td>

                {/* Confidence Badge */}
                <td style={{ padding: '14px 18px' }}>
                  <span
                    className={`badge-pill ${
                      r.overallConfidence >= 0.85
                        ? 'badge-pill-success'
                        : r.overallConfidence >= 0.7
                        ? 'badge-pill-warning'
                        : 'badge-pill-conflict'
                    }`}
                  >
                    ● {Math.round(r.overallConfidence * 100)}%
                  </span>
                </td>

                {/* Why Included Action */}
                <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                  <button
                    onClick={() => setSelectedWhyIncluded(r)}
                    className="btn-luxury-secondary"
                    style={{ padding: '4px 10px', fontSize: '11px' }}
                  >
                    Why Included?
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Field Provenance Modal */}
      {selectedFieldEvidence && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            className="glass-panel-elevated"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '26px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  FIELD PROVENANCE & LINEAGE
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '2px' }}>
                  {selectedFieldEvidence.fieldName}
                </h3>
              </div>
              <button onClick={() => setSelectedFieldEvidence(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CURRENT RESOLVED VALUE</div>
                <div className="font-mono" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent-blue)' }}>
                  {String(selectedFieldEvidence.value)}
                </div>
              </div>
              <span className="badge-pill badge-pill-success">
                ● {Math.round(selectedFieldEvidence.confidence * 100)}% Confidence
              </span>
            </div>

            {selectedFieldEvidence.resolutionReason && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '14px',
                  background: 'var(--bg-surface)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-default)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: 'var(--text-primary)' }}>Consensus Resolution:</strong> {selectedFieldEvidence.resolutionReason}
              </div>
            )}

            {/* Contributing observations */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>
                Multi-Source Observations ({selectedFieldEvidence.evidence.length})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedFieldEvidence.evidence.map((ev, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 14px',
                      background: 'var(--bg-surface)',
                      borderRadius: '8px',
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
                        Observed: <strong style={{ color: 'var(--accent-blue)' }}>{String(ev.observedValue)}</strong> • Recorded: {ev.collectedAt.split('T')[0]}
                      </div>
                    </div>
                    <span className="font-mono text-muted" style={{ fontSize: '11px' }}>
                      {Math.round(ev.confidence * 100)}% confidence
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button onClick={() => setSelectedFieldEvidence(null)} className="btn-luxury-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Why Included?" Match Analysis Modal */}
      {selectedWhyIncluded && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            className="glass-panel-elevated"
            style={{
              width: '100%',
              maxWidth: '580px',
              padding: '26px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  MATCH EXPLAINABILITY & AUDIT
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '2px' }}>
                  {selectedWhyIncluded.companyName.value}
                </h3>
              </div>
              <button onClick={() => setSelectedWhyIncluded(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '16px', lineHeight: 1.5 }}>
              {selectedWhyIncluded.whyIncluded.summary}
            </p>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedWhyIncluded.whyIncluded.matches.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-surface)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {m.status === 'MET' ? (
                      <CheckCircle2 size={16} color="var(--color-success)" />
                    ) : (
                      <AlertTriangle size={16} color="var(--color-warning)" />
                    )}
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{m.criterion}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.detail}</div>
                    </div>
                  </div>

                  <span
                    className="badge-pill"
                    style={{
                      background: m.status === 'MET' ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                      color: m.status === 'MET' ? 'var(--color-success)' : 'var(--color-warning)',
                    }}
                  >
                    {m.status}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="font-mono text-muted" style={{ fontSize: '12px' }}>
                Overall Record Confidence: <strong style={{ color: 'var(--accent-blue)' }}>{Math.round(selectedWhyIncluded.overallConfidence * 100)}%</strong>
              </span>
              <button onClick={() => setSelectedWhyIncluded(null)} className="btn-luxury-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Inspector Drawer */}
      {selectedRecord && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '480px',
            background: 'var(--bg-surface-elevated)',
            backdropFilter: 'blur(24px)',
            borderLeft: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 90,
            display: 'flex',
            flexDirection: 'column',
            padding: '28px',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '18px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                RECORD INSPECTOR • {selectedRecord.id}
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>
                {selectedRecord.companyName.value}
              </h2>
            </div>
            <button onClick={() => setSelectedRecord(null)} style={{ color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>INDUSTRY & LOCATION</div>
              <div style={{ fontWeight: 600, fontSize: '14px', marginTop: '2px' }}>
                {selectedRecord.industry.value} — {selectedRecord.city.value}, {selectedRecord.country.value}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>VENTURE FINANCING</div>
              <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-success)', marginTop: '2px' }}>
                {selectedRecord.fundingTotal.value} ({selectedRecord.lastFundingRound.value}, {selectedRecord.lastFundingDate.value})
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>VERIFIED HEADCOUNT</div>
              <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-blue)', marginTop: '2px' }}>
                {selectedRecord.employees.value} employees
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE RECRUITMENT</div>
              <div style={{ fontSize: '13px', marginTop: '2px', fontWeight: 500 }}>
                {selectedRecord.openJobsCount.value} active positions (ATS Telemetry)
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                {selectedRecord.hiringSignals.value.map((h, i) => (
                  <span key={i} style={{ fontSize: '11px', padding: '3px 8px', background: 'var(--bg-surface)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-warning)', fontWeight: 700 }}>
                AI-DERIVED OPPORTUNITY SIGNALS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {selectedRecord.demandSignals.value.map((sig, i) => (
                  <div key={i} style={{ fontSize: '12px', padding: '8px 10px', background: 'var(--bg-surface)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                    ⚡ {sig}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)' }}>
              <a
                href={selectedRecord.website.value}
                target="_blank"
                rel="noreferrer"
                className="btn-luxury-primary"
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
