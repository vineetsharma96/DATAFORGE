export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';

export interface Source {
  id: string;
  name: string;
  url: string;
  type: 'official_website' | 'regulatory_registry' | 'job_board' | 'news_wire' | 'venture_database' | 'synthetic_demo';
  domain: string;
  reliability: 'High' | 'Medium' | 'Low';
  retrievedAt: string;
  status: 'available' | 'rate_limited' | 'offline';
  metadata?: Record<string, any>;
  isSynthetic: boolean;
}

export interface Observation {
  id: string;
  recordId: string;
  field: string;
  rawValue: any;
  normalizedValue: any;
  sourceId: string;
  sourceName: string;
  observedAt: string;
  confidence: number;
  contextSnippet?: string;
}

export interface EvidenceItem {
  sourceId: string;
  sourceName: string;
  sourceType: string;
  observedValue: any;
  collectedAt: string;
  confidence: number;
  url?: string;
  snippet?: string;
  isSynthetic?: boolean;
}

export interface ProvenanceField<T = any> {
  value: T;
  confidence: number; // 0.0 to 1.0
  confidenceLevel: ConfidenceLevel;
  confidenceReason?: string;
  evidence: EvidenceItem[];
  hasConflict?: boolean;
  conflictId?: string;
  isUnknown?: boolean;
  lastUpdated: string;
}

export interface ConflictResolution {
  resolvedValue: any;
  confidence: number;
  reason: string;
  isResolved: boolean;
}

export interface Conflict {
  id: string;
  recordId: string;
  recordName: string;
  field: string;
  status: 'UNRESOLVED' | 'RESOLVED';
  observations: Observation[];
  resolvedValue?: any;
  resolutionReason?: string;
  resolvedConfidence?: number;
  detectedAt: string;
  resolvedAt?: string;
}

export interface RequirementMatch {
  criterion: string;
  matched: boolean;
  status: 'MET' | 'PARTIAL' | 'UNMET';
  detail: string;
}

export interface DatasetRecord {
  id: string;
  datasetId: string;
  companyName: ProvenanceField<string>;
  website: ProvenanceField<string>;
  industry: ProvenanceField<string>;
  country: ProvenanceField<string>;
  city: ProvenanceField<string>;
  foundedYear: ProvenanceField<number | null>;
  employees: ProvenanceField<number | null>;
  fundingTotal: ProvenanceField<string>;
  lastFundingRound: ProvenanceField<string>;
  lastFundingDate: ProvenanceField<string>;
  openJobsCount: ProvenanceField<number>;
  hiringSignals: ProvenanceField<string[]>;
  demandSignals: ProvenanceField<string[]>;
  overallConfidence: number;
  overallConfidenceLevel: ConfidenceLevel;
  isSynthetic: boolean;
  whyIncluded: {
    matches: RequirementMatch[];
    summary: string;
    finalConfidence: number;
  };
  conflicts: Conflict[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ChangeEvent {
  id: string;
  datasetId: string;
  recordId: string;
  recordName: string;
  field: string;
  oldValue: any;
  newValue: any;
  changeType: 'NEW_RECORD' | 'REMOVED_RECORD' | 'VALUE_CHANGED' | 'NEW_EVIDENCE' | 'CONFLICT_RESOLVED' | 'SIGNAL_NEW';
  source: string;
  detectedAt: string;
  description: string;
}

export interface DatasetQuality {
  coverage: number;       // e.g. 0.91
  completeness: number;   // e.g. 0.88
  evidenceCoverage: number; // e.g. 0.95
  freshness: number;      // e.g. 0.88
  consistency: number;    // e.g. 0.93
  duplicateRate: number;  // e.g. 0.01
  conflictRate: number;   // e.g. 0.04
  overallScore: number;   // e.g. 0.93
}

export interface DatasetVersion {
  versionId: string;
  datasetId: string;
  versionNumber: string; // e.g. "v1.0", "v1.1"
  recordCount: number;
  createdAt: string;
  createdBy: string;
  changesSummary: string;
  quality: DatasetQuality;
}

export interface LivingMonitoringConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  detectNewRecords: boolean;
  detectRemovedRecords: boolean;
  detectChangedFields: boolean;
  detectNewEvidence: boolean;
  detectConfidenceChanges: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  consecutiveRuns: number;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  prompt: string;
  entityType: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'MONITORING';
  recordsCount: number;
  currentVersion: string;
  versions: DatasetVersion[];
  quality: DatasetQuality;
  monitoring: LivingMonitoringConfig;
  schemaFields: string[];
  isSynthetic: boolean;
  createdAt: string;
  updatedAt: string;
}
