import { NextResponse } from 'next/server';
import { aiService } from '@/lib/ai/service';
import { store } from '@/lib/storage/store';
import { orchestrator } from '@/lib/engine/orchestrator';
import { ResearchTask } from '@/types/research';

export async function GET() {
  try {
    const tasks = store.getAllTasks();
    return NextResponse.json({ tasks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, provider, autoRun = true } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (provider && ['gemini', 'ollama', 'heuristic'].includes(provider)) {
      aiService.setProvider(provider);
    }

    const activeProvider = aiService.getActiveProviderType();
    const requirements = await aiService.understandRequest(prompt);
    const workflow = await aiService.generateResearchPlan(requirements);

    const taskId = `task_${Date.now()}`;
    const newTask: ResearchTask = {
      id: taskId,
      prompt,
      status: 'PLANNING',
      progressPercent: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      provider: activeProvider,
      providerModel:
        activeProvider === 'gemini'
          ? process.env.GEMINI_MODEL || 'gemini-1.5-flash'
          : activeProvider === 'ollama'
          ? process.env.OLLAMA_MODEL || 'llama3'
          : 'Rule-Based Heuristic',
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
      currentStepMessage: 'AI parsed requirements and synthesized multi-stage workflow plan.',
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          stage: 'Planning',
          message: `Natural language prompt understood using ${activeProvider.toUpperCase()} provider.`,
        },
      ],
    };

    store.saveTask(newTask);

    if (autoRun) {
      // Fire-and-forget orchestrator execution (async)
      orchestrator.runResearchWorkflow(taskId).catch((err) => {
        console.error('Async workflow error for task', taskId, err);
      });
    }

    return NextResponse.json({
      taskId,
      task: newTask,
      requirements,
      workflow,
    });
  } catch (err: any) {
    console.error('Research creation error', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
