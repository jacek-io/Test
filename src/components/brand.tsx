import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-brand dark:text-primary-foreground", className)}
    >
      <svg viewBox="0 0 32 32" className="size-5" fill="none">
        <rect x="6" y="7" width="4" height="18" rx="1.5" fill="currentColor" />
        <path d="M14 7h6.5a9 9 0 0 1 0 18H14V7Zm4 4v10h2.5a5 5 0 0 0 0-10H18Z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Brand({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 rounded-lg", className)} aria-label="TEAM ID — home">
      <BrandMark />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight">TEAM ID</span>
          <span className="mt-0.5 text-[11px] text-muted-foreground">Operations</span>
        </span>
      )}
    </Link>
  );
}
