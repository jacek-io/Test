import { Sidebar } from "@/components/sidebar";
import { StatTile } from "@/components/stat-tile";
import { RevenueChart } from "@/components/revenue-chart";
import { ExpenseChart } from "@/components/expense-chart";
import { CashflowChart } from "@/components/cashflow-chart";
import { TransactionsTable } from "@/components/transactions-table";
import { kpis } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-secondary">
        <header className="border-b border-border bg-card px-6 py-4 lg:px-8">
          <h1 className="text-xl font-semibold text-foreground">Financial Overview</h1>
          <p className="text-sm text-muted-foreground">Annual performance summary, 2024</p>
        </header>

        <div className="px-6 py-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatTile
              label="Total Revenue"
              value={formatCurrency(kpis.totalRevenue)}
              delta={kpis.revenueDelta}
            />
            <StatTile
              label="Total Expenses"
              value={formatCurrency(kpis.totalExpenses)}
              delta={kpis.expenseDelta}
              upIsGood={false}
            />
            <StatTile
              label="Net Profit"
              value={formatCurrency(kpis.netProfit)}
              delta={kpis.profitDelta}
            />
            <StatTile
              label="Profit Margin"
              value={`${kpis.profitMargin}%`}
              delta={kpis.marginDelta}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <RevenueChart />
            <ExpenseChart />
          </div>

          <CashflowChart />

          <TransactionsTable />
        </div>
      </main>
    </div>
  );
}
