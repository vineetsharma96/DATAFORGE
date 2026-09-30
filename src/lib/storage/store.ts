import { Dataset, DatasetRecord, DatasetVersion, ChangeEvent, Source, Conflict } from '@/types/dataset';
import { ResearchTask } from '@/types/research';
import { AIInsight, OpportunitySignal, GraphData } from '@/types/intelligence';
import fs from 'fs';
import path from 'path';

interface StorageState {
  tasks: Record<string, ResearchTask>;
  datasets: Record<string, Dataset>;
  records: Record<string, DatasetRecord[]>; // datasetId -> records
  sources: Record<string, Source>;
  conflicts: Record<string, Conflict[]>;
  changes: Record<string, ChangeEvent[]>; // datasetId -> change events
  insights: Record<string, AIInsight[]>;
  opportunitySignals: Record<string, OpportunitySignal[]>;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const STATE_FILE = path.join(DATA_DIR, 'dataforge_state.json');

class DataForgeStore {
  private state: StorageState = {
    tasks: {},
    datasets: {},
    records: {},
    sources: {},
    conflicts: {},
    changes: {},
    insights: {},
    opportunitySignals: {},
  };

  private initialized = false;

  constructor() {
    this.loadFromDisk();
  }

  private ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (err) {
        console.error('Failed to create data directory', err);
      }
    }
  }

  private loadFromDisk() {
    if (this.initialized) return;
    try {
      this.ensureDir();
      if (fs.existsSync(STATE_FILE)) {
        const raw = fs.readFileSync(STATE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.state = {
          tasks: parsed.tasks || {},
          datasets: parsed.datasets || {},
          records: parsed.records || {},
          sources: parsed.sources || {},
          conflicts: parsed.conflicts || {},
          changes: parsed.changes || {},
          insights: parsed.insights || {},
          opportunitySignals: parsed.opportunitySignals || {},
        };
      }
      this.initialized = true;
    } catch (err) {
      console.warn('Could not load persistent state from disk, starting in-memory', err);
      this.initialized = true;
    }
  }

  public saveToDisk() {
    try {
      this.ensureDir();
      fs.writeFileSync(STATE_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write state to disk', err);
    }
  }

  // --- Tasks ---
  public getTask(id: string): ResearchTask | undefined {
    return this.state.tasks[id];
  }

  public getAllTasks(): ResearchTask[] {
    return Object.values(this.state.tasks).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public saveTask(task: ResearchTask): void {
    this.state.tasks[task.id] = task;
    this.saveToDisk();
  }

  // --- Datasets ---
  public getDataset(id: string): Dataset | undefined {
    return this.state.datasets[id];
  }

  public getAllDatasets(): Dataset[] {
    return Object.values(this.state.datasets).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public saveDataset(dataset: Dataset): void {
    this.state.datasets[dataset.id] = dataset;
    this.saveToDisk();
  }

  // --- Records ---
  public getRecords(datasetId: string): DatasetRecord[] {
    return this.state.records[datasetId] || [];
  }

  public getRecordById(datasetId: string, recordId: string): DatasetRecord | undefined {
    const list = this.state.records[datasetId] || [];
    return list.find((r) => r.id === recordId);
  }

  public saveRecords(datasetId: string, records: DatasetRecord[]): void {
    this.state.records[datasetId] = records;
    if (this.state.datasets[datasetId]) {
      this.state.datasets[datasetId].recordsCount = records.length;
      this.state.datasets[datasetId].updatedAt = new Date().toISOString();
    }
    this.saveToDisk();
  }

  // --- Sources ---
  public getSource(id: string): Source | undefined {
    return this.state.sources[id];
  }

  public getAllSources(): Source[] {
    return Object.values(this.state.sources);
  }

  public saveSource(source: Source): void {
    this.state.sources[source.id] = source;
    this.saveToDisk();
  }

  public saveSources(sources: Source[]): void {
    sources.forEach((s) => (this.state.sources[s.id] = s));
    this.saveToDisk();
  }

  // --- Conflicts ---
  public getConflicts(datasetId?: string): Conflict[] {
    if (!datasetId) {
      return Object.values(this.state.conflicts).flat();
    }
    return this.state.conflicts[datasetId] || [];
  }

  public saveConflicts(datasetId: string, conflicts: Conflict[]): void {
    this.state.conflicts[datasetId] = conflicts;
    this.saveToDisk();
  }

  // --- Changes (Living Dataset Events) ---
  public getChanges(datasetId: string): ChangeEvent[] {
    return this.state.changes[datasetId] || [];
  }

  public getAllChanges(): ChangeEvent[] {
    return Object.values(this.state.changes).flat().sort(
      (a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    );
  }

  public addChanges(datasetId: string, changes: ChangeEvent[]): void {
    if (!this.state.changes[datasetId]) {
      this.state.changes[datasetId] = [];
    }
    this.state.changes[datasetId].unshift(...changes);
    this.saveToDisk();
  }

  // --- Insights & Opportunity Signals ---
  public getInsights(datasetId?: string): AIInsight[] {
    if (!datasetId) {
      return Object.values(this.state.insights).flat();
    }
    return this.state.insights[datasetId] || [];
  }

  public saveInsights(datasetId: string, insights: AIInsight[]): void {
    this.state.insights[datasetId] = insights;
    this.saveToDisk();
  }

  public getOpportunitySignals(datasetId?: string): OpportunitySignal[] {
    if (!datasetId) {
      return Object.values(this.state.opportunitySignals).flat();
    }
    return this.state.opportunitySignals[datasetId] || [];
  }

  public saveOpportunitySignals(datasetId: string, signals: OpportunitySignal[]): void {
    this.state.opportunitySignals[datasetId] = signals;
    this.saveToDisk();
  }

  // Reset or clear if needed
  public clearAll(): void {
    this.state = {
      tasks: {},
      datasets: {},
      records: {},
      sources: {},
      conflicts: {},
      changes: {},
      insights: {},
      opportunitySignals: {},
    };
    this.saveToDisk();
  }
}

// Global singleton instance
export const store = new DataForgeStore();
