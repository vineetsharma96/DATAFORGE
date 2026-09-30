export type NodeType =
  | 'company'
  | 'person'
  | 'investor'
  | 'funding_round'
  | 'job'
  | 'technology'
  | 'location'
  | 'opportunity'
  | 'source';

export type EdgeType =
  | 'FOUNDED_BY'
  | 'FUNDED_BY'
  | 'HIRING'
  | 'LOCATED_IN'
  | 'USES'
  | 'MENTIONED_IN'
  | 'RELATED_TO'
  | 'EVIDENCED_BY';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  color?: string;
  radius?: number;
  data: {
    title?: string;
    subtitle?: string;
    confidence?: number;
    evidenceCount?: number;
    status?: string;
    isSynthetic?: boolean;
    properties?: Record<string, any>;
  };
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
  confidence?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface AIInsight {
  id: string;
  datasetId: string;
  recordId?: string;
  type: 'OPPORTUNITY' | 'HIRING_TREND' | 'MARKET_CLUSTER' | 'GROWTH_INDICATOR' | 'COMPETITIVE_PATTERN';
  title: string;
  description: string;
  confidence: number;
  isDerivedInference: boolean;
  observedFacts: string[];
  inferredSignal: string;
  supportingRecordIds: string[];
  supportingSources: string[];
  detectedAt: string;
}

export interface OpportunitySignal {
  id: string;
  companyName: string;
  recordId: string;
  signalTitle: string;
  category: 'Cybersecurity Demand' | 'Cloud Migration' | 'Enterprise Expansion' | 'AI Integration';
  confidence: number;
  observedEvidence: string[];
  derivedRecommendation: string;
  detectedAt: string;
}
