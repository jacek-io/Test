/**
 * TEAM ID — demo dataset.
 * Deterministic (seeded) so server and client render identical trees.
 */

export type Industry = "fintech" | "banking" | "healthcare" | "automotive" | "financial" | "compliance";
export type RoleFamily = "engineering" | "qa" | "product" | "design" | "other";
export type Seniority = "junior" | "mid" | "senior" | "lead";
export type Health = "on-track" | "watch" | "at-risk";
export type EngagementModel = "dedicated" | "extended" | "managed";
export type Availability = "active" | "vacation" | "notice";
export type RoleStage = "sourcing" | "screening" | "interviewing" | "offer";

export interface Person {
  id: string;
  name: string;
  title: string;
  family: RoleFamily;
  seniority: Seniority;
  teamId: string | null; // null = bench
  allocation: number; // 0–100
  startDate: string; // joined company
  location: string;
  availability: Availability;
}

export interface OpenRole {
  id: string;
  teamId: string;
  title: string;
  family: RoleFamily;
  seniority: Seniority;
  stage: RoleStage;
  openedAt: string;
  candidates: number;
  urgent: boolean;
}

export interface TeamEvent {
  id: string;
  teamId: string;
  date: string;
  type: "joined" | "left" | "renewal" | "escalation" | "milestone" | "note";
  text: string;
}

export interface Team {
  id: string;
  name: string;
  client: string;
  industry: Industry;
  model: EngagementModel;
  health: Health;
  leadId: string;
  startDate: string;
  renewalDate: string;
  targetSize: number;
  utilization: number; // billable % of capacity
  location: string;
  summary: string;
  signals: string[];
}

export interface TrendPoint {
  month: string; // "Nov", "Dec" …
  deployed: number;
  bench: number;
}

/* ---------------------------------------------------------------- */
/* Lookups                                                           */
/* ---------------------------------------------------------------- */

export const INDUSTRY_LABEL: Record<Industry, string> = {
  fintech: "Fintech",
  banking: "Banking",
  healthcare: "Healthcare",
  automotive: "Automotive",
  financial: "Financial services",
  compliance: "Compliance",
};

export const FAMILY_LABEL: Record<RoleFamily, string> = {
  engineering: "Engineering",
  qa: "QA",
  product: "Product & delivery",
  design: "Design",
  other: "Data & ops",
};

export const FAMILY_ORDER: RoleFamily[] = ["engineering", "qa", "product", "design", "other"];

export const SENIORITY_LABEL: Record<Seniority, string> = {
  junior: "Junior",
  mid: "Mid",
  senior: "Senior",
  lead: "Lead",
};

export const HEALTH_LABEL: Record<Health, string> = {
  "on-track": "On track",
  watch: "Watch",
  "at-risk": "At risk",
};

export const MODEL_LABEL: Record<EngagementModel, string> = {
  dedicated: "Dedicated team",
  extended: "Team extension",
  managed: "Managed delivery",
};

export const STAGE_LABEL: Record<RoleStage, string> = {
  sourcing: "Sourcing",
  screening: "Screening",
  interviewing: "Interviewing",
  offer: "Offer",
};

export const STAGE_ORDER: RoleStage[] = ["sourcing", "screening", "interviewing", "offer"];

/* ---------------------------------------------------------------- */
/* Seeded generator                                                  */
/* ---------------------------------------------------------------- */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20261003);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const between = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

const FIRST = [
  "Anna", "Marek", "Zofia", "Piotr", "Kasia", "Tomasz", "Ola", "Michał", "Julia", "Jakub", "Maja", "Adam",
  "Lena", "Filip", "Hanna", "Bartek", "Nadia", "Kamil", "Iga", "Szymon", "Emilia", "Łukasz", "Alicja", "Dawid",
  "Marta", "Paweł", "Natalia", "Krzysztof", "Oliwia", "Wojtek", "Sara", "Igor", "Ewa", "Mateusz", "Klara", "Rafał",
  "Pola", "Antoni", "Weronika", "Dominik", "Laura", "Hubert", "Amelia", "Oskar", "Nina", "Aleks", "Maria", "Jan",
];
const LAST = [
  "Nowak", "Kowalska", "Wiśniewski", "Wójcik", "Kowalczyk", "Kamińska", "Lewandowski", "Zielińska", "Szymański",
  "Woźniak", "Dąbrowska", "Kozłowski", "Jankowska", "Mazur", "Wojciechowski", "Kwiatkowska", "Krawczyk", "Kaczmarek",
  "Piotrowska", "Grabowski", "Zając", "Pawłowska", "Michalski", "Król", "Wieczorek", "Jabłońska", "Nowicki",
  "Majewska", "Olszewski", "Stępień", "Malinowska", "Jaworski", "Adamczyk", "Dudek", "Sikora", "Baran",
];
const LOCATIONS = ["Warsaw", "Gdańsk", "Kraków", "Wrocław", "Poznań", "Remote · PL", "Remote · PT", "Remote · ES"];

