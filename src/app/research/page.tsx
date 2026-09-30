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

  // Load task if taskId present
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

    // Connect to SSE stream
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
              return { ...n, status: updateEvent.nodeStatus, recordsProcessed: updateEvent.data?.recordsProcessed ?? n.recordsProcessed };
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Research Request Header / Input (DESIGN.md Section 18 & 20) */}
      <div className="dataforge-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              RESEARCH REQUEST
            </span>
            {currentTask && (
              <span className="badge badge-running">
                {currentTask.status} ({currentTask.progressPercent}%)
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isCompleted && (
              <button
                onClick={() => router.push(`/datasets?id=${currentTask.datasetId || 'dataset_flagship_demo'}`)}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                <Database size={14} />
                <span>Explore Dataset</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={currentTask?.status === 'RUNNING'}
            rows={2}
            style={{
              flex: 1,
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              fontSize: '14px',
              resize: 'none',
              outline: 'none',
            }}
          />

          <button
            onClick={handleStartResearch}
            disabled={isLoading || currentTask?.status === 'RUNNING'}
            className="btn-primary"
            style={{ padding: '0 20px', whiteSpace: 'nowrap' }}
          >
            <Play size={15} fill="currentColor" />
            <span>{currentTask?.status === 'RUNNING' ? 'Executing...' : 'Start Research'}</span>
          </button>
        </div>

        {/* Suggested Quick Prompts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Demo Scenarios:</span>
          {DEMO_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setPrompt(sc.prompt)}
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              {sc.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Split: AI Understanding + Workflow Execution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Left Column: AI Understanding Panel (DESIGN.md Section 21) */}
        <div className="dataforge-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '14px', fontWeight: 600 }}>AI Interpretation</h2>
            </div>
            <button
              onClick={() => setIsEditingReqs(!isEditingReqs)}
              style={{ fontSize: '11px', color: 'var(--accent-cyan)', background: 'transparent' }}
            >
              {isEditingReqs ? 'Done' : 'Edit Requirements'}
            </button>
          </div>

          {currentTask ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                  TARGET ENTITY
                </span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 500, marginTop: '2px' }}>
                  {currentTask.requirements.entity || 'Company'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                  INDUSTRY FILTER
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                  {currentTask.requirements.industries?.map((ind) => (
                    <span key={ind} style={{ padding: '2px 6px', background: 'var(--bg-secondary)', borderRadius: '3px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                  GEOGRAPHIC JURISDICTION
                </span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 500, marginTop: '2px' }}>
                  {currentTask.requirements.locations?.join(', ') || 'India'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                  HEADCOUNT BRACKET
                </span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 500, marginTop: '2px' }}>
                  {currentTask.requirements.employeeRange?.min || 50} – {currentTask.requirements.employeeRange?.max || 500} employees
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                  FUNDING RECENCY
                </span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 500, marginTop: '2px' }}>
                  {currentTask.requirements.funding?.recency || 'Recent (Last 12-18 Months)'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                  DERIVED SIGNALS
                </span>
                <div style={{ color: 'var(--color-warning)', marginTop: '2px', lineHeight: 1.4 }}>
                  {currentTask.requirements.signals?.join(', ') || 'Cybersecurity demand & engineering expansion'}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                  PROVENANCE FIELDS
                </span>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {currentTask.requirements.requiredFields?.map((f) => (
                    <span key={f} className="font-mono" style={{ fontSize: '10px', padding: '2px 5px', background: 'var(--bg-secondary)', color: 'var(--accent-cyan)' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', padding: '24px 0' }}>
              Enter a prompt above and click &quot;Start Research&quot; to synthesize requirement interpretation.
            </div>
          )}

          {/* Live Metric Counters (DESIGN.md Section 25) */}
          {currentTask && (
            <div
              style={{
                marginTop: 'auto',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              <div style={{ padding: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>DISCOVERED</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {currentTask.metrics.recordsDiscovered || 28}
                </div>
              </div>

              <div style={{ padding: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>VERIFIED</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-verified)' }}>
                  {currentTask.metrics.verifiedRecords || 24}
                </div>
              </div>

              <div style={{ padding: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>DUPLICATES MERGED</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-warning)' }}>
                  {currentTask.metrics.duplicatesDetected || 2}
                </div>
              </div>

              <div style={{ padding: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CONFLICTS RESOLVED</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-conflict)' }}>
                  {currentTask.metrics.conflictsResolved || 2}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Workflow Visualization & Agent Console (DESIGN.md Section 22, 23, 24) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Workflow Graph Nodes */}
          <div className="dataforge-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} color="var(--accent-cyan)" />
                <h2 style={{ fontSize: '14px', fontWeight: 600 }}>Autonomous Workflow Pipeline</h2>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Progress: {currentTask?.progressPercent || 0}%
              </div>
            </div>

            {/* Progress Bar with Data Flow Accent */}
            <div style={{ height: '4px', background: 'var(--bg-primary)', borderRadius: '2px', marginBottom: '20px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${currentTask?.progressPercent || 0}%`,
                  background: 'linear-gradient(90deg, #4DDCFF, #5FE3A1)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>

            {/* Workflow Nodes Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                      padding: '12px 14px',
                      background: isRunning ? 'var(--bg-higher)' : 'var(--bg-secondary)',
                      border: isRunning ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.2s ease',
                      boxShadow: isRunning ? '0 0 10px rgba(77, 220, 255, 0.2)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', width: '20px' }}>
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, fontSize: '13px', color: isRunning ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                            {node.name}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {node.description}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {isRunning && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                          <RefreshCw size={12} className="animate-spin" />
                          <span>PROCESSING</span>
                        </div>
                      )}
                      {isCompleted && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-verified)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                          <CheckCircle2 size={13} />
                          <span>VERIFIED</span>
                        </div>
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

          {/* Active Agent Operator Console (DESIGN.md Section 24) */}
          <div className="dataforge-card" style={{ background: '#07090C', borderColor: 'var(--border-subtle)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <Terminal size={14} color="var(--accent-cyan)" />
              <span style={{ fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Agent Orchestration Terminal
              </span>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                height: '160px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                lineHeight: 1.4,
              }}
            >
              {currentTask?.logs.map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--text-disabled)' }}>
                    {log.timestamp.split('T')[1]?.substring(0, 8)}
                  </span>
                  <span style={{ color: log.level === 'error' ? 'var(--color-critical)' : log.level === 'warn' ? 'var(--color-warning)' : 'var(--accent-cyan)' }}>
                    [{log.stage}]
                  </span>
                  <span style={{ color: 'var(--text-primary)' }}>{log.message}</span>
                </div>
              ))}
              {(!currentTask || currentTask.logs.length === 0) && (
                <div style={{ color: 'var(--text-disabled)' }}>Terminal awaiting research task execution...</div>
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
