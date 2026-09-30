'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
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
          // Initialize deterministic positions in a radial/force layout
          const nodesWithCoords = data.graphData.nodes.map((node: GraphNode, index: number) => {
            const angle = (index / data.graphData.nodes.length) * 2 * Math.PI;
            const distance = node.type === 'company' ? 180 : node.type === 'source' ? 360 : 270;
            return {
              ...node,
              x: 480 + Math.cos(angle) * distance + (index % 3) * 20,
              y: 340 + Math.sin(angle) * distance + (index % 2) * 20,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            RELATIONSHIP & PROVENANCE GRAPH
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, marginTop: '2px' }}>Evidence & Intelligence Graph</h1>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {['all', 'company', 'funding_round', 'opportunity', 'source'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                background: filterType === t ? 'var(--accent-cyan-subtle)' : 'var(--bg-secondary)',
                border: filterType === t ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                color: filterType === t ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                textTransform: 'capitalize',
              }}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph & Inspector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedNode ? '2.5fr 1fr' : '1fr', gap: '20px' }}>
        {/* Canvas Area */}
        <div
          className="dataforge-card"
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
          {/* Controls Overlay */}
          <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setZoom((z) => Math.min(2, z + 0.15))}
              className="btn-secondary"
              style={{ padding: '6px 10px' }}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
              className="btn-secondary"
              style={{ padding: '6px 10px' }}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="btn-secondary"
              style={{ padding: '6px 10px' }}
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
                    stroke={isHighlighted ? 'var(--accent-cyan)' : 'var(--border-strong)'}
                    strokeWidth={isHighlighted ? 1.8 : 0.8}
                    strokeDasharray={edge.type === 'EVIDENCED_BY' ? '4 3' : 'none'}
                    opacity={isHighlighted ? 1 : 0.6}
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
                    {/* Outer Glow on Selected */}
                    {isSelected && (
                      <circle
                        r={radius + 6}
                        fill="none"
                        stroke="var(--accent-cyan)"
                        strokeWidth="2"
                        opacity="0.8"
                      />
                    )}

                    {/* Node Circle */}
                    <circle
                      r={radius}
                      fill="var(--bg-elevated)"
                      stroke={node.color || 'var(--accent-cyan)'}
                      strokeWidth={isSelected ? 3 : 1.5}
                    />

                    {/* Node Text Label */}
                    <text
                      y={radius + 14}
                      textAnchor="middle"
                      fill="var(--text-primary)"
                      fontSize="11px"
                      fontFamily="var(--font-mono)"
                      fontWeight={isSelected ? 600 : 400}
                    >
                      {node.label.length > 22 ? `${node.label.substring(0, 20)}...` : node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Right Node Inspector (DESIGN.md Section 36) */}
        {selectedNode && (
          <div className="dataforge-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                  {selectedNode.type.replace('_', ' ')} NODE
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {selectedNode.data.title || selectedNode.label}
                </h3>
              </div>
              <button onClick={() => setSelectedNode(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {selectedNode.data.subtitle}
            </div>

            {selectedNode.data.confidence !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Confidence Score</span>
                <span className="badge badge-verified">● {Math.round(selectedNode.data.confidence * 100)}%</span>
              </div>
            )}

            {selectedNode.data.properties && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Attributes</span>
                {Object.entries(selectedNode.data.properties).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{k}:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{String(v)}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Directly connected to verified public sources and observational telemetry.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* AI Opportunity Signals & Market Insights (DESIGN.md Section 40, prompt section 21) */}
      <div className="dataforge-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Sparkles size={16} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '15px', fontWeight: 600 }}>AI Intelligence Signals (Fact vs Inference)</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
          {insights.map((ins) => (
            <div
              key={ins.id}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{ins.title}</span>
                <span className="badge badge-warning">● {Math.round(ins.confidence * 100)}% Confidence</span>
              </div>

              {/* Distinguishing Observed facts vs Inferred signal */}
              <div style={{ padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '10px', color: 'var(--color-verified)', fontWeight: 600, textTransform: 'uppercase' }}>
                  OBSERVED EVIDENCE (FACTS)
                </div>
                <ul style={{ paddingLeft: '16px', marginTop: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {ins.observedFacts.map((fact, idx) => (
                    <li key={idx}>{fact}</li>
                  ))}
                </ul>
              </div>

              <div style={{ padding: '8px 12px', background: 'rgba(77, 220, 255, 0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(77, 220, 255, 0.2)' }}>
                <div style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: 600, textTransform: 'uppercase' }}>
                  AI-DERIVED OPPORTUNITY SIGNAL (INFERENCE)
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.4 }}>
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
