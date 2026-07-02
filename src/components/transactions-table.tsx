"use client";

import { transactions } from "@/lib/data";
import { formatCompact } from "@/lib/utils";
import { StatusPill } from "./status-pill";
import { cn } from "@/lib/utils";

export function TransactionsTable() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="p-5 border-b border-border">
        <h3 className="text-base font-semibold text-card-foreground">Recent Transactions</h3>
        <p className="text-sm text-muted-foreground">Last 10 transactions</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">ID</th>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Description</th>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Category</th>
              <th className="px-5 py-3 text-right font-medium text-muted-foreground">Amount</th>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr
                key={txn.id}
                className={cn(
                  "border-b border-border last:border-b-0 hover:bg-accent transition-colors",
                  txn.status === "failed" && "border-l-2 border-l-[var(--st-fail-dot)]"
                )}
              >
                <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{txn.id}</td>
                <td className="px-5 py-3 text-muted-foreground tabular">{txn.date}</td>
                <td className="px-5 py-3 font-medium text-card-foreground">{txn.description}</td>
                <td className="px-5 py-3 text-muted-foreground">{txn.category}</td>
                <td className={cn(
                  "px-5 py-3 text-right font-medium tabular",
                  txn.amount >= 0 ? "text-[var(--st-live-fg)]" : "text-card-foreground"
                )}>
                  {txn.amount >= 0 ? "+" : ""}{formatCompact(txn.amount)}
                </td>
                <td className="px-5 py-3">
                  <StatusPill status={txn.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
