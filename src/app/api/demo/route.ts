import { NextResponse } from 'next/server';
import { store } from '@/lib/storage/store';
import { orchestrator } from '@/lib/engine/orchestrator';
import { aiService } from '@/lib/ai/service';
import { DEMO_SCENARIOS } from '@/lib/synthetic/scenarios';
import { ResearchTask } from '@/types/research';

export async function POST() {
  try {
    const scenario = DEMO_SCENARIOS[0]; // Flagship scenario
    const prompt = scenario.prompt;

    const requirements = await aiService.understandRequest(prompt);
    const workflow = await aiService.generateResearchPlan(requirements);

    const taskId = `task_demo_${Date.now()}`;
    const demoTask: ResearchTask = {
      id: taskId,
      prompt,
      status: 'PLANNING',
      progressPercent: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      provider: aiService.getActiveProviderType(),
      providerModel: 'Deterministic Demo Engine',
      requirements,
      workflow,
      metrics: {
        sourcesDiscovered: 0,
        recordsDiscovered: 0,
        recordsProcessed: 0,
        verifiedRecords: 0,
        duplicatesDetected: 0,
        conflictsDetected: 0,
        conflictsResolved: 0,
        qualityScore: 0,
      },
      currentStepMessage: 'Initializing deterministic flagship demonstration...',
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          stage: 'Demo Setup',
          message: 'Flagship demo launched: Indian SaaS with Cybersecurity signals.',
        },
      ],
    };

    store.saveTask(demoTask);

    // Launch workflow execution asynchronously
    orchestrator.runResearchWorkflow(taskId).catch((err) => {
      console.error('Demo workflow execution error', err);
    });

    return NextResponse.json({
      message: 'Demo research workflow launched',
      taskId,
      datasetId: `dataset_${taskId}`,
      task: demoTask,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
