import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { UserLayout } from "@/components/layout/UserLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Clock, XCircle, Upload, ImagePlus } from "lucide-react";

interface VerificationResponse {
  success: boolean;
  data?: {
    id: string;
    status: "pending" | "approved" | "rejected";
    idDocumentUrl: string;
    selfieUrl?: string;
    adminNotes?: string;
    rejectionReason?: string;
    createdAt: string;
    reviewedAt?: string;
  };
  message?: string;
}

export default function VerificationRetryPage() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verification, setVerification] = useState<VerificationResponse["data"] | null>(null);
  const [verificationState, setVerificationState] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  
  const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewSelfie, setPreviewSelfie] = useState<string | null>(null);
  
  const idInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  // Fetch verification status on mount
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        setStatusLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verification`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          setVerification(data || null);
          if(data?.status === "not_submitted" || data?.status === "rejected"){
            setVerificationState(true);
          }
        }

      } catch (error) {
        console.error("Failed to fetch verification status:", error);
      } finally {
        setStatusLoading(false);
      }
    };

    if (user && token) {
      fetchVerificationStatus();
    }
  }, [user, token]);


  const handleFileChange = (file: File | null, type: "id" | "selfie") => {
    const validMimes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    
    if (file && !validMimes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only JPEG, PNG, GIF, and PDF files are allowed",
        variant: "destructive",
      });
      return;
    }

    if (file && file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }

    if (type === "id") {
      setIdDocumentFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewId(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreviewId(null);
      }
    } else {
      setSelfieFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewSelfie(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreviewSelfie(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idDocumentFile) {
      toast({
        title: "Missing required file",
        description: "Please upload an identity document",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!token) {
        toast({
          title: "Authentication error",
          description: "Please sign in again before submitting verification.",
          variant: "destructive",
        });
        return;
      }

      setSubmitting(true);
      const formData = new FormData();
      formData.append("idDocument", idDocumentFile);
      if (selfieFile) {
        formData.append("selfie", selfieFile);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verification`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setVerification(data);
        setIdDocumentFile(null);
        setSelfieFile(null);
        setPreviewId(null);
        setPreviewSelfie(null);
        
        toast({
          title: "Thank you",
          description: "Your verification request was submitted successfully.",
        });
      } else {
        toast({
          title: "Submission failed",
          description: data.message || "Failed to submit verification",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit verification",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "approved":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  return (
    <UserLayout>
      <div className="space-y-6 px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div>
            <h1 className="text-3xl text-center font-bold text-foreground">IDENTITY VERIFICATION </h1>
            <p className="text-base text-center text-muted-foreground mt-2">
              Complete your identity verification to unlock all platform features.
            </p>

          </div>
        </div>

        {/* Pending Verification Status */}
        {verification && verification.status === "pending" && (
          <div className="rounded-2xl border border-yellow-200/50 bg-gradient-to-br from-yellow-50 to-amber-50 p-6 shadow-sm">
            <div className="flex gap-4">
              <div className="flex-shrink-0 pt-1">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-yellow-900 mb-1">Verification Pending Review</h2>
                <p className="text-sm text-yellow-800 mb-4">
                  We've received your documents and they're being reviewed by our team. This typically takes 24-48 hours.
                </p>
                <div className="bg-white/60 rounded-lg p-4 mb-4 border border-yellow-100/50">
                  <p className="text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">Submitted</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(verification.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {verification.adminNotes && (
                  <div className="bg-white/60 rounded-lg p-4 border border-yellow-100/50">
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-600 mb-2">Notes</p>
                    <p className="text-sm text-gray-800">{verification.adminNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Approved Verification Status */}
        {verification && verification.status === "approved" && (
          <div className="rounded-2xl border border-green-200/50 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-sm">
            <div className="flex gap-4">
              <div className="flex-shrink-0 pt-1">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-green-900 mb-1">Verification Approved</h2>
                <p className="text-sm text-green-800 mb-4">
                  Congratulations! Your identity has been successfully verified. You now have full access to all platform features.
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bg-white/60 rounded-lg p-4 border border-green-100/50">
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">Verified on</p>
                    <p className="text-sm font-medium text-gray-900">
                      {verification.reviewedAt
                        ? new Date(verification.reviewedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  {verification.adminNotes && (
                    <div className="bg-white/60 rounded-lg p-4 border border-green-100/50">
                      <p className="text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">Notes</p>
                      <p className="text-sm text-gray-800">{verification.adminNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {verificationState && (
          <Card className="border border-border rounded-xl overflow-hidden shadow-sm">
            <CardHeader className="px-6 py-6 border-b border-border bg-gradient-to-r from-background to-muted/20">
              <CardTitle className="text-xl mb-1">Submit Your Documents</CardTitle>
              <CardDescription>
                Upload your identity document and optional selfie to complete verification
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Identity Document Upload */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                      Select Type of Identity Documents <span className="text-destructive">*</span>
                    </label>
                    <select
                      required
                      name="idDocumentType"
                      className="w-full mb-3 bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select Document Type</option>
                      <option value="passport">Passport</option>
                      <option value="driverLicense">Driver's License</option>
                      <option value="nationalId">National ID</option>
                      <option value="residencePermit">Residence Permit</option>
                      <option value="GOVERNMENT">OR ANY VALID GOVERNMENT ID</option>
                      
                    </select>


                  <label className="block">
                    <span className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-2">
                       Back of ID
                      <span className="text-destructive text-lg leading-none">*</span>
                    </span>

                    {previewId ? (
                      <div className="relative rounded-xl border border-border bg-muted/50 p-4 mb-3">
                        {idDocumentFile?.type.startsWith("image/") ? (
                          <img
                            src={previewId}
                            alt="ID Document Preview"
                            className="max-h-64 mx-auto rounded-lg object-contain"
                          />
                        ) : (
                          <div className="py-8 text-center">
                            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <p className="text-sm font-medium text-foreground">{idDocumentFile?.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {(idDocumentFile?.size || 0) / 1024 / 1024 > 0 && 
                                `${((idDocumentFile?.size || 0) / 1024 / 1024).toFixed(2)} MB`
                              }
                            </p>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleFileChange(null, "id")}
                          className="absolute top-3 right-3 rounded-full bg-destructive/80 text-white p-2 hover:bg-destructive transition-colors"
                          title="Remove file"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => idInputRef.current?.click()}
                        className="w-full rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/50 px-4 py-12 text-center transition-colors hover:border-muted-foreground/50 hover:bg-muted/70 active:bg-muted"
                      >
                        <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground/60" />
                        <div className="font-semibold text-foreground">Click to upload or drag and drop</div>
                        <div className="text-xs text-muted-foreground mt-1">JPEG, PNG, GIF, or PDF</div>
                      </button>
                    )}
                    <input
                      ref={idInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,application/pdf"
                      onChange={(e) => handleFileChange(e.target.files?.[0] || null, "id")}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Selfie Upload */}
                {/* Selfie Upload */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-2">
                       Front of ID
                      <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
                    </span>
                    <span hidden className="text-xs text-muted-foreground block mb-3">
                      A clear photo of yourself holding your ID. This improves verification success rate.
                    </span>

                    {previewSelfie ? (
                      <div className="relative rounded-xl border border-border bg-muted/50 p-4 mb-3">
                        <img
                          src={previewSelfie}
                          alt="Selfie Preview"
                          className="max-h-64 mx-auto rounded-lg object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => handleFileChange(null, "selfie")}
                          className="absolute top-3 right-3 rounded-full bg-destructive/80 text-white p-2 hover:bg-destructive transition-colors"
                          title="Remove file"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => selfieInputRef.current?.click()}
                        className="w-full rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/50 px-4 py-12 text-center transition-colors hover:border-muted-foreground/50 hover:bg-muted/70 active:bg-muted"
                      >
                        <ImagePlus className="mx-auto mb-3 h-10 w-10 text-muted-foreground/60" />
                        <div className="font-semibold text-foreground">Click to upload or drag and drop</div>
                        <div className="text-xs text-muted-foreground mt-1">JPEG or PNG</div>
                      </button>
                    )}
                    <input
                      ref={selfieInputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) => handleFileChange(e.target.files?.[0] || null, "selfie")}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Info Alert */}
                <Alert className="border-blue-200/50 bg-blue-50/50">
                  <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <AlertDescription className="text-sm text-blue-900 ml-2">
                    Your documents are encrypted and will be reviewed within 24-48 hours. You'll receive an email when the process is complete.
                  </AlertDescription>
                </Alert>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={submitting || !idDocumentFile} 
                  className="w-full h-11 text-base font-semibold"
                >
                  {submitting ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Submitting Your Documents...
                    </>
                  ) : (
                    "Submit for Verification"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </UserLayout>
  );
}
