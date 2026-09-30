import { store } from '@/lib/storage/store';
import { exportToCSV, exportToJSON } from '@/lib/engine/exporter';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const dataset = store.getDataset(id);

    if (!dataset) {
      return new Response('Dataset not found', { status: 404 });
    }

    const records = store.getRecords(id);
    const url = new URL(req.url);
    const format = (url.searchParams.get('format') || 'csv').toLowerCase();

    if (format === 'json') {
      const jsonContent = exportToJSON(records, dataset.name);
      return new Response(jsonContent, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${dataset.name.toLowerCase().replace(/\s+/g, '_')}_provenance.json"`,
        },
      });
    }

    const csvContent = exportToCSV(records);
    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${dataset.name.toLowerCase().replace(/\s+/g, '_')}_provenance.csv"`,
      },
    });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
