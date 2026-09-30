'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Sparkles,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Terminal,
  Activity,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Check,
} from 'lucide-react';
import { ResearchTask, WorkflowNode, WorkflowEvent } from '@/types/research';
import { DEMO_SCENARIOS } from '@/lib/synthetic/scenarios';

function ResearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTaskId = searchParams.get('taskId');

  const [prompt, setPrompt] = useState(
    'Find Indian SaaS companies that raised funding recently, have 50–500 employees, are actively hiring, and show signals that they may need cybersecurity services.'
  );
  const [currentTask, setCurrentTask] = useState<ResearchTask | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingReqs, setIsEditingReqs] = useState(false);

  // Load task and stream events
  useEffect(() => {
    if (!initialTaskId) return;

    fetch(`/api/research/${initialTaskId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.task) {
          setCurrentTask(data.task);
          setPrompt(data.task.prompt);
        }
      })
      .catch((err) => console.error('Error fetching task', err));

    const eventSource = new EventSource(`/api/research/${initialTaskId}/stream`);

    eventSource.addEventListener('init', (e) => {
      try {
        const task = JSON.parse(e.data);
        setCurrentTask(task);
      } catch (err) {}
    });

    eventSource.addEventListener('update', (e) => {
      try {
        const updateEvent: WorkflowEvent = JSON.parse(e.data);
        setCurrentTask((prev) => {
          if (!prev) return null;
          const updatedNodes = prev.workflow.nodes.map((n) => {
            if (n.id === updateEvent.nodeId && updateEvent.nodeStatus) {
              return {
                ...n,
                status: updateEvent.nodeStatus,
                recordsProcessed: updateEvent.data?.recordsProcessed ?? n.recordsProcessed,
              };
            }
            return n;
          });

          return {
            ...prev,
            progressPercent: updateEvent.progressPercent,
            currentStepMessage: updateEvent.message,
            workflow: { ...prev.workflow, nodes: updatedNodes },
            logs: [
              ...prev.logs,
              {
                timestamp: updateEvent.timestamp,
                level: updateEvent.nodeStatus === 'FAILED' ? 'error' : updateEvent.nodeStatus === 'WARNING' ? 'warn' : 'info',
                stage: updateEvent.stage,
                message: updateEvent.message,
              },
            ],
            status:
              updateEvent.type === 'research.completed'
                ? 'COMPLETED'
                : updateEvent.type === 'research.failed'
                ? 'FAILED'
                : prev.status,
          };
        });
      } catch (err) {}
    });

    return () => {
      eventSource.close();
    };
  }, [initialTaskId]);

  const handleStartResearch = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, autoRun: true }),
      });
      const data = await res.json();
      if (data.taskId) {
        router.push(`/research?taskId=${data.taskId}`);
      }
    } catch (err) {
      console.error('Failed to start research', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isCompleted = currentTask?.status === 'COMPLETED';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Top Header Card */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              RESEARCH SPECIFICATION
            </span>
            {currentTask && (
              <span className="badge-pill badge-pill-accent">
                {currentTask.status} • {currentTask.progressPercent}%
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isCompleted && (
              <button
                onClick={() => router.push(`/datasets?id=${currentTask.datasetId || 'dataset_flagship_demo'}`)}
                className="btn-luxury-primary"
                style={{ padding: '7px 16px', fontSize: '13px' }}
              >
                <Database size={15} />
                <span>Explore Generated Dataset</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px' }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={currentTask?.status === 'RUNNING'}
            rows={2}
            style={{
              flex: 1,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-default)',
              borderRadius: '10px',
              padding: '14px 16px',
              fontSize: '14px',
              resize: 'none',
              outline: 'none',
              boxShadow: 'var(--shadow-sm)',
            }}
          />

          <button
            onClick={handleStartResearch}
            disabled={isLoading || currentTask?.status === 'RUNNING'}
            className="btn-luxury-primary"
            style={{ padding: '0 24px', whiteSpace: 'nowrap' }}
          >
            <Play size={15} fill="currentColor" />
            <span>{currentTask?.status === 'RUNNING' ? 'Executing Pipeline...' : 'Start Research'}</span>
          </button>
        </div>

        {/* Demo Scenario Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Predefined Scenarios:</span>
          {DEMO_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setPrompt(sc.prompt)}
              className="btn-luxury-secondary"
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '16px',
              }}
            >
              {sc.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Split: AI Understanding vs Workflow Execution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Left Column: AI Understanding Panel */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} color="var(--accent-blue)" />
              <h2 style={{ fontSize: '15px', fontWeight: 700 }}>AI Interpretation</h2>
            </div>
            <button
              onClick={() => setIsEditingReqs(!isEditingReqs)}
              style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: 600 }}
            >
              {isEditingReqs ? 'Done' : 'Edit Spec'}
            </button>
          </div>

          {currentTask ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  TARGET ENTITY
                </span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                  {currentTask.requirements.entity || 'Company'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  INDUSTRY VERTICALS
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {currentTask.requirements.industries?.map((ind) => (
                    <span
                      key={ind}
                      style={{
                        padding: '3px 8px',
                        background: 'var(--bg-surface-elevated)',
                        borderRadius: '6px',
                        border: '1px solid var(--border-default)',
                        fontSize: '11px',
                        fontWeight: 500,
                      }}
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  LOCATION JURISDICTION
                </span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 500, marginTop: '2px' }}>
                  {currentTask.requirements.locations?.join(', ') || 'India'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  HEADCOUNT THRESHOLD
                </span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                  {currentTask.requirements.employeeRange?.min || 50} – {currentTask.requirements.employeeRange?.max || 500} employees
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  OPPORTUNITY SIGNALS
                </span>
                <div style={{ color: 'var(--color-warning)', marginTop: '2px', lineHeight: 1.4, fontSize: '12px' }}>
                  {currentTask.requirements.signals?.join(', ') || 'Cybersecurity demand & engineering expansion'}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  REQUIRED PROVENANCE FIELDS
                </span>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {currentTask.requirements.requiredFields?.map((f) => (
                    <span
                      key={f}
                      className="font-mono"
                      style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--accent-blue)',
                        borderRadius: '4px',
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '36px 0' }}>
              Enter prompt and click &quot;Start Research&quot; to synthesize requirements.
            </div>
          )}

          {/* Metric Chips */}
          {currentTask && (
            <div
              style={{
                marginTop: 'auto',
                paddingTop: '18px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}
            >
              <div style={{ padding: '10px', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DISCOVERED</div>
                <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700 }}>
                  {currentTask.metrics.recordsDiscovered || 28}
                </div>
              </div>

              <div style={{ padding: '10px', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>VERIFIED</div>
                <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-success)' }}>
                  {currentTask.metrics.verifiedRecords || 24}
                </div>
              </div>

              <div style={{ padding: '10px', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MERGED DUPLICATES</div>
                <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-warning)' }}>
                  {currentTask.metrics.duplicatesDetected || 2}
                </div>
              </div>

              <div style={{ padding: '10px', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>RESOLVED CONFLICTS</div>
                <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-conflict)' }}>
                  {currentTask.metrics.conflictsResolved || 2}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Workflow Stepper & Agent Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Workflow Stepper Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} color="var(--accent-blue)" />
                <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Autonomous Pipeline Stepper</h2>
              </div>
              <span className="font-mono" style={{ fontSize: '12px', color: 'var(--accent-blue)', fontWeight: 600 }}>
                {currentTask?.progressPercent || 0}% Complete
              </span>
            </div>

            {/* Glowing Gradient Progress Bar */}
            <div style={{ height: '5px', background: 'var(--bg-app)', borderRadius: '3px', marginBottom: '22px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${currentTask?.progressPercent || 0}%`,
                  background: 'var(--accent-gradient)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>

            {/* Workflow Pipeline Nodes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentTask?.workflow.nodes.map((node, index) => {
                const isRunning = node.status === 'RUNNING';
                const isCompleted = node.status === 'COMPLETED';

                return (
                  <div
                    key={node.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      background: isRunning ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                      border: isRunning ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      boxShadow: isRunning ? '0 0 16px rgba(99, 102, 241, 0.25)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)', width: '22px' }}>
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, fontSize: '14px', color: isRunning ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                            {node.name}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {node.description}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {isRunning && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-blue)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                          <RefreshCw size={12} className="animate-spin" />
                          <span>PROCESSING</span>
                        </div>
                      )}
                      {isCompleted && (
                        <span className="badge-pill badge-pill-success">
                          <Check size={11} /> VERIFIED
                        </span>
                      )}
                      {node.status === 'QUEUED' && (
                        <span style={{ fontSize: '11px', color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>
                          QUEUED
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Agent Orchestration Terminal */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <Terminal size={15} color="var(--accent-blue)" />
              <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                Agent Telemetry Console
              </span>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                height: '170px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '7px',
                lineHeight: 1.45,
              }}
            >
              {currentTask?.logs.map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--text-disabled)' }}>
                    {log.timestamp.split('T')[1]?.substring(0, 8)}
                  </span>
                  <span style={{ color: log.level === 'error' ? 'var(--color-danger)' : log.level === 'warn' ? 'var(--color-warning)' : 'var(--accent-blue)' }}>
                    [{log.stage}]
                  </span>
                  <span style={{ color: 'var(--text-primary)' }}>{log.message}</span>
                </div>
              ))}
              {(!currentTask || currentTask.logs.length === 0) && (
                <div style={{ color: 'var(--text-disabled)' }}>Awaiting workflow start...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '32px', color: 'var(--text-muted)' }}>Loading Research Workspace...</div>}>
      <ResearchContent />
    </Suspense>
  );
}
