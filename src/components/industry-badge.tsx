import { Landmark, Banknote, HeartPulse, Car, LineChart, ShieldCheck, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { INDUSTRY_LABEL, type Industry } from "@/lib/data";

export const INDUSTRY_ICON: Record<Industry, LucideIcon> = {
  fintech: Banknote,
  banking: Landmark,
  healthcare: HeartPulse,
  automotive: Car,
  financial: LineChart,
  compliance: ShieldCheck,
};

export function IndustryBadge({ industry, className }: { industry: Industry; className?: string }) {
  const Icon = INDUSTRY_ICON[industry];
  return (
    <Badge variant="outline" className={className}>
      <Icon aria-hidden className="text-muted-foreground" />
      {INDUSTRY_LABEL[industry]}
    </Badge>
  );
}
