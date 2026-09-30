import { NextResponse } from 'next/server';
import { store } from '@/lib/storage/store';
import { generateSyntheticDataset } from '@/lib/synthetic/generator';
import { calculateDatasetQuality } from '@/lib/engine/confidence';
import { Dataset } from '@/types/dataset';
import { DEMO_SCENARIOS } from '@/lib/synthetic/scenarios';

// Ensure at least the flagship demo dataset exists if store is empty
function ensureSeedData() {
  const existing = store.getAllDatasets();
  if (existing.length === 0) {
    const scenario = DEMO_SCENARIOS[0];
    const synthetic = generateSyntheticDataset(
      {
        intent: 'Flagship Autonomous SaaS Discovery',
        entity: 'Company',
        industries: ['SaaS', 'Enterprise Software', 'Cybersecurity'],
        locations: ['India'],
        foundedAfter: '2020-01-01',
        employeeRange: { min: 50, max: 500 },
        funding: { required: true, recency: 'recent', minAmount: 1000000 },
        requiredFields: ['companyName', 'website', 'industry', 'country', 'employees', 'fundingTotal'],
        optionalFields: ['city', 'openJobsCount', 'demandSignals'],
      },
      42
    );

    const quality = calculateDatasetQuality(synthetic.records);
    const datasetId = 'dataset_flagship_demo';

    const flagshipDataset: Dataset = {
      id: datasetId,
      name: 'Indian SaaS Intelligence & Cybersecurity Leads',
      description: scenario.prompt,
      prompt: scenario.prompt,
      entityType: 'Company',
      status: 'MONITORING',
      recordsCount: synthetic.records.length,
      currentVersion: 'v1.0',
      versions: [
        {
          versionId: 'ver_v1_0',
          datasetId,
          versionNumber: 'v1.0',
          recordCount: synthetic.records.length,
          createdAt: new Date().toISOString(),
          createdBy: 'DATAFORGE Autonomous Research',
          changesSummary: 'Initial verified intelligence collection across 5 authoritative sources.',
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
      schemaFields: [
        'companyName',
        'website',
        'industry',
        'country',
        'city',
        'foundedYear',
        'employees',
        'fundingTotal',
        'lastFundingRound',
        'lastFundingDate',
        'openJobsCount',
        'demandSignals',
      ],
      isSynthetic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.saveDataset(flagshipDataset);
    store.saveRecords(datasetId, synthetic.records);
    store.saveSources(synthetic.sources);
    store.saveConflicts(datasetId, synthetic.conflicts);
  }
}

export async function GET() {
  try {
    ensureSeedData();
    const datasets = store.getAllDatasets();
    return NextResponse.json({ datasets });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
