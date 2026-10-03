"use client";

import { Search } from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCommandPalette } from "@/components/command-palette";

export function Header() {
  const { setOpen } = useCommandPalette();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-md sm:px-6 lg:h-16 lg:px-8">
      <div className="lg:hidden">
        <Brand compact />
      </div>
      <div className="flex-1" />
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="pressable hidden h-9 w-72 items-center gap-2 rounded-lg border border-input bg-card px-3 text-sm text-muted-foreground hover:bg-muted sm:flex"
        aria-label="Search (⌘K)"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search teams, people…</span>
        <Kbd>⌘K</Kbd>
      </button>
      <Button variant="outline" size="icon-sm" className="sm:hidden" onClick={() => setOpen(true)} aria-label="Search">
        <Search />
      </Button>
      <ThemeToggle className="lg:hidden" />
    </header>
  );
}
