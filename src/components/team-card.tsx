import Link from "next/link";
import { CalendarClock, Users } from "lucide-react";
import { getPerson, type Team } from "@/lib/data";
import { roleMix, teamSize } from "@/lib/metrics";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { HealthBadge } from "@/components/health-badge";
import { IndustryBadge } from "@/components/industry-badge";
import { RoleMixBar } from "@/components/role-mix";
import { cn, daysUntil, formatRelativeDays, stagger } from "@/lib/utils";

export function renewalTone(days: number) {
  if (days <= 30) return "text-danger";
  if (days <= 60) return "text-warning";
  return "text-muted-foreground";
}

export function TeamCard({ team, index = 0 }: { team: Team; index?: number }) {
  const size = teamSize(team);
  const lead = getPerson(team.leadId);
  const days = daysUntil(team.renewalDate);
  const openSeats = Math.max(0, team.targetSize - size);

  return (
    <Link href={`/teams/${team.id}`} className="enter block rounded-xl focus-visible:outline-offset-4" style={stagger(index)}>
      <Card className="hover-lift h-full gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold tracking-tight">{team.name}</h3>
            <p className="truncate text-[13px] text-muted-foreground">{team.client}</p>
          </div>
          <HealthBadge health={team.health} />
        </div>

        <p className="line-clamp-2 min-h-[2.6em] text-[13px] leading-snug text-muted-foreground">{team.summary}</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="size-3.5" />
              <span className="tabular">
                <span className="font-medium text-foreground">{size}</span> / {team.targetSize} seats
              </span>
            </span>
            {openSeats > 0 ? (
              <span className="tabular font-medium text-warning">{openSeats} open</span>
            ) : (
              <span className="text-muted-foreground">Fully staffed</span>
            )}
          </div>
          <RoleMixBar mix={roleMix(team.id)} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Utilization</span>
            <span className="tabular font-medium">{team.utilization}%</span>
          </div>
          <Progress value={team.utilization} tone="auto" label={`Utilization ${team.utilization}%`} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
          <IndustryBadge industry={team.industry} />
          <span className={cn("flex items-center gap-1.5 text-xs tabular", renewalTone(days))}>
            <CalendarClock className="size-3.5" />
            Renewal {formatRelativeDays(days)}
          </span>
        </div>
        {lead && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Avatar name={lead.name} size="xs" />
            <span className="truncate">
              <span className="font-medium text-foreground">{lead.name}</span> · {lead.title}
            </span>
          </div>
        )}
      </Card>
    </Link>
  );
}
