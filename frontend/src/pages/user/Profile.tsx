import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserLayout } from "@/components/layout/UserLayout";
import { useToast } from "@/hooks/use-toast";
import { useGetPublicSettings } from "@/lib/api-client/generated/api";
import { format } from "date-fns";
import WalletQR from "@/components/ui/WalletQR";

export default function Profile() {
  const { user, token } = useAuth();
  const { toast } = useToast();

  const { data: settings } = useGetPublicSettings();


  return (
    <UserLayout>
      <div className="space-y-6  w-full">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account information</p>
        </div>

        {/* Profile card */}
        <div className="bg-card border border-border rounded-xl p-6">

          <div className="mt-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-2xl font-bold">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-foreground">{user?.fullName}</h2>
                  <p className="text-sm text-muted-foreground">@{user?.username}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 mt-1 inline-block">
                    {user?.role}
                  </span>
                </div>
              </div>

              <div className="w-15 h-15">
                  <WalletQR address={user?.fullName + " investor of " + localStorage.getItem("siteName") + ". Email: " + user?.email} />
              </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
              <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">{user?.email}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Username</label>
              <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">{user?.username}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Account Balance</label>
              <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm font-semibold text-accent">
                {settings?.currency} {parseFloat(String(user?.balance ?? 0)).toFixed(2)}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Bonus Balance</label>
              <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm font-semibold text-primary">
                {settings?.currency} {parseFloat(String(user?.bonusBalance ?? 0)).toFixed(2)}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Account Status</label>
              <div className={`rounded-lg px-3 py-2.5 text-sm font-medium inline-flex items-center gap-2 ${user?.status === "active" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                <div className={`w-2 h-2 rounded-full ${user?.status === "active" ? "bg-green-400" : "bg-red-400"}`} />
                {user?.status.charAt(0).toUpperCase()}{user?.status.slice(1)}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Member Since</label>
              <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        {(user?.title || user?.firstName || user?.lastName || user?.dateOfBirth) && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.title && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Title</label>
                  <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">{user.title}</div>
                </div>
              )}
              {user?.firstName && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">First Name</label>
                  <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">{user.firstName}</div>
                </div>
              )}
              {user?.lastName && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Last Name</label>
                  <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">{user.lastName}</div>
                </div>
              )}
              {user?.dateOfBirth && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Date of Birth</label>
                  <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">
                    {format(new Date(user.dateOfBirth), "MMM d, yyyy")}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Financial Information */}
        {(user?.currency || user?.employmentStatus || user?.sourceOfIncome || user?.industry || user?.annualIncome || user?.estimatedNetWorth) && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Financial Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.currency && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Currency</label>
                  <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">{user.currency}</div>
                </div>
              )}
              {user?.employmentStatus && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Employment Status</label>
                  <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">{user.employmentStatus}</div>
                </div>
              )}
              {user?.sourceOfIncome && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Source of Income</label>
                  <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">{user.sourceOfIncome}</div>
                </div>
              )}
              {user?.industry && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Industry</label>
                  <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">{user.industry}</div>
                </div>
              )}
              {user?.annualIncome && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Annual Income</label>
                  <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">{user.annualIncome}</div>
                </div>
              )}
              {user?.estimatedNetWorth && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Estimated Net Worth</label>
                  <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">{user.estimatedNetWorth}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Address Information */}
        {(user?.streetAddress || user?.city || user?.provinceState || user?.postalZipCode || user?.phoneNumber) && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Address Information</h2>
            <div className="space-y-4">
              {user?.streetAddress && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Street Address</label>
                  <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">{user.streetAddress}</div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {user?.city && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">City</label>
                    <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">{user.city}</div>
                  </div>
                )}
                {user?.provinceState && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Province / State</label>
                    <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">{user.provinceState}</div>
                  </div>
                )}
                {user?.postalZipCode && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Postal / Zip Code</label>
                    <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">{user.postalZipCode}</div>
                  </div>
                )}
              </div>
              {user?.phoneNumber && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Phone Number</label>
                  <div className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground">{user.phoneNumber}</div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </UserLayout>
  );
}
