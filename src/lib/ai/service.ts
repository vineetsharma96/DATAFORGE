import { AIProvider } from './interface';
import { GeminiProvider } from './gemini';
import { OllamaProvider } from './ollama';
import { HeuristicFallbackProvider } from './heuristic';
import { AIProviderType, ResearchRequirement, WorkflowPlan } from '@/types/research';
import { Conflict, DatasetRecord } from '@/types/dataset';
import { AIInsight } from '@/types/intelligence';
import { ProviderStatus } from '@/types/provider';

class AIServiceManager {
  private activeProviderType: AIProviderType = 'gemini';
  private geminiProvider: GeminiProvider;
  private ollamaProvider: OllamaProvider;
  private heuristicProvider: HeuristicFallbackProvider;

  constructor() {
    this.geminiProvider = new GeminiProvider();
    this.ollamaProvider = new OllamaProvider();
    this.heuristicProvider = new HeuristicFallbackProvider();

    // Default provider from environment if specified
    const envProv = (process.env.AI_PROVIDER || 'gemini').toLowerCase() as AIProviderType;
    if (['gemini', 'ollama', 'heuristic'].includes(envProv)) {
      this.activeProviderType = envProv;
    }
  }

  public setProvider(type: AIProviderType) {
    this.activeProviderType = type;
  }

  public getActiveProviderType(): AIProviderType {
    return this.activeProviderType;
  }

  public getActiveProvider(): AIProvider {
    switch (this.activeProviderType) {
      case 'gemini':
        return this.geminiProvider;
      case 'ollama':
        return this.ollamaProvider;
      case 'heuristic':
      default:
        return this.heuristicProvider;
    }
  }

  public async getStatus(): Promise<ProviderStatus[]> {
    const now = new Date().toISOString();
    const geminiHealth = await this.geminiProvider.checkHealth();
    const ollamaHealth = await this.ollamaProvider.checkHealth();
    const heuristicHealth = await this.heuristicProvider.checkHealth();

    return [
      {
        provider: 'gemini',
        name: 'Google Gemini',
        isConnected: geminiHealth.isAvailable,
        statusText: geminiHealth.isAvailable
          ? 'Connected'
          : geminiHealth.error || 'API Key Required',
        model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
        latencyMs: geminiHealth.latencyMs,
        lastChecked: now,
        error: geminiHealth.error,
      },
      {
        provider: 'ollama',
        name: 'Ollama (Local)',
        isConnected: ollamaHealth.isAvailable,
        statusText: ollamaHealth.isAvailable
          ? 'Local Ready'
          : ollamaHealth.error || 'Server Offline',
        model: process.env.OLLAMA_MODEL || 'llama3',
        endpoint: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        latencyMs: ollamaHealth.latencyMs,
        lastChecked: now,
        error: ollamaHealth.error,
      },
      {
        provider: 'heuristic',
        name: 'Deterministic Engine',
        isConnected: true,
        statusText: 'Always Available (Zero-dependency)',
        model: 'Rule-Based Heuristic',
        latencyMs: heuristicHealth.latencyMs,
        lastChecked: now,
      },
    ];
  }

  public async understandRequest(prompt: string): Promise<ResearchRequirement> {
    const provider = this.getActiveProvider();
    try {
      return await provider.understandRequest(prompt);
    } catch (err) {
      console.warn(`Primary provider (${this.activeProviderType}) failed, falling back to heuristic.`, err);
      return this.heuristicProvider.understandRequest(prompt);
    }
  }

  public async generateResearchPlan(requirements: ResearchRequirement): Promise<WorkflowPlan> {
    const provider = this.getActiveProvider();
    try {
      return await provider.generateResearchPlan(requirements);
    } catch (err) {
      console.warn(`Primary provider failed for plan, using heuristic fallback.`, err);
      return this.heuristicProvider.generateResearchPlan(requirements);
    }
  }

  public async resolveConflict(conflict: Conflict): Promise<{
    resolvedValue: any;
    confidence: number;
    reason: string;
    isResolved: boolean;
  }> {
    const provider = this.getActiveProvider();
    try {
      return await provider.resolveConflict(conflict);
    } catch (err) {
      return this.heuristicProvider.resolveConflict(conflict);
    }
  }

  public async generateInsights(records: DatasetRecord[], requirements: ResearchRequirement): Promise<AIInsight[]> {
    const provider = this.getActiveProvider();
    try {
      return await provider.generateInsights(records, requirements);
    } catch (err) {
      return this.heuristicProvider.generateInsights(records, requirements);
    }
  }

  public async explainRecordInclusion(record: DatasetRecord, requirements: ResearchRequirement) {
    const provider = this.getActiveProvider();
    return provider.explainRecordInclusion(record, requirements);
  }
}

export const aiService = new AIServiceManager();
