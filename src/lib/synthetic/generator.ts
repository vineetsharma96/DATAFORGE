import { DatasetRecord, Source, Observation, Conflict, EvidenceItem, ProvenanceField, ConfidenceLevel } from '@/types/dataset';
import { ResearchRequirement } from '@/types/research';

// Simple deterministic seeded PRNG (Linear Congruential Generator)
class SeededRandom {
  private seed: number;

  constructor(seed = 42) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number): number {
    return Math.floor(min + this.next() * (max - min + 1));
  }

  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
}

export function generateSyntheticSources(): Source[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'src_roc_registry',
      name: 'Ministry of Corporate Affairs (ROC Registry)',
      url: 'https://mca.gov.in/companies-registry',
      type: 'regulatory_registry',
      domain: 'mca.gov.in',
      reliability: 'High',
      retrievedAt: now,
      status: 'available',
      isSynthetic: true,
      metadata: { jurisdiction: 'India', filingType: 'Annual Return / Form AOC-4' },
    },
    {
      id: 'src_venture_pulse',
      name: 'VenturePulse Intelligence Feed',
      url: 'https://venturepulse.io/data/feed',
      type: 'venture_database',
      domain: 'venturepulse.io',
      reliability: 'High',
      retrievedAt: now,
      status: 'available',
      isSynthetic: true,
      metadata: { apiVersion: 'v2.4', coverage: 'Global Tech & PE' },
    },
    {
      id: 'src_official_domains',
      name: 'Primary Corporate Domains & Security Disclosures',
      url: 'https://corp-domains.index/crawl',
      type: 'official_website',
      domain: 'corporate-domains.net',
      reliability: 'High',
      retrievedAt: now,
      status: 'available',
      isSynthetic: true,
      metadata: { verificationMethod: 'DNS & SSL Certificate Handshake' },
    },
    {
      id: 'src_techhire_jobs',
      name: 'TechHire Enterprise Career Portal & Telemetry',
      url: 'https://techhire.io/telemetry/feed',
      type: 'job_board',
      domain: 'techhire.io',
      reliability: 'Medium',
      retrievedAt: now,
      status: 'available',
      isSynthetic: true,
      metadata: { trackedBoards: 450, parsingEngine: 'Structured ATS Crawler' },
    },
    {
      id: 'src_news_wire',
      name: 'Global Newswire & Tech Wire Press Releases',
      url: 'https://technewswire.com/syndication',
      type: 'news_wire',
      domain: 'technewswire.com',
      reliability: 'Medium',
      retrievedAt: now,
      status: 'available',
      isSynthetic: true,
      metadata: { verifiedJournalists: true },
    },
  ];
}

const INDIAN_CITIES = ['Bengaluru', 'Bengaluru', 'Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Mumbai', 'Chennai', 'Noida'];

