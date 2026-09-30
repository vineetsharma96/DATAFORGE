# DATAFORGE — DESIGN SYSTEM & UI/UX SPECIFICATION

Version: 1.0
Product: DATAFORGE
Descriptor: Autonomous Data Intelligence
Design Direction: AI Intelligence Command Center
Primary Experience: ASK → INVESTIGATE → VERIFY → UNDERSTAND

---

# 1. DESIGN NORTH STAR

DATAFORGE is not a generic AI SaaS dashboard and must not visually resemble a standard CRUD administration panel.

The interface should communicate:

> "An autonomous intelligence system is researching, validating, and transforming information into trusted data."

The visual language combines:

* AI research workspace
* enterprise intelligence platform
* advanced data analytics
* agent orchestration
* evidence/provenance visualization
* futuristic developer tooling

The design must feel:

* sophisticated
* technical
* trustworthy
* analytical
* futuristic
* information-dense
* premium
* calm
* precise

Avoid making the interface feel:

* playful
* cartoon-like
* consumer AI
* excessively futuristic
* crypto/Web3
* generic SaaS
* overloaded with gradients
* excessively glassmorphic

---

# 2. CORE EXPERIENCE

The complete product experience follows:

ASK
↓
UNDERSTAND
↓
PLAN
↓
RESEARCH
↓
COLLECT
↓
VERIFY
↓
STRUCTURE
↓
INTELLIGENCE
↓
MONITOR

The UI must visually communicate this progression.

The user should always understand:

1. What they asked.
2. What the AI understood.
3. What the AI is doing.
4. Where information came from.
5. How reliable the result is.
6. What was inferred versus observed.
7. What changed since the previous dataset version.

---

# 3. PRIMARY VISUAL CONCEPT

## DATA FLOW

DATA FLOW is the primary visual identity of DATAFORGE.

Represent the platform as a continuous information pipeline:

PROMPT
↓
AI PLAN
↓
SOURCES
↓
OBSERVATIONS
↓
EVIDENCE
↓
VALIDATION
↓
DATASET
↓
INTELLIGENCE

Use:

* thin connecting lines
* subtle animated particles
* small node indicators
* pulses for active operations
* directional flow
* restrained glow

Do not use excessive glowing effects.

The visual metaphor should resemble a high-end intelligence system rather than a sci-fi movie interface.

---

# 4. VISUAL HIERARCHY

Use three visual layers.

## Layer 1 — QUESTION

Natural-language business requirement.

Primary interaction:

"What do you need to know?"

## Layer 2 — RESEARCH

AI workflow, sources, agents, evidence and verification.

Primary interaction:

"How is DATAFORGE finding the answer?"

## Layer 3 — INTELLIGENCE

Dataset, confidence, relationships, insights and changes.

Primary interaction:

"What did DATAFORGE learn?"

---

# 5. COLOR SYSTEM

The interface uses a dark-first design.

## Background

Primary background:

#0A0D10

Secondary background:

#0D1115

Elevated surface:

#11161B

Higher elevation:

#151B21

## Borders

Primary border:

#252D35

Subtle border:

#1B2229

Strong border:

#303A44

## Text

Primary:

#F1F4F6

Secondary:

#9AA4AE

Muted:

#68737E

Disabled:

#454D55

## Primary Accent

DATAFORGE primary intelligence accent:

#4DDCFF

Use this for:

* active AI states
* data flow
* selected navigation
* active nodes
* primary interactive elements
* intelligence indicators

Do not flood the interface with cyan.

Cyan should communicate:

> "DATAFORGE is actively processing intelligence."

## Semantic Colors

Verified:

#5FE3A1

Warning:

#F5C451

Conflict:

#FF8A65

Critical:

#FF5C70

Unknown:

#7D8791

---

# 6. COLOR SEMANTICS

Color must communicate meaning.

CYAN
= AI / active / processing / intelligence

GREEN
= verified / successful / trusted

AMBER
= warning / incomplete / needs attention

ORANGE
= conflict / investigation

RED
= critical failure

GRAY
= unknown / unavailable / inactive

Never use color as the only way to communicate status.

