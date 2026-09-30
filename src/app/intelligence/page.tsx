'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Network,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Sparkles,
  ShieldCheck,
  Building2,
  DollarSign,
  Briefcase,
  Radio,
  X,
  ExternalLink,
} from 'lucide-react';
import { GraphData, GraphNode, AIInsight } from '@/types/intelligence';

function IntelligenceContent() {
  const searchParams = useSearchParams();
  const datasetIdParam = searchParams.get('datasetId') || 'dataset_flagship_demo';

  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch(`/api/datasets/${datasetIdParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.graphData) {
          const nodesWithCoords = data.graphData.nodes.map((node: GraphNode, index: number) => {
            const angle = (index / data.graphData.nodes.length) * 2 * Math.PI;
            const distance = node.type === 'company' ? 180 : node.type === 'source' ? 360 : 270;
            return {
              ...node,
              x: 480 + Math.cos(angle) * distance + (index % 3) * 20,
              y: 330 + Math.sin(angle) * distance + (index % 2) * 20,
            };
          });
          setGraphData({ nodes: nodesWithCoords, edges: data.graphData.edges });
        }
        if (data.insights) setInsights(data.insights);
      })
      .catch((err) => console.error('Error fetching intelligence graph', err));
  }, [datasetIdParam]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const filteredNodes = graphData.nodes.filter((node) => {
    if (filterType === 'all') return true;
    return node.type === filterType;
  });

  const nodePositionMap = new Map<string, { x: number; y: number }>();
  filteredNodes.forEach((n) => nodePositionMap.set(n.id, { x: n.x || 0, y: n.y || 0 }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            INTELLIGENCE GRAPH & DISCOVERY
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginTop: '2px', letterSpacing: '-0.02em' }}>
            Evidence & Relationship Graph
          </h1>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'company', 'funding_round', 'opportunity', 'source'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className="btn-luxury-secondary"
              style={{
                fontSize: '11px',
                padding: '5px 12px',
                borderRadius: '20px',
                background: filterType === t ? 'var(--accent-subtle)' : undefined,
                borderColor: filterType === t ? 'var(--accent-blue)' : undefined,
                color: filterType === t ? 'var(--accent-blue)' : undefined,
                fontWeight: filterType === t ? 700 : 500,
                textTransform: 'capitalize',
              }}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas & Inspector Split */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedNode ? '2.5fr 1fr' : '1fr', gap: '24px' }}>
        {/* Canvas Area */}
        <div
          className="glass-panel"
          style={{
            height: '620px',
            position: 'relative',
            overflow: 'hidden',
            padding: 0,
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Floating Controls */}
          <div style={{ position: 'absolute', top: 18, right: 18, zIndex: 10, display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setZoom((z) => Math.min(2, z + 0.15))}
              className="btn-luxury-secondary"
              style={{ padding: '7px 11px', borderRadius: '8px' }}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
              className="btn-luxury-secondary"
              style={{ padding: '7px 11px', borderRadius: '8px' }}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="btn-luxury-secondary"
              style={{ padding: '7px 11px', borderRadius: '8px' }}
              title="Reset View"
            >
              <Maximize2 size={14} />
            </button>
          </div>

          {/* SVG Canvas */}
          <svg width="100%" height="100%">
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Edges */}
              {graphData.edges.map((edge) => {
                const s = nodePositionMap.get(edge.source);
                const t = nodePositionMap.get(edge.target);
                if (!s || !t) return null;

                const isHighlighted = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

                return (
                  <line
                    key={edge.id}
                    x1={s.x}
                    y1={s.y}
                    x2={t.x}
                    y2={t.y}
                    stroke={isHighlighted ? 'var(--accent-blue)' : 'var(--border-strong)'}
                    strokeWidth={isHighlighted ? 2 : 1}
                    strokeDasharray={edge.type === 'EVIDENCED_BY' ? '4 3' : 'none'}
                    opacity={isHighlighted ? 1 : 0.45}
                  />
                );
              })}

              {/* Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const radius = node.radius || 18;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x || 0}, ${node.y || 0})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Glow outline on selection */}
                    {isSelected && (
                      <circle
                        r={radius + 8}
                        fill="none"
                        stroke="var(--accent-blue)"
                        strokeWidth="2"
                        opacity="0.8"
                      />
                    )}

                    {/* Node circle */}
                    <circle
                      r={radius}
                      fill="var(--bg-surface-elevated)"
                      stroke={node.color || 'var(--accent-blue)'}
                      strokeWidth={isSelected ? 3 : 1.8}
                    />

                    {/* Node label */}
                    <text
                      y={radius + 15}
                      textAnchor="middle"
                      fill="var(--text-primary)"
                      fontSize="11px"
                      fontFamily="var(--font-mono)"
                      fontWeight={isSelected ? 700 : 500}
                    >
                      {node.label.length > 22 ? `${node.label.substring(0, 20)}...` : node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Right Node Inspector */}
        {selectedNode && (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                  {selectedNode.type.replace('_', ' ')} NODE
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginTop: '2px' }}>
                  {selectedNode.data.title || selectedNode.label}
                </h3>
              </div>
              <button onClick={() => setSelectedNode(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={17} />
              </button>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {selectedNode.data.subtitle}
            </div>

            {selectedNode.data.confidence !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-surface-elevated)', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Confidence Score</span>
                <span className="badge-pill badge-pill-success">● {Math.round(selectedNode.data.confidence * 100)}%</span>
              </div>
            )}

            {selectedNode.data.properties && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>ATTRIBUTES</span>
                {Object.entries(selectedNode.data.properties).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{k}:</span>
                    <span style={{ fontWeight: 600 }}>{String(v)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Opportunity Signals & Market Insights */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Sparkles size={18} color="var(--accent-blue)" />
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>AI Intelligence Signals (Observed Fact vs Inference)</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
          {insights.map((ins) => (
            <div
              key={ins.id}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>{ins.title}</span>
                <span className="badge-pill badge-pill-warning">● {Math.round(ins.confidence * 100)}% Confidence</span>
              </div>

              {/* Observed Facts */}
              <div style={{ padding: '12px 14px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 700, textTransform: 'uppercase' }}>
                  OBSERVED EVIDENCE (FACTS)
                </div>
                <ul style={{ paddingLeft: '18px', marginTop: '6px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {ins.observedFacts.map((fact, idx) => (
                    <li key={idx}>{fact}</li>
                  ))}
                </ul>
              </div>

              {/* Inferred Signal */}
              <div style={{ padding: '12px 14px', background: 'var(--accent-subtle)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <div style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: 700, textTransform: 'uppercase' }}>
                  AI-DERIVED OPPORTUNITY SIGNAL (INFERENCE)
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
                  {ins.inferredSignal}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function IntelligencePage() {
  return (
    <Suspense fallback={<div style={{ padding: '32px', color: 'var(--text-muted)' }}>Loading Evidence Graph...</div>}>
      <IntelligenceContent />
    </Suspense>
  );
}
