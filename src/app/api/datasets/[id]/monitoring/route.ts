import { NextResponse } from 'next/server';
import { store } from '@/lib/storage/store';
import { simulateLivingDatasetUpdate } from '@/lib/synthetic/generator';
import { ChangeEvent } from '@/types/dataset';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const dataset = store.getDataset(id);

    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }

    const currentRecords = store.getRecords(id);
    const { updatedRecords, changes } = simulateLivingDatasetUpdate(currentRecords);

    // Save updated records
    store.saveRecords(id, updatedRecords);

    // Create change events
    const changeEvents: ChangeEvent[] = changes.map((c, i) => ({
      id: `change_${Date.now()}_${i}`,
      datasetId: id,
      recordId: c.recordId,
      recordName: c.recordName,
      field: c.field,
      oldValue: c.oldValue,
      newValue: c.newValue,
      changeType: c.changeType,
      source: 'TechHire Enterprise Feeds & ROC Automated Monitoring',
      detectedAt: new Date().toISOString(),
      description: c.description,
    }));

    store.addChanges(id, changeEvents);

    // Update dataset version from v1.0 -> v1.1
    const newVersionNumber = 'v1.1';
    dataset.currentVersion = newVersionNumber;
    dataset.updatedAt = new Date().toISOString();
    dataset.monitoring.lastRunAt = new Date().toISOString();
    dataset.monitoring.nextRunAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    dataset.monitoring.consecutiveRuns += 1;

    dataset.versions.unshift({
      versionId: `ver_${id}_${Date.now()}`,
      datasetId: id,
      versionNumber: newVersionNumber,
      recordCount: updatedRecords.length,
      createdAt: new Date().toISOString(),
      createdBy: 'DATAFORGE Living Dataset Monitor',
      changesSummary: `${changeEvents.length} updates detected: Headcount growth (+11%), Series B raise ($22.5M), and CISO hiring signal.`,
      quality: dataset.quality,
    });

    store.saveDataset(dataset);

    return NextResponse.json({
      message: `Living monitoring check complete. ${changeEvents.length} changes detected and indexed to version ${newVersionNumber}.`,
      newVersion: newVersionNumber,
      changes: changeEvents,
      updatedRecordsCount: updatedRecords.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
