"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, UserRound, X } from "lucide-react";
import { FAMILY_LABEL, FAMILY_ORDER, SENIORITY_LABEL, getTeam, people, type RoleFamily, type Seniority } from "@/lib/data";
import { formatTenure } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Segmented } from "@/components/ui/segmented";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FAMILY_COLOR } from "@/components/role-mix";

type Status = "all" | "deployed" | "bench";
const SENIORITY_RANK: Record<Seniority, number> = { lead: 0, senior: 1, mid: 2, junior: 3 };
const PAGE = 40;

export function PeopleTable() {
  const [q, setQ] = useState("");
  const [family, setFamily] = useState<RoleFamily | "all">("all");
  const [seniority, setSeniority] = useState<Seniority | "all">("all");
  const [status, setStatus] = useState<Status>("all");
  const [limit, setLimit] = useState(PAGE);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return people
      .filter((p) => status === "all" || (status === "bench" ? !p.teamId : !!p.teamId))
      .filter((p) => family === "all" || p.family === family)
      .filter((p) => seniority === "all" || p.seniority === seniority)
      .filter((p) => !needle || `${p.name} ${p.title} ${p.location} ${p.teamId ? getTeam(p.teamId)?.name : "bench"}`.toLowerCase().includes(needle))
      .sort((a, b) => (a.teamId ? 1 : 0) - (b.teamId ? 1 : 0) || SENIORITY_RANK[a.seniority] - SENIORITY_RANK[b.seniority] || a.name.localeCompare(b.name));
  }, [q, family, seniority, status]);

  const shown = filtered.slice(0, limit);
  const hasFilters = q || family !== "all" || seniority !== "all" || status !== "all";
  function reset() {
    setQ("");
    setFamily("all");
    setSeniority("all");
    setStatus("all");
  }

  return (
    <div className="space-y-4">
      <div className="enter flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, title, team" className="pl-9" aria-label="Search people" />
        </div>
        <div className="flex items-center gap-2">
          <Select value={family} onChange={(e) => setFamily(e.target.value as RoleFamily | "all")} aria-label="Discipline" className="flex-1 lg:w-44">
            <option value="all">All disciplines</option>
            {FAMILY_ORDER.map((f) => (
              <option key={f} value={f}>{FAMILY_LABEL[f]}</option>
            ))}
          </Select>
          <Select value={seniority} onChange={(e) => setSeniority(e.target.value as Seniority | "all")} aria-label="Level" className="flex-1 lg:w-32">
            <option value="all">Any level</option>
            {(Object.keys(SENIORITY_LABEL) as Seniority[]).map((s) => (
              <option key={s} value={s}>{SENIORITY_LABEL[s]}</option>
            ))}
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="icon-sm" onClick={reset} aria-label="Clear filters"><X /></Button>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 lg:ml-auto">
          <p className="tabular text-xs text-muted-foreground">{filtered.length} of {people.length}</p>
          <Segmented<Status>
            value={status}
            onChange={setStatus}
            size="sm"
            options={[
              { value: "all", label: "All" },
              { value: "deployed", label: "Deployed" },
              { value: "bench", label: "Bench" },
            ]}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={UserRound} title="Nobody matches" description="Loosen the filters to see more people." action={<Button variant="outline" size="sm" onClick={reset}>Clear filters</Button>} />
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <Card className="enter hidden overflow-hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Person</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="w-40">Allocation</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead className="text-right">Tenure</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.map((p) => {
                  const team = p.teamId ? getTeam(p.teamId) : undefined;
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="relative">
                            <Avatar name={p.name} />
                            <span aria-hidden className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-card" style={{ background: FAMILY_COLOR[p.family] }} />
                          </span>
                          <div className="min-w-0">
                            <p className="flex items-center gap-2 text-sm font-medium">
                              <span className="truncate">{p.name}</span>
                              {p.availability === "vacation" && <Badge variant="secondary">On leave</Badge>}
                              {p.availability === "notice" && <Badge variant="danger">Notice</Badge>}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">{p.title}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {team ? (
                          <Link href={`/teams/${team.id}`} className="block hover:underline">
                            <p className="text-sm font-medium">{team.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{team.client}</p>
                          </Link>
                        ) : (
                          <Badge variant="warning">Bench</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{SENIORITY_LABEL[p.seniority]}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={p.allocation} tone={p.allocation === 0 ? "warning" : p.allocation < 100 ? "warning" : "brand"} className="w-20" label={`Allocation ${p.allocation}%`} />
                          <span className="tabular text-xs font-medium">{p.allocation}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">{p.location}</TableCell>
                      <TableCell className="tabular text-right text-xs text-muted-foreground">{formatTenure(p.startDate)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile list */}
          <ul className="enter space-y-2 md:hidden">
            {shown.map((p) => {
              const team = p.teamId ? getTeam(p.teamId) : undefined;
              return (
                <li key={p.id}>
                  <Card className="flex-row items-center gap-3 p-3">
                    <span className="relative">
                      <Avatar name={p.name} size="lg" />
                      <span aria-hidden className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-card" style={{ background: FAMILY_COLOR[p.family] }} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-sm font-medium">
                        <span className="truncate">{p.name}</span>
                        {p.availability === "notice" && <Badge variant="danger">Notice</Badge>}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{p.title} · {SENIORITY_LABEL[p.seniority]}</p>
                      <p className="mt-0.5 truncate text-xs">
                        {team ? <Link href={`/teams/${team.id}`} className="font-medium hover:underline">{team.name}</Link> : <span className="font-medium text-warning">Bench</span>}
                        <span className="text-muted-foreground"> · {p.location}</span>
                      </p>
                    </div>
                    <span className="tabular shrink-0 text-xs font-medium">{p.allocation}%</span>
                  </Card>
                </li>
              );
            })}
          </ul>

          {shown.length < filtered.length && (
            <div className="flex justify-center">
              <Button variant="outline" size="sm" onClick={() => setLimit((l) => l + PAGE)}>
                Show {Math.min(PAGE, filtered.length - shown.length)} more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
