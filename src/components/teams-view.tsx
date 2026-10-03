"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, Rows3, Search, Users, X } from "lucide-react";
import { HEALTH_LABEL, INDUSTRY_LABEL, getPerson, teams, type Health, type Industry } from "@/lib/data";
import { roleMix, teamSize } from "@/lib/metrics";
import { daysUntil, formatRelativeDays, cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Segmented } from "@/components/ui/segmented";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HealthBadge } from "@/components/health-badge";
import { IndustryBadge } from "@/components/industry-badge";
import { RoleMixBar } from "@/components/role-mix";
import { TeamCard, renewalTone } from "@/components/team-card";

type View = "grid" | "table";
const HEALTH_RANK: Record<Health, number> = { "at-risk": 0, watch: 1, "on-track": 2 };

export function TeamsView() {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [industry, setIndustry] = useState<Industry | "all">((params.get("industry") as Industry) || "all");
  const [health, setHealth] = useState<Health | "all">((params.get("health") as Health) || "all");
  const [view, setView] = useState<View>("grid");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return teams
      .filter((t) => industry === "all" || t.industry === industry)
      .filter((t) => health === "all" || t.health === health)
      .filter((t) => !needle || `${t.name} ${t.client} ${t.summary}`.toLowerCase().includes(needle))
      .sort((a, b) => HEALTH_RANK[a.health] - HEALTH_RANK[b.health] || teamSize(b) - teamSize(a));
  }, [q, industry, health]);

  const hasFilters = q || industry !== "all" || health !== "all";
  function reset() {
    setQ("");
    setIndustry("all");
    setHealth("all");
    router.replace("/teams");
  }

  return (
    <div className="space-y-4">
      {/* One filter row, scoping everything below it */}
      <div className="enter flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search team or client" className="pl-9" aria-label="Search teams" />
        </div>
        <div className="flex flex-1 items-center gap-2">
          <Select value={industry} onChange={(e) => setIndustry(e.target.value as Industry | "all")} aria-label="Industry" className="flex-1 sm:flex-none sm:w-44">
            <option value="all">All industries</option>
            {(Object.keys(INDUSTRY_LABEL) as Industry[]).map((k) => (
              <option key={k} value={k}>{INDUSTRY_LABEL[k]}</option>
            ))}
          </Select>
          <Select value={health} onChange={(e) => setHealth(e.target.value as Health | "all")} aria-label="Health" className="flex-1 sm:flex-none sm:w-36">
            <option value="all">Any health</option>
            {(Object.keys(HEALTH_LABEL) as Health[]).map((k) => (
              <option key={k} value={k}>{HEALTH_LABEL[k]}</option>
            ))}
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="icon-sm" onClick={reset} aria-label="Clear filters">
              <X />
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 sm:ml-auto">
          <p className="tabular text-xs text-muted-foreground">
            {filtered.length} of {teams.length}
          </p>
          <Segmented<View>
            value={view}
            onChange={setView}
            size="sm"
            options={[
              { value: "grid", label: <LayoutGrid />, "aria-label": "Card view" },
              { value: "table", label: <Rows3 />, "aria-label": "Table view" },
            ]}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Users}
            title="No teams match"
            description="Try a different industry or clear the filters."
            action={<Button variant="outline" size="sm" onClick={reset}>Clear filters</Button>}
          />
        </Card>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t, i) => (
            <TeamCard key={t.id} team={t} index={i} />
          ))}
        </div>
      ) : (
        <Card className="enter overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Health</TableHead>
                <TableHead className="text-right">Seats</TableHead>
                <TableHead className="w-44">Role mix</TableHead>
                <TableHead className="w-40">Utilization</TableHead>
                <TableHead>Renewal</TableHead>
                <TableHead>Lead</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => {
                const size = teamSize(t);
                const lead = getPerson(t.leadId);
                const days = daysUntil(t.renewalDate);
                return (
                  <TableRow key={t.id}>
                    <TableCell>
                      <Link href={`/teams/${t.id}`} className="block min-w-0 hover:underline">
                        <p className="font-medium">{t.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{t.client}</p>
                      </Link>
                    </TableCell>
                    <TableCell><IndustryBadge industry={t.industry} /></TableCell>
                    <TableCell><HealthBadge health={t.health} /></TableCell>
                    <TableCell className="tabular text-right">
                      <span className="font-medium">{size}</span>
                      <span className="text-muted-foreground"> / {t.targetSize}</span>
                    </TableCell>
                    <TableCell><RoleMixBar mix={roleMix(t.id)} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={t.utilization} tone="auto" className="w-24" label={`Utilization ${t.utilization}%`} />
                        <span className="tabular text-xs font-medium">{t.utilization}%</span>
                      </div>
                    </TableCell>
                    <TableCell className={cn("tabular text-xs font-medium whitespace-nowrap", renewalTone(days))}>{formatRelativeDays(days)}</TableCell>
                    <TableCell>
                      {lead && (
                        <span className="flex items-center gap-2 whitespace-nowrap">
                          <Avatar name={lead.name} size="xs" />
                          <span className="text-xs">{lead.name}</span>
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
