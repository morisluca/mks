import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  ArrowLeftRight,
  Wallet,
  Settings,
  LogOut,
  Menu,
  Bitcoin,
  ShieldCheck,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/pages/public/components/ThemeToggle";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/plans", label: "Investment Plans", icon: TrendingUp },
  { href: "/admin/investments", label: "Investments", icon: TrendingUp },
  { href: "/admin/deposts", label: "Deposts", icon: ArrowLeftRight },
  { href: "/admin/withdrawal", label: "Withdrawal", icon: ArrowLeftRight },
  { href: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/admin/wallets", label: "Deposit Wallets", icon: Wallet },
  { href: "/admin/wallet-connections", label: "Wallet Connections", icon: Wallet },
  { href: "/admin/verifications", label: "Verifications", icon: Shield },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
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
            <Bitcoin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-sm text-foreground capitalize">{localStorage.getItem('siteName')}</span>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-accent" />
              <span className="text-xs text-accent font-medium">Admin Panel</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = location === href || (href !== "/admin" && location.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="px-3 py-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary mb-2">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-accent text-xs font-bold">
                {user?.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.fullName}</p>
              <p className="text-xs text-accent">Administrator</p>
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
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border px-4 py-3 flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-semibold text-foreground">Administration</h1>
          <div className="flex-1" />
          <ThemeToggle />
          <span className="text-xs text-muted-foreground">{user?.email}</span>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
