import { AIProvider } from './interface';
import { ResearchRequirement, WorkflowPlan } from '@/types/research';
import { Conflict, DatasetRecord } from '@/types/dataset';
import { AIInsight } from '@/types/intelligence';
import { HeuristicFallbackProvider } from './heuristic';

export class OllamaProvider implements AIProvider {
  readonly id = 'ollama';
  readonly name = 'Ollama (Local AI)';

  private baseUrl: string;
  private model: string;
  private fallback: HeuristicFallbackProvider;

  constructor(baseUrl?: string, model?: string) {
    this.baseUrl = baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = model || process.env.OLLAMA_MODEL || 'llama3';
    this.fallback = new HeuristicFallbackProvider();
  }

  async checkHealth(): Promise<{ isAvailable: boolean; latencyMs?: number; error?: string }> {
    const start = Date.now();
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });

      const latencyMs = Date.now() - start;
      if (!response.ok) {
        return {
          isAvailable: false,
          latencyMs,
          error: `Ollama returned HTTP ${response.status}`,
        };
      }

      const data = await response.json();
      const models = data?.models || [];
      const hasModel = models.some((m: any) => m.name.includes(this.model) || m.model.includes(this.model));

      return {
        isAvailable: true,
        latencyMs,
        error: hasModel ? undefined : `Model '${this.model}' not found in local Ollama repository.`,
      };
    } catch (err: any) {
      return {
        isAvailable: false,
        latencyMs: Date.now() - start,
        error: `Cannot connect to Ollama at ${this.baseUrl}. Is Ollama running?`,
      };
    }
  }

  private async callOllamaJson<T>(prompt: string, fallbackFn: () => Promise<T>): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          format: 'json',
          stream: false,
        }),
        signal: AbortSignal.timeout(12000),
      });

      if (!response.ok) {
        console.warn('Ollama returned error, using fallback');
        return fallbackFn();
      }

      const data = await response.json();
      if (!data.response) return fallbackFn();

      return JSON.parse(data.response) as T;
    } catch (err) {
      console.warn('Ollama connection failed, defaulting to heuristic fallback:', err);
      return fallbackFn();
    }
  }

  async understandRequest(prompt: string): Promise<ResearchRequirement> {
    const aiPrompt = `You are DATAFORGE, an autonomous enterprise intelligence system.
Parse this requirement into JSON format:
Prompt: "${prompt}"
Output valid JSON only.`;

    return this.callOllamaJson<ResearchRequirement>(aiPrompt, () => this.fallback.understandRequest(prompt));
  }

  async generateResearchPlan(requirements: ResearchRequirement): Promise<WorkflowPlan> {
    return this.fallback.generateResearchPlan(requirements);
  }

  async resolveConflict(conflict: Conflict): Promise<{
    resolvedValue: any;
    confidence: number;
    reason: string;
    isResolved: boolean;
  }> {
    return this.fallback.resolveConflict(conflict);
  }

  async generateInsights(records: DatasetRecord[], requirements: ResearchRequirement): Promise<AIInsight[]> {
    return this.fallback.generateInsights(records, requirements);
  }

  async explainRecordInclusion(
    record: DatasetRecord,
    requirements: ResearchRequirement
  ): Promise<{
    matches: Array<{ criterion: string; matched: boolean; status: 'MET' | 'PARTIAL' | 'UNMET'; detail: string }>;
    summary: string;
    finalConfidence: number;
  }> {
    return this.fallback.explainRecordInclusion(record, requirements);
  }
}