Always combine color with:

* icon
* text
* shape
* status indicator

---

# 7. TYPOGRAPHY

Use two typography families.

## Primary Typeface

Preferred:

Geist

Fallback:

Inter

Alternative:

IBM Plex Sans

Use the actual available/project font if one is already specified elsewhere.

Primary typeface is used for:

* navigation
* headings
* descriptions
* tables
* buttons
* forms
* dashboards

## Technical Typeface

Preferred:

JetBrains Mono

Alternative:

IBM Plex Mono

Use for:

* timestamps
* source IDs
* dataset IDs
* API status
* workflow logs
* technical metadata
* confidence values where appropriate
* code-like values

---

# 8. TYPE SCALE

## Display

56px
Weight: 600
Line height: 1.05

Use rarely.

## H1

36px
Weight: 600
Line height: 1.1

## H2

28px
Weight: 600
Line height: 1.15

## H3

20px
Weight: 600
Line height: 1.25

## Body Large

16px
Weight: 400
Line height: 1.5

## Body

14px
Weight: 400
Line height: 1.5

## Small

12px
Weight: 400
Line height: 1.4

## Technical

11–13px
JetBrains Mono
Line height: 1.4

Avoid using too many typography sizes.

---

# 9. SPACING SYSTEM

Use an 8px base grid.

Available values:

4
8
12
16
20
24
32
40
48
64
80
96

Preferred:

4px = micro spacing
8px = icon/internal spacing
12px = compact components
16px = normal component spacing
24px = card/panel padding
32px = section spacing
48px = major section spacing
64px+ = page-level spacing

Avoid arbitrary spacing values unless required by an existing component.

---

# 10. BORDER RADIUS

The interface should feel technical rather than overly rounded.

Use:

4px
6px
8px
10px
12px

Preferred:

6px for inputs
8px for cards
8px for buttons
10px for larger panels

Avoid excessive 20–32px rounded cards.

---

# 11. SURFACE SYSTEM

Use layered surfaces.

LEVEL 0

Page background.

LEVEL 1

Primary content surfaces.

LEVEL 2

Cards and panels.

LEVEL 3

Focused/expanded surfaces.

LEVEL 4

Modal/overlay surfaces.

Each elevation should be communicated primarily through:

* border
* subtle tonal shift
* small shadow

Avoid heavy shadows.

---

# 12. GRID

Desktop primary width:

1440px

Maximum content width:

1400px

Preferred content padding:

32px

Large desktop padding:

48px

Dashboard grid:

12 columns

Default gap:

16px

Major dashboard panels should align to the grid.

---

# 13. APPLICATION SHELL

Desktop structure:

SIDEBAR
+
MAIN CONTENT

Recommended sidebar width:

240px

Collapsed sidebar:

72px

Main content should occupy remaining viewport.

---

# 14. NAVIGATION

Primary navigation:

DATAFORGE

Overview

Research

Datasets

Intelligence

Sources

History

Settings

Navigation should remain minimal.

Use simple line icons.

Icons should generally be 18–20px.

Active item:

* subtle cyan background
* cyan icon
* primary text

Do not use large glowing active states.

---

# 15. TOP BAR

Top bar contains:

Left:

Current page / breadcrumb

Center:

Optional research/task state

Right:

AI provider
Notifications
User menu

Example:

DATAFORGE / Research / Task #0142

Right:

GEMINI ●
Notifications
Profile

---

# 16. AI PROVIDER INDICATOR

Always show which AI provider is active when relevant.

Example:

GEMINI
● CONNECTED

or

OLLAMA
● LOCAL

Provider indicator should be small.

Use a tooltip for technical information.

---

# 17. OVERVIEW DASHBOARD

The Overview page is an intelligence summary, not a collection of random charts.

Top:

"Good afternoon."

Then:

"Your intelligence workspace"

Primary action:

NEW RESEARCH

Main KPIs:

Datasets
Active Research
Records
Verified Records
Evidence
Changes

Secondary sections:

Research Activity
Dataset Quality
Recent Research
Living Datasets
Opportunity Signals

---

# 18. HERO RESEARCH INPUT

