export const revenueData = [
  { month: "Jan", revenue: 186000, expenses: 124000 },
  { month: "Feb", revenue: 205000, expenses: 131000 },
  { month: "Mar", revenue: 237000, expenses: 142000 },
  { month: "Apr", revenue: 273000, expenses: 155000 },
  { month: "May", revenue: 209000, expenses: 138000 },
  { month: "Jun", revenue: 314000, expenses: 167000 },
  { month: "Jul", revenue: 298000, expenses: 158000 },
  { month: "Aug", revenue: 342000, expenses: 175000 },
  { month: "Sep", revenue: 378000, expenses: 189000 },
  { month: "Oct", revenue: 356000, expenses: 182000 },
  { month: "Nov", revenue: 401000, expenses: 198000 },
  { month: "Dec", revenue: 438000, expenses: 212000 },
];

export const expenseBreakdown = [
  { category: "Payroll", amount: 892000 },
  { category: "Infrastructure", amount: 341000 },
  { category: "Marketing", amount: 267000 },
  { category: "Operations", amount: 198000 },
  { category: "R&D", amount: 173000 },
];

export const cashFlowData = [
  { month: "Jan", inflow: 210000, outflow: 148000 },
  { month: "Feb", inflow: 228000, outflow: 156000 },
  { month: "Mar", inflow: 265000, outflow: 171000 },
  { month: "Apr", inflow: 301000, outflow: 185000 },
  { month: "May", inflow: 243000, outflow: 162000 },
  { month: "Jun", inflow: 349000, outflow: 198000 },
  { month: "Jul", inflow: 331000, outflow: 187000 },
  { month: "Aug", inflow: 378000, outflow: 204000 },
  { month: "Sep", inflow: 412000, outflow: 219000 },
  { month: "Oct", inflow: 389000, outflow: 210000 },
  { month: "Nov", inflow: 435000, outflow: 228000 },
  { month: "Dec", inflow: 472000, outflow: 241000 },
];

export type TransactionStatus = "completed" | "pending" | "failed";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: TransactionStatus;
}

export const transactions: Transaction[] = [
  { id: "TXN-001", date: "2024-12-28", description: "Cloud hosting renewal", category: "Infrastructure", amount: -24500, status: "completed" },
  { id: "TXN-002", date: "2024-12-27", description: "Client payment - Acme Corp", category: "Revenue", amount: 85000, status: "completed" },
  { id: "TXN-003", date: "2024-12-27", description: "Monthly payroll", category: "Payroll", amount: -74300, status: "completed" },
  { id: "TXN-004", date: "2024-12-26", description: "Marketing campaign Q1", category: "Marketing", amount: -12800, status: "pending" },
  { id: "TXN-005", date: "2024-12-26", description: "Client payment - Bolt Inc", category: "Revenue", amount: 42000, status: "completed" },
  { id: "TXN-006", date: "2024-12-25", description: "Software licenses", category: "Operations", amount: -8950, status: "completed" },
  { id: "TXN-007", date: "2024-12-24", description: "Contractor payment", category: "Payroll", amount: -15600, status: "failed" },
  { id: "TXN-008", date: "2024-12-24", description: "Client payment - Nova Ltd", category: "Revenue", amount: 63500, status: "pending" },
  { id: "TXN-009", date: "2024-12-23", description: "Office supplies", category: "Operations", amount: -2340, status: "completed" },
  { id: "TXN-010", date: "2024-12-23", description: "Client payment - Zenith Co", category: "Revenue", amount: 91200, status: "completed" },
];

export const kpis = {
  totalRevenue: 3637000,
  totalExpenses: 1871000,
  netProfit: 1766000,
  profitMargin: 48.6,
  revenueDelta: 12.4,
  expenseDelta: 5.2,
  profitDelta: 18.7,
  marginDelta: 3.1,
};
