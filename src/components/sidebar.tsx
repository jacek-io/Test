"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, isActive } from "@/lib/nav";
import { Brand } from "@/components/brand";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
      <div className="flex h-16 items-center px-5">
        <Brand />
      </div>
      <nav className="flex-1 space-y-0.5 px-3 pt-2" aria-label="Primary">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "pressable group relative flex h-9 items-center gap-3 rounded-lg px-3 text-[13.5px] font-medium",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              {active && <span aria-hidden className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-brand-strong" />}
              <item.icon className={cn("size-4", active ? "text-brand-strong" : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <Avatar name="Jacek Zabicki" tone="primary" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-foreground">Jacek Zabicki</p>
            <p className="truncate text-xs text-muted-foreground">Operations manager</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