const COMPANY_SEEDS = [
  { name: 'Acme AI Technologies', domain: 'acmeai.in', industry: 'Enterprise SaaS & AI Ops', baseEmp: 127, funding: '$14.2M', round: 'Series A', date: '2024-08-14' },
  { name: 'SecurePulse Systems', domain: 'securepulse.io', industry: 'Cybersecurity SaaS', baseEmp: 184, funding: '$22.5M', round: 'Series B', date: '2024-11-03' },
  { name: 'CloudMatrix AI', domain: 'cloudmatrix.tech', industry: 'Infrastructure & DevOps SaaS', baseEmp: 92, funding: '$8.5M', round: 'Series A', date: '2024-09-22' },
  { name: 'ZenFlow Labs', domain: 'zenflowhq.com', industry: 'Workflow Automation SaaS', baseEmp: 310, funding: '$35.0M', round: 'Series B', date: '2024-06-18' },
  { name: 'VigilantSec India', domain: 'vigilantsec.co', industry: 'Cloud Security & Compliance SaaS', baseEmp: 76, funding: '$6.2M', round: 'Seed', date: '2025-01-10' },
  { name: 'DataKite Analytics', domain: 'datakite.ai', industry: 'Data Intelligence & Governance', baseEmp: 145, funding: '$18.0M', round: 'Series A', date: '2024-10-05' },
  { name: 'InfraArmor', domain: 'infraarmor.dev', industry: 'Zero Trust & Cloud Infra', baseEmp: 64, funding: '$4.8M', round: 'Seed', date: '2024-12-01' },
  { name: 'DevFortress Technologies', domain: 'devfortress.io', industry: 'DevSecOps & Software Supply Chain', baseEmp: 220, funding: '$28.0M', round: 'Series B', date: '2024-07-29' },
  { name: 'ScaleOps Networks', domain: 'scaleops.in', industry: 'Kubernetes & Cost Optimization SaaS', baseEmp: 88, funding: '$7.5M', round: 'Series A', date: '2024-10-19' },
  { name: 'CogniGuard AI', domain: 'cogniguard.com', industry: 'Threat Intelligence SaaS', baseEmp: 160, funding: '$19.5M', round: 'Series A', date: '2024-05-12' },
  { name: 'AuthShield Enterprise', domain: 'authshield.io', industry: 'Identity & Access Management (IAM)', baseEmp: 115, funding: '$12.0M', round: 'Series A', date: '2024-11-28' },
  { name: 'HyperSaaS Platform', domain: 'hypersaas.co', industry: 'B2B Commerce Infrastructure', baseEmp: 240, funding: '$31.0M', round: 'Series B', date: '2024-08-30' },
  { name: 'NexusTrace Systems', domain: 'nexustrace.ai', industry: 'Observability & API Security', baseEmp: 95, funding: '$9.2M', round: 'Series A', date: '2024-12-14' },
  { name: 'Synthetix Cloud', domain: 'synthetixcloud.io', industry: 'Synthetic Data & Privacy Tech', baseEmp: 58, funding: '$5.4M', round: 'Seed', date: '2025-01-20' },
  { name: 'TrustLayer Technologies', domain: 'trustlayer.in', industry: 'Governance, Risk & Compliance (GRC)', baseEmp: 175, funding: '$16.8M', round: 'Series A', date: '2024-09-08' },
  { name: 'ByteShield India', domain: 'byteshield.tech', industry: 'Application Security SaaS', baseEmp: 135, funding: '$15.0M', round: 'Series A', date: '2024-07-11' },
  { name: 'StackPulse Networks', domain: 'stackpulse.io', industry: 'Reliability Engineering SaaS', baseEmp: 82, funding: '$7.0M', round: 'Seed', date: '2024-11-15' },
  { name: 'CyberMesh Solutions', domain: 'cybermesh.co', industry: 'Network Security SaaS', baseEmp: 290, funding: '$38.0M', round: 'Series B', date: '2024-04-25' },
  { name: 'APIProtect', domain: 'apiprotect.dev', industry: 'API Gateway & Security', baseEmp: 70, funding: '$6.5M', round: 'Seed', date: '2024-10-31' },
  { name: 'OptiLogix Systems', domain: 'optilogix.ai', industry: 'Enterprise Search & Observability', baseEmp: 195, funding: '$21.0M', round: 'Series B', date: '2024-06-05' },
  { name: 'KubeDefense', domain: 'kubedefense.io', industry: 'Container Security Platform', baseEmp: 54, funding: '$4.2M', round: 'Seed', date: '2024-12-28' },
  { name: 'SentroAI Technologies', domain: 'sentroai.com', industry: 'Behavioral Threat Detection', baseEmp: 150, funding: '$17.5M', round: 'Series A', date: '2024-08-01' },
  { name: 'CoreSaaS India', domain: 'coresaas.in', industry: 'ERP & Vertical SaaS', baseEmp: 380, funding: '$42.0M', round: 'Series C', date: '2024-03-19' },
  { name: 'VortexIAM', domain: 'vortexiam.net', industry: 'Cloud Privilege Management', baseEmp: 68, funding: '$5.8M', round: 'Seed', date: '2024-11-09' },
];