const TITLES: Record<RoleFamily, Record<Seniority, string[]>> = {
  engineering: {
    junior: ["Frontend Engineer", "Backend Engineer"],
    mid: ["Frontend Engineer", "Backend Engineer", "Full-stack Engineer", "Mobile Engineer"],
    senior: ["Senior Backend Engineer", "Senior Frontend Engineer", "Senior Full-stack Engineer", "DevOps Engineer"],
    lead: ["Tech Lead", "Staff Engineer", "Solutions Architect"],
  },
  qa: {
    junior: ["QA Engineer"],
    mid: ["QA Engineer", "QA Automation Engineer"],
    senior: ["Senior QA Automation Engineer", "Senior QA Engineer"],
    lead: ["QA Lead"],
  },
  product: {
    junior: ["Junior Business Analyst"],
    mid: ["Business Analyst", "Scrum Master"],
    senior: ["Project Manager", "Product Owner", "Delivery Manager"],
    lead: ["Senior Project Manager", "Engagement Lead"],
  },
  design: {
    junior: ["UI Designer"],
    mid: ["Product Designer"],
    senior: ["Senior Product Designer", "UX Researcher"],
    lead: ["Design Lead"],
  },
  other: {
    junior: ["Data Analyst"],
    mid: ["Data Engineer", "Security Analyst"],
    senior: ["Senior Data Engineer", "Cloud Engineer", "ML Engineer"],
    lead: ["Data Lead"],
  },
};

