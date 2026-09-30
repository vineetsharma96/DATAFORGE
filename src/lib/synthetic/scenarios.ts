export interface DemoScenario {
  id: string;
  title: string;
  category: string;
  prompt: string;
  description: string;
  targetCount: number;
  highlightSignal: string;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'scenario_saas_cybersec',
    title: 'Indian SaaS with Cybersecurity Demand',
    category: 'Sales & Market Intelligence',
    prompt:
      'Find Indian SaaS companies that raised funding recently, have 50–500 employees, are actively hiring, and show signals that they may need cybersecurity services.',
    description:
      'Flagship end-to-end scenario demonstrating discovery, evidence cross-checking, conflict resolution on headcount, deduplication, and AI opportunity detection.',
    targetCount: 30,
    highlightSignal: 'Cybersecurity Demand Signals & Headcount Growth',
  },
  {
    id: 'scenario_ai_engineers',
    title: 'Startups Hiring AI/ML Engineers',
    category: 'Hiring Intelligence',
    prompt:
      'Find fast-growing B2B technology startups hiring Senior Machine Learning and Generative AI Engineers with verified Series A or B funding.',
    description:
      'Extracts tech stack requirements, hiring pace, compensation signals, and open role provenance.',
    targetCount: 25,
    highlightSignal: 'Generative AI & LLM Infrastructure Roles',
  },
  {
    id: 'scenario_hackathon_sponsors',
    title: 'Developer Platform Sponsor Discovery',
    category: 'Sponsor & Partner Discovery',
    prompt:
      'Identify enterprise developer tooling and cloud infrastructure startups with active developer relations programs and recent venture funding.',
    description:
      'Cross-checks GitHub developer engagement, sponsorship history, and corporate marketing budgets.',
    targetCount: 20,
    highlightSignal: 'DevRel Budget & Community Event Participation',
  },
  {
    id: 'scenario_hypergrowth_headcount',
    title: 'Startups with Rapid Employee Headcount Growth',
    category: 'Growth & Expansion Signals',
    prompt:
      'Discover seed and early growth startups that doubled headcount over the last 6 months across India and Southeast Asia.',
    description:
      'Detects headcount variance across job boards, LinkedIn corporate pages, and regulatory registrar filings.',
    targetCount: 24,
    highlightSignal: 'Net 100%+ Headcount Velocity in 180 Days',
  },
  {
    id: 'scenario_sea_expansion',
    title: 'Fintech Companies Expanding to SEA & India',
    category: 'Market Entry Intelligence',
    prompt:
      'Find payment and fintech platforms establishing regional compliance, local banking rails, and regional headquarters in India or Singapore.',
    description:
      'Monitors regulatory license grants, local entity filings, and regional leadership appointments.',
    targetCount: 18,
    highlightSignal: 'RBI / MAS Regulatory Filing & Regional Licensing',
  },
];