export function generateSyntheticDataset(
  requirements: ResearchRequirement,
  seed = 42
): {
  records: DatasetRecord[];
  sources: Source[];
  conflicts: Conflict[];
} {
  const rng = new SeededRandom(seed);
  const sources = generateSyntheticSources();
  const records: DatasetRecord[] = [];
  const conflicts: Conflict[] = [];

  const now = new Date();

  COMPANY_SEEDS.forEach((seedItem, index) => {
    const recordId = `rec_${1000 + index}`;
    const city = rng.pick(INDIAN_CITIES);
    const foundedYear = rng.range(2020, 2023);

    // Intentional conflict for demo:
    // First record (Acme AI) has an employee count conflict:
    // Source A says 127, Source B says 130, Source C says 127 -> Resolved to 127
    const hasConflict = index === 0 || index === 4;

    const obsEmployees: Observation[] = [];
    let resolvedEmp = seedItem.baseEmp;
    let conflictEmp: Conflict | undefined;

    if (index === 0) {
      // Flagship conflict demo from prompt section 15
      obsEmployees.push(
        {
          id: `obs_${recordId}_emp_1`,
          recordId,
          field: 'employees',
          rawValue: '127 verified on official site',
          normalizedValue: 127,
          sourceId: 'src_official_domains',
          sourceName: 'Official Corporate Domain',
          observedAt: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
          confidence: 0.94,
        },
        {
          id: `obs_${recordId}_emp_2`,
          recordId,
          field: 'employees',
          rawValue: '130 headcount',
          normalizedValue: 130,
          sourceId: 'src_techhire_jobs',
          sourceName: 'TechHire Enterprise Portal',
          observedAt: new Date(now.getTime() - 26 * 3600 * 1000).toISOString(), // yesterday
          confidence: 0.82,
        },
        {
          id: `obs_${recordId}_emp_3`,
          recordId,
          field: 'employees',
          rawValue: '127 payroll filing',
          normalizedValue: 127,
          sourceId: 'src_roc_registry',
          sourceName: 'ROC Regulatory Registry',
          observedAt: new Date(now.getTime() - 4 * 3600 * 1000).toISOString(), // today
          confidence: 0.96,
        }
      );

      conflictEmp = {
        id: `conf_${recordId}_emp`,
        recordId,
        recordName: seedItem.name,
        field: 'employees',
        status: 'RESOLVED',
        observations: obsEmployees,
        resolvedValue: 127,
        resolutionReason:
          '3 sources cross-checked. 2 sources agree on 127 (Official Domain & ROC Registry). Most recent authoritative observation is 2 hours old.',
        resolvedConfidence: 0.92,
        detectedAt: new Date(now.getTime() - 3600 * 1000).toISOString(),
        resolvedAt: now.toISOString(),
      };
      conflicts.push(conflictEmp);
      resolvedEmp = 127;
    } else if (index === 4) {
      // Unresolved conflict for demonstration of unresolved handling
      obsEmployees.push(
        {
          id: `obs_${recordId}_emp_1`,
          recordId,
          field: 'employees',
          rawValue: '76',
          normalizedValue: 76,
          sourceId: 'src_official_domains',
          sourceName: 'Official Corporate Domain',
          observedAt: new Date(now.getTime() - 48 * 3600 * 1000).toISOString(),
          confidence: 0.72,
        },
        {
          id: `obs_${recordId}_emp_2`,
          recordId,
          field: 'employees',
          rawValue: '142',
          normalizedValue: 142,
          sourceId: 'src_techhire_jobs',
          sourceName: 'TechHire Portal',
          observedAt: new Date(now.getTime() - 12 * 3600 * 1000).toISOString(),
          confidence: 0.65,
        }
      );

      conflictEmp = {
        id: `conf_${recordId}_emp`,
        recordId,
        recordName: seedItem.name,
        field: 'employees',
        status: 'UNRESOLVED',
        observations: obsEmployees,
        resolvedValue: '76–142',
        resolutionReason:
          'Discrepancy between web disclosure (76) and aggressive job board postings (142). Flagged as unresolved variance for human review.',
        resolvedConfidence: 0.51,
        detectedAt: now.toISOString(),
      };
      conflicts.push(conflictEmp);
      resolvedEmp = 76;
    } else {
      obsEmployees.push({
        id: `obs_${recordId}_emp_1`,
        recordId,
        field: 'employees',
        rawValue: String(seedItem.baseEmp),
        normalizedValue: seedItem.baseEmp,
        sourceId: 'src_roc_registry',
        sourceName: 'Ministry of Corporate Affairs (ROC)',
        observedAt: now.toISOString(),
        confidence: 0.95,
      });
    }

    // Open jobs & signals
    const openJobs = rng.range(6, 28);
    const demandSignals: string[] = [];
    const hiringSignals: string[] = [];

    if (seedItem.industry.includes('Security') || index % 2 === 0) {
      demandSignals.push('Cybersecurity Demand Signal: Active AppSec / SOC hiring');
      hiringSignals.push('Lead Security Engineer');
      hiringSignals.push('DevSecOps Lead');
    }
    if (openJobs > 15) {
      demandSignals.push('Rapid Headcount Acceleration (+35% QoQ)');
      hiringSignals.push('Senior Backend Engineer (Go/Rust)');
    }
    demandSignals.push('Enterprise SOC2 Compliance Expansion');
    hiringSignals.push('Cloud Infrastructure Engineer');

    // Create Provenance Fields
    const companyNameField: ProvenanceField<string> = {
      value: seedItem.name,
      confidence: 0.98,
      confidenceLevel: 'HIGH',
      confidenceReason: 'Verified against MCA corporate registration database and DNS records.',
      evidence: [
        {
          sourceId: 'src_roc_registry',
          sourceName: 'Ministry of Corporate Affairs',
          sourceType: 'regulatory_registry',
          observedValue: seedItem.name,
          collectedAt: now.toISOString(),
          confidence: 0.98,
          isSynthetic: true,
        },
      ],
      lastUpdated: now.toISOString(),
    };

    const websiteField: ProvenanceField<string> = {
      value: `https://${seedItem.domain}`,
      confidence: 0.99,
      confidenceLevel: 'HIGH',
      confidenceReason: 'Domain DNS lookup and SSL handshake validated.',
      evidence: [
        {
          sourceId: 'src_official_domains',
          sourceName: 'Corporate Domain Index',
          sourceType: 'official_website',
          observedValue: `https://${seedItem.domain}`,
          collectedAt: now.toISOString(),
          confidence: 0.99,
          isSynthetic: true,
        },
      ],
      lastUpdated: now.toISOString(),
    };

    const employeesField: ProvenanceField<number | null> = {
      value: resolvedEmp,
      confidence: conflictEmp ? (conflictEmp.status === 'RESOLVED' ? 0.92 : 0.51) : 0.94,
      confidenceLevel: conflictEmp ? (conflictEmp.status === 'RESOLVED' ? 'HIGH' : 'LOW') : 'HIGH',
      confidenceReason: conflictEmp?.resolutionReason || 'Directly corroborated by ROC annual filing and payroll data.',
      hasConflict: !!conflictEmp,
      conflictId: conflictEmp?.id,
      evidence: obsEmployees.map((o) => ({
        sourceId: o.sourceId,
        sourceName: o.sourceName,
        sourceType: 'official_data',
        observedValue: o.normalizedValue,
        collectedAt: o.observedAt,
        confidence: o.confidence,
        isSynthetic: true,
      })),
      lastUpdated: now.toISOString(),
    };

    const fundingField: ProvenanceField<string> = {
      value: seedItem.funding,
      confidence: 0.96,
      confidenceLevel: 'HIGH',
      confidenceReason: 'Verified in venture registry filing and confirmed in syndicate press release.',
      evidence: [
        {
          sourceId: 'src_venture_pulse',
          sourceName: 'VenturePulse Intelligence Feed',
          sourceType: 'venture_database',
          observedValue: seedItem.funding,
          collectedAt: now.toISOString(),
          confidence: 0.96,
          isSynthetic: true,
        },
        {
          sourceId: 'src_news_wire',
          sourceName: 'Tech Newswire',
          sourceType: 'news_wire',
          observedValue: seedItem.funding,
          collectedAt: now.toISOString(),
          confidence: 0.91,
          isSynthetic: true,
        },
      ],
      lastUpdated: now.toISOString(),
    };

    const record: DatasetRecord = {
      id: recordId,
      datasetId: 'dataset_flagship_demo',
      companyName: companyNameField,
      website: websiteField,
      industry: {
        value: seedItem.industry,
        confidence: 0.95,
        confidenceLevel: 'HIGH',
        evidence: [
          {
            sourceId: 'src_official_domains',
            sourceName: 'Corporate Domain',
            sourceType: 'official_website',
            observedValue: seedItem.industry,
            collectedAt: now.toISOString(),
            confidence: 0.95,
            isSynthetic: true,
          },
        ],
        lastUpdated: now.toISOString(),
      },
      country: {
        value: 'India',
        confidence: 0.99,
        confidenceLevel: 'HIGH',
        evidence: [
          {
            sourceId: 'src_roc_registry',
            sourceName: 'Ministry of Corporate Affairs',
            sourceType: 'regulatory_registry',
            observedValue: 'India',
            collectedAt: now.toISOString(),
            confidence: 0.99,
            isSynthetic: true,
          },
        ],
        lastUpdated: now.toISOString(),
      },
      city: {
        value: city,
        confidence: 0.95,
        confidenceLevel: 'HIGH',
        evidence: [
          {
            sourceId: 'src_roc_registry',
            sourceName: 'ROC Database',
            sourceType: 'regulatory_registry',
            observedValue: city,
            collectedAt: now.toISOString(),
            confidence: 0.95,
            isSynthetic: true,
          },
        ],
        lastUpdated: now.toISOString(),
      },
      foundedYear: {
        value: foundedYear,
        confidence: 0.96,
        confidenceLevel: 'HIGH',
        evidence: [
          {
            sourceId: 'src_roc_registry',
            sourceName: 'ROC Certificate of Incorporation',
            sourceType: 'regulatory_registry',
            observedValue: foundedYear,
            collectedAt: now.toISOString(),
            confidence: 0.96,
            isSynthetic: true,
          },
        ],
        lastUpdated: now.toISOString(),
      },
      employees: employeesField,
      fundingTotal: fundingField,
      lastFundingRound: {
        value: seedItem.round,
        confidence: 0.95,
        confidenceLevel: 'HIGH',
        evidence: [
          {
            sourceId: 'src_venture_pulse',
            sourceName: 'VenturePulse Feed',
            sourceType: 'venture_database',
            observedValue: seedItem.round,
            collectedAt: now.toISOString(),
            confidence: 0.95,
            isSynthetic: true,
          },
        ],
        lastUpdated: now.toISOString(),
      },
      lastFundingDate: {
        value: seedItem.date,
        confidence: 0.93,
        confidenceLevel: 'HIGH',
        evidence: [
          {
            sourceId: 'src_news_wire',
            sourceName: 'Tech Newswire Syndication',
            sourceType: 'news_wire',
            observedValue: seedItem.date,
            collectedAt: now.toISOString(),
            confidence: 0.93,
            isSynthetic: true,
          },
        ],
        lastUpdated: now.toISOString(),
      },
      openJobsCount: {
        value: openJobs,
        confidence: 0.88,
        confidenceLevel: 'MEDIUM',
        evidence: [
          {
            sourceId: 'src_techhire_jobs',
            sourceName: 'TechHire Enterprise Feeds',
            sourceType: 'job_board',
            observedValue: openJobs,
            collectedAt: now.toISOString(),
            confidence: 0.88,
            isSynthetic: true,
          },
        ],
        lastUpdated: now.toISOString(),
      },
      hiringSignals: {
        value: hiringSignals,
        confidence: 0.85,
        confidenceLevel: 'MEDIUM',
        evidence: [
          {
            sourceId: 'src_techhire_jobs',
            sourceName: 'TechHire Telemetry',
            sourceType: 'job_board',
            observedValue: hiringSignals,
            collectedAt: now.toISOString(),
            confidence: 0.85,
            isSynthetic: true,
          },
        ],
        lastUpdated: now.toISOString(),
      },
      demandSignals: {
        value: demandSignals,
        confidence: 0.82,
        confidenceLevel: 'MEDIUM',
        confidenceReason: 'AI-derived opportunity inference from simultaneous hiring and enterprise compliance milestones.',
        evidence: [
          {
            sourceId: 'src_techhire_jobs',
            sourceName: 'Career Feed Analyzer',
            sourceType: 'job_board',
            observedValue: demandSignals,
            collectedAt: now.toISOString(),
            confidence: 0.82,
            isSynthetic: true,
          },
        ],
        lastUpdated: now.toISOString(),
      },
      overallConfidence: conflictEmp && conflictEmp.status === 'UNRESOLVED' ? 0.68 : 0.91,
      overallConfidenceLevel: conflictEmp && conflictEmp.status === 'UNRESOLVED' ? 'LOW' : 'HIGH',
      isSynthetic: true,
      whyIncluded: {
        matches: [
          { criterion: 'SaaS / Tech Entity', matched: true, status: 'MET', detail: `Category: ${seedItem.industry}` },
          { criterion: 'India Jurisdiction', matched: true, status: 'MET', detail: `Location: ${city}, India` },
          { criterion: 'Headcount Bracket (50–500)', matched: true, status: 'MET', detail: `${resolvedEmp} employees` },
          { criterion: 'Recent Venture Capital', matched: true, status: 'MET', detail: `${seedItem.funding} in ${seedItem.round}` },
          {
            criterion: 'Cybersecurity / Hiring Signal',
            matched: demandSignals.length > 0,
            status: demandSignals.length > 0 ? 'MET' : 'PARTIAL',
            detail: `${openJobs} open jobs; ${demandSignals.join(', ')}`,
          },
        ],
        summary: `${seedItem.name} fully satisfies all 5 specified research criteria backed by 5 corroborated sources.`,
        finalConfidence: conflictEmp && conflictEmp.status === 'UNRESOLVED' ? 0.68 : 0.91,
      },
      conflicts: conflictEmp ? [conflictEmp] : [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    records.push(record);
  });

  return { records, sources, conflicts };
}

// Function to simulate a future living dataset update
export function simulateLivingDatasetUpdate(
  currentRecords: DatasetRecord[]
): {
  updatedRecords: DatasetRecord[];
  changes: Array<{
    recordId: string;
    recordName: string;
    field: string;
    oldValue: any;
    newValue: any;
    changeType: 'VALUE_CHANGED' | 'NEW_RECORD' | 'SIGNAL_NEW';
    description: string;
  }>;
} {
  const updatedRecords = JSON.parse(JSON.stringify(currentRecords)) as DatasetRecord[];
  const changes: any[] = [];
  const now = new Date().toISOString();

  // Target Acme AI (first record) as specified in prompt section 18 and 51
  if (updatedRecords.length > 0) {
    const acme = updatedRecords[0];

    // Change 1: Headcount grew from 127 -> 141 (+14 / +11%)
    const oldEmp = acme.employees.value;
    acme.employees.value = 141;
    acme.employees.confidence = 0.95;
    acme.employees.confidenceReason = 'Consensus confirmed: +14 net verified hires on payroll registry.';
    acme.employees.lastUpdated = now;
    acme.employees.evidence.unshift({
      sourceId: 'src_techhire_jobs',
      sourceName: 'TechHire Enterprise Feeds',
      sourceType: 'job_board',
      observedValue: 141,
      collectedAt: now,
      confidence: 0.95,
      isSynthetic: true,
    });
    changes.push({
      recordId: acme.id,
      recordName: acme.companyName.value,
      field: 'employees',
      oldValue: oldEmp,
      newValue: 141,
      changeType: 'VALUE_CHANGED',
      description: `Employee headcount expanded from ${oldEmp} to 141 (+11% growth detected).`,
    });

    // Change 2: Funding increased from $14.2M -> $22.5M Series B
    const oldFunding = acme.fundingTotal.value;
    acme.fundingTotal.value = '$22.5M';
    acme.lastFundingRound.value = 'Series B';
    acme.lastFundingDate.value = '2025-02-15';
    acme.fundingTotal.lastUpdated = now;
    acme.fundingTotal.evidence.unshift({
      sourceId: 'src_venture_pulse',
      sourceName: 'VenturePulse Intelligence Feed',
      sourceType: 'venture_database',
      observedValue: '$22.5M Series B',
      collectedAt: now,
      confidence: 0.98,
      isSynthetic: true,
    });
    changes.push({
      recordId: acme.id,
      recordName: acme.companyName.value,
      field: 'fundingTotal',
      oldValue: oldFunding,
      newValue: '$22.5M (Series B)',
      changeType: 'VALUE_CHANGED',
      description: `New Series B capital raise detected: ${oldFunding} → $22.5M led by Enterprise Growth Fund.`,
    });

    // Change 3: New cybersecurity job signal detected
    const oldJobs = acme.openJobsCount.value;
    acme.openJobsCount.value = 24;
    acme.hiringSignals.value.unshift('Head of Information Security (CISO)');
    acme.demandSignals.value.unshift('CRITICAL: CISO role opened, preparing for FedRAMP / HIPAA compliance');
    acme.updatedAt = now;
    changes.push({
      recordId: acme.id,
      recordName: acme.companyName.value,
      field: 'demandSignals',
      oldValue: `${oldJobs} open positions`,
      newValue: '24 open positions (+11 new roles, including CISO appointment)',
      changeType: 'SIGNAL_NEW',
      description: 'Senior Information Security Leadership vacancy posted on corporate ATS.',
    });
  }

  return { updatedRecords, changes };
}
