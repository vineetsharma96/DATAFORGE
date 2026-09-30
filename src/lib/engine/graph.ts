import { DatasetRecord, Source } from '@/types/dataset';
import { GraphData, GraphNode, GraphEdge } from '@/types/intelligence';

export function buildIntelligenceGraph(records: DatasetRecord[], sources: Source[]): GraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeMap = new Set<string>();

  const addNode = (node: GraphNode) => {
    if (!nodeMap.has(node.id)) {
      nodeMap.add(node.id);
      nodes.push(node);
    }
  };

  const addEdge = (edge: GraphEdge) => {
    edges.push(edge);
  };

  // Add source nodes
  sources.forEach((src) => {
    addNode({
      id: src.id,
      label: src.name,
      type: 'source',
      color: '#7D8791',
      radius: 18,
      data: {
        title: src.name,
        subtitle: `Type: ${src.type} | Reliability: ${src.reliability}`,
        properties: { domain: src.domain, url: src.url },
      },
    });
  });

  // Limit records in initial graph view to top 15 for crisp performance
  const displayRecords = records.slice(0, 15);

  displayRecords.forEach((r, idx) => {
    const compNodeId = `node_comp_${r.id}`;
    addNode({
      id: compNodeId,
      label: r.companyName.value,
      type: 'company',
      color: '#4DDCFF', // Cyan primary intelligence accent
      radius: 24,
      data: {
        title: r.companyName.value,
        subtitle: `${r.industry.value} (${r.city.value}, ${r.country.value})`,
        confidence: r.overallConfidence,
        evidenceCount: r.companyName.evidence.length + r.employees.evidence.length,
        properties: {
          employees: r.employees.value,
          funding: r.fundingTotal.value,
          round: r.lastFundingRound.value,
          jobs: r.openJobsCount.value,
        },
      },
    });

    // Link company to sources that gave evidence
    const usedSourceIds = new Set<string>();
    [...r.companyName.evidence, ...r.employees.evidence, ...r.fundingTotal.evidence].forEach((ev) => {
      if (ev.sourceId && !usedSourceIds.has(ev.sourceId)) {
        usedSourceIds.add(ev.sourceId);
        addEdge({
          id: `edge_${compNodeId}_${ev.sourceId}`,
          source: compNodeId,
          target: ev.sourceId,
          type: 'EVIDENCED_BY',
          label: 'verified by',
          confidence: ev.confidence,
        });
      }
    });

    // Add Funding Node if present
    if (r.fundingTotal.value && r.fundingTotal.value !== 'Undisclosed') {
      const fundNodeId = `node_fund_${r.id}`;
      addNode({
        id: fundNodeId,
        label: `${r.fundingTotal.value} (${r.lastFundingRound.value})`,
        type: 'funding_round',
        color: '#5FE3A1', // Green
        radius: 16,
        data: {
          title: `Capital Raise: ${r.fundingTotal.value}`,
          subtitle: `${r.lastFundingRound.value} closed on ${r.lastFundingDate.value}`,
        },
      });

      addEdge({
        id: `edge_${compNodeId}_${fundNodeId}`,
        source: compNodeId,
        target: fundNodeId,
        type: 'FUNDED_BY',
        label: 'raised',
      });
    }

    // Add Opportunity / Signal Node if present
    if (r.demandSignals.value.length > 0) {
      const oppNodeId = `node_opp_${r.id}`;
      addNode({
        id: oppNodeId,
        label: 'Cybersecurity Demand Signal',
        type: 'opportunity',
        color: '#F5C451', // Amber
        radius: 16,
        data: {
          title: 'Enterprise Security Lead',
          subtitle: r.demandSignals.value[0],
          confidence: r.demandSignals.confidence,
        },
      });

      addEdge({
        id: `edge_${compNodeId}_${oppNodeId}`,
        source: compNodeId,
        target: oppNodeId,
        type: 'RELATED_TO',
        label: 'signals demand',
      });
    }

    // Add Headcount / Job Node
    if (r.openJobsCount.value > 10) {
      const jobNodeId = `node_jobs_${r.id}`;
      addNode({
        id: jobNodeId,
        label: `${r.openJobsCount.value} Open Roles`,
        type: 'job',
        color: '#FF8A65', // Orange
        radius: 14,
        data: {
          title: `${r.openJobsCount.value} Active Job Postings`,
          subtitle: r.hiringSignals.value.join(', '),
        },
      });

      addEdge({
        id: `edge_${compNodeId}_${jobNodeId}`,
        source: compNodeId,
        target: jobNodeId,
        type: 'HIRING',
        label: 'actively recruiting',
      });
    }
  });

  return { nodes, edges };
}