The primary action across the application is the research prompt.

Large input:

WHAT DO YOU NEED TO KNOW?

Placeholder:

"Describe a business requirement in plain English..."

Example:

"Find Indian SaaS companies recently funded, actively hiring, and showing cybersecurity demand signals."

Primary button:

RUN RESEARCH

Optional actions:

Attach context
Choose dataset
Advanced options

---

# 19. RESEARCH LANDING SCREEN

Before research begins, prioritize simplicity.

Layout:

Centered research input.

Below:

Suggested research templates.

Examples:

Sales Intelligence
Market Research
Hiring Intelligence
Sponsor Discovery
Competitive Intelligence

Below:

Recent Research

The screen should feel spacious.

---

# 20. RESEARCH EXECUTION

When research starts, the interface transitions from input mode to execution mode.

Do not navigate to an unrelated page unless necessary.

The research input remains visible at the top.

Below it:

AI interpretation
+
Workflow
+
Live execution

---

# 21. AI INTERPRETATION PANEL

Title:

AI UNDERSTANDING

Display:

Entity
Industry
Location
Time range
Filters
Required attributes
Derived attributes

Example:

ENTITY
Company

INDUSTRY
SaaS

LOCATION
India

EMPLOYEES
50–500

FUNDING
Recent

Buttons:

EDIT REQUIREMENTS
START RESEARCH

---

# 22. WORKFLOW VISUALIZATION

Workflow nodes:

UNDERSTAND
PLAN
DISCOVER
COLLECT
EXTRACT
NORMALIZE
DEDUPLICATE
VALIDATE
VERIFY
FINALIZE

Each node includes:

Name
Status
Duration
Records

Node states:

QUEUED
RUNNING
COMPLETED
WARNING
FAILED
SKIPPED

---

# 23. WORKFLOW NODE DESIGN

Default:

Dark surface
1px border
8px radius

Running:

Cyan border
Subtle cyan glow
Animated indicator

Completed:

Green status indicator

Warning:

Amber indicator

Conflict:

Orange indicator

Failed:

Red indicator

Do not animate entire nodes.

Only animate:

* indicator
* connecting line
* progress
* data particle

---

# 24. ACTIVE AGENT PANEL

Display what the AI is currently doing.

Example:

ACTIVE AGENT

Evidence Verification Agent

Checking:

Acme AI

Employee count

Source A
127

Source B
130

Source C
127

STATUS

Resolving conflict...

This panel should feel like an AI operator console.

---

# 25. LIVE METRICS

During research show:

Records discovered
Records processed
Verified
Duplicates
Conflicts
Low confidence

Example:

241
RECORDS

187
VERIFIED

21
DUPLICATES

12
CONFLICTS

---

# 26. DATASET EXPLORER

The dataset explorer is high-density.

Top:

Dataset name

Metadata:

Records
Quality
Evidence
Last updated

Controls:

Search
Filter
Sort
Columns
Saved views
Export

---

# 27. DATA TABLE

Use compact rows.

Recommended row height:

48–56px

Column headers:

11–12px uppercase or technical style.

Rows should support:

hover
selection
keyboard navigation

Avoid excessive row separators.

Use subtle borders.

---

# 28. CONFIDENCE DISPLAY

Confidence should never look like a generic progress bar everywhere.

Preferred:

92%
High confidence

or:

● 92%

Color based on confidence category.

Example:

90–100
High

70–89
Medium

Below 70
Low

The actual threshold should remain configurable.

Always clarify:

"System confidence estimate"

not:

"Truth score."

---

# 29. RECORD INSPECTOR

Opening a record should reveal a side panel.

Recommended width:

420–520px

Sections:

Overview
Properties
Evidence
Sources
Confidence
Relationships
AI Insights
Change History

The dataset should remain visible behind the panel.

---

# 30. WHY INCLUDED

Every record should have:

WHY INCLUDED?

Show requirement matching.

Example:

✓ Indian company
✓ SaaS
✓ 50–500 employees
✓ Recent funding
⚠ Hiring evidence limited

This should be understandable without technical knowledge.

---

