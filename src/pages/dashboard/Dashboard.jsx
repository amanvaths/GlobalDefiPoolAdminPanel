import { Route, Routes, useParams } from "react-router-dom";
import DashboardNav from "../../components/DashboardNav";
import Associates from "./Associates";
import DashboardAreaNav from "./DashboardAreaNav";
import DashboardFooter from "./DashboardFooter";
import DashboardHome from "./DashboardHome";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTrasactions from "./DashboardTransactions";
import FundRequest from "./FundRequest";
import IncomeHistory from "./IncomeHistory";
import TransactionHistory from "./TransactionHistory";
import Investments from "./Investments";
import RoyaltyIncomes from "./RoyaltyIncomes";
import Settings from "./Settings";
import UserDashboard from "./UserDashboard";
import WidthdrawlHistory from "./WidthdrawlHistory";
import WithdrawlRequest from "./WithdrawlRequest";
// import DatewiseWithdrawls from "./DatewiseWithdrawls";
import DatewiseRequest from "./DatewiseRequest";
import SmartWalletCreditReport from "./SmartWalletCreditReport";
import Announcement from "./Announcement";
import Statistics from "./Statistics";
import Support from "./Support";

export default function Dashboard() {
  const { page, memberID } = useParams();
  const pages = {
    settings: <Settings />,
    associates: <Associates />,
    investments: <Investments />,
    fund_request: <FundRequest />,
    transaction_history: <TransactionHistory />,
    income_history: <IncomeHistory />,
    widthdrawal_history: <WidthdrawlHistory />,
    withdrawl_requests: <WithdrawlRequest />,
    datewise_withdrawl_requests: <WithdrawlRequest />,
    transactions: <DashboardTrasactions />,
    royalty_income: <RoyaltyIncomes />,
    smart_wallet_credit_report:<SmartWalletCreditReport/>,
    Announcement:<Announcement/>,
    Statistics:<Statistics/>,
    support: <Support />,
    // datewise_widthdrawal_history:<DatewiseWithdrawls/>,
    datewise_withdrawl_requests:<DatewiseRequest/>
  };
  console.log(page, memberID);
  return (
    <>
      <DashboardNav />
      <div className="container-fluid bg-soft">
        <div className="row">
          <div className="col-12">
            {/* DashboardSidebar */}
            <DashboardSidebar />
            <main className="content">
              {/* DashboardNav */}
              <DashboardAreaNav />
              {memberID ? (
                <UserDashboard />
              ) : pages?.[page] ? (
                pages[page]
              ) : (
                <DashboardHome />
              )}
              {/* DashboardFooter */}
              {/* <DashboardFooter /> */}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
