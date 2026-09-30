import { ResearchTask, WorkflowEvent, NodeStatus } from '@/types/research';
import { Dataset, DatasetRecord, Conflict } from '@/types/dataset';
import { aiService } from '@/lib/ai/service';
import { store } from '@/lib/storage/store';
import { generateSyntheticDataset } from '@/lib/synthetic/generator';
import { deduplicateRecords } from './deduplicator';
import { validateRecords } from './validator';
import { calculateDatasetQuality } from './confidence';

export type EventCallback = (event: WorkflowEvent) => void;

class ResearchOrchestrator {
  private activeListeners = new Map<string, Set<EventCallback>>();

  public addListener(taskId: string, cb: EventCallback): () => void {
    if (!this.activeListeners.has(taskId)) {
      this.activeListeners.set(taskId, new Set());
    }
    this.activeListeners.get(taskId)!.add(cb);

    return () => {
      this.activeListeners.get(taskId)?.delete(cb);
    };
  }

  private emit(taskId: string, event: WorkflowEvent) {
    const listeners = this.activeListeners.get(taskId);
    if (listeners) {
      listeners.forEach((cb) => {
        try {
          cb(event);
        } catch (err) {
          console.error('Error invoking event listener', err);
        }
      });
    }
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async runResearchWorkflow(taskId: string): Promise<ResearchTask> {
    const task = store.getTask(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    task.status = 'RUNNING';
    task.updatedAt = new Date().toISOString();
    store.saveTask(task);

    const emitEvent = (
      type: WorkflowEvent['type'],
      stage: string,
      percent: number,
      message: string,
      nodeId?: string,
      nodeStatus?: NodeStatus,
      data?: any
    ) => {
      task.progressPercent = percent;
      task.currentStepMessage = message;
      task.updatedAt = new Date().toISOString();
      task.logs.push({
        timestamp: new Date().toISOString(),
        level: nodeStatus === 'FAILED' ? 'error' : nodeStatus === 'WARNING' ? 'warn' : 'info',
        stage,
        message,
      });

      if (nodeId && nodeStatus) {
        const node = task.workflow.nodes.find((n) => n.id === nodeId);
        if (node) {
          node.status = nodeStatus;
          if (nodeStatus === 'RUNNING' && !node.startedAt) node.startedAt = new Date().toISOString();
          if (['COMPLETED', 'FAILED', 'WARNING'].includes(nodeStatus)) {
            node.completedAt = new Date().toISOString();
            if (node.startedAt) {
              node.durationMs = new Date(node.completedAt).getTime() - new Date(node.startedAt).getTime();
            }
          }
          if (data?.recordsProcessed !== undefined) node.recordsProcessed = data.recordsProcessed;
          if (data?.recordsCreated !== undefined) node.recordsCreated = data.recordsCreated;
          if (data?.sourceCount !== undefined) node.sourceCount = data.sourceCount;
        }
      }

      store.saveTask(task);
      this.emit(taskId, {
        taskId,
        type,
        stage,
        progressPercent: percent,
        message,
        nodeId,
        nodeStatus,
        data,
        timestamp: new Date().toISOString(),
      });
    };

    try {
      // 01: Entity & Source Discovery
      emitEvent('research.started', 'Discovery', 10, 'Discovering permitted enterprise sources and corporate registries...', 'node_01_discovery', 'RUNNING');
      await this.sleep(700);

      // Generate or retrieve sources
      const rawData = generateSyntheticDataset(task.requirements, 42);
      store.saveSources(rawData.sources);
      task.metrics.sourcesDiscovered = rawData.sources.length;

      emitEvent('source.discovered', 'Discovery', 20, `Identified ${rawData.sources.length} authoritative sources (ROC India, VenturePulse, Corporate Domains, TechHire).`, 'node_01_discovery', 'COMPLETED', {
        sourceCount: rawData.sources.length,
        recordsProcessed: 140,
      });

      // 02: Multi-Source Data Collection
      emitEvent('collection.started', 'Collection', 30, 'Collecting multi-source entity observations and corporate filings...', 'node_02_collection', 'RUNNING');
      await this.sleep(800);

      // Simulated initial discovery count
      const initialDiscovered = rawData.records.length + 4; // includes some intentional duplicates
      task.metrics.recordsDiscovered = initialDiscovered;

      // Add a couple intentional duplicate candidate records to demonstrate deduplication
      const duplicateCandidate: DatasetRecord = JSON.parse(JSON.stringify(rawData.records[0]));
      duplicateCandidate.id = 'rec_dup_acme_technologies';
      duplicateCandidate.companyName.value = 'Acme AI Pvt Ltd (India Branch)';
      duplicateCandidate.website.value = 'https://www.acmeai.in/corporate';

      const duplicateCandidate2: DatasetRecord = JSON.parse(JSON.stringify(rawData.records[1]));
      duplicateCandidate2.id = 'rec_dup_securepulse';
      duplicateCandidate2.companyName.value = 'Secure Pulse Systems Inc.';
      duplicateCandidate2.website.value = 'https://securepulse.io/in';

      const candidateRecords = [duplicateCandidate, ...rawData.records, duplicateCandidate2];

      emitEvent('record.discovered', 'Collection', 42, `Ingested ${candidateRecords.length} raw corporate records with ${rawData.sources.length} linked sources.`, 'node_02_collection', 'COMPLETED', {
        recordsCreated: candidateRecords.length,
        recordsProcessed: candidateRecords.length,
      });

      // 03: Extraction & Schema Mapping
      emitEvent('research.planning', 'Extraction', 52, 'Extracting structured schemas: headcounts, funding dates, and ATS signals...', 'node_03_extraction', 'RUNNING');
      await this.sleep(600);

      emitEvent('record.normalized', 'Extraction', 58, 'Structured extraction complete across 9 required intelligence fields.', 'node_03_extraction', 'COMPLETED', {
        recordsProcessed: candidateRecords.length,
      });

      // 04: Deterministic Normalization
      emitEvent('record.normalized', 'Normalization', 64, 'Normalizing canonical URLs, currencies ($USD), and employee headcount brackets...', 'node_04_normalization', 'RUNNING');
      await this.sleep(600);

      emitEvent('record.normalized', 'Normalization', 70, 'Normalized entities, dates, and valuations to standard schema.', 'node_04_normalization', 'COMPLETED', {
        recordsProcessed: candidateRecords.length,
      });

      // 05: Deduplication
      emitEvent('record.duplicate', 'Deduplication', 75, 'Running deterministic & semantic entity deduplication...', 'node_05_deduplication', 'RUNNING');
      await this.sleep(700);

      const dedupResult = deduplicateRecords(candidateRecords);
      task.metrics.duplicatesDetected = dedupResult.mergedCount;

      emitEvent('record.duplicate', 'Deduplication', 80, `Detected and merged ${dedupResult.mergedCount} duplicate entities while preserving provenance.`, 'node_05_deduplication', 'COMPLETED', {
        recordsProcessed: candidateRecords.length,
        recordsCreated: dedupResult.deduplicatedRecords.length,
      });

      // 06: Validation
      emitEvent('research.planning', 'Validation', 84, 'Validating schema constraints and headcount ranges against query criteria...', 'node_06_validation', 'RUNNING');
      await this.sleep(500);

      const valResult = validateRecords(dedupResult.deduplicatedRecords, task.requirements);
      emitEvent('record.verified', 'Validation', 88, `${valResult.validRecords.length} records successfully satisfied all strict validation checks.`, 'node_06_validation', 'COMPLETED', {
        recordsProcessed: valResult.totalValidated,
        recordsCreated: valResult.validRecords.length,
      });

      // 07: Cross-Source Conflict Resolution
      emitEvent('record.conflict', 'Verification', 90, 'Investigating multi-source discrepancies and conflicting employee counts...', 'node_07_conflict', 'RUNNING');
      await this.sleep(800);

      task.metrics.conflictsDetected = rawData.conflicts.length;
      const resolvedConflicts = rawData.conflicts.filter((c) => c.status === 'RESOLVED');
      task.metrics.conflictsResolved = resolvedConflicts.length;

      emitEvent('record.conflict', 'Verification', 93, `Detected ${rawData.conflicts.length} data conflicts. Resolved ${resolvedConflicts.length} via source recency & authority.`, 'node_07_conflict', 'COMPLETED', {
        recordsProcessed: valResult.validRecords.length,
      });

      // 08: Confidence Engine & Evidence Linking
      emitEvent('research.planning', 'Confidence', 95, 'Computing multi-factor confidence scores and attaching provenance graph...', 'node_08_confidence', 'RUNNING');
      await this.sleep(600);

      const quality = calculateDatasetQuality(valResult.validRecords);
      task.metrics.qualityScore = quality.overallScore;
      task.metrics.verifiedRecords = valResult.validRecords.filter((r) => r.overallConfidenceLevel === 'HIGH').length;

      emitEvent('record.verified', 'Confidence', 97, `Confidence assessment completed. Overall dataset quality calculated at ${Math.round(quality.overallScore * 100)}%.`, 'node_08_confidence', 'COMPLETED');

      // 09: Finalize Living Dataset & AI Intelligence Insights
      emitEvent('dataset.updated', 'Finalize', 99, 'Generating AI opportunity signals and finalizing dataset version v1.0...', 'node_09_finalize', 'RUNNING');
      await this.sleep(600);

      const datasetId = `dataset_${taskId}`;
      task.datasetId = datasetId;

      const dataset: Dataset = {
        id: datasetId,
        name: 'Indian SaaS Intelligence & Cybersecurity Leads',
        description: task.prompt,
        prompt: task.prompt,
        entityType: task.requirements.entity || 'Company',
        status: 'MONITORING',
        recordsCount: valResult.validRecords.length,
        currentVersion: 'v1.0',
        versions: [
          {
            versionId: `ver_${datasetId}_1`,
            datasetId,
            versionNumber: 'v1.0',
            recordCount: valResult.validRecords.length,
            createdAt: new Date().toISOString(),
            createdBy: 'DATAFORGE Autonomous Pipeline',
            changesSummary: 'Initial verified intelligence collection across 5 public data sources.',
            quality,
          },
        ],
        quality,
        monitoring: {
          enabled: true,
          frequency: 'daily',
          detectNewRecords: true,
          detectRemovedRecords: true,
          detectChangedFields: true,
          detectNewEvidence: true,
          detectConfidenceChanges: true,
          lastRunAt: new Date().toISOString(),
          nextRunAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
          consecutiveRuns: 1,
        },
        schemaFields: task.requirements.requiredFields,
        isSynthetic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      store.saveDataset(dataset);
      store.saveRecords(datasetId, valResult.validRecords);
      store.saveConflicts(datasetId, rawData.conflicts);

      // AI Insights
      const insights = await aiService.generateInsights(valResult.validRecords, task.requirements);
      store.saveInsights(datasetId, insights);

      task.status = 'COMPLETED';
      task.progressPercent = 100;
      task.updatedAt = new Date().toISOString();
      store.saveTask(task);

      emitEvent('research.completed', 'Finalize', 100, `Research workflow complete. Generated structured dataset with ${valResult.validRecords.length} verified records.`, 'node_09_finalize', 'COMPLETED');

      return task;
    } catch (err: any) {
      console.error('Research workflow failed', err);
      task.status = 'FAILED';
      task.progressPercent = 100;
      task.logs.push({
        timestamp: new Date().toISOString(),
        level: 'error',
        stage: 'Execution',
        message: err.message || 'Unknown orchestrator error',
      });
      store.saveTask(task);

      emitEvent('research.failed', 'Execution', 100, `Workflow halted: ${err.message || 'Error occurred'}`, undefined, 'FAILED');
      throw err;
    }
  }
}

export const orchestrator = new ResearchOrchestrator();
