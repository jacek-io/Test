import {
  FAMILY_ORDER,
  INDUSTRY_LABEL,
  openRoles,
  people,
  teamMembers,
  teams,
  trend,
  type Industry,
  type RoleFamily,
  type Team,
} from "@/lib/data";
import { daysUntil, daysSince } from "@/lib/utils";

export interface FamilyCount {
  family: RoleFamily;
  count: number;
}

export function roleMix(teamId?: string): FamilyCount[] {
  const pool = teamId ? teamMembers(teamId) : people.filter((p) => p.teamId);
  return FAMILY_ORDER.map((family) => ({ family, count: pool.filter((p) => p.family === family).length }));
}

export function teamSize(team: Team) {
  return teamMembers(team.id).length;
}

export function headcountByIndustry(): Array<{ industry: Industry; label: string; people: number; teams: number }> {
  const map = new Map<Industry, { people: number; teams: number }>();
  for (const t of teams) {
    const cur = map.get(t.industry) ?? { people: 0, teams: 0 };
    cur.people += teamSize(t);
    cur.teams += 1;
    map.set(t.industry, cur);
  }
  return [...map.entries()]
    .map(([industry, v]) => ({ industry, label: INDUSTRY_LABEL[industry], ...v }))
    .sort((a, b) => b.people - a.people);
}

export function portfolioKpis() {
  const deployed = people.filter((p) => p.teamId);
  const bench = people.filter((p) => !p.teamId);
  const totalCapacity = teams.reduce((acc, t) => acc + teamSize(t), 0);
  const weightedUtil = teams.reduce((acc, t) => acc + t.utilization * teamSize(t), 0) / Math.max(1, totalCapacity);
  const prev = trend[trend.length - 2];
  const urgentRoles = openRoles.filter((r) => r.urgent).length;
  const atRisk = teams.filter((t) => t.health === "at-risk").length;
  const watch = teams.filter((t) => t.health === "watch").length;
  const renewals60 = teams.filter((t) => daysUntil(t.renewalDate) <= 60).length;

  return {
    teams: teams.length,
    deployed: deployed.length,
    deployedDelta: deployed.length - prev.deployed,
    bench: bench.length,
    benchDelta: bench.length - prev.bench,
    benchRate: (bench.length / people.length) * 100,
    utilization: weightedUtil,
    openRoles: openRoles.length,
    urgentRoles,
    atRisk,
    watch,
    renewals60,
    avgTeamSize: totalCapacity / teams.length,
    medianDaysOpen: median(openRoles.map((r) => daysSince(r.openedAt))),
  };
}

export function attentionTeams(): Team[] {
  const rank = { "at-risk": 0, watch: 1, "on-track": 2 } as const;
  return [...teams]
    .filter((t) => t.health !== "on-track")
    .sort((a, b) => rank[a.health] - rank[b.health] || daysUntil(a.renewalDate) - daysUntil(b.renewalDate));
}

export function upcomingRenewals(withinDays = 120): Team[] {
  return [...teams]
    .filter((t) => daysUntil(t.renewalDate) <= withinDays)
    .sort((a, b) => daysUntil(a.renewalDate) - daysUntil(b.renewalDate));
}

export function median(values: number[]) {
  if (!values.length) return 0;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function avgTenureDays(teamId: string) {
  const members = teamMembers(teamId);
  if (!members.length) return 0;
  return members.reduce((acc, p) => acc + daysSince(p.startDate), 0) / members.length;
}
