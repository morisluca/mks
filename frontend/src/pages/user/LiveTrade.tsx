import { Link } from "wouter";
import { ArrowRight, CreditCard, Globe2, ShieldCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetPublicSettings } from "@/lib/api-client/generated/api";
import { UserLayout } from "@/components/layout/UserLayout";

export default function LiveTrade() {
  const { data: settings } = useGetPublicSettings();
  const email = settings?.siteEmail || "support@captrustmarketsync.com";

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto rounded-[2rem] border border-oc-text/10 bg-white/80 p-8 shadow-xl shadow-oc-text/5 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-oc-accent font-semibold">Live Trading Access</p>
              <h1 className="mt-3 text-3xl md:text-4xl font-semibold text-oc-text">Access Restricted</h1>
            </div>
            {/* <Badge className="bg-oc-accent/10 text-oc-accent border-oc-accent/20">Pending Activation</Badge> */}
          </div>

          <div className="rounded-3xl border border-oc-accent/20 bg-oc-accent/5 p-6 mb-8">
            <p className="text-oc-text/90 leading-7">
              Unfortunately, you don’t currently have access to live trading sessions due to a few restrictions.
              Once these conditions are met, live trading access will be automatically enabled.
              If you’re still experiencing difficulties, please contact customer service for further assistance.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3 mb-8">
            <div className="rounded-3xl border border-oc-text/10 bg-oc-background p-6 shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-oc-accent/10 text-oc-accent mb-4">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-oc-text mb-2">Account balance requirement</h2>
              <p className="text-sm text-oc-muted leading-6">
                Your current funding level does not meet the minimum threshold required for live trading access.
              </p>
            </div>

            <div className="rounded-3xl border border-oc-text/10 bg-oc-background p-6 shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-oc-accent/10 text-oc-accent mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-oc-text mb-2">KYC verification</h2>
              <p className="text-sm text-oc-muted leading-6">
                Full identity verification is required for regulatory compliance before live trading can be enabled.
              </p>
            </div>

            <div className="rounded-3xl border border-oc-text/10 bg-oc-background p-6 shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-oc-accent/10 text-oc-accent mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-oc-text mb-2">Regional restrictions</h2>
              <p className="text-sm text-oc-muted leading-6">
                Live trading features are not supported in some regions due to brokerage and regulatory limitations.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            <div className="rounded-3xl border border-oc-text/10 bg-oc-background p-6">
              <h3 className="text-xl font-semibold text-oc-text mb-4">What to do next</h3>
              <ul className="space-y-4 text-sm text-oc-muted">
                <li className="flex gap-3">
                  <span className="font-semibold text-oc-text">1.</span>
                  Deposit funds to meet the minimum live trading threshold.
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-oc-text">2.</span>
                  Complete your KYC verification with valid identity documents.
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-oc-text">3.</span>
                  Confirm your region is supported for live trading access.
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-oc-text/10 bg-oc-background p-6">
              <h3 className="text-xl font-semibold text-oc-text mb-4">Need help?</h3>
              <p className="text-sm text-oc-muted leading-7 mb-6">
                Our support team can help you verify your account status, deposit requirements, and regional eligibility.
              </p>
              <div className="flex flex-col gap-3">
                {/* <Button asChild>
                  <Link href="/dashboard/deposit">Fund Account</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/verification">Complete KYC</Link>
                </Button> */}
                <Button variant="ghost" asChild>
                  <a href={`mailto:${email}`}>Contact Support</a>
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-oc-text/10 bg-oc-accent/5 p-6">
            <div className="flex items-start gap-4">
              <MessageSquare className="w-5 h-5 text-oc-accent mt-1" />
              <div>
                <p className="font-semibold text-oc-text">Still experiencing difficulties?</p>
                <p className="text-sm text-oc-muted leading-7">
                  If you meet the requirements but access is still unavailable, contact customer service for further assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
