import { Activity, ArrowDownCircle, ArrowUpCircle, Bitcoin, LayoutDashboard, Newspaper, Share2, Shield, Signal, TrendingUp, User, Users } from "lucide-react";

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
      { href: "/dashboard/signal", label: "Signal", icon: Signal },
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
    //   { href: "/dashboard/newspaper", label: "News", icon: Newspaper },
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

export default UserNavGroups;


  const depositMethods = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      network: "Bitcoin Network",
      rate: 69331.21,
      color: "text-orange-500",
      bg: "bg-orange-50",
      icon: Bitcoin,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      network: "ERC20 Network",
      rate: 1991.65,
      color: "text-violet-500",
      bg: "bg-violet-50",
      icon: Bitcoin,
    },
    {
      symbol: "TRX",
      name: "Tron",
      network: "Tron Network",
      rate: 0.031709,
      color: "text-rose-500",
      bg: "bg-rose-50",
      icon: Bitcoin,
    },
  ];
