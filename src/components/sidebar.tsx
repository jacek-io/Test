"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  Wallet,
  FileText,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Transactions", icon: ArrowLeftRight, active: false },
  { label: "Analytics", icon: TrendingUp, active: false },
  { label: "Accounts", icon: Wallet, active: false },
  { label: "Reports", icon: FileText, active: false },
  { label: "Settings", icon: Settings, active: false },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-[var(--sidebar)] text-[var(--sidebar-foreground)]">
      <div className="flex items-center px-6 py-5 border-b border-[var(--sidebar-border)]">
        <Image
          src="/idego-logo.svg"
          alt="Idego"
          width={100}
          height={37}
          priority
        />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              item.active
                ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
                : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
            )}
          >
            {item.active && (
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--sidebar-primary)]" />
            )}
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-[var(--sidebar-border)]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[var(--sidebar-accent)] flex items-center justify-center text-sm font-medium text-[var(--sidebar-primary)]">
            JZ
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Jacek Z.</p>
            <p className="text-xs text-[var(--sidebar-foreground)] truncate">Finance Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
