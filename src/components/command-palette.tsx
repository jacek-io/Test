"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, UserRound, CornerDownLeft } from "lucide-react";
import { people, teams, getTeam } from "@/lib/data";
import { Kbd } from "@/components/ui/kbd";
import { HealthDot } from "@/components/health-badge";
import { cn } from "@/lib/utils";

interface Ctx {
  open: boolean;
  setOpen: (v: boolean) => void;
}
const PaletteContext = createContext<Ctx>({ open: false, setOpen: () => {} });
export const useCommandPalette = () => useContext(PaletteContext);

type Result =
  | { kind: "team"; id: string; title: string; subtitle: string; href: string }
  | { kind: "person"; id: string; title: string; subtitle: string; href: string };

function search(q: string): Result[] {
  const needle = q.trim().toLowerCase();
  const teamHits: Result[] = teams
    .filter((t) => !needle || `${t.name} ${t.client} ${t.industry}`.toLowerCase().includes(needle))
    .slice(0, needle ? 6 : 5)
    .map((t) => ({ kind: "team", id: t.id, title: t.name, subtitle: t.client, href: `/teams/${t.id}` }));
  const personHits: Result[] = needle
    ? people
        .filter((p) => `${p.name} ${p.title}`.toLowerCase().includes(needle))
        .slice(0, 6)
        .map((p) => ({
          kind: "person",
          id: p.id,
          title: p.name,
          subtitle: `${p.title} · ${p.teamId ? getTeam(p.teamId)?.name : "Bench"}`,
          href: p.teamId ? `/teams/${p.teamId}` : "/people",
        }))
    : [];
  return [...teamHits, ...personHits];
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(() => ({ open, setOpen }), [open]);
  return (
    <PaletteContext.Provider value={value}>
      {children}
      {open && <Palette onClose={() => setOpen(false)} />}
    </PaletteContext.Provider>
  );
}

/* Opened by keyboard dozens of times a day → no open/close animation. */
function Palette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => search(q), [q]);

  useEffect(() => {
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const go = useCallback(
    (r: Result | undefined) => {
      if (!r) return;
      onClose();
      router.push(r.href);
    },
    [onClose, router],
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[index]);
    }
  }

  const teamsRes = results.filter((r) => r.kind === "team");
  const peopleRes = results.filter((r) => r.kind === "person");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]" role="presentation">
      <button aria-label="Close search" className="absolute inset-0 bg-foreground/30 dark:bg-black/60" onClick={onClose} />
      <div
        role="dialog"
        aria-modal
        aria-label="Search teams and people"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-2xl"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="size-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIndex(0);
            }}
            placeholder="Search teams, clients, people…"
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search"
          />
          <Kbd>esc</Kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
          {results.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">No matches for “{q}”.</p>
          )}
          {teamsRes.length > 0 && <Group label="Teams" icon={Users} items={teamsRes} results={results} index={index} onPick={go} setIndex={setIndex} />}
          {peopleRes.length > 0 && <Group label="People" icon={UserRound} items={peopleRes} results={results} index={index} onPick={go} setIndex={setIndex} />}
        </div>
        <div className="flex items-center gap-3 border-t px-4 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate</span>
          <span className="flex items-center gap-1"><Kbd><CornerDownLeft className="size-2.5" /></Kbd> open</span>
        </div>
      </div>
    </div>
  );
}

function Group({
  label,
  icon: Icon,
  items,
  results,
  index,
  onPick,
  setIndex,
}: {
  label: string;
  icon: typeof Users;
  items: Result[];
  results: Result[];
  index: number;
  onPick: (r: Result) => void;
  setIndex: (i: number) => void;
}) {
  return (
    <div className="mb-1">
      <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      {items.map((r) => {
        const i = results.indexOf(r);
        const active = i === index;
        const team = r.kind === "team" ? getTeam(r.id) : undefined;
        return (
          <button
            key={r.id}
            role="option"
            aria-selected={active}
            onMouseEnter={() => setIndex(i)}
            onClick={() => onPick(r)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm",
              active ? "bg-accent text-accent-foreground" : "text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0 text-muted-foreground" />
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <span className="truncate font-medium">{r.title}</span>
              {team && <HealthDot health={team.health} />}
            </span>
            <span className="truncate text-xs text-muted-foreground">{r.subtitle}</span>
          </button>
        );
      })}
    </div>
  );
}
