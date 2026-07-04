import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Clock, XCircle, Download } from "lucide-react";

interface Verification {
  id: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  status: "pending" | "approved" | "rejected";
  idDocumentUrl: string;
  selfieUrl?: string;
  adminNotes?: string;
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
}

interface VerificationDetail extends Verification {
  reviewedBy?: string;
}

const statusStyles: Record<Verification["status"], string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  approved: "bg-green-500/10 text-green-500",
  rejected: "bg-red-500/10 text-red-500",
};

function StatusPill({ status }: { status: Verification["status"] }) {
  return (
    <span className={"inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-semibold " + statusStyles[status]}>
      {status}
    </span>
  );
}

export default function AdminVerificationsPage() {
  const { user, token } = useAuth();
  const { toast } = useToast();

  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<VerificationDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const statusChoices = ["all", "pending", "approved", "rejected"] as const;

  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [deletingDocType, setDeletingDocType] = useState<"idDocument" | "selfie" | null>(null);

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/verifications`, {
          headers: { "Authorization": "Bearer " + token },
        });

        if (response.ok) {
          const data = await response.json();
          setVerifications(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch verifications:", error);
        toast({
          title: "Error",
          description: "Failed to load verifications",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === "admin" && token) {
      fetchVerifications();
    }
  }, [user, token, toast]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }

    const fetchDetail = async () => {
      try {
        setDetailLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/verifications/` + selectedId, {
          headers: { "Authorization": "Bearer " + token },
        });

        if (response.ok) {
          const data = await response.json();
          setDetail(data);
          setAdminNotes(data?.adminNotes || "");
          setRejectionReason(data?.rejectionReason || "");
        }
      } catch (error) {
        console.error("Failed to fetch verification detail:", error);
        toast({
          title: "Error",
          description: "Failed to load verification details",
          variant: "destructive",
        });
      } finally {
        setDetailLoading(false);
      }
    };

    if (token) {
      fetchDetail();
    }
  }, [selectedId, token, toast]);

  const handleApprove = async () => {
    if (!selectedId) return;

    try {
      setApprovingId(selectedId);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/verifications/` + selectedId + "/approve", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminNotes }),
      });

      if (response.ok) {
        setVerifications((prev) =>
          prev.map((v) => (v.id === selectedId ? { ...v, status: "approved" as const } : v))
        );
        setDetail(null);
        setSelectedId(null);
        setShowApproveForm(false);
        setAdminNotes("");
        toast({
          title: "Approved",
          description: "Verification has been approved",
        });
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.message || "Failed to approve verification",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve verification",
        variant: "destructive",
      });
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedId || !rejectionReason.trim()) {
      toast({
        title: "Required field",
        description: "Rejection reason is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setRejectingId(selectedId);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/verifications/` + selectedId + "/reject", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rejectionReason }),
      });

      if (response.ok) {
        setVerifications((prev) =>
          prev.map((v) => (v.id === selectedId ? { ...v, status: "rejected" as const } : v))
        );
        setDetail(null);
        setSelectedId(null);
        setShowRejectForm(false);
        setRejectionReason("");
        toast({
          title: "Rejected",
          description: "Verification has been rejected",
        });
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.message || "Failed to reject verification",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject verification",
        variant: "destructive",
      });
    } finally {
      setRejectingId(null);
    }
  };

  const handleDeleteDocument = async (docType: "idDocument" | "selfie") => {
    if (!selectedId) return;

    try {
      setDeletingDocType(docType);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/verifications/` + selectedId + "/documents/" + docType, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDetail(data);
        setVerifications((prev) =>
          prev.map((v) => (v.id === selectedId ? { ...v, status: data.status } : v))
        );
        toast({
          title: "Deleted",
          description: (docType === "idDocument" ? "ID document" : "Selfie") + " has been deleted from server storage.",
        });
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to delete document",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    } finally {
      setDeletingDocType(null);
    }
  };

  const filteredVerifications = verifications.filter((v) => {
    if (statusFilter !== "all" && v.status !== statusFilter) return false;
    const query = searchQuery.toLowerCase();
    return v.userFullName.toLowerCase().includes(query) || v.userEmail.toLowerCase().includes(query);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Identity Verifications</h1>
          <p className="text-sm text-muted-foreground mt-1">Review pending user verification submissions and update their status.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_1.3fr]">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-4 border-b border-border flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Submissions</h2>
                <p className="text-sm text-muted-foreground">Search, filter, and select a request</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto] items-center">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email"
                  className="h-10 min-w-[220px]"
                />
                <div className="flex flex-wrap gap-2">
                  {statusChoices.map((status) => {
                    const buttonClass =
                      statusFilter === status
                        ? "rounded-full px-3 py-1.5 text-xs font-semibold transition bg-primary text-primary-foreground"
                        : "rounded-full px-3 py-1.5 text-xs font-semibold transition bg-secondary text-muted-foreground hover:bg-secondary/80";

                    return (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={buttonClass}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredVerifications.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-sm text-muted-foreground">
                        No verifications found
                      </td>
                    </tr>
                  ) : (
                    filteredVerifications.map((verification) => (
                      <tr
                        key={verification.id}
                        onClick={() => setSelectedId(verification.id)}
                        className={
                          selectedId === verification.id
                            ? "cursor-pointer transition-colors bg-primary/5"
                            : "cursor-pointer transition-colors hover:bg-secondary/50"
                        }
                      >
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-foreground">{verification.userFullName}</div>
                          <div className="text-xs text-muted-foreground">{verification.userEmail}</div>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {new Date(verification.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 capitalize">
                          <StatusPill status={verification.status} />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedId(selectedId === verification.id ? null : verification.id);
                            }}
                          >
                            {selectedId === verification.id ? "Close" : "View"}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            {selectedId && detail ? (
              <Card className="border border-border rounded-xl">
                <CardHeader className="px-4 py-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Verification Details</CardTitle>
                    <StatusPill status={detail.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 px-4 py-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-2">User</p>
                    <p className="font-medium text-foreground">{detail.userFullName}</p>
                    <p className="text-sm text-muted-foreground">{detail.userEmail}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-border bg-secondary/10 p-4">
                      <p className="text-sm font-semibold text-foreground">Storage advisory</p>
                      <p className="text-sm text-muted-foreground text-red-500 mt-2">
                        After the verification decision is final, delete uploaded documents to free storage and reduce retained sensitive data. Keep files only as long as required for audit or compliance.
                      </p>
                    </div>

                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Documents</p>
                    <div className="space-y-4">
                      {/* Document Previews */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* ID Document Preview */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">ID Document</p>
                          <div className="border border-border rounded-lg p-2 bg-muted/20">
                            {detail.idDocumentUrl ? (
                              detail.idDocumentUrl.toLowerCase().endsWith('.pdf') ? (
                                <div className="flex items-center justify-center h-24 bg-muted/50 rounded text-xs text-muted-foreground">
                                  PDF Document
                                </div>
                              ) : (
                                <img
                                  src={`${import.meta.env.VITE_API_URL}/api/verification-documents/${detail.idDocumentUrl}`}
                                  alt="ID Document"
                                  className="w-full h-24 object-cover rounded border border-border"
                                  onError={(e) => {
                                    const img = e.currentTarget as HTMLImageElement;
                                    img.style.display = 'none';
                                    (img.nextElementSibling as HTMLElement).style.display = 'flex';
                                  }}
                                />
                              )
                            ) : (
                              <div className="flex items-center justify-center h-24 bg-muted/50 rounded text-xs text-muted-foreground">
                                ID document deleted
                              </div>
                            )}
                            <div className="flex items-center justify-center h-24 bg-muted/50 rounded text-xs text-muted-foreground" style={{ display: 'none' }}>
                              Preview not available
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            {detail.idDocumentUrl && (
                              <a
                                href={`${import.meta.env.VITE_API_URL}/api/verification-documents/${detail.idDocumentUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                              >
                                <Download className="w-4 h-4" />
                                Download ID Document
                              </a>
                            )}
                            <Button
                              className="dark:bg-white-50"
                              size="sm"
                              onClick={() => handleDeleteDocument("idDocument")}
                              disabled={!detail.idDocumentUrl || deletingDocType === "idDocument"}
                            >
                              {deletingDocType === "idDocument" ? "Deleting..." : "Delete"}
                            </Button>
                          </div>
                        </div>

                        {/* Selfie Preview */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Selfie</p>
                          <div className="border border-border rounded-lg p-2 bg-muted/20">
                            {detail.selfieUrl ? (
                              detail.selfieUrl.toLowerCase().endsWith('.pdf') ? (
                                <div className="flex items-center justify-center h-24 bg-muted/50 rounded text-xs text-muted-foreground">
                                  PDF Document
                                </div>
                              ) : (
                                <img
                                  src={`${import.meta.env.VITE_API_URL}/api/verification-documents/${detail.selfieUrl}`}
                                  alt="Selfie"
                                  className="w-full h-24 object-cover rounded border border-border"
                                  onError={(e) => {
                                    const img = e.currentTarget as HTMLImageElement;
                                    img.style.display = 'none';
                                    (img.nextElementSibling as HTMLElement).style.display = 'flex';
                                  }}
                                />
                              )
                            ) : (
                              <div className="flex items-center justify-center h-24 bg-muted/50 rounded text-xs text-muted-foreground">
                                Selfie deleted
                              </div>
                            )}
                            <div className="flex items-center justify-center h-24 bg-muted/50 rounded text-xs text-muted-foreground" style={{ display: 'none' }}>
                              Preview not available
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            {detail.selfieUrl && (
                              <a
                                href={`${import.meta.env.VITE_API_URL}/api/verification-documents/${detail.selfieUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                              >
                                <Download className="w-4 h-4" />
                                Download Selfie
                              </a>
                            )}
                            <Button
                              className="dark:bg-white-50"
                              size="sm"
                              onClick={() => handleDeleteDocument("selfie")}
                              disabled={!detail.selfieUrl || deletingDocType === "selfie"}
                            >
                              {deletingDocType === "selfie" ? "Deleting..." : "Delete"}
                            </Button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {detail.rejectionReason && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <p className="text-sm font-medium">Rejection Reason</p>
                        <p className="text-sm text-muted-foreground mt-1">{detail.rejectionReason}</p>
                      </AlertDescription>
                    </Alert>
                  )}

                  {detail.status === "pending" && (
                    <div className="space-y-3">
                      {!showApproveForm && !showRejectForm ? (
                        <div className="grid gap-3">
                          <Button
                            onClick={() => setShowApproveForm(true)}
                            className="w-full bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => setShowRejectForm(true)}
                            variant="outline"
                            className="w-full"
                            size="sm"
                          >
                            Reject
                          </Button>
                        </div>
                      ) : showApproveForm ? (
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium block mb-2">Admin Notes (optional)</label>
                            <Textarea
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Add notes about the verification..."
                              className="h-24 text-xs"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={handleApprove}
                              disabled={approvingId === selectedId}
                              className="flex-1 bg-green-600 hover:bg-green-700 h-10"
                              size="sm"
                            >
                              {approvingId === selectedId ? "Approving..." : "Confirm Approval"}
                            </Button>
                            <Button
                              onClick={() => {
                                setShowApproveForm(false);
                                setAdminNotes("");
                              }}
                              variant="outline"
                              className="flex-1 h-10"
                              size="sm"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium block mb-2">
                              Rejection Reason <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="Explain why this verification was rejected..."
                              className="h-24 text-xs"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={handleReject}
                              disabled={rejectingId === selectedId || !rejectionReason.trim()}
                              className="flex-1 bg-red-600 hover:bg-red-700 h-10"
                              size="sm"
                            >
                              {rejectingId === selectedId ? "Rejecting..." : "Confirm Rejection"}
                            </Button>
                            <Button
                              onClick={() => {
                                setShowRejectForm(false);
                                setRejectionReason("");
                              }}
                              variant="outline"
                              className="flex-1 h-10"
                              size="sm"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : selectedId && detailLoading ? (
              <Card className="border border-border rounded-xl flex items-center justify-center h-96">
                <Spinner className="w-6 h-6" />
              </Card>
            ) : (
              <Card className="border border-border rounded-xl">
                <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
                  <p>Select a verification to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