# 31. EVIDENCE COMPONENT

Every important field can expose evidence.

Example:

EMPLOYEES

127

92% confidence

Evidence:

Source A
127
Collected 2h ago

Source C
127
Collected today

Conflict:

Source B
130

Actions:

VIEW SOURCE
VIEW EVIDENCE

---

# 32. SOURCE-BACKED UI

Never display an unsupported value as though it were verified.

Unknown state:

VALUE UNKNOWN

No reliable observation found.

Confidence:

0%

This is preferable to fabricated completeness.

---

# 33. CONFLICT UI

Conflicts should be visually obvious but not alarming.

Example:

DATA CONFLICT

Employee count

127
Source A

130
Source B

127
Source C

RESOLUTION

127

Confidence:

92%

Reason:

Two sources agree and the supporting observation is more recent.

If unresolved:

UNRESOLVED

80–130

Do not force a value.

---

# 34. DATA QUALITY CENTER

Show:

Coverage
Completeness
Evidence coverage
Duplicate rate
Conflict rate
Freshness

Example:

DATA QUALITY

93%

Coverage
91%

Evidence
95%

Freshness
88%

Use charts sparingly.

---

# 35. EVIDENCE GRAPH

Graph background:

#0A0D10

Nodes use dark surfaces.

Primary node:

cyan outline

Entity nodes:

neutral outline

Evidence nodes:

green/neutral

Conflict nodes:

orange

Relationships:

thin lines.

Selected relationship:

cyan.

Graph must support:

Zoom
Pan
Search
Filter
Node selection
Relationship inspection
Expand

---

# 36. GRAPH INFORMATION PANEL

When a node is selected:

ENTITY

Acme AI

Type:

Company

Relationships:

Founder
Funding
Investor
Jobs
Sources

Evidence:

6 observations

Confidence:

92%

---

# 37. LIVING DATASETS

Living datasets should feel like monitored intelligence assets.

Each dataset card displays:

Dataset name
Monitoring state
Last checked
Next check
Record count
Recent changes

Example:

INDIAN SAAS INTELLIGENCE

● MONITORING

271 records

Last checked
2 hours ago

Next check
Tomorrow

18 changes detected

VIEW CHANGES

---

# 38. CHANGE TIMELINE

Use chronological presentation.

Example:

TODAY

14:21
+18 companies

13:58
Acme AI employee count changed

12:41
4 records removed

11:09
New funding evidence detected

Each event should identify whether it is:

NEW
REMOVED
CHANGED
VERIFIED
CONFLICT
RESOLVED

---

# 39. DATASET VERSIONING

Display:

Version 01
Version 02
Version 03

Allow:

Compare versions
Restore view
Inspect changes

Never visually imply that old evidence has been deleted.

---

# 40. AI INSIGHTS

AI-derived information must be visually separated from observed data.

Observed:

OBSERVED FACT

Security Engineer position posted.

AI-derived:

AI SIGNAL

Potential cybersecurity demand.

Confidence:

78%

Use different visual treatment for AI inference.

---

# 41. SOURCE REGISTRY

Sources page should display:

Source name
Type
Reliability
Last collection
Records
Status

Example:

SOURCE

Public Website

Type
Web

Status
● Available

Reliability
High

Last checked
Today

---

# 42. HISTORY

Research history should show:

Research name
Prompt
Status
Records
Duration
Created
Last run

Actions:

Open
Run again
Duplicate
Monitor
Export

---

# 43. SETTINGS

Settings sections:

AI Providers
Data Sources
Research Defaults
Dataset Defaults
Monitoring
Security
Appearance

---

# 44. AI PROVIDER SETTINGS

Display:

GEMINI

API status
Model
Connection

OLLAMA

Local endpoint
Model
Connection

Controls:

Test connection
Switch provider

Never expose API keys after saving.

---

# 45. SYNTHETIC DATA MODE

Synthetic mode must be visually obvious.

Banner:

SYNTHETIC DEMONSTRATION DATA

Use a subtle amber/gray indicator.

Never make synthetic records appear to be real external records.

Example label:

SYNTHETIC

attached to:

Source
Dataset
Evidence

