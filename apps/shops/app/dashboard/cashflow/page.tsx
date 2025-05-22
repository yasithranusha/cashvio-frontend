import {
  getShopCashFlow,
  getCustomerDues,
  getUpcomingPayments,
  getShopBaBalance,
} from "@/actions/cashflow";
import CashflowView from "@/components/cashflow/cashflow-view";

export default function CashflowPage() {
  return <CashflowView />;
}
