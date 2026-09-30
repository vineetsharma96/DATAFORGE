import { DatasetRecord } from '@/types/dataset';

export function exportToJSON(records: DatasetRecord[], datasetName: string): string {
  const exportPayload = {
    dataset: datasetName,
    exportedAt: new Date().toISOString(),
    recordCount: records.length,
    records: records.map((r) => ({
      id: r.id,
      company: r.companyName.value,
      website: r.website.value,
      industry: r.industry.value,
      location: `${r.city.value}, ${r.country.value}`,
      foundedYear: r.foundedYear.value,
      employees: {
        value: r.employees.value,
        confidence: r.employees.confidence,
        confidenceLevel: r.employees.confidenceLevel,
        hasConflict: r.employees.hasConflict,
        evidence: r.employees.evidence,
      },
      funding: {
        total: r.fundingTotal.value,
        round: r.lastFundingRound.value,
        date: r.lastFundingDate.value,
        confidence: r.fundingTotal.confidence,
        evidence: r.fundingTotal.evidence,
      },
      openJobsCount: r.openJobsCount.value,
      hiringSignals: r.hiringSignals.value,
      demandSignals: r.demandSignals.value,
      overallConfidence: r.overallConfidence,
      whyIncluded: r.whyIncluded,
      isSynthetic: r.isSynthetic,
    })),
  };

  return JSON.stringify(exportPayload, null, 2);
}

export function exportToCSV(records: DatasetRecord[]): string {
  const headers = [
    'Company',
    'Website',
    'Industry',
    'City',
    'Country',
    'Founded Year',
    'Employees',
    'Employees Confidence',
    'Employees Primary Source',
    'Funding Total',
    'Funding Round',
    'Funding Date',
    'Funding Confidence',
    'Open Jobs',
    'Demand Signals',
    'Overall Confidence',
    'Why Included Summary',
    'Is Synthetic',
  ];

  const escapeCSV = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = records.map((r) => {
    const empSource = r.employees.evidence[0]?.sourceName || 'Unattributed';
    return [
      escapeCSV(r.companyName.value),
      escapeCSV(r.website.value),
      escapeCSV(r.industry.value),
      escapeCSV(r.city.value),
      escapeCSV(r.country.value),
      escapeCSV(r.foundedYear.value),
      escapeCSV(r.employees.value),
      escapeCSV(`${Math.round(r.employees.confidence * 100)}%`),
      escapeCSV(empSource),
      escapeCSV(r.fundingTotal.value),
      escapeCSV(r.lastFundingRound.value),
      escapeCSV(r.lastFundingDate.value),
      escapeCSV(`${Math.round(r.fundingTotal.confidence * 100)}%`),
      escapeCSV(r.openJobsCount.value),
      escapeCSV(r.demandSignals.value.join('; ')),
      escapeCSV(`${Math.round(r.overallConfidence * 100)}%`),
      escapeCSV(r.whyIncluded.summary),
      escapeCSV(r.isSynthetic ? 'SYNTHETIC DEMO' : 'LIVE'),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
