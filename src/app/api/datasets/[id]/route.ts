import { NextResponse } from 'next/server';
import { store } from '@/lib/storage/store';
import { buildIntelligenceGraph } from '@/lib/engine/graph';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const dataset = store.getDataset(id);

    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }

    const url = new URL(req.url);
    const search = (url.searchParams.get('search') || '').toLowerCase().trim();
    const industry = url.searchParams.get('industry') || '';
    const minConfidence = parseFloat(url.searchParams.get('minConfidence') || '0');
    const minEmp = parseInt(url.searchParams.get('minEmployees') || '0', 10);
    const maxEmp = parseInt(url.searchParams.get('maxEmployees') || '1000000', 10);
    const hasConflictsOnly = url.searchParams.get('conflictsOnly') === 'true';

    let records = store.getRecords(id);

    // Apply filtering
    if (search) {
      records = records.filter(
        (r) =>
          r.companyName.value.toLowerCase().includes(search) ||
          r.website.value.toLowerCase().includes(search) ||
          r.city.value.toLowerCase().includes(search) ||
          r.industry.value.toLowerCase().includes(search) ||
          r.demandSignals.value.some((s) => s.toLowerCase().includes(search))
      );
    }

    if (industry) {
      records = records.filter((r) => r.industry.value.toLowerCase().includes(industry.toLowerCase()));
    }

    if (minConfidence > 0) {
      records = records.filter((r) => r.overallConfidence >= minConfidence);
    }

    if (minEmp > 0 || maxEmp < 1000000) {
      records = records.filter((r) => {
        const emp = r.employees.value || 0;
        return emp >= minEmp && emp <= maxEmp;
      });
    }

    if (hasConflictsOnly) {
      records = records.filter((r) => r.employees.hasConflict || r.conflicts.length > 0);
    }

    const sources = store.getAllSources();
    const conflicts = store.getConflicts(id);
    const changes = store.getChanges(id);
    const insights = store.getInsights(id);
    const graphData = buildIntelligenceGraph(records, sources);

    return NextResponse.json({
      dataset,
      records,
      totalCount: records.length,
      conflicts,
      changes,
      insights,
      sources,
      graphData,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