---

# 46. DEMO MODE

Demo mode should be accessible from settings or development controls.

Display:

DEMO MODE

Synthetic research
Deterministic results
No external requests

The demo should reproduce the same result reliably.

---

# 47. EMPTY STATES

Never show empty blank pages.

Example:

NO DATASETS YET

Turn a business question into your first intelligence dataset.

[START RESEARCH]

Secondary:

Try a sample research request.

---

# 48. LOADING STATES

Loading should communicate work.

Examples:

UNDERSTANDING REQUEST...

DISCOVERING SOURCES...

VALIDATING RECORDS...

RESOLVING CONFLICTS...

GENERATING DATASET...

Use subtle animated indicators.

Avoid generic:

"Loading..."

---

# 49. ERROR STATES

Errors should explain:

What happened
What continues
What the user can do

Example:

SOURCE UNAVAILABLE

One research source could not be reached.

DATAFORGE will continue using available sources.

[RETRY]
[VIEW WORKFLOW]

---

# 50. AI FAILURE STATE

Example:

AI PROVIDER UNAVAILABLE

Gemini could not complete the request.

Available fallback:

OLLAMA

[SWITCH TO OLLAMA]
[RETRY GEMINI]

---

# 51. BUTTONS

Primary:

Filled accent

Secondary:

Dark surface + border

Tertiary:

Text only

Danger:

Use semantic red only for destructive actions.

Button heights:

32px compact
36px default
40px primary
44px large

Radius:

6–8px

---

# 52. INPUTS

Default:

Dark surface
1px border
6px radius

Focus:

Cyan border

Error:

Red border

Placeholder:

Muted gray

Inputs should not have large exaggerated glow effects.

---

# 53. BADGES

Badges should be compact.

Examples:

RUNNING
VERIFIED
LOW CONFIDENCE
CONFLICT
SYNTHETIC
MONITORING

Use text + small status indicator.

---

# 54. ICONOGRAPHY

Use simple technical line icons.

Preferred size:

16px
18px
20px
24px

Avoid decorative icons.

Icons must support comprehension.

---

# 55. TABLE INTERACTION

Support:

Row hover
Row selection
Column sorting
Column resizing
Filtering
Search
Pagination

Selected row:

subtle cyan-tinted background

Never use heavy borders around every cell.

---

# 56. CHART DESIGN

Charts should be analytical.

Recommended:

Line charts
Bar charts
Area charts
Scatter plots
Distribution charts
Network graphs

Avoid:

3D charts
pie-chart overload
decorative graphs

Charts should answer questions.

---

# 57. DASHBOARD CHART COLORS

Use semantic colors.

Primary analytical series:

cyan

Positive:

green

Warning:

amber

Conflict:

orange

Critical:

red

Do not create a rainbow dashboard.

---

# 58. MOTION SYSTEM

Motion is functional.

## Fast

120–180ms

Buttons
Hover
Focus

## Standard

200–300ms

Panels
Dropdowns
Drawers

## Complex

400–700ms

Workflow transitions
Graph expansion
Dataset transitions

Avoid animations longer than 1 second unless they communicate ongoing processing.

---

# 59. DATA FLOW ANIMATION

Use subtle particles travelling along workflow connections.

When a node is active:

line becomes brighter.

When completed:

line returns to subtle state.

When failed:

flow stops at node.

When conflict occurs:

flow branches into verification.

---

# 60. PAGE TRANSITIONS

Use subtle opacity/position transitions.

Avoid cinematic transitions between every page.

The application should remain efficient.

---

# 61. RESPONSIVE DESIGN

Desktop:

Primary experience.

Tablet:

Maintain sidebar or compact navigation.

Mobile:

Prioritize:

Research
Task progress
Dataset summary
Alerts
Record inspection

Complex graph view may use simplified interactions on mobile.

---

# 62. MOBILE NAVIGATION

Use:

Top bar
Bottom navigation or compact sidebar

Primary items:

Research
Datasets
Intelligence
History

Settings can remain secondary.

---

# 63. ACCESSIBILITY

Required:

