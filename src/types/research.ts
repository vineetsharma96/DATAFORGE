export type AIProviderType = 'gemini' | 'ollama' | 'heuristic';

export type TaskStatus =
  | 'DRAFT'
  | 'PLANNING'
  | 'READY'
  | 'RUNNING'
  | 'PAUSED'
  | 'COMPLETED'
  | 'PARTIAL'
  | 'FAILED'
  | 'CANCELLED';

export type NodeStatus =
  | 'QUEUED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'WARNING'
  | 'FAILED'
  | 'SKIPPED';

export interface ResearchRequirement {
  intent: string;
  entity: string;
  industries: string[];
  locations: string[];
  foundedAfter?: string;
  employeeRange?: {
    min?: number;
    max?: number;
  };
  funding?: {
    required: boolean;
    recency?: string;
    minAmount?: number;
  };
  signals?: string[];
  requiredFields: string[];
  optionalFields: string[];
  ambiguities?: string[];
  clarifications?: Record<string, string>;
  isConfirmed?: boolean;
}

export interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  description: string;
  status: NodeStatus;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  recordsProcessed: number;
  recordsCreated: number;
  sourceCount: number;
  errors: string[];
  logSnippet?: string;
}

export interface WorkflowPlan {
  id: string;
  nodes: WorkflowNode[];
  estimatedDurationSec: number;
  strategy: string;
  validationRules: string[];
}

export interface ResearchTask {
  id: string;
  prompt: string;
  status: TaskStatus;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
  provider: AIProviderType;
  providerModel: string;
  requirements: ResearchRequirement;
  workflow: WorkflowPlan;
  datasetId?: string;
  metrics: {
    sourcesDiscovered: number;
    recordsDiscovered: number;
    recordsProcessed: number;
    verifiedRecords: number;
    duplicatesDetected: number;
    conflictsDetected: number;
    conflictsResolved: number;
    qualityScore: number;
  };
  currentStepMessage?: string;
  logs: Array<{
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'success';
    stage: string;
    message: string;
  }>;
}

export interface WorkflowEvent {
  taskId: string;
  type:
    | 'research.started'
    | 'research.planning'
    | 'source.discovered'
    | 'collection.started'
    | 'record.discovered'
    | 'record.normalized'
    | 'record.duplicate'
    | 'record.conflict'
    | 'record.verified'
    | 'dataset.updated'
    | 'research.completed'
    | 'research.failed';
  stage: string;
  progressPercent: number;
  message: string;
  nodeId?: string;
  nodeStatus?: NodeStatus;
  data?: any;
  timestamp: string;
}
