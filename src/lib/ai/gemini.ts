import { AIProvider } from './interface';
import { ResearchRequirement, WorkflowPlan } from '@/types/research';
import { Conflict, DatasetRecord } from '@/types/dataset';
import { AIInsight } from '@/types/intelligence';
import { HeuristicFallbackProvider } from './heuristic';

export class GeminiProvider implements AIProvider {
  readonly id = 'gemini';
  readonly name = 'Google Gemini';

  private apiKey: string;
  private model: string;
  private fallback: HeuristicFallbackProvider;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    this.model = model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    this.fallback = new HeuristicFallbackProvider();
  }

  async checkHealth(): Promise<{ isAvailable: boolean; latencyMs?: number; error?: string }> {
    if (!this.apiKey) {
      return {
        isAvailable: false,
        error: 'GEMINI_API_KEY is not configured in environment or settings.',
      };
    }

    const start = Date.now();
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with JSON: {"status": "ok"}' }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
          signal: AbortSignal.timeout(6000),
        }
      );

      const latencyMs = Date.now() - start;
      if (!response.ok) {
        const errText = await response.text();
        return { isAvailable: false, latencyMs, error: `Gemini HTTP ${response.status}: ${errText}` };
      }

      return { isAvailable: true, latencyMs };
    } catch (err: any) {
      return { isAvailable: false, latencyMs: Date.now() - start, error: err.message || 'Connection error' };
    }
  }

  private async callGeminiJson<T>(prompt: string, fallbackFn: () => Promise<T>): Promise<T> {
    if (!this.apiKey) {
      return fallbackFn();
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
          signal: AbortSignal.timeout(10000),
        }
      );

      if (!response.ok) {
        console.warn(`Gemini call failed with status ${response.status}, utilizing deterministic fallback.`);
        return fallbackFn();
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) return fallbackFn();

      const parsed = JSON.parse(rawText);
      return parsed as T;
    } catch (err) {
      console.warn('Gemini error, reverting to deterministic fallback:', err);
      return fallbackFn();
    }
  }

  async understandRequest(prompt: string): Promise<ResearchRequirement> {
    const aiPrompt = `You are DATAFORGE, an autonomous enterprise data intelligence platform.
Parse the following natural language business data requirement into a structured requirement specification.
Never output markdown text or explanation. Output ONLY valid JSON matching this schema:
{
  "intent": string,
  "entity": string,
  "industries": string[],
  "locations": string[],
  "foundedAfter": string,
  "employeeRange": { "min": number, "max": number },
  "funding": { "required": boolean, "recency": string, "minAmount": number },
  "signals": string[],
  "requiredFields": string[],
  "optionalFields": string[],
  "ambiguities": string[],
  "clarifications": Record<string, string>,
  "isConfirmed": boolean
}

Prompt: "${prompt}"`;

    return this.callGeminiJson<ResearchRequirement>(aiPrompt, () => this.fallback.understandRequest(prompt));
  }

  async generateResearchPlan(requirements: ResearchRequirement): Promise<WorkflowPlan> {
    const aiPrompt = `Generate a dynamic, multi-stage research and verification workflow for the following requirement.
Requirements: ${JSON.stringify(requirements)}
Output ONLY valid JSON matching:
{
  "id": string,
  "strategy": string,
  "estimatedDurationSec": number,
  "validationRules": string[],
  "nodes": [
    {
      "id": string,
      "type": string,
      "name": string,
      "description": string,
      "status": "QUEUED",
      "recordsProcessed": 0,
      "recordsCreated": 0,
      "sourceCount": 0,
      "errors": []
    }
  ]
}`;

    return this.callGeminiJson<WorkflowPlan>(aiPrompt, () => this.fallback.generateResearchPlan(requirements));
  }

  async resolveConflict(conflict: Conflict): Promise<{
    resolvedValue: any;
    confidence: number;
    reason: string;
    isResolved: boolean;
  }> {
    const aiPrompt = `You are DATAFORGE Conflict Resolution Agent.
Evaluate these conflicting observations for entity "${conflict.recordName}", field "${conflict.field}":
${JSON.stringify(conflict.observations)}
Evaluate source authority, observation timestamps (recency), and agreement.
Output ONLY valid JSON:
{
  "resolvedValue": any,
  "confidence": number,
  "reason": string,
  "isResolved": boolean
}`;

    return this.callGeminiJson(aiPrompt, () => this.fallback.resolveConflict(conflict));
  }

  async generateInsights(records: DatasetRecord[], requirements: ResearchRequirement): Promise<AIInsight[]> {
    const sample = records.slice(0, 10).map((r) => ({
      name: r.companyName.value,
      industry: r.industry.value,
      employees: r.employees.value,
      funding: r.fundingTotal.value,
      jobs: r.openJobsCount.value,
      signals: r.demandSignals.value,
    }));

    const aiPrompt = `Analyze the structured corporate records and derive 2-3 high-value enterprise intelligence insights and market opportunity signals.
CRITICAL: Clearly separate observed facts from AI-derived inferences.
Data sample: ${JSON.stringify(sample)}
Output ONLY valid JSON array of:
[
  {
    "id": string,
    "datasetId": string,
    "type": "OPPORTUNITY" | "HIRING_TREND" | "MARKET_CLUSTER" | "GROWTH_INDICATOR",
    "title": string,
    "description": string,
    "confidence": number,
    "isDerivedInference": true,
    "observedFacts": string[],
    "inferredSignal": string,
    "supportingRecordIds": string[],
    "supportingSources": string[],
    "detectedAt": string
  }
]`;

    return this.callGeminiJson<AIInsight[]>(aiPrompt, () => this.fallback.generateInsights(records, requirements));
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
