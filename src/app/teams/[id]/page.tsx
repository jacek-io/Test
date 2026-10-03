import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, MapPin, Users, BriefcaseBusiness, Gauge, Clock, TriangleAlert, Flag, UserPlus, UserMinus, FileSignature, MessageSquareText, ArrowRight } from "lucide-react";
import {
  MODEL_LABEL,
  SENIORITY_LABEL,
  STAGE_LABEL,
  getPerson,
  getTeam,
  teamEvents,
  teamMembers,
  teamRoles,
  teams,
} from "@/lib/data";
import { avgTenureDays, roleMix } from "@/lib/metrics";
import { cn, daysSince, daysUntil, formatDateLong, formatDuration, formatRelativeDays, formatTenure, stagger, formatDate } from "@/lib/utils";
import { StatTile } from "@/components/stat-tile";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HealthBadge } from "@/components/health-badge";
import { IndustryBadge } from "@/components/industry-badge";
import { RoleMixBar, RoleMixLegend, FAMILY_COLOR } from "@/components/role-mix";
import { renewalTone } from "@/components/team-card";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return teams.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const team = getTeam(id);
  return { title: team ? `${team.name} · ${team.client}` : "Team" };
}

const EVENT_ICON = { joined: UserPlus, left: UserMinus, renewal: FileSignature, escalation: TriangleAlert, milestone: Flag, note: MessageSquareText };
const SENIORITY_RANK = { lead: 0, senior: 1, mid: 2, junior: 3 } as const;

