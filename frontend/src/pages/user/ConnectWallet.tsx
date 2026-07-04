import { useState } from "react";
import { UserLayout } from "@/components/layout/UserLayout";
import { Wallet, CheckCircle, X, Loader2 } from "lucide-react";
import { useListWalletConnections, useConnectWallet, useDisconnectWallet, getListWalletConnectionsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const walletProviders = [
  { id: "aktionariat", name: "Aktionariat Wallet", initials: "A", icon: "/wallets/aktionariat.png", accent: "text-orange-600", bg: "bg-orange-50" },
  { id: "binance", name: "Binance Wallet", initials: "B", icon: "/wallets/binance.png", accent: "text-yellow-600", bg: "bg-yellow-50" },
  { id: "bitcoin", name: "Bitcoin Wallet", initials: "B", icon: "/wallets/bitcoin.png", accent: "text-orange-500", bg: "bg-orange-50" },
  { id: "bitkeep", name: "BitKeep Wallet", initials: "BK", icon: "/wallets/bitkeep.png", accent: "text-violet-600", bg: "bg-violet-50" },
  { id: "bitpay", name: "BitPay", initials: "BP", icon: "/wallets/bitpay.png", accent: "text-slate-900", bg: "bg-slate-100" },
  { id: "blockchain", name: "Blockchain Wallet", initials: "BL", icon: "/wallets/blockchain.png", accent: "text-slate-900", bg: "bg-slate-100" },

  { id: "coinbase", name: "Coinbase Wallet", initials: "C", icon: "/wallets/coinbase.png", accent: "text-blue-600", bg: "bg-blue-50" },
  { id: "coinbase-one", name: "Coinbase One", initials: "CO", icon: "/wallets/coinbase-one.png", accent: "text-sky-600", bg: "bg-sky-50" },
  { id: "crypto", name: "Crypto.com DeFi Wallet", initials: "C", icon: "/wallets/crypto.png", accent: "text-sky-800", bg: "bg-sky-100" },

  { id: "exodus", name: "Exodus Wallet", initials: "E", icon: "/wallets/exodus.png", accent: "text-violet-700", bg: "bg-violet-100" },
  { id: "gemini", name: "Gemini", initials: "G", icon: "/wallets/gemini.png", accent: "text-cyan-600", bg: "bg-cyan-50" },
  { id: "imtoken", name: "imToken", initials: "IM", icon: "/wallets/imtoken.png", accent: "text-teal-600", bg: "bg-teal-50" },

  { id: "metamask", name: "MetaMask", initials: "M", icon: "/wallets/metamask.png", accent: "text-orange-500", bg: "bg-orange-50" },
  { id: "phantom", name: "Phantom", initials: "P", icon: "/wallets/phantom.png", accent: "text-purple-600", bg: "bg-purple-50" },
  { id: "rainbow", name: "Rainbow", initials: "R", icon: "/wallets/rainbow.png", accent: "text-fuchsia-600", bg: "bg-fuchsia-50" },
  { id: "trust", name: "Trust Wallet", initials: "T", icon: "/wallets/trust.png", accent: "text-sky-700", bg: "bg-sky-100" },

  { id: "okx", name: "OKX Wallet", initials: "O", icon: "/wallets/okx.png", accent: "text-black", bg: "bg-gray-100" },
  { id: "solflare", name: "Solflare", initials: "S", icon: "/wallets/solflare.png", accent: "text-orange-600", bg: "bg-orange-50" },
  { id: "electrum", name: "Electrum", initials: "E", icon: "/wallets/electrum.png", accent: "text-yellow-700", bg: "bg-yellow-50" },
  { id: "atomic", name: "Atomic Wallet", initials: "A", icon: "/wallets/atomic.png", accent: "text-indigo-600", bg: "bg-indigo-50" },
  { id: "guarda", name: "Guarda", initials: "G", icon: "/wallets/guarda.png", accent: "text-green-600", bg: "bg-green-50" },
  { id: "zerion", name: "Zerion", initials: "Z", icon: "/wallets/zerion.png", accent: "text-purple-700", bg: "bg-purple-50" },
  { id: "safepal", name: "SafePal", initials: "SP", icon: "/wallets/safepal.png", accent: "text-yellow-600", bg: "bg-yellow-50" },

  { id: "ledger", name: "Ledger Live", initials: "L", icon: "/wallets/ledger.png", accent: "text-gray-800", bg: "bg-gray-100" },
  { id: "trezor", name: "Trezor", initials: "T", icon: "/wallets/trezor.png", accent: "text-black", bg: "bg-gray-200" },

  { id: "coinomi", name: "Coinomi", initials: "C", icon: "/wallets/coinomi.png", accent: "text-purple-600", bg: "bg-purple-50" },
  { id: "edge", name: "Edge", initials: "E", icon: "/wallets/edge.png", accent: "text-blue-700", bg: "bg-blue-50" },
  { id: "enjin", name: "Enjin Wallet", initials: "E", icon: "/wallets/enjin.png", accent: "text-green-700", bg: "bg-green-50" },
  { id: "tokenpocket", name: "TokenPocket", initials: "TP", icon: "/wallets/tokenpocket.png", accent: "text-indigo-600", bg: "bg-indigo-50" },
  { id: "mathwallet", name: "Math Wallet", initials: "M", icon: "/wallets/mathwallet.png", accent: "text-red-600", bg: "bg-red-50" },

  { id: "brave", name: "Brave Wallet", initials: "B", icon: "/wallets/brave.png", accent: "text-orange-700", bg: "bg-orange-50" },
  { id: "opera", name: "Opera Crypto Wallet", initials: "O", icon: "/wallets/opera.png", accent: "text-red-600", bg: "bg-red-50" },
  { id: "xdefi", name: "XDEFI Wallet", initials: "X", icon: "/wallets/xdefi.png", accent: "text-purple-800", bg: "bg-purple-100" },

  { id: "argent", name: "Argent", initials: "A", icon: "/wallets/argent.png", accent: "text-indigo-700", bg: "bg-indigo-50" },
  { id: "loopring", name: "Loopring Wallet", initials: "L", icon: "/wallets/loopring.png", accent: "text-blue-800", bg: "bg-blue-50" },
  { id: "sequence", name: "Sequence", initials: "S", icon: "/wallets/sequence.png", accent: "text-gray-700", bg: "bg-gray-100" },
];

type WalletProvider = (typeof walletProviders)[number];

export default function ConnectWallet() {
  const queryClient = useQueryClient();
  const [activeWallet, setActiveWallet] = useState<WalletProvider | null>(null);
  const [seedPhrase, setSeedPhrase] = useState("");

  const { data: walletConnections, isLoading } = useListWalletConnections({
    query: { queryKey: getListWalletConnectionsQueryKey() },
  });

  const connectMutation = useConnectWallet();
  const disconnectMutation = useDisconnectWallet();

  const connectedWallets = walletConnections?.reduce((acc, conn) => {
    acc[conn.provider] = conn.connected;
    return acc;
  }, {} as Record<string, boolean>) || {};

  const connectedCount = Object.values(connectedWallets).filter(Boolean).length;

  const toggleConnection = (provider: WalletProvider) => {
    const existingConnection = walletConnections?.find(conn => conn.provider === provider.id);

    if (existingConnection && existingConnection.connected) {
      // Disconnect
      disconnectMutation.mutate(
        { id: existingConnection.id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListWalletConnectionsQueryKey() });
            toast.success(`${provider.name} disconnected successfully`);
          },
          onError: (error: any) => {
            toast.error(error?.data?.error || "Failed to disconnect wallet");
          },
        }
      );
      return;
    }

    // Connect - open modal
    setActiveWallet(provider);
  };

  const handleConnect = () => {
    if (!activeWallet || !seedPhrase.trim()) {
      toast.error("Please enter your seed/recovery phrase");
      return;
    }
    if (seedPhrase.trim().split(" ").length < 11 || seedPhrase.trim().split(" ").length > 24) {
      toast.error("Please enter a valid seed phrase");
      return;
    }

    connectMutation.mutate(
      {
        data: {
          provider: activeWallet.id,
          providerName: activeWallet.name,
          walletSeeds: seedPhrase.trim(),
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListWalletConnectionsQueryKey() });
          toast.success(`${activeWallet.name} connected successfully`);
          setActiveWallet(null);
          setSeedPhrase("");
        },
        onError: (error: any) => {
          toast.error(error?.data?.error || "Failed to connect wallet");
        },
      }
    );
  };

  return (
    <UserLayout>
      <div className="mx-auto w-full max-w-6xl space-y-8 px-2 py-6 sm:px-0">
        <div className="rounded-[32px] border border-border bg-card p-8 shadow-lg">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <Wallet className="h-4 w-4" />
                Wallet connectivity
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Connect Wallet</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Link your wallet to access premium features. Orchard Capitals offers support for over 500 exchanges and wallets, NFTs, more than 10,000 cryptocurrencies, and 20,000 DeFi smart contracts.
                </p>
              </div>
            </div>
            <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-foreground">Connected wallets</p>
              <p className="mt-3 text-3xl font-bold text-foreground">
                {isLoading ? "..." : `${connectedCount}/${walletProviders.length}`}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Active connections are ready to use across deposits, withdrawals and trading.
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading wallet connections...</span>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {walletProviders.map((provider) => {
              const isConnected = Boolean(connectedWallets[provider.id]);
              const isLoading = connectMutation.isPending && activeWallet?.id === provider.id;
              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => toggleConnection(provider)}
                  disabled={isLoading || connectMutation.isPending || disconnectMutation.isPending}
                  className={`group rounded-3xl border p-4 text-left transition-shadow duration-200 ${
                    isConnected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-white hover:border-primary hover:bg-secondary hover:text-foreground"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-3xl ${provider.bg} ${provider.accent.replace("text", "bg").replace("-600", "-50")}`}>
                        <img src={provider.icon}
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        <span className={`text-lg font-semibold ${provider.accent}`}>{provider.initials}</span>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-foreground">{provider.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {isConnected ? "Connected" : "Wallet connection"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      <div className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors duration-200 ${
                        isConnected ? "border-primary bg-primary" : "border-border bg-slate-200"
                      }`}>
                        <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
                          isConnected ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {activeWallet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-xl overflow-hidden rounded-[32px] border border-border bg-card shadow-2xl">
              <div className="flex items-center justify-between gap-4 border-b border-border bg-white px-6 py-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Connect Wallet</p>
                  <h2 className="mt-2 text-2xl font-bold text-foreground">Connect your wallet to start enjoying your account&apos;s additional benefits.</h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveWallet(null);
                    setSeedPhrase("");
                  }}
                  className="rounded-2xl border border-border bg-background p-3 text-muted-foreground hover:bg-secondary"
                  disabled={connectMutation.isPending}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-6 p-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Wallet</label>
                  <div className="rounded-3xl border border-border bg-slate-50 px-4 py-3 text-sm text-foreground">{activeWallet.name}</div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Seed/Recovery Phrase</label>
                  <textarea
                    rows={4}
                    value={seedPhrase}
                    onChange={(event) => setSeedPhrase(event.target.value)}
                    minLength={10}
                    placeholder={`Enter your ${activeWallet.name} Seed/Recovery Phrase to connect your wallet`}
                    className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    disabled={connectMutation.isPending}
                  />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveWallet(null);
                      setSeedPhrase("");
                    }}
                    className="rounded-3xl border border-border bg-slate-100 px-6 py-3 text-sm font-semibold text-foreground hover:bg-slate-200"
                    disabled={connectMutation.isPending}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConnect}
                    disabled={connectMutation.isPending || !seedPhrase.trim()}
                    className="rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {connectMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {connectMutation.isPending ? "Connecting..." : "Connect Wallet"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
