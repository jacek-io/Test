import { CircleCheck, CircleAlert, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HEALTH_LABEL, type Health } from "@/lib/data";
import { cn } from "@/lib/utils";

const config = {
  "on-track": { variant: "success" as const, Icon: CircleCheck, dot: "bg-success-dot" },
  watch: { variant: "warning" as const, Icon: CircleAlert, dot: "bg-warning-dot" },
  "at-risk": { variant: "danger" as const, Icon: TriangleAlert, dot: "bg-danger-dot" },
};

export function HealthBadge({ health, className }: { health: Health; className?: string }) {
  const { variant, Icon } = config[health];
  return (
    <Badge variant={variant} className={className}>
      <Icon aria-hidden />
      {HEALTH_LABEL[health]}
    </Badge>
  );
}

export function HealthDot({ health, className }: { health: Health; className?: string }) {
  return (
    <span
      role="img"
      aria-label={HEALTH_LABEL[health]}
      title={HEALTH_LABEL[health]}
      className={cn("inline-block size-2 shrink-0 rounded-full", config[health].dot, className)}
    />
  );
}
