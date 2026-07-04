import { useState } from "react";
import {
  useAdminListWallets, getAdminListWalletsQueryKey,
  useCreateWallet, useUpdateWallet, useDeleteWallet,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Plus, Edit, Trash2, X, Copy, CheckCircle } from "lucide-react";

const currencies = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "USDT", name: "USDT" },
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "BNB", name: "Binance Coin" },
  { symbol: "LTC", name: "Litecoin" },
  { symbol: "XRP", name: "Ripple" },
  { symbol: "ADA", name: "Cardano" },
  { symbol: "USDT", name: "Tether" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "DOGE", name: "Dogecoin" },
  { symbol: "DOT", name: "Polkadot" },
  { symbol: "MATIC", name: "Polygon" },
  { symbol: "TRX", name: "Tron" },
  { symbol: "AVAX", name: "Avalanche" },
  { symbol: "DAI", name: "Dai" },
  { symbol: "ATOM", name: "Cosmos" },
  { symbol: "XLM", name: "Stellar" },
  { symbol: "FTM", name: "Fantom" },
  { symbol: "NEAR", name: "NEAR Protocol" },
  { symbol: "ALGO", name: "Algorand" },
  { symbol: "ICP", name: "Internet Computer" },
  { symbol: "ARB", name: "Arbitrum" },
  { symbol: "OP", name: "Optimism" },
  { symbol: "APT", name: "Aptos" },
  { symbol: "SUI", name: "Sui" },
  { symbol: "Bank", name: "Bank Transfer" }
];

interface WalletForm {
  id?: number;
  currency: string;
  address: string;
  network: string;
  isActive: boolean;
}

const empty: WalletForm = { currency: "BTC", address: "", network: "", isActive: true };

export default function Wallets() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<WalletForm | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const { data: wallets, isLoading } = useAdminListWallets({
    query: { queryKey: getAdminListWalletsQueryKey() },
  });

  const createMutation = useCreateWallet();
  const updateMutation = useUpdateWallet();
  const deleteMutation = useDeleteWallet();

  const openNew = () => { setModal(empty); setError(""); };
  const openEdit = (w: any) => {
    setModal({ id: w.id, currency: w.currency, address: w.address, network: w.network || "", isActive: w.isActive });
    setError("");
  };

  const copyAddress = async (id: number, address: string) => {
    await navigator.clipboard.writeText(address);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;
    setError("");
    const { id, ...fields } = modal;
    try {
      if (id) {
        await updateMutation.mutateAsync({ id, data: fields });
      } else {
        await createMutation.mutateAsync({ data: fields });
      }
      queryClient.invalidateQueries({ queryKey: getAdminListWalletsQueryKey() });
      setModal(null);
    } catch (err: any) {
      setError(err?.data?.error || err.message || "Save failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this wallet?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getAdminListWalletsQueryKey() });
    } catch (err: any) {
      alert(err?.data?.error || "Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Deposit Wallets</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage crypto wallet addresses for deposits</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            Add Wallet
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {wallets?.map((wallet) => (
              <div key={wallet.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-primary">{wallet.currency}</span>
                    </div>
                    {wallet.network && <p className="text-xs text-muted-foreground">{wallet.network} Network</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${wallet.isActive ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"}`}>
                      {wallet.isActive ? "Active" : "Inactive"}
                    </span>
                    <button onClick={() => openEdit(wallet)} className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(wallet.id)} className="p-1.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="bg-secondary rounded-lg p-3 flex items-center gap-3">
                  <code className="flex-1 text-xs font-mono text-foreground break-all">{wallet.address}</code>
                  <button onClick={() => copyAddress(wallet.id, wallet.address)} className="flex-shrink-0 p-1.5 hover:bg-border rounded">
                    {copied === wallet.id ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">{modal.id ? "Edit Wallet" : "Add Wallet"}</h2>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 mb-4 text-sm text-destructive-foreground">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Currency</label>
                  <select value={modal.currency} onChange={(e) => setModal({ ...modal, currency: e.target.value })}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>select coin</option>
                    {currencies.map((c) => <option key={c?.symbol} value={c?.name}>{c?.name + (c?.symbol ? ` (${c?.symbol})` : '')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Network</label>
                  <input value={modal.network} onChange={(e) => setModal({ ...modal, network: e.target.value })}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g. ERC-20" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">Wallet Address</label>
                  <input value={modal.address} onChange={(e) => setModal({ ...modal, address: e.target.value })}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="0x..." required />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={modal.isActive} onChange={(e) => setModal({ ...modal, isActive: e.target.checked })} className="rounded" />
                    <span className="text-sm text-foreground">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)}
                  className="flex-1 border border-border rounded-lg py-2 text-sm hover:bg-secondary transition-colors">Cancel</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                  {modal.id ? "Save Changes" : "Add Wallet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
