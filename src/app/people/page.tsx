import type { Metadata } from "next";
import { Suspense } from "react";
import { people } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { PeopleTable } from "@/components/people-table";

export const metadata: Metadata = { title: "People" };

export default function PeoplePage() {
  const bench = people.filter((p) => !p.teamId).length;
  const onLeave = people.filter((p) => p.availability === "vacation").length;
  const notice = people.filter((p) => p.availability === "notice").length;
  return (
    <div className="space-y-6">
      <PageHeader
        title="People"
        description={`${people.length} people · ${people.length - bench} deployed · ${bench} on bench · ${onLeave} on leave · ${notice} on notice`}
      />
      <Suspense>
        <PeopleTable />
      </Suspense>
    </div>
  );
}
