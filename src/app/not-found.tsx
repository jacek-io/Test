import Link from "next/link";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <EmptyState
      icon={SearchX}
      title="Nothing here"
      description="The page you asked for doesn't exist or the team was archived."
      action={
        <Link href="/" className={buttonClass("outline", "sm")}>
          Back to overview
        </Link>
      }
      className="py-32"
    />
  );
}