export default async function TeamPage({ params }: Params) {
  const { id } = await params;
  const team = getTeam(id);
  if (!team) notFound();

  const members = [...teamMembers(team.id)].sort(
    (a, b) => (a.id === team.leadId ? -1 : b.id === team.leadId ? 1 : 0) || SENIORITY_RANK[a.seniority] - SENIORITY_RANK[b.seniority] || a.name.localeCompare(b.name),
  );
  const lead = getPerson(team.leadId);
  const roles = teamRoles(team.id);
  const history = [...teamEvents(team.id)].sort((a, b) => b.date.localeCompare(a.date));
  const mix = roleMix(team.id);
  const days = daysUntil(team.renewalDate);
  const openSeats = Math.max(0, team.targetSize - members.length);
  const tenure = avgTenureDays(team.id);
  const partial = members.filter((m) => m.allocation < 100).length;

  return (
    <div className="space-y-6">
      <div className="enter space-y-4">
        <Link href="/teams" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Teams
        </Link>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{team.name}</h1>
              <HealthBadge health={team.health} />
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{team.client}</span> · {team.summary}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <IndustryBadge industry={team.industry} />
              <Badge variant="outline"><BriefcaseBusiness className="text-muted-foreground" />{MODEL_LABEL[team.model]}</Badge>
              <Badge variant="outline"><MapPin className="text-muted-foreground" />{team.location}</Badge>
              <Badge variant="outline"><Clock className="text-muted-foreground" />Since {formatDateLong(team.startDate)}</Badge>
            </div>
          </div>
          {lead && (
            <Card className="flex-row items-center gap-3 p-3 pr-5 lg:shrink-0">
              <Avatar name={lead.name} size="lg" tone="primary" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Team lead</p>
                <p className="truncate text-sm font-semibold">{lead.name}</p>
                <p className="truncate text-xs text-muted-foreground">{lead.title} · {lead.location}</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4" aria-label="Team metrics">
        <StatTile label="Team size" value={members.length} unit={`/ ${team.targetSize}`} hint={openSeats ? `${openSeats} open seat${openSeats > 1 ? "s" : ""}` : "fully staffed"} style={stagger(1)} />
        <StatTile label="Utilization" value={team.utilization} unit="%" hint={partial ? `${partial} partially allocated` : "everyone fully allocated"} style={stagger(2)} />
        <StatTile label="Open roles" value={roles.length} hint={roles.some((r) => r.urgent) ? `${roles.filter((r) => r.urgent).length} urgent` : roles.length ? "none urgent" : "no hiring in progress"} style={stagger(3)} />
        <StatTile label="Renewal" value={formatRelativeDays(days).replace("in ", "")} hint={formatDateLong(team.renewalDate)} style={stagger(4)} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="enter overflow-hidden lg:col-span-2" style={stagger(4)}>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Roster</CardTitle>
              <CardDescription>{members.length} people · avg tenure {formatDuration(tenure)}</CardDescription>
            </div>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-0 pb-0 pt-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Person</TableHead>
                  <TableHead className="hidden sm:table-cell">Level</TableHead>
                  <TableHead className="w-20 sm:w-36">Allocation</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Tenure</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="relative">
                          <Avatar name={m.name} size="md" tone={m.id === team.leadId ? "primary" : "muted"} />
                          <span
                            aria-hidden
                            className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-card"
                            style={{ background: FAMILY_COLOR[m.family] }}
                          />
                        </span>
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 text-sm font-medium">
                            <span className="truncate">{m.name}</span>
                            {m.availability === "vacation" && <Badge variant="secondary">On leave</Badge>}
                            {m.availability === "notice" && <Badge variant="danger">Notice</Badge>}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{m.title}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{SENIORITY_LABEL[m.seniority]}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={m.allocation} tone={m.allocation < 100 ? "warning" : "brand"} className="hidden w-16 sm:block" label={`Allocation ${m.allocation}%`} />
                        <span className="tabular text-xs font-medium">{m.allocation}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{m.location}</TableCell>
                    <TableCell className="hidden sm:table-cell tabular text-right text-xs text-muted-foreground">{formatTenure(m.startDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="enter" style={stagger(5)}>
            <CardHeader>
              <CardTitle>Role mix</CardTitle>
              <CardDescription>Seats filled by discipline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <RoleMixBar mix={mix} height="h-3" />
              <RoleMixLegend mix={mix} />
            </CardContent>
          </Card>

          <Card className="enter" style={stagger(6)}>
            <CardHeader>
              <CardTitle>Signals</CardTitle>
              <CardDescription>What the ops team is tracking</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {team.signals.length ? (
                <ul className="space-y-2.5">
                  {team.signals.map((s) => (
                    <li key={s} className="flex items-start gap-2.5 text-[13px]">
                      <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", team.health === "on-track" ? "bg-success-dot" : team.health === "watch" ? "bg-warning-dot" : "bg-danger-dot")} />
                      {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13px] text-muted-foreground">Nothing flagged. Steady state.</p>
              )}
            </CardContent>
          </Card>

          <Card className="enter" style={stagger(7)}>
            <CardHeader>
              <CardTitle>Open roles</CardTitle>
              <CardDescription>{roles.length ? `${roles.length} in pipeline` : "No open positions"}</CardDescription>
            </CardHeader>
            {roles.length > 0 && (
              <CardContent className="pt-4">
                <ul className="divide-y">
                  {roles.map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-[13px] font-medium">
                          <span className="truncate">{r.title}</span>
                          {r.urgent && <Badge variant="danger">Urgent</Badge>}
                        </p>
                        <p className="text-xs text-muted-foreground">{STAGE_LABEL[r.stage]} · {r.candidates} candidate{r.candidates === 1 ? "" : "s"}</p>
                      </div>
                      <span className="tabular shrink-0 text-xs text-muted-foreground">{daysSince(r.openedAt)}d open</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
            <CardFooter>
              <Link href="/roles" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                Hiring board <ArrowRight className="size-3" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      <Card className="enter" style={stagger(8)}>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Renewal {formatDate(team.renewalDate)} · <span className={renewalTone(days)}>{formatRelativeDays(days)}</span></CardDescription>
          </div>
          <CalendarClock className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-4">
          {history.length ? (
            <ol className="relative space-y-5 border-l pl-6">
              {history.map((e) => {
                const Icon = EVENT_ICON[e.type];
                const tone = e.type === "escalation" ? "bg-danger-bg text-danger" : e.type === "milestone" ? "bg-success-bg text-success" : "bg-muted text-muted-foreground";
                return (
                  <li key={e.id} className="relative">
                    <span className={cn("absolute -left-[37px] flex size-6 items-center justify-center rounded-full ring-4 ring-card", tone)}>
                      <Icon className="size-3" />
                    </span>
                    <p className="text-sm leading-snug">{e.text}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatDateLong(e.date)} · {formatRelativeDays(-daysSince(e.date))}</p>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="flex items-center gap-2 text-[13px] text-muted-foreground"><Gauge className="size-4" /> No events logged yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
