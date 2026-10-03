import type { Metadata } from "next";
import { Suspense } from "react";
import { teams } from "@/lib/data";
import { portfolioKpis } from "@/lib/metrics";
import { PageHeader } from "@/components/page-header";
import { TeamsView } from "@/components/teams-view";

export const metadata: Metadata = { title: "Teams" };

export default function TeamsPage() {
  const k = portfolioKpis();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Teams"
        description={`${teams.length} client teams · ${k.deployed} people · ${k.atRisk + k.watch} need attention`}
      />
      <Suspense>
        <TeamsView />
      </Suspense>
    </div>
  );
}
