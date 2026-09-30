import { ResearchRequirement, WorkflowPlan } from '@/types/research';
import { Conflict, ConflictResolution, DatasetRecord } from '@/types/dataset';
import { AIInsight } from '@/types/intelligence';

export interface AIProvider {
  readonly id: string;
  readonly name: string;

  checkHealth(): Promise<{ isAvailable: boolean; latencyMs?: number; error?: string }>;

  understandRequest(prompt: string): Promise<ResearchRequirement>;

  generateResearchPlan(requirements: ResearchRequirement): Promise<WorkflowPlan>;

  resolveConflict(conflict: Conflict): Promise<ConflictResolution>;

  generateInsights(
    records: DatasetRecord[],
    requirements: ResearchRequirement
  ): Promise<AIInsight[]>;

  explainRecordInclusion(
    record: DatasetRecord,
    requirements: ResearchRequirement
  ): Promise<{
    matches: Array<{ criterion: string; matched: boolean; status: 'MET' | 'PARTIAL' | 'UNMET'; detail: string }>;
    summary: string;
    finalConfidence: number;
  }>;
}
