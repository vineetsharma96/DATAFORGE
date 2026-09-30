import { NextResponse } from 'next/server';
import { aiService } from '@/lib/ai/service';
import { AIProviderType } from '@/types/research';

export async function GET() {
  try {
    const statuses = await aiService.getStatus();
    const activeProvider = aiService.getActiveProviderType();
    return NextResponse.json({
      activeProvider,
      providers: statuses,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { provider } = body;

    if (!['gemini', 'ollama', 'heuristic'].includes(provider)) {
      return NextResponse.json({ error: 'Invalid provider specified' }, { status: 400 });
    }

    aiService.setProvider(provider as AIProviderType);
    const statuses = await aiService.getStatus();

    return NextResponse.json({
      message: `Active AI provider switched to ${provider}`,
      activeProvider: provider,
      providers: statuses,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
