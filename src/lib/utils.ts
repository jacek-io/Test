import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Fixed "today" so the demo data reads the same on every machine. */
export const TODAY = new Date("2026-10-03T09:00:00Z");

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "");
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export function daysUntil(iso: string): number {
  return daysBetween(TODAY, new Date(iso));
}

export function daysSince(iso: string): number {
  return daysBetween(new Date(iso), TODAY);
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }) {
  return new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: "UTC" }).format(new Date(iso));
}

export function formatDateLong(iso: string) {
  return formatDate(iso, { month: "short", day: "numeric", year: "numeric" });
}

export function formatRelativeDays(days: number): string {
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days === -1) return "yesterday";
  if (days < 0) return `${Math.abs(days)}d ago`;
  if (days < 60) return `in ${days}d`;
  const months = Math.round(days / 30);
  return `in ${months}mo`;
}

export function formatTenure(iso: string): string {
  const days = daysSince(iso);
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem ? `${years}y ${rem}mo` : `${years}y`;
}

export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function formatPercent(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function pluralize(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

export function titleCase(s: string) {
  return s.replace(/(^|[\s-])\S/g, (m) => m.toUpperCase());
}

/** Stagger index for the `.enter` animation. */
export function stagger(i: number): React.CSSProperties {
  return { ["--i" as string]: i } as React.CSSProperties;
}

export function formatDuration(days: number): string {
  const d = Math.round(days);
  if (d < 30) return `${d}d`;
  const months = Math.floor(d / 30);
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem ? `${years}y ${rem}mo` : `${years}y`;
}
