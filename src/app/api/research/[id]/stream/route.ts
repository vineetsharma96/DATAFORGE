import { NextRequest } from 'next/server';
import { store } from '@/lib/storage/store';
import { orchestrator } from '@/lib/engine/orchestrator';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = store.getTask(id);

  if (!task) {
    return new Response('Task not found', { status: 404 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial task state
      controller.enqueue(
        encoder.encode(`event: init\ndata: ${JSON.stringify(task)}\n\n`)
      );

      // Subscribe to real-time events from orchestrator
      const unsubscribe = orchestrator.addListener(id, (event) => {
        try {
          controller.enqueue(
            encoder.encode(`event: update\ndata: ${JSON.stringify(event)}\n\n`)
          );
          if (event.type === 'research.completed' || event.type === 'research.failed') {
            setTimeout(() => {
              try {
                controller.close();
              } catch (e) {}
            }, 1000);
          }
        } catch (err) {
          unsubscribe();
        }
      });

      // Cleanup on client disconnect
      req.signal.addEventListener('abort', () => {
        unsubscribe();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