Keyboard navigation
Visible focus
Semantic HTML
Readable contrast
ARIA labels
Reduced motion support
Accessible tables
Accessible charts
Tooltips with text alternatives

Never communicate information using color alone.

---

# 64. COMPONENT ARCHITECTURE

Build reusable components.

Core:

AppShell
Sidebar
TopBar
ResearchInput
PromptSuggestion
RequirementPanel
Workflow
WorkflowNode
AgentConsole
MetricCard
DatasetTable
DatasetToolbar
RecordInspector
EvidencePanel
EvidenceItem
ConfidenceBadge
ConflictCard
SourceCard
QualityCard
GraphView
GraphInspector
LivingDatasetCard
ChangeTimeline
ProviderSelector
StatusBadge
Toast
Modal
Drawer
EmptyState
LoadingState
ErrorState

---

# 65. DESIGN TOKENS

All colors, spacing, typography and radii should be centralized.

Do not scatter values throughout components.

Suggested token categories:

color.background.*
color.surface.*
color.border.*
color.text.*
color.accent.*
color.semantic.*

space.*
radius.*
type.*
shadow.*
motion.*

---

# 66. FIGMA FILE STRUCTURE

Create these Figma pages:

01 — Foundations
02 — Components
03 — Application Shell
04 — Overview
05 — Research
06 — Execution
07 — Dataset Explorer
08 — Record Inspector
09 — Evidence Graph
10 — Living Datasets
11 — History
12 — Settings
13 — Responsive
14 — Prototype Flows

---

# 67. FIGMA FOUNDATIONS

Foundations page contains:

Colors
Typography
Spacing
Grid
Radius
Elevation
Motion
Icons

Every reusable visual rule should originate here.

---

# 68. FIGMA COMPONENTS

Create reusable:

Buttons
Inputs
Cards
Badges
Navigation
Metric cards
Workflow nodes
Dataset rows
Evidence items
Confidence indicators
Graph nodes
Status indicators
Drawers
Modals

Use variants rather than duplicating components.

---

# 69. RESEARCH SCREEN FIGMA FRAME

Desktop target:

1440 × 1024

Structure:

Top navigation
Research prompt
AI interpretation
Suggested templates
Recent research

The research prompt is the dominant visual element.

---

# 70. EXECUTION SCREEN FIGMA FRAME

Desktop target:

1440 × 1024

Structure:

Header
Research request
Progress metrics
Workflow visualization
Agent console
Activity log

The workflow is the dominant element.

---

# 71. DATASET SCREEN FIGMA FRAME

Desktop target:

1440 × 1024

Structure:

Dataset header
Quality metrics
Toolbar
Data table
Optional record inspector

The table should dominate.

---

# 72. EVIDENCE GRAPH FRAME

Desktop target:

1440 × 1024

Structure:

Graph canvas
Top toolbar
Search
Filters
Right inspector

The graph should occupy approximately 70–80% of the available space.

---

# 73. LIVING DATASET FRAME

Desktop target:

1440 × 1024

Structure:

Dataset header
Monitoring status
Quality metrics
Change timeline
Version comparison

---

# 74. INFORMATION DENSITY

DATAFORGE is an intelligence product.

Use higher information density than a normal SaaS application.

However:

Do not cram everything onto one screen.

Use:

* hierarchy
* whitespace
* progressive disclosure
* side panels
* tabs
* expandable details

Primary information first.

Technical information second.

Raw evidence third.

---

# 75. TRUST PRINCIPLE

The UI must always distinguish:

FACT
from
EVIDENCE
from
AI INTERPRETATION

Example:

FACT:

127 employees observed.

EVIDENCE:

Source A + Source C.

AI INTERPRETATION:

Company appears to be experiencing growth.

Never combine these into one indistinguishable card.

---

# 76. AI TRANSPARENCY

When AI performs an operation, the interface should expose enough context to build trust.

Examples:

"AI generated research plan"

"3 sources selected"

"21 duplicates removed"

"12 conflicts detected"

"6 records require additional evidence"

Avoid exposing internal chain-of-thought or private reasoning.

Show concise operational explanations instead.

---

