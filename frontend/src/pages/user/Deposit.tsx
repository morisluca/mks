import { useEffect, useState } from "react";
import { useListActiveWallets, getListActiveWalletsQueryKey, useCreateDeposit, useGetPublicSettings } from "@workspace/api-client-react";
import { customFetch } from "@/lib/api-client/custom-fetch";
import { UserLayout } from "@/components/layout/UserLayout";
import { Copy, CheckCircle, ArrowDownCircle, Bitcoin, ArrowLeft, X, ArrowRight } from "lucide-react";
import WalletQR from "@/components/ui/WalletQR";
import { fetchCoinRate } from "@/components/ui/fetchCoinRate";

export default function Deposit() {
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [rate, setRate] = useState(Number);
  const [copied, setCopied] = useState(false);
  const { data: settings } = useGetPublicSettings();
  const { data: wallets, isLoading } = useListActiveWallets({
    query: { queryKey: getListActiveWalletsQueryKey() },
  });

  const depositMutation = useCreateDeposit();

  const copyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [timeLeft, setTimeLeft] = useState(7200);

  const currencies = wallets || [];


  useEffect(() => {
    if (step !== 3) {
      setTimeLeft(7200);
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [step]);

  const selectedMethod = selectedWallet
    ? currencies.find((method) => method?.currency === selectedWallet.currency)
    : null;

    // fetch current coin rate
    const getRate = async (rr:string) => {
      const rate = await fetchCoinRate(rr?.toLowerCase());
      setRate(rate);
    };
    
    const handleWalletSelect = (wallet: any) => {
      const method = currencies.find((item) => item?.currency === wallet.currency);
      getRate(wallet?.currency);
      setSelectedWallet({ ...wallet, method });
      setStep(2);
      setAmount("");
      setTxHash("");
      setReceiptFile(null);
      setError("");
      setSuccess("");
    };

  const handleReceiptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setReceiptFile(file);
  };

  const currentRate = rate ?? 0;
  const formattedCryptoAmount = selectedWallet && amount && currentRate
    ? (parseFloat(amount) / currentRate).toFixed(8)
    : "0.00000000";


  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Enter a valid deposit amount.");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleConfirmDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (receiptFile) {
        const formData = new FormData();
        formData.append("amount", amount);
        formData.append("currency", selectedWallet.currency);
        formData.append("walletId", String(selectedWallet.id));
        if (txHash) {
          formData.append("txHash", txHash);
        }
        formData.append("receipt", receiptFile);

        await customFetch(`${import.meta.env.VITE_API_URL}/api/transactions/deposit-receipt`, {
          method: "POST",
          body: formData,
        });
      } else {
        await depositMutation.mutateAsync({
          data: {
            amount: parseFloat(amount),
            currency: selectedWallet.currency,
            walletId: selectedWallet.id,
            txHash: txHash || undefined,
          },
        });
      }

      setSuccess(`Your deposit of ${settings?.currency}${amount} has been initiated.`);
      setStep(1);
      setSelectedWallet(null);
      setAmount("");
      setTxHash("");
      setReceiptFile(null);
    } catch (err: any) {
      setError(err?.data?.error || err.message || "Deposit failed");
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <UserLayout>
      <div className="mx-auto w-full max-w-3xl space-y-2 px-2 py-4 sm:px-0">
        <div className="">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Choose Payment Method</p>
              <h3 className="mt-3 text-sm font-bold text-foreground">Scroll and select your preferred payment method to deposit funds.</h3>
            </div>
            {/* <button
              onClick={() => {
                setStep(1);
                setSelectedWallet(null);
              }}
              className="rounded-2xl border border-border bg-background p-3 text-muted-foreground hover:bg-secondary"
            >
              <X className="h-5 w-5" />
            </button> */}
          </div>

          {success && (
            <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle className="inline-block h-4 w-4 align-middle" />
              <span className="ml-2">{success}</span>
            </div>
          )}

          {step === 1 && (
            <div className="mt-6 space-y-4">
              {isLoading ? (
                <div className="rounded-3xl border border-border bg-background p-6 text-center text-muted-foreground">Loading payment methods…</div>
              ) : (
                <div className="space-y-4">
                  {wallets?.map((wallet) => {
                    const method = currencies.find((item) => item?.currency === wallet.currency);
                    return (
                      <div key={wallet.id} className="rounded-3xl border border-border bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-3xl ${method || "bg-slate-100"}`}>
                              {method ? (
                                ""
                              ) : (
                                <span className="text-sm font-semibold">{wallet.currency}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-foreground">{method?.currency ?? wallet.currency} <br/> <span className="text-[#45bf58] text-sm"> {method?.network ?? ""}</span></p>
                              {/* <p className="text-sm text-muted-foreground">Network: {method?.network ?? "Crypto Network"}</p> */}
                              {/* <p className="text-sm text-muted-foreground mt-1">Rate: ${rate?.toFixed(6) ?? "0.00"} per unit</p> */}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleWalletSelect(wallet)}
                            className="inline-flex items-center justify-center rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                          >
                            Deposit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {step === 2 && selectedWallet && (
            <div className="mt-6 rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 rounded-3xl border border-border bg-slate-50 px-4 py-2 text-sm text-foreground hover:bg-slate-100"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <div className="text-right text-sm text-muted-foreground">Step 2 of 3</div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                <div className="rounded-3xl border border-border bg-slate-50 p-5">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-3xl ${selectedMethod ?? "bg-slate-100"}`}>
                      {selectedMethod ? (
                        // <selectedMethod.icon className={`h-6 w-6 ${selectedMethod.color}`} />
                        <span className="text-sm font-semibold">{selectedWallet.currency}</span>
                      ) : (
                        <span className="text-sm font-semibold">{selectedWallet.currency}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{selectedMethod?.currency ?? selectedWallet.currency} </p>
                      <p className="text-sm text-muted-foreground">Network: {selectedMethod?.network ?? ""}</p>
                      {rate && <p className="text-sm text-muted-foreground mt-1">Rate: ${rate?.toFixed(6)} per unit</p>}
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-slate-50 p-5">
                  <label className="text-sm font-semibold text-foreground">Amount ({settings?.currency})</label>
                  <div className="mt-3 rounded-3xl border border-border bg-white px-4 py-3">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min={settings?.minDeposit}
                      step="0.01"
                      className="w-full border-none bg-transparent p-0 text-2xl font-semibold text-foreground outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  {rate &&
                    <div className="mt-4 rounded-3xl border border-border bg-orange-50 px-4 py-3 text-sm text-orange-700">
                      <p>You will send</p>
                      <p className="mt-2 text-lg font-semibold">{formattedCryptoAmount} {selectedWallet.currency}</p>
                    </div>
                  }
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-3xl border border-border bg-slate-100 px-6 py-3 text-sm font-semibold text-foreground hover:bg-slate-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && selectedWallet && (
            <div className="mt-6 rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-foreground">Complete Your Deposit</p>
                  <p className="text-sm text-muted-foreground">Confirm the details and send funds to the address below.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-2xl border border-border bg-slate-50 px-3 py-2 text-muted-foreground hover:bg-slate-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 rounded-3xl border border-border bg-orange-50 px-5 py-4 text-orange-700">
                <p className="text-sm">Your deposit of {settings?.currency}{amount} has been initiated.</p>
                {rate && <p className="mt-2 text-base font-semibold">Please send {formattedCryptoAmount} {selectedWallet.currency} to the address below.</p> }
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-3xl hidden border border-border bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-500/10 p-3 text-orange-600">1</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Check coin ticker</p>
                      <p className="text-xs text-muted-foreground">{selectedWallet.currency}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-border bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-500/10 p-3 text-orange-600">2</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Check the total amount</p>
                      <p className="text-xs text-muted-foreground">≈ {settings?.currency}{amount}</p>
                    </div>
                  </div>
                  {rate &&
                  <div className="mt-4 rounded-3xl border border-border bg-white p-4 text-sm text-foreground">
                    <p className="font-semibold">{formattedCryptoAmount} {selectedWallet.currency}</p>
                  </div>
                  }
                </div>
                <div className="rounded-3xl border border-border bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-500/10 p-3 text-orange-600">3</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Send to this wallet address</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3 rounded-3xl border border-border bg-white p-4">
                    <code className="flex-1 break-all text-sm text-foreground font-mono">{selectedWallet.address}</code>
                    <button
                      type="button"
                      onClick={() => copyAddress(selectedWallet.address)}
                      className="rounded-2xl border border-border bg-slate-100 px-4 py-2 text-sm font-semibold text-foreground hover:bg-slate-200"
                    >
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                {rate && 
                  <div className="rounded-3xl border border-border bg-white p-6 text-center shadow-sm">
                    <div className="mx-auto mb-4 h-40 w-40 flex items-center justify-center rounded-3xl border border-border bg-slate-50">
                      <WalletQR address={selectedWallet.address} /> 
                    </div>
                    <p className="text-sm text-muted-foreground">Scan to Pay</p>
                  </div>
                }
                <div className="rounded-3xl border border-border hidden bg-slate-50 p-5 text-center">
                  <p className="text-sm text-muted-foreground hidden">Address valid for:</p>
                  <p className="mt-3 text-3xl font-semibold text-foreground hidden">{formatTime(timeLeft)}</p>
                  {rate && 
                    <div className="mt-4 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      Important: Send exactly {formattedCryptoAmount} {selectedWallet.currency}.
                    </div>
                  }
                </div>
              </div>

              <form onSubmit={handleConfirmDeposit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Deposit Receipt (optional)</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/gif,application/pdf"
                    onChange={handleReceiptChange}
                    className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground"
                  />
                  {receiptFile && (
                    <p className="mt-2 text-sm text-muted-foreground">Selected file: {receiptFile.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Transaction Hash (optional)</label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-foreground font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="0x..."
                  />
                </div>
                {error && (
                  <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-3xl border border-border bg-slate-100 px-6 py-3 text-sm font-semibold text-foreground hover:bg-slate-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={depositMutation.isPending}
                    className="rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                  >
                    Confirm Deposit
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