function isoDaysAgo(days: number) {
  const d = new Date("2026-10-03T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}
function isoDaysAhead(days: number) {
  return isoDaysAgo(-days);
}

/* ---------------------------------------------------------------- */
/* Teams (authored)                                                  */
/* ---------------------------------------------------------------- */

interface TeamSeed {
  id: string;
  name: string;
  client: string;
  industry: Industry;
  model: EngagementModel;
  health: Health;
  startDaysAgo: number;
  renewalInDays: number;
  mix: Partial<Record<RoleFamily, number>>; // seats filled per family
  targetSize: number;
  utilization: number;
  location: string;
  summary: string;
  signals: string[];
}

const TEAM_SEEDS: TeamSeed[] = [
  {
    id: "atlas", name: "Atlas", client: "Northwind Bank", industry: "banking", model: "dedicated", health: "on-track",
    startDaysAgo: 812, renewalInDays: 142, mix: { engineering: 11, qa: 3, product: 2, design: 1, other: 1 }, targetSize: 18, utilization: 94,
    location: "Warsaw · Hybrid",
    summary: "Core banking modernisation: migrating the retail ledger to an event-driven platform.",
    signals: ["Q3 milestone delivered on time", "Client NPS 9 / 10"],
  },
  {
    id: "helios", name: "Helios", client: "Lumen Pay", industry: "fintech", model: "dedicated", health: "watch",
    startDaysAgo: 455, renewalInDays: 38, mix: { engineering: 7, qa: 2, product: 1, design: 1 }, targetSize: 13, utilization: 86,
    location: "Gdańsk · Remote",
    summary: "Instant-payments rails and merchant onboarding for a Nordic PSP.",
    signals: ["Renewal in 38 days — commercial review pending", "2 open senior backend seats for 6+ weeks"],
  },
  {
    id: "nimbus", name: "Nimbus", client: "CareBridge Health", industry: "healthcare", model: "managed", health: "on-track",
    startDaysAgo: 290, renewalInDays: 201, mix: { engineering: 5, qa: 1, product: 1, design: 1 }, targetSize: 8, utilization: 91,
    location: "Kraków · Remote",
    summary: "Patient-intake portal and HL7 FHIR integrations for a hospital network.",
    signals: ["HIPAA audit passed in September"],
  },
  {
    id: "orion", name: "Orion", client: "Veltro Motors", industry: "automotive", model: "extended", health: "at-risk",
    startDaysAgo: 610, renewalInDays: 22, mix: { engineering: 9, qa: 2, product: 1 }, targetSize: 15, utilization: 78,
    location: "Wrocław · On-site",
    summary: "Connected-vehicle telemetry platform and OTA update pipeline.",
    signals: ["Renewal in 22 days — scope reduction requested", "Tech lead on notice period", "Utilization slipped below 80%"],
  },
  {
    id: "vega", name: "Vega", client: "Granite Capital", industry: "financial", model: "dedicated", health: "on-track",
    startDaysAgo: 1120, renewalInDays: 310, mix: { engineering: 12, qa: 3, product: 2, design: 1, other: 2 }, targetSize: 20, utilization: 96,
    location: "Warsaw · Hybrid",
    summary: "Portfolio analytics and risk reporting suite for an asset manager.",
    signals: ["Largest account — 20 seats fully staffed", "Expansion to a second squad under discussion"],
  },
  {
    id: "lyra", name: "Lyra", client: "Veritas RegTech", industry: "compliance", model: "managed", health: "on-track",
    startDaysAgo: 180, renewalInDays: 185, mix: { engineering: 3, qa: 1, product: 1 }, targetSize: 5, utilization: 88,
    location: "Remote · PL",
    summary: "AML transaction-monitoring rules engine and case management.",
    signals: ["Discovery phase closed; build started in August"],
  },
  {
    id: "pulsar", name: "Pulsar", client: "Northwind Bank", industry: "banking", model: "extended", health: "watch",
    startDaysAgo: 365, renewalInDays: 142, mix: { engineering: 4, qa: 1, product: 1 }, targetSize: 7, utilization: 82,
    location: "Warsaw · Hybrid",
    summary: "Mobile banking app squad embedded with the client's own product team.",
    signals: ["Client PM changed in September — cadence re-baselined", "1 QA seat open"],
  },
  {
    id: "cosmo", name: "Cosmo", client: "Meridian Insurance", industry: "financial", model: "dedicated", health: "on-track",
    startDaysAgo: 720, renewalInDays: 95, mix: { engineering: 6, qa: 2, product: 1, design: 1, other: 1 }, targetSize: 11, utilization: 90,
    location: "Poznań · Remote",
    summary: "Claims automation with document AI and a broker self-service portal.",
    signals: ["Renewal in 95 days — early signals positive"],
  },
  {
    id: "kepler", name: "Kepler", client: "Axon Mobility", industry: "automotive", model: "dedicated", health: "on-track",
    startDaysAgo: 150, renewalInDays: 215, mix: { engineering: 5, qa: 1, product: 1, design: 1 }, targetSize: 9, utilization: 89,
    location: "Wrocław · Hybrid",
    summary: "Fleet-management SaaS: route optimisation and EV charging scheduling.",
    signals: ["Ramp-up completed; 1 designer seat to fill"],
  },
  {
    id: "titan", name: "Titan", client: "Harbor Credit Union", industry: "banking", model: "managed", health: "on-track",
    startDaysAgo: 520, renewalInDays: 260, mix: { engineering: 4, qa: 1, product: 1 }, targetSize: 6, utilization: 92,
    location: "Remote · PL",
    summary: "Loan origination workflow and credit decisioning integrations.",
    signals: [],
  },
  {
    id: "juno", name: "Juno", client: "Clover Health Tech", industry: "healthcare", model: "extended", health: "watch",
    startDaysAgo: 95, renewalInDays: 55, mix: { engineering: 3, qa: 1 }, targetSize: 6, utilization: 75,
    location: "Remote · ES",
    summary: "Telehealth scheduling and e-prescription modules.",
    signals: ["Pilot engagement — conversion decision due in 55 days", "Below target size: 4 / 6 seats"],
  },
  {
    id: "sol", name: "Sol", client: "Lumen Pay", industry: "fintech", model: "extended", health: "on-track",
    startDaysAgo: 240, renewalInDays: 38, mix: { engineering: 3, product: 1 }, targetSize: 4, utilization: 93,
    location: "Gdańsk · Remote",
    summary: "Fraud-scoring service and PSD2 open-banking connectors.",
    signals: ["Shares renewal date with Helios"],
  },
  {
    id: "draco", name: "Draco", client: "Sentinel Compliance", industry: "compliance", model: "dedicated", health: "at-risk",
    startDaysAgo: 400, renewalInDays: 70, mix: { engineering: 6, qa: 2, product: 1, other: 1 }, targetSize: 12, utilization: 72,
    location: "Kraków · Hybrid",
    summary: "KYC orchestration platform with sanctions screening.",
    signals: ["Escalation: delivery slipped two sprints", "Utilization 72% — 2 engineers partially allocated", "Open PM seat since August"],
  },
  {
    id: "rhea", name: "Rhea", client: "Veltro Motors", industry: "automotive", model: "managed", health: "on-track",
    startDaysAgo: 60, renewalInDays: 120, mix: { engineering: 2, design: 1 }, targetSize: 3, utilization: 85,
    location: "Wrocław · On-site",
    summary: "Design-led discovery for the in-car companion app.",
    signals: ["Discovery squad — converts to a build team in Q1"],
  },
];

/* ---------------------------------------------------------------- */
/* Build people, roles, events                                       */
/* ---------------------------------------------------------------- */

const people: Person[] = [];
const teams: Team[] = [];
const openRoles: OpenRole[] = [];
const events: TeamEvent[] = [];
const usedNames = new Set<string>();

let personCounter = 1;
function makePerson(family: RoleFamily, seniority: Seniority, teamId: string | null, startDaysAgoMax: number, allocation = 100): Person {
  let name = "";
  do {
    name = `${pick(FIRST)} ${pick(LAST)}`;
  } while (usedNames.has(name));
  usedNames.add(name);
  const id = `p${String(personCounter++).padStart(3, "0")}`;
  const availabilityRoll = rand();
  const person: Person = {
    id,
    name,
    title: pick(TITLES[family][seniority]),
    family,
    seniority,
    teamId,
    allocation,
    startDate: isoDaysAgo(between(20, Math.max(40, startDaysAgoMax + 200))),
    location: pick(LOCATIONS),
    availability: availabilityRoll > 0.95 ? "notice" : availabilityRoll > 0.86 ? "vacation" : "active",
  };
  people.push(person);
  return person;
}

function seniorityFor(index: number, total: number): Seniority {
  const ratio = index / Math.max(1, total);
  if (index === 0) return "lead";
  if (ratio < 0.4) return "senior";
  if (ratio < 0.8) return "mid";
  return "junior";
}

for (const seed of TEAM_SEEDS) {
  let leadId = "";
  for (const family of FAMILY_ORDER) {
    const count = seed.mix[family] ?? 0;
    for (let i = 0; i < count; i++) {
      const seniority = seniorityFor(i, count);
      const partial = seed.utilization < 80 && rand() > 0.7 ? 50 : 100;
      const p = makePerson(family, seniority, seed.id, seed.startDaysAgo, partial);
      if (!leadId && (family === "product" || family === "engineering") && seniority === "lead") leadId = p.id;
    }
  }
  if (!leadId) leadId = people.find((p) => p.teamId === seed.id)!.id;

  teams.push({
    id: seed.id,
    name: seed.name,
    client: seed.client,
    industry: seed.industry,
    model: seed.model,
    health: seed.health,
    leadId,
    startDate: isoDaysAgo(seed.startDaysAgo),
    renewalDate: isoDaysAhead(seed.renewalInDays),
    targetSize: seed.targetSize,
    utilization: seed.utilization,
    location: seed.location,
    summary: seed.summary,
    signals: seed.signals,
  });
}

// Bench
const BENCH: Array<[RoleFamily, Seniority]> = [
  ["engineering", "mid"], ["engineering", "senior"], ["engineering", "junior"], ["qa", "mid"],
  ["design", "mid"], ["product", "senior"], ["engineering", "mid"], ["other", "senior"], ["engineering", "junior"],
];
for (const [family, seniority] of BENCH) makePerson(family, seniority, null, 500, 0);

// Open roles — one per unfilled seat, authored stages
const ROLE_SEEDS: Array<Omit<OpenRole, "id" | "openedAt"> & { openedDaysAgo: number }> = [
  { teamId: "helios", title: "Senior Backend Engineer", family: "engineering", seniority: "senior", stage: "interviewing", openedDaysAgo: 44, candidates: 3, urgent: true },
  { teamId: "helios", title: "Senior Backend Engineer", family: "engineering", seniority: "senior", stage: "screening", openedDaysAgo: 44, candidates: 5, urgent: true },
  { teamId: "orion", title: "Tech Lead", family: "engineering", seniority: "lead", stage: "sourcing", openedDaysAgo: 9, candidates: 2, urgent: true },
  { teamId: "orion", title: "QA Automation Engineer", family: "qa", seniority: "mid", stage: "offer", openedDaysAgo: 31, candidates: 1, urgent: false },
  { teamId: "orion", title: "Product Designer", family: "design", seniority: "mid", stage: "sourcing", openedDaysAgo: 12, candidates: 4, urgent: false },
  { teamId: "pulsar", title: "QA Engineer", family: "qa", seniority: "mid", stage: "interviewing", openedDaysAgo: 26, candidates: 2, urgent: false },
  { teamId: "kepler", title: "Product Designer", family: "design", seniority: "senior", stage: "screening", openedDaysAgo: 18, candidates: 6, urgent: false },
  { teamId: "juno", title: "Full-stack Engineer", family: "engineering", seniority: "mid", stage: "offer", openedDaysAgo: 35, candidates: 1, urgent: false },
  { teamId: "juno", title: "Business Analyst", family: "product", seniority: "mid", stage: "sourcing", openedDaysAgo: 7, candidates: 3, urgent: false },
  { teamId: "draco", title: "Project Manager", family: "product", seniority: "senior", stage: "interviewing", openedDaysAgo: 58, candidates: 2, urgent: true },
  { teamId: "draco", title: "Senior Backend Engineer", family: "engineering", seniority: "senior", stage: "screening", openedDaysAgo: 21, candidates: 4, urgent: false },
];
ROLE_SEEDS.forEach((r, i) => {
  const { openedDaysAgo, ...rest } = r;
  openRoles.push({ ...rest, id: `r${String(i + 1).padStart(2, "0")}`, openedAt: isoDaysAgo(openedDaysAgo) });
});

const EVENT_SEEDS: Array<Omit<TeamEvent, "id" | "date"> & { daysAgo: number }> = [
  { teamId: "orion", type: "escalation", text: "Client requested a 20% scope reduction ahead of renewal.", daysAgo: 1 },
  { teamId: "atlas", type: "milestone", text: "Ledger migration wave 3 completed — 4.2M accounts moved.", daysAgo: 2 },
  { teamId: "draco", type: "escalation", text: "Sprint 41 and 42 goals missed; recovery plan agreed with client.", daysAgo: 3 },
  { teamId: "vega", type: "joined", text: "Two senior data engineers onboarded for the risk-reporting squad.", daysAgo: 4 },
  { teamId: "helios", type: "note", text: "Commercial review for renewal scheduled with Lumen Pay CFO.", daysAgo: 5 },
  { teamId: "nimbus", type: "milestone", text: "HIPAA compliance audit passed with no findings.", daysAgo: 8 },
  { teamId: "orion", type: "left", text: "Tech lead handed in notice — handover plan in progress.", daysAgo: 9 },
  { teamId: "pulsar", type: "note", text: "New client product manager; sprint cadence re-baselined.", daysAgo: 12 },
  { teamId: "juno", type: "joined", text: "Pilot squad extended with a second frontend engineer.", daysAgo: 15 },
  { teamId: "cosmo", type: "renewal", text: "Renewal conversation opened — client signalling expansion.", daysAgo: 18 },
  { teamId: "rhea", type: "joined", text: "Discovery squad kicked off on-site in Wrocław.", daysAgo: 60 },
  { teamId: "lyra", type: "milestone", text: "Discovery closed; build phase started.", daysAgo: 48 },
];
EVENT_SEEDS.forEach((e, i) => {
  const { daysAgo, ...rest } = e;
  events.push({ ...rest, id: `e${String(i + 1).padStart(2, "0")}`, date: isoDaysAgo(daysAgo) });
});

// 12-month trend (deployed vs bench), ending at the current month
const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const deployedNow = people.filter((p) => p.teamId).length;
const benchNow = people.filter((p) => !p.teamId).length;
const DEPLOYED_OFFSETS = [-31, -28, -24, -21, -18, -15, -13, -9, -6, -4, -3, 0];
const BENCH_OFFSETS = [5, 3, 2, 4, 1, 0, 3, -1, -2, 1, -1, 0];
const DEPLOYED_SERIES = DEPLOYED_OFFSETS.map((d) => deployedNow + d);
const BENCH_SERIES = BENCH_OFFSETS.map((d) => benchNow + d);
export const trend: TrendPoint[] = MONTHS.map((month, i) => ({ month, deployed: DEPLOYED_SERIES[i], bench: BENCH_SERIES[i] }));

export { people, teams, openRoles, events };

/* ---------------------------------------------------------------- */
/* Accessors                                                         */
/* ---------------------------------------------------------------- */

export const getTeam = (id: string) => teams.find((t) => t.id === id);
export const getPerson = (id: string) => people.find((p) => p.id === id);
export const teamMembers = (teamId: string) => people.filter((p) => p.teamId === teamId);
export const teamRoles = (teamId: string) => openRoles.filter((r) => r.teamId === teamId);
export const teamEvents = (teamId: string) => events.filter((e) => e.teamId === teamId);