# 77. SOURCE TRANSPARENCY

Every external observation should preserve:

Source
Collection time
Observed value
Field
Confidence
Evidence reference

---

# 78. SYNTHETIC TRANSPARENCY

Synthetic data must be clearly identified.

Use:

SYNTHETIC

or:

DEMO DATA

Never use fake URLs or pretend that generated sources are real.

---

# 79. VISUAL PERSONALITY

The product personality is:

PRECISION
+
INTELLIGENCE
+
CONTROL
+
TRUST

Not:

PLAYFULNESS
+
DECORATION
+
VISUAL NOISE

---

# 80. DESIGN DO / DON'T

DO:

Use dark analytical surfaces.

DO:

Use restrained cyan accents.

DO:

Use data-flow visualization.

DO:

Make evidence inspectable.

DO:

Use high information density.

DO:

Use progressive disclosure.

DO:

Make AI activity visible.

DO:

Use precise typography.

DO:

Use meaningful animation.

DON'T:

Use generic purple AI gradients.

DON'T:

Use excessive glassmorphism.

DON'T:

Use giant decorative 3D objects.

DON'T:

Use excessive rounded cards.

DON'T:

Use rainbow dashboards.

DON'T:

Make every element glow.

DON'T:

Hide provenance.

DON'T:

Present AI inference as fact.

DON'T:

Create fake real-world evidence.

---

# 81. SIGNATURE VISUAL ELEMENTS

DATAFORGE should be recognizable through:

1. DATA FLOW
2. Evidence visualization
3. Confidence indicators
4. Workflow nodes
5. Dense intelligence tables
6. Graph relationships
7. Living dataset timeline
8. Cyan intelligence accent
9. Technical typography
10. Dark command-center environment

---

# 82. PRIMARY USER JOURNEY

User opens DATAFORGE.

↓

Sees:

WHAT DO YOU NEED TO KNOW?

↓

Enters business question.

↓

DATAFORGE shows:

AI UNDERSTANDING

↓

User confirms.

↓

Interface transforms into:

RESEARCH EXECUTION

↓

Workflow activates.

↓

Sources appear.

↓

Records stream into the dataset.

↓

Validation begins.

↓

Duplicates are removed.

↓

Conflicts appear.

↓

Evidence verification begins.

↓

Confidence scores appear.

↓

Dataset completes.

↓

User explores records.

↓

User opens Evidence Graph.

↓

User enables monitoring.

↓

Later:

DATASET CHANGE DETECTED

↓

User reviews changes.

This journey should be the primary prototype flow in Figma.

---

# 83. DEMO EXPERIENCE

The default demonstration should use:

"Find Indian SaaS companies that recently raised funding, have 50–500 employees, are actively hiring, and show cybersecurity demand signals."

The UI should visibly demonstrate:

1. Prompt interpretation.
2. Workflow generation.
3. Source discovery.
4. Data collection.
5. Normalization.
6. Deduplication.
7. Conflict detection.
8. Evidence verification.
9. Confidence.
10. Dataset generation.
11. Intelligence graph.
12. Living dataset.
13. Change detection.

---

# 84. FINAL DESIGN PRINCIPLE

DATAFORGE should make invisible AI/data operations visible.

Instead of:

"AI is processing..."

Show:

UNDERSTAND
→
PLAN
→
DISCOVER
→
COLLECT
→
VERIFY
→
STRUCTURE
→
INTELLIGENCE

The user should feel that they are operating an intelligent research machine.

The interface is not the product.

The interface is the visualization of the intelligence engine.

---

# 85. FINAL DESIGN STATEMENT

DATAFORGE is:

ASK
→
INVESTIGATE
→
VERIFY
→
UNDERSTAND

Its visual identity is:

DARK
+
PRECISE
+
DATA-DENSE
+
EVIDENCE-FIRST
+
AI-ACTIVE

The defining visual metaphor is:

DATA FLOW.

The defining trust mechanism is:

EVIDENCE.

The defining intelligence mechanism is:

ADAPTIVE RESEARCH.

The defining long-term capability is:

LIVING DATASETS.

Every design decision should reinforce these four ideas.
