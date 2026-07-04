import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import {
  LogOut,
  Menu,
  HelpCircle,
  Bell,
  ArrowDownCircle,
  ArrowUpCircle,
  X,
  LayoutDashboard,
  TrendingUp,
  Signal,
  Activity,
  User,
  Bitcoin,
  Shield,
  History,
  Lock,
  Newspaper,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useGetPublicSettings } from "@/lib/api-client/generated/api";
import { useListMyTransactions, getListMyTransactionsQueryKey } from "@workspace/api-client-react";
import ThemeToggle from "@/pages/public/components/ThemeToggle";
// import TawkTo from "./TawkTo";
import { getNumberOfuserMessages } from "@/lib/api-client/custom-fetch";



const UserNavGroups = [
  {
    title: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Funding",
    items: [
      { href: "/dashboard/deposit", label: "Deposit", icon: ArrowDownCircle },
      { href: "/dashboard/withdraw", label: "Withdraw", icon: ArrowUpCircle },
    ],
  },
  {
    title: "Trade Plans",
    items: [
      { href: "/dashboard/invest", label: "Join Plan", icon: TrendingUp },
      { href: "/dashboard/active-investments", label: "Active Plan", icon: Activity },
      { href: "/dashboard/investments", label: "Trade History", icon: History },
    ],
  },
  {
      title: "Trading",
    items: [
        { href: "/dashboard/Markets", label: "Markets", icon: TrendingUp },
        // { href: "/dashboard/signal", label: "Signal", icon: Signal },
        { href: "/dashboard/live-trade", label: "Live Trade", icon: Activity },
    ],
  },
  {
    title: "Transactions",
    items: [
      { href: "/dashboard/deposits", label: "Deposits", icon: TrendingUp },
      { href: "/dashboard/withdrawals", label: "Withdrawals", icon: Activity },
      { href: "/dashboard/transactions", label: "Transactions", icon: History },
    //   { href: "/dashboard/traders", label: "Pro Traders", icon: Users },
    //   { href: "/dashboard/referral", label: "Referral", icon: Share2 },
  ],
},
{
  title: "Account",
  items: [
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/security", label: "Settings", icon: Lock },
  ],
},
{
  title: "Notifications",
  items: [
    { href: "/dashboard/messages", label: "Messages", icon: Bell },
      { href: "/dashboard/newspaper", label: "News", icon: Newspaper },
  ],
},
  {
    title: "Wallet",
    items: [
      { href: "/dashboard/connect-wallet", label: "Connect Wallet", icon: Bitcoin },
    ],
  },
  {
    title: "Verification",
    items: [
      { href: "/dashboard/verification", label: "Go To Verification", icon: Shield },
    ],
  },
];

export function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [numberOfUserMessages, setNumberOfUserMessages] = useState<number>(0);

  const { data: settings, isLoading } = useGetPublicSettings();
  const { data: transactions, isLoading: transactionsLoading } = useListMyTransactions({
    query: { queryKey: getListMyTransactionsQueryKey() },
  });

  const currency = settings?.currency || "USD";

  useEffect(() => {
    const loadMessageCount = async () => {
      const count = await getNumberOfuserMessages();
      if (typeof count === "number") {
        setNumberOfUserMessages(count);
      }
    };

    loadMessageCount();
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      {/* <TawkTo /> */}
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 overflow-x-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            {/* <span><img src={favicon} alt="Logo" className="w-7 h-7" /> </span> */}C
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">{settings?.siteName?.toLocaleUpperCase()}</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-6">
          {UserNavGroups?.filter(f => settings?.identityVerificationEnabled || f.title !== "Verification")?.filter(f => settings?.walletConnectionRequired || f.title !== "Wallet")?.map(({ title, items }) => (
            <div key={title}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground mb-3 px-1">
                {title}
              </p>
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-2">
                {items.map(({ href, label, icon: Icon }) => {
                  const active = location === href || (href !== "/dashboard" && location.startsWith(href));
                  return (
                    <Link
                      key={href + label}
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "group rounded-2xl border overflow-hidden px-2 py-2  text-center gap-3 transition-all duration-200",
                        active
                          ? "border-primary bg-primary/10 text-foreground shadow-sm"
                          : "border-border bg-card text-muted-foreground hover:border-primary hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex h-10 w-10 items-center justify-center rounded-2xl",
                          active ? "bg-primary text-primary-foreground" : "bg-muted/10 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span> <br/>
                      <span className="text-sm font-medium">{label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="px-4 text-center py-10 bg-secondary rounded-3xl">
            <HelpCircle className="mx-auto mb-3 h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Need help?
            </p>
            <Link href={`mailto:${settings?.siteEmail}`} className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
              Contact support
            </Link>
          </div>
        </nav>

        {/* User info + logout */}
        <div className="px-3 py-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-xs font-bold">
                {user?.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground">
                {settings?.currency} {parseFloat(String(user?.balance ?? 0)).toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive-foreground hover:bg-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen  overflow-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border px-4 py-3 flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
              <a href="/dashboard/messages" className="relative rounded-2xl border border-border bg-card p-2 text-muted-foreground transition-colors hover:border-primary hover:bg-secondary hover:text-foreground">
                <MessageCircle className="w-5 h-5" />
                {numberOfUserMessages > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-3 w-3 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">
                    {numberOfUserMessages}
                  </span>
                )}
              </a>

            <button
              type="button"
              onClick={() => setShowTransactions(true)}
              className="relative rounded-2xl border border-border bg-card p-2 text-muted-foreground transition-colors hover:border-primary hover:bg-secondary hover:text-foreground"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -right-1 -top-1 inline-flex h-3 w-3 rounded-full bg-rose-500 ring-2 ring-card" />
            </button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-accent font-semibold">
                {settings?.currency} {parseFloat(String(user?.balance ?? 0)).toFixed(2)}
              </span>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

     

      {showTransactions && (
        <div className="fixed inset-0 z-50 flex items-center mt-15 justify-end  p-4">
          <div className="max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
            
            {/* Header */}
            <div className="relative text-center border-b py-4">
              <h2 className="text-xl font-semibold text-gray-800">Transactions</h2>

              {/* Close button */}
              <button
                onClick={() => setShowTransactions(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto">
              {transactionsLoading ? (
                <p className="p-6 text-center text-sm text-gray-500">
                  Loading transactions...
                </p>
              ) : (transactions?.length ?? 0) === 0 ? (
                <p className="p-6 text-center text-sm text-gray-500">
                  No transaction history available.
                </p>
              ) : (
                <div className="divide-y">
                  {transactions?.reverse()?.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
                    >
                      {/* Left */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-full ${
                            tx.type === "deposit" || tx.type === "profit" || tx.type === "bonus"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-500"
                          }`}
                        >
                          {tx.type === "deposit" || tx.type === "profit" || tx.type === "bonus" ? (
                            <ArrowDownCircle className="w-5 h-5" />
                          ) : (
                            <ArrowUpCircle className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-800 capitalize">
                            {tx.type}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(tx.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold ${
                            tx.type === "deposit" || tx.type === "profit" || tx.type === "bonus"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {tx.type === "deposit" || tx.type === "profit" || tx.type === "bonus" ? "+" : "-"}
                          {currency}
                          {parseFloat(String(tx.amount ?? 0)).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400 uppercase">
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <button onClick={() => window.location.href="/dashboard/transactions"} className="w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 transition">
                View All
              </button>
            </div>
          </div>
        </div>
      )}


     {/* end */}
    </div>
  );
}
