export type HealthStatus = "HEALTHY" | "WARNING" | "CRITICAL";

export type TransactionType = "ORDER_PAYMENT" | "DUE_PAYMENT" | "EXPENSE";
export type TransactionCategory =
  | "SALES"
  | "SHOP_RENT"
  | "UTILITIES"
  | "SUPPLIES"
  | "OTHER";
export type PaymentType = "ONE_TIME" | "RECURRING";

export type CustomerDue = {
  customerId: string;
  customerName: string;
  contactInfo: string;
  balance: number;
  dueAmount: number;
  isDue: boolean;
};

export type CustomerDues = {
  totalDues: number;
  duesList: CustomerDue[];
  count: number;
};

export type UpcomingPayment = {
  id: string;
  description: string;
  amount: string;
  dueDate: string;
  paymentType: PaymentType;
  isPriority: boolean;
  shopId: string;
  createdAt: string;
  updatedAt: string;
};

export type Transaction = {
  id: string;
  description: string;
  amount: string;
  date: string;
  shopId: string;
  type: TransactionType;
  category: TransactionCategory;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TransactionSummaryItem = {
  count: number;
  total: number;
};

export type TransactionSummary = {
  [key in TransactionType]?: TransactionSummaryItem;
};

export type MonthlyTrend = {
  month: string;
  income: number;
  expense: number;
  net: number;
};

export type TransactionCollection = {
  recent: Transaction[];
  summary: TransactionSummary;
  monthlyTrends: MonthlyTrend[];
  count: number;
};

export type CashflowData = {
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  projectedBalance: number;
  customerDues: CustomerDues;
  totalUpcoming: number;
  upcomingPayments: UpcomingPayment[];
  transactions: TransactionCollection;
  dailyTarget: number;
  dailyProgress: number;
  daysUntilNextPayment: number;
  incomeGrowth: number;
  expenseGrowth: number;
  adjustedBalance: number;
  healthStatus: HealthStatus;
};

export type ShopBalance = {
  shopId: string;
  cashBalance: string;
  cardBalance: string;
  bankBalance: string;
  totalBalance: string;
};
