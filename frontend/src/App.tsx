import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import "@/lib/auth";
import NotFound from "@/pages/not-found";

// Auth pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

// User pages
import UserDashboard from "@/pages/user/Dashboard";
import Invest from "@/pages/user/Invest";
import Investments from "@/pages/user/Investments";
import Deposit from "@/pages/user/Deposit";
import Withdraw from "@/pages/user/Withdraw";
import Transactions from "@/pages/user/Transactions";
import DepositTransactions from "@/pages/user/DepositTransactions";
import WithdrawTransactions from "@/pages/user/WithdrawTransactions";
import Profile from "@/pages/user/Profile";
import Verification from "@/pages/user/Verification";
import VerificationRetryPage from "@/pages/user/VerificationRetryPage";
import ConnectWallet from "@/pages/user/ConnectWallet";
import Settings from "./pages/user/Settings";
import TradingViewWidget from "./pages/user/TradingViewWidget";
import ActiveInvestments from "./pages/user/ActiveInvestments";
import Messages from "./pages/user/Messages";
import News from "./pages/user/News";
import LiveTrade from "./pages/user/LiveTrade";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminPlans from "@/pages/admin/Plans";
import AdminUsers from "@/pages/admin/Users";
import AdminUserDetails from "@/pages/admin/UserDetails";
import AdminInvestments from "@/pages/admin/Investments";
import AdminTransactionsDepost from "@/pages/admin/TransactionsDepost";
import AdminTransactionsWithdrawal from "@/pages/admin/TransactionsWithdrawal";
import AdminTransactions from "@/pages/admin/Transactions";
import AdminWallets from "@/pages/admin/Wallets";
import AdminWalletConnections from "@/pages/admin/WalletConnections";
import AdminSettings from "@/pages/admin/Settings";
import AdminVerifications from "@/pages/admin/Verifications";

// others
import { Toaster } from "sonner";
import LandingPage from "./pages/public/LandingPage";
import { Cookie } from "./components/layout/Cookie";
import LoadingScreen from "./components/ui/LoadingScreen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function UserRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!user) return <Redirect to="/login" />;
  if (user.role === "admin") return <Redirect to="/admin" />;
  return <Component />;
}

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!user) return <Redirect to="/login" />;
  if (user.role !== "admin") return <Redirect to="/dashboard" />;
  return <Component />;
}

function GuestRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (user?.role === "admin") return <Redirect to="/admin" />;
  if (user) return <Redirect to="/dashboard" />;
  return <Component />;
}

function HomeRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!user) return <Redirect to="/login" />;
  if (user.role === "admin") return <Redirect to="/admin" />;
  return <Redirect to="/dashboard" />;
}

function Router() {

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      {/* <Route path="/" component={HomeRedirect} /> */}
      <Route path="/login" component={() => <GuestRoute component={Login} />} />
      <Route path="/register" component={() => <GuestRoute component={Register} />} />
      <Route path="/forgot-password" component={() => <GuestRoute component={ForgotPassword} />} />
      <Route path="/reset-password" component={() => <GuestRoute component={ResetPassword} />} />

      {/* User routes */}
      <Route path="/dashboard" component={() => <UserRoute component={UserDashboard} />} />
      <Route path="/dashboard/invest" component={() => <UserRoute component={Invest} />} />
      <Route path="/dashboard/investments" component={() => <UserRoute component={Investments} />} />
      <Route path="/dashboard/deposit" component={() => <UserRoute component={Deposit} />} />
      <Route path="/dashboard/withdraw" component={() => <UserRoute component={Withdraw} />} />
      <Route path="/dashboard/transactions" component={() => <UserRoute component={Transactions} />} />
      <Route path="/dashboard/deposits" component={() => <UserRoute component={DepositTransactions} />} />
      <Route path="/dashboard/withdrawals" component={() => <UserRoute component={WithdrawTransactions} />} />
      <Route path="/dashboard/profile" component={() => <UserRoute component={Profile} />} />
      <Route path="/dashboard/verification" component={() => <UserRoute component={Verification} />} />
      <Route path="/dashboard/verificationretry" component={() => <UserRoute component={VerificationRetryPage} />} />
      <Route path="/dashboard/connect-wallet" component={() => <UserRoute component={ConnectWallet} />} />
      <Route path="/dashboard/security" component={() => <UserRoute component={Settings} />} />
      <Route path="/dashboard/messages" component={() => <UserRoute component={Messages} />} />
      <Route path="/dashboard/active-investments" component={() => <UserRoute component={ActiveInvestments} />} />
      <Route path="/dashboard/markets" component={() => <UserRoute component={TradingViewWidget} />} />
      <Route path="/dashboard/live-trade" component={() => <UserRoute component={LiveTrade} />} />
      <Route path="/dashboard/newspaper" component={() => <UserRoute component={News} />} />


      
      {/* Admin routes */}
      <Route path="/admin" component={() => <AdminRoute component={AdminDashboard} />} />
      <Route path="/admin/plans" component={() => <AdminRoute component={AdminPlans} />} />
      <Route path="/admin/users/:id" component={() => <AdminRoute component={AdminUserDetails} />} />
      <Route path="/admin/users" component={() => <AdminRoute component={AdminUsers} />} />
      <Route path="/admin/investments" component={() => <AdminRoute component={AdminInvestments} />} />
      <Route path="/admin/transactions" component={() => <AdminRoute component={AdminTransactions} />} />
      <Route path="/admin/deposts" component={() => <AdminRoute component={AdminTransactionsDepost} />} />
      <Route path="/admin/withdrawal" component={() => <AdminRoute component={AdminTransactionsWithdrawal} />} />
      <Route path="/admin/wallets" component={() => <AdminRoute component={AdminWallets} />} />
      <Route path="/admin/wallet-connections" component={() => <AdminRoute component={AdminWalletConnections} />} />
      <Route path="/admin/verifications" component={() => <AdminRoute component={AdminVerifications} />} />
      <Route path="/admin/settings" component={() => <AdminRoute component={AdminSettings} />} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <AuthProvider>
          <Cookie/>
          <div id="google_translate_element" style={{ display: "none" }} />
          <Router />
          <Toaster />
        </AuthProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
