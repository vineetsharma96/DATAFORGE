# DATAFORGE — Autonomous AI Data Intelligence Platform & Living Dataset Engine

> **Ask a business question. Get a verified, traceable, continuously maintainable intelligence dataset.**

DATAFORGE turns natural language business requirements into structured, multi-source validated datasets with complete observation provenance, automated conflict resolution, and continuous living dataset change detection.

---

## 🌟 Core Innovations

1. **Autonomous Research Orchestration**: AI plans and generates adaptive multi-stage data-collection workflows instead of rigid static scrapers.
2. **Provenance & Evidence Graph**: Every critical field traces back to underlying observations, collection timestamps, and source authorities.
3. **Cross-Source Verification & Conflict Resolution**: Automatically cross-references conflicting observations (e.g., employee headcounts from registries vs. web disclosures), evaluates recency and authority, and resolves values with multi-factor confidence scoring.
4. **Deterministic & Semantic Deduplication**: Clusters corporate entities via legal name normalization, canonical URL resolution, and fuzzy similarity matching while preserving merged provenance.
5. **Living Datasets Engine**: Datasets don't go stale. Continuous monitoring scans for headcount velocity, new funding rounds, and new hiring signals, computing field-level diffs and maintaining version history (`v1.0` → `v1.1`).
6. **Multi-Model AI Architecture**: Provider-agnostic abstraction supporting **Google Gemini API** (cloud), **Ollama** (local AI), and a zero-dependency **Deterministic Heuristic Engine** for instant offline demonstrations.
7. **Observed Facts vs. AI-Derived Inferences**: Visually and semantically distinguishes observed facts (e.g., job postings, funding filings) from AI-derived signals (e.g., cybersecurity demand opportunities).

---

## 🏗️ Architecture

```text
USER PROMPT
     ↓
INTENT PARSER (Gemini / Ollama / Deterministic)
     ↓
REQUIREMENT SPECIFICATION
     ↓
DYNAMIC WORKFLOW GENERATOR
     ↓
MULTI-SOURCE DISCOVERY (Corporate Registries, Tech Wire, Job Feeds)
     ↓
DATA COLLECTION & RAW INGESTION
     ↓
SCHEMA EXTRACTION
     ↓
DETERMINISTIC NORMALIZATION (Currencies, URLs, Brackets)
     ↓
ENTITY DEDUPLICATION & MERGING
     ↓
CONSTRAINT VALIDATION
     ↓
CONFLICT DETECTION & CROSS-CHECK
     ↓
CONFIDENCE ENGINE (Authority × Recency × Agreement)
     ↓
LIVING DATASET (Versioned & Monitored)
     ↓
INTELLIGENCE GRAPH & SIGNALS
```

---

## 🚀 Quick Start

### 1. Installation

```bash
git clone https://github.com/vineetsharma96/DATAFORGE.git
cd DATAFORGE
npm install
```

### 2. Environment Configuration

Copy the example environment configuration:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# AI Provider ("gemini" | "ollama" | "heuristic")
AI_PROVIDER=gemini

# Google Gemini (Primary Cloud Provider)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Ollama (Local AI Alternative)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# Demo Mode (Deterministic Synthetic Data)
DATA_MODE=synthetic
DEMO_MODE=true
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎬 Flagship Demo Story

Launch the platform and click **"Run Flagship Demo"** or enter:

> *"Find Indian SaaS companies that raised funding recently, have 50–500 employees, are actively hiring, and show signals that they may need cybersecurity services."*

### What Happens:
1. **AI Requirement Understanding**: Extracts target entity, industry, headcount bracket (50–500), and compliance/security signals.
2. **Dynamic Workflow Generation**: Creates 9 observable pipeline nodes with duration and record metrics.
3. **Data Ingestion**: Gathers observations across ROC India, VenturePulse, Corporate Domains, and TechHire.
4. **Deduplication**: Merges "Acme AI Pvt Ltd" and "Acme AI Technologies" while preserving dual evidence chains.
5. **Conflict Resolution**: Detects employee count discrepancies (Source A: 127, Source B: 130, Source C: 127). Evaluates source freshness and consensus to resolve to 127 with 92% confidence.
6. **Confidence Engine**: Assigns multi-factor confidence across fields, records, and overall dataset quality (93%).
7. **Dataset Explorer**: High-density interactive table with click-to-view evidence and "Why Included?" match analysis.
8. **Evidence Graph**: Interactive SVG relationship graph between companies, funding rounds, jobs, sources, and opportunity signals.
9. **Living Dataset Simulation**: Click **"Check Monitoring (Simulate)"** to simulate a future update detecting Acme AI's headcount expanding (127 → 141), Series B funding ($22.5M), and new CISO leadership vacancy!

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server-Sent Events, Streaming API Routes)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with strict design token system adhering to `DESIGN.md` (dark aesthetic `#0A0D10`, cyan intelligence accent `#4DDCFF`)
- **Icons**: Lucide React
- **Storage**: In-memory + persisted JSON store (`.data/`)
- **AI Integrations**: Google Gemini API, Ollama Local REST API, and Deterministic Fallback Engine

---

## 🔒 Security & Privacy

- API keys are handled server-side and never exposed to the frontend client.
- External web content is treated as untrusted data with strict sanitization.
- Zero silent hallucination: unsupported values are marked explicitly as unknown.
- Tool execution is strictly allowlisted.
