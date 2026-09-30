import { NextResponse } from 'next/server';
import { store } from '@/lib/storage/store';
import { orchestrator } from '@/lib/engine/orchestrator';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = store.getTask(id);

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json({ task });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = store.getTask(id);

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  if (action === 'run') {
    orchestrator.runResearchWorkflow(id).catch((err) => {
      console.error('Error executing task', id, err);
    });
    return NextResponse.json({ message: 'Workflow execution initiated', taskId: id });
  }

  if (action === 'cancel') {
    task.status = 'CANCELLED';
    task.updatedAt = new Date().toISOString();
    store.saveTask(task);
    return NextResponse.json({ message: 'Task cancelled', task });
  }

  return NextResponse.json({ task });
}
