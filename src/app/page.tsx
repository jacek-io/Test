import Link from "next/link";
import { ArrowRight, Activity, CalendarClock, TriangleAlert, UserPlus, UserMinus, Flag, FileSignature, MessageSquareText } from "lucide-react";
import { events, getTeam, people, teams, trend } from "@/lib/data";
import { attentionTeams, headcountByIndustry, portfolioKpis, roleMix, upcomingRenewals } from "@/lib/metrics";
import { daysSince, daysUntil, formatDate, formatRelativeDays, stagger, cn, pluralize } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { StatTile } from "@/components/stat-tile";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HealthBadge, HealthDot } from "@/components/health-badge";
import { CapacityChart } from "@/components/charts/capacity-chart";
import { IndustryChart } from "@/components/charts/industry-chart";
import { RoleMixBar, RoleMixLegend } from "@/components/role-mix";
import { renewalTone } from "@/components/team-card";

const EVENT_ICON = {
  joined: UserPlus,
  left: UserMinus,
  renewal: FileSignature,
  escalation: TriangleAlert,
  milestone: Flag,
  note: MessageSquareText,
};

export default function OverviewPage() {
  const k = portfolioKpis();
  const attention = attentionTeams();
  const renewals = upcomingRenewals(120);
  const industries = headcountByIndustry();
  const mix = roleMix();
  const first = trend[0];
  const last = trend[trend.length - 1];
  const yoy = last.deployed + last.bench - (first.deployed + first.bench);
  const recent = [...events].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Friday, 3 October 2026"
        title="Overview"
        description={`${pluralize(teams.length, "team")} · ${k.deployed} people deployed · ${k.bench} on bench · ${people.length} total headcount`}
      />

      {/* KPI row */}
      <section aria-label="Key metrics" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <StatTile label="Active teams" value={k.teams} hint={`avg ${k.avgTeamSize.toFixed(0)} people per team`} style={stagger(1)} />
        <StatTile
          label="People deployed"
          value={k.deployed}
          delta={k.deployedDelta}
          trend={trend.map((t) => t.deployed)}
          style={stagger(2)}
        />
        <StatTile
          label="On bench"
          value={k.bench}
          unit={`${k.benchRate.toFixed(1)}%`}
          delta={k.benchDelta}
          upIsGood={false}
          trend={trend.map((t) => t.bench)}
          style={stagger(3)}
        />
        <StatTile label="Utilization" value={k.utilization.toFixed(0)} unit="%" hint="weighted by team size" style={stagger(4)} />
        <StatTile
          label="Open roles"
          value={k.openRoles}
          hint={`${k.urgentRoles} urgent · median ${k.medianDaysOpen}d open`}
          className="col-span-2 lg:col-span-1"
          style={stagger(5)}
        />
      </section>

      {/* Capacity + attention */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="enter lg:col-span-2" style={stagger(3)}>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Headcount, last 12 months</CardTitle>
              <CardDescription>Deployed on client teams vs. on bench, end of month</CardDescription>
            </div>
            <Badge variant="brand" className="hidden sm:inline-flex">
              {yoy > 0 ? "+" : ""}{yoy} headcount YoY
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col pt-4">
            <CapacityChart data={trend} />
          </CardContent>
        </Card>

        <Card className="enter" style={stagger(4)}>
          <CardHeader>
            <CardTitle>Needs attention</CardTitle>
            <CardDescription>{k.atRisk} at risk · {k.watch} to watch</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="divide-y">
              {attention.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/teams/${t.id}`}
                    className="pressable -mx-2 flex items-start gap-3 rounded-lg px-2 py-3 hover:bg-muted"
                  >
                    <HealthDot health={t.health} className="mt-1.5" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">
                          {t.name} <span className="font-normal text-muted-foreground">· {t.client}</span>
                        </p>
                        <HealthBadge health={t.health} className="hidden xl:inline-flex" />
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{t.signals[0]}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/teams?health=at-risk" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              All teams <ArrowRight className="size-3" />
            </Link>
          </CardFooter>
        </Card>
      </section>

      {/* Industry · role mix · renewals */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="enter" style={stagger(5)}>
          <CardHeader>
            <CardTitle>Headcount by industry</CardTitle>
            <CardDescription>People deployed across {industries.length} verticals</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <IndustryChart data={industries} />
          </CardContent>
        </Card>

        <Card className="enter" style={stagger(6)}>
          <CardHeader>
            <CardTitle>Role mix</CardTitle>
            <CardDescription>Composition of all deployed people</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <RoleMixBar mix={mix} height="h-3" />
            <RoleMixLegend mix={mix} />
          </CardContent>
        </Card>

        <Card className="enter md:col-span-2 xl:col-span-1" style={stagger(7)}>
          <CardHeader>
            <CardTitle>Upcoming renewals</CardTitle>
            <CardDescription>{k.renewals60} within 60 days</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="divide-y">
              {renewals.map((t) => {
                const days = daysUntil(t.renewalDate);
                return (
                  <li key={t.id}>
                    <Link href={`/teams/${t.id}`} className="pressable -mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-muted">
                      <span className={cn("flex size-9 shrink-0 flex-col items-center justify-center rounded-lg bg-muted", renewalTone(days))}>
                        <CalendarClock className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{t.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{t.client} · {formatDate(t.renewalDate)}</p>
                      </div>
                      <span className={cn("tabular shrink-0 text-xs font-medium", renewalTone(days))}>{formatRelativeDays(days)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Activity */}
      <Card className="enter" style={stagger(8)}>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Across all teams, newest first</CardDescription>
          </div>
          <Activity className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-4">
          <ol className="grid gap-x-8 md:grid-cols-2">
            {recent.map((e) => {
              const team = getTeam(e.teamId)!;
              const Icon = EVENT_ICON[e.type];
              const tone = e.type === "escalation" ? "bg-danger-bg text-danger" : e.type === "milestone" ? "bg-success-bg text-success" : "bg-muted text-muted-foreground";
              return (
                <li key={e.id} className="flex gap-3 border-b py-3 last:border-0 md:[&:nth-last-child(2)]:border-0">
                  <span className={cn("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full", tone)}>
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{e.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <Link href={`/teams/${team.id}`} className="font-medium text-foreground hover:underline">{team.name}</Link>
                      {" · "}{team.client}{" · "}{formatRelativeDays(-daysSince(e.date))}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
