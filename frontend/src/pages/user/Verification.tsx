import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { UserLayout } from "@/components/layout/UserLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Clock, XCircle, Upload, ImagePlus, User, DollarSign, MapPin, FileText, Shield, ArrowRight, Lock, LockIcon } from "lucide-react";
import ThemeToggle from "../public/components/ThemeToggle";

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

interface VerificationFormData {
  // Personal Info
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  
  // Financial Info
  currency: string;
  employmentStatus: string;
  sourceOfIncome: string;
  industry: string;
  annualIncome: string;
  estimatedNetWorth: string;
  
  // Address Info
  streetAddress: string;
  city: string;
  provinceState: string;
  postalZipCode: string;
  phoneNumber: string;
  
  // Documents
  idDocument: File | null;
  selfie: File | null;
}

const defaultFormData: VerificationFormData = {
  title: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  currency: "USD",
  employmentStatus: "",
  sourceOfIncome: "",
  industry: "",
  annualIncome: "",
  estimatedNetWorth: "",
  streetAddress: "",
  city: "",
  provinceState: "",
  postalZipCode: "",
  phoneNumber: "",
  idDocument: null,
  selfie: null,
};

export default function VerificationPage() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [verification, setVerification] = useState<VerificationResponse["data"] | null>(null);
  const [verificationState, setVerificationState] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewSelfie, setPreviewSelfie] = useState<string | null>(null);
  const [dash, setDash] = useState(false);
  
  const [form, setForm] = useState<VerificationFormData>(defaultFormData);
  
  const idInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  if(user?.phoneNumber || user?.firstName){
    window.location.href="/dashboard/verificationretry";
    return;
  }

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
          if(data?.status === "not_submitted"){
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleFileChange = (file: File | null, type: "idDocument" | "selfie") => {
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

    setForm(prev => ({ ...prev, [type]: file }));
    setError("");

    if (type === "idDocument" && file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewId(reader.result as string);
      reader.readAsDataURL(file);
    } else if (type === "idDocument") {
      setPreviewId(null);
    }

    if (type === "selfie" && file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewSelfie(reader.result as string);
      reader.readAsDataURL(file);
    } else if (type === "selfie") {
      setPreviewSelfie(null);
    }
  };

  const validateStep = (currentStep: number): boolean => {
    setError("");
    
    if (currentStep === 1) {
      if (!form.title.trim()) { setError("Please select a title"); return false; }
      if (!form.firstName.trim()) { setError("First name is required"); return false; }
      if (!form.lastName.trim()) { setError("Last name is required"); return false; }
      if (!form.dateOfBirth) { setError("Date of birth is required"); return false; }
      return true;
    }
    
    if (currentStep === 2) {
      if (!form.currency) { setError("Currency is required"); return false; }
      if (!form.employmentStatus) { setError("Employment status is required"); return false; }
      if (!form.sourceOfIncome) { setError("Source of income is required"); return false; }
      if (!form.industry) { setError("Industry is required"); return false; }
      if (!form.annualIncome) { setError("Annual income is required"); return false; }
      if (!form.estimatedNetWorth) { setError("Estimated net worth is required"); return false; }
      return true;
    }
    
    if (currentStep === 3) {
      if (!form.streetAddress.trim()) { setError("Street address is required"); return false; }
      if (!form.city.trim()) { setError("City is required"); return false; }
      if (!form.provinceState.trim()) { setError("Province/State is required"); return false; }
      if (!form.postalZipCode.trim()) { setError("Postal code is required"); return false; }
      if (!form.phoneNumber.trim()) { setError("Phone number is required"); return false; }
      return true;
    }
    
    if (currentStep === 4) {
      // Document upload is optional
      return true;
    }
    
    return true;
  };
  

  const handleContinue = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(4)) {
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

      
      if(!dash) {
        setSubmitting(true);
      } 

      const formData = new FormData();
      
      // Add personal info
      formData.append("title", form.title);
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("dateOfBirth", form.dateOfBirth);
      
      // Add financial info
      formData.append("currency", form.currency);
      formData.append("employmentStatus", form.employmentStatus);
      formData.append("sourceOfIncome", form.sourceOfIncome);
      formData.append("industry", form.industry);
      formData.append("annualIncome", form.annualIncome);
      formData.append("estimatedNetWorth", form.estimatedNetWorth);
      
      // Add address info
      formData.append("streetAddress", form.streetAddress);
      formData.append("city", form.city);
      formData.append("provinceState", form.provinceState);
      formData.append("postalZipCode", form.postalZipCode);
      formData.append("phoneNumber", form.phoneNumber);
      formData.append("dash", "dash");

      
      // Add documents
      if(!dash){
        if (form.idDocument) {
          formData.append("idDocument", form.idDocument);
        }
        if (form.selfie) {
          formData.append("selfie", form.selfie);
        }
      }

      setDash(false);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verification`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      
      const data = await response.json();
      
      if (response.ok) {
      toast({
        title: "Verification submitted successfully",
        description: "Verification submitted successfully",
        variant: "default",
      });

        if(data?.userInfo?.dashing){
          window.location.href="/dashboard";
          // setLocation("/dashboard");
          return;
        }
        setVerification(data);
        setForm(defaultFormData);
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


  // Show status if already verified
  if (verification && (verification.status === "pending" || verification.status === "rejected" || verification.status === "approved")) {
    return (
      <UserLayout>
        <div className="space-y-6 px-4 py-8 w-full">
          <h1 className="text-3xl font-bold text-foreground">IDENTITY VERIFICATION</h1>
          
          {verification.status === "pending" && (
            <div className="rounded-2xl border border-yellow-200/50 bg-gradient-to-br from-yellow-50 to-amber-50 p-6">
              <div className="flex gap-4">
                <Clock className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-yellow-900 mb-2">Verification Pending</h2>
                  <p className="text-sm text-yellow-800 mb-4">Your documents are being reviewed. This typically takes 24-48 hours.</p>
                   
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

          {verification.status === "approved" && (
            <div className="rounded-2xl border border-green-200/50 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
              <div className="gap-4">
              <div className="flex gap-4 items-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-semibold text-green-900 mb-2">Verification Approved</h2>
                    <p className="text-sm text-green-800">Congratulations! Your identity has been successfully verified.</p>
                  </div>
                </div>
                
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
          )}

        {/* Rejected Verification Status */}
        {verification && verification.status === "rejected" && (
          <div className="rounded-2xl border border-red-200/50 bg-gradient-to-br from-red-50 to-rose-50 p-6 shadow-sm">
            <div className="flex gap-4">
              <div className="flex-shrink-0 pt-1">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-red-900 mb-1">Verification Needs Correction</h2>
                <p className="text-sm text-red-800 mb-4">
                  Your verification submission couldn't be approved. Please review the details below and resubmit with corrected documents.
                </p>
                <div className="bg-white/60 rounded-lg p-4 mb-4 border border-red-100/50">
                  <p className="text-xs uppercase tracking-wider font-semibold text-gray-600 mb-2">Reason</p>
                  <p className="text-sm text-gray-800">{verification.rejectionReason}</p>
                </div>
                {verification.adminNotes && (
                  <div className="bg-white/60 rounded-lg p-4 mb-4 border border-red-100/50">
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-600 mb-2">Additional Information</p>
                    <p className="text-sm text-gray-800">{verification.adminNotes}</p>
                  </div>
                )}
                <div className="flex justify-end mt-4 pt-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  <Link to="/dashboard/verificationretry" className="text-sm text-yellow-500 hover:text-green-500 hover:px-3">Resubmit Documents</Link>
                </div>
              </div>
            </div>
          </div>
        )}


        </div>
      </UserLayout>
    );
  }

  return (
    <>

    {/* <UserLayout> */}
    <div className="flex items-center justify-center min-h-screen from-gray-900 to-gray-800"> 
      <div className="space-y-6 px-2 py-8 max-w-3xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground  flex items-center justify-center gap-2"><Shield /> IDENTITY VERIFICATION</h1>
          <div className="flex items-center justify-end">
            <ThemeToggle/>
          </div>
          <p className="text-muted-foreground mt-2">Step {step} of 4</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                s < step ? 'bg-primary text-white' : s === step ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {s < step ? '✓' : s}
              </div>
              {s < 4 && <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            {step === 1 && (
              <>
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your basic personal details</CardDescription>
                  </div>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle>Financial Information</CardTitle>
                    <CardDescription>Your financial details and preferences</CardDescription>
                  </div>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle>Address Information</CardTitle>
                    <CardDescription>Your residential address</CardDescription>
                  </div>
                </div>
              </>
            )}
            {step === 4 && (
              <>
                <div className="flex items-center gap-3 ">
                  <FileText className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle className="text-lg font-semibold">Thanks for completing the verification process!. Now submit and continue to your dashboard</CardTitle>
                    {/* <CardDescription>we will review your documents and get back to you soon.</CardDescription> */}
                  </div>
                </div>
              </>
            )}
          </CardHeader>

          <CardContent>
            {error && (
              <div className="bg-destructive/50 border border-destructive/20 rounded-lg px-4 py-3 mb-6 text-sm text-destructive-foreground">
                {error}
              </div>
            )}

            <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleContinue(); }}
                  className="space-y-4">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                    <select
                      name="title"
                      value={user?.title ? user?.title : form.title}
                      onChange={handleInputChange}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select title</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Dr.">Dr.</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      min="3"
                      value={form.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </>
              )}

              {/* Step 2: Financial Information */}
              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Currency *</label>
                    <select
                      name="currency"
                      value={user?.currency ? user?.currency : form.currency}
                      onChange={handleInputChange}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Employment Status *</label>
                    <select
                      name="employmentStatus"
                      value={form.employmentStatus}
                      onChange={handleInputChange}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select status</option>
                      <option value="Employed">Employed</option>
                      <option value="Self-employed">Self-employed</option>
                      <option value="Unemployed">Unemployed</option>
                      <option value="Retired">Retired</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Source of Income *</label>
                    <select
                      name="sourceOfIncome"
                      value={form.sourceOfIncome}
                      onChange={handleInputChange}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                    <option value="">Select source</option>
                    <option value="Employment">Employment</option>
                    <option value="Investments">Investments</option>
                    <option value="Business">Business</option>
                    <option value="Savings">Savings</option>
                    <option value="Inheritance">Inheritance</option>

                    <option value="Freelancing">Freelancing</option>
                    <option value="Side Hustle">Side Hustle</option>
                    <option value="Gifts">Gifts</option>
                    <option value="Pension">Pension</option>
                    <option value="Rental Income">Rental Income</option>
                    <option value="Dividends">Dividends</option>
                    <option value="Interest Income">Interest Income</option>
                    <option value="Royalties">Royalties</option>
                    <option value="Government Benefits">Government Benefits</option>
                    <option value="Scholarships">Scholarships</option>
                    <option value="Grants">Grants</option>
                    <option value="Crowdfunding">Crowdfunding</option>
                    <option value="Sale of Assets">Sale of Assets</option>
                    <option value="Crypto Earnings">Crypto Earnings</option>
                    <option value="Farming/Agriculture">Farming/Agriculture</option>
                    <option value="Trading">Trading</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Industry *</label>
                    <select
                      name="industry"
                      value={form.industry}
                      onChange={handleInputChange}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>

                    <option value="Education">Education</option>
                    <option value="Construction">Construction</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Energy">Energy</option>
                    <option value="Oil and Gas">Oil and Gas</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Telecommunications">Telecommunications</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Tourism">Tourism</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Media">Media</option>
                    <option value="Advertising and Marketing">Advertising and Marketing</option>
                    <option value="Legal Services">Legal Services</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Nonprofit">Nonprofit</option>
                    <option value="Government">Government</option>
                    <option value="Aviation">Aviation</option>
                    <option value="Pharmaceuticals">Pharmaceuticals</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Mining">Mining</option>
                    <option value="Food and Beverage">Food and Beverage</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Annual Income (USD) *</label>
                    <select
                      name="annualIncome"
                      value={form.annualIncome}
                      onChange={handleInputChange}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select range</option>
                      <option value="<$50,000">Less than $50,000</option>
                      <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                      <option value="$100,000 - $250,000">$100,000 - $250,000</option>
                      <option value="$250,000 - $500,000">$250,000 - $500,000</option>
                      <option value="$500,000 - $1M">$500,000 - $1M</option>
                      <option value=">$1M">Greater than $1M</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Estimated Net Worth (USD) *</label>
                    <select
                      name="estimatedNetWorth"
                      value={form.estimatedNetWorth}
                      onChange={handleInputChange}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select range</option>
                      <option value="<$100,000">Less than $100,000</option>
                      <option value="$100,000 - $500,000">$100,000 - $500,000</option>
                      <option value="$500,000 - $1M">$500,000 - $1M</option>
                      <option value="$1M - $5M">$1M - $5M</option>
                      <option value="$5M - $10M">$5M - $10M</option>
                      <option value=">$10M">Greater than $10M</option>
                    </select>
                  </div>
                </>
              )}

              {/* Step 3: Address Information */}
              {step === 3 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={form.streetAddress}
                      onChange={handleInputChange}
                      placeholder="123 Main St"
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Province / State *</label>
                    <input
                      type="text"
                      name="provinceState"
                      value={form.provinceState}
                      onChange={handleInputChange}
                      placeholder="NY"
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Postal / Zip Code *</label>
                    <input
                      type="text"
                      name="postalZipCode"
                      value={form.postalZipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      min="9"
                      value={form.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </>
              )}

              {/* Step 4: Documents */}
              {step === 4 && (
                <>
                  {/* Identity Document */}
                  <div hidden>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                      Select Type of Identity Documents <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
                    </label>
                    <select
                      name="idDocumentType"
                      onChange={handleInputChange}
                      className="w-full mb-3 bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select Document Type</option>
                      <option value="passport">Passport</option>
                      <option value="driverLicense">Driver's License</option>
                      <option value="nationalId">National ID</option>
                      <option value="residencePermit">Residence Permit</option>
                      <option value="GOVERNMENT">OR ANY VALID GOVERNMENT ID</option>
                      
                    </select>

                    <span className="block text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                      Front of ID.
                    </span>

                    {previewId ? (
                      <div className="relative rounded-lg border border-border bg-muted/50 p-4 mb-3">
                        {form.idDocument?.type.startsWith("image/") ? (
                          <img src={previewId} alt="ID Preview" className="max-h-64 mx-auto rounded-lg object-contain" />
                        ) : (
                          <div className="py-8 text-center">
                            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <p className="text-sm font-medium text-foreground">{form.idDocument?.name}</p>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleFileChange(null, "idDocument")}
                          className="absolute top-3 right-3 rounded-full bg-destructive text-white p-2 hover:bg-destructive/90"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => idInputRef.current?.click()}
                        className="w-full rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 px-4 py-8 text-center hover:border-muted-foreground/50 hover:bg-muted/70"
                      >
                        <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground/60" />
                        <div className="font-medium text-foreground">Click to upload or drag and drop</div>
                        <div className="text-xs text-muted-foreground mt-1">JPEG, PNG, GIF, or PDF</div>
                      </button>
                    )}
                    <input
                      ref={idInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,application/pdf"
                      onChange={(e) => handleFileChange(e.target.files?.[0] || null, "idDocument")}
                      className="hidden"
                    />
                  </div>

                  {/* Selfie */}
                  <div hidden>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                      Back of ID <span className="text-muted-foreground text-xs font-normal"></span>
                    </label>
                    <span className="text-xs text-muted-foreground block mb-3">
                      A clear photo of the back of your ID. This improves verification success rate.
                    </span>

                    {previewSelfie ? (
                      <div className="relative rounded-lg border border-border bg-muted/50 p-4 mb-3">
                        <img src={previewSelfie} alt="Selfie Preview" className="max-h-64 mx-auto rounded-lg object-contain" />
                        <button
                          type="button"
                          onClick={() => handleFileChange(null, "selfie")}
                          className="absolute top-3 right-3 rounded-full bg-destructive text-white p-2 hover:bg-destructive/90"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => selfieInputRef.current?.click()}
                        className="w-full rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 px-4 py-8 text-center hover:border-muted-foreground/50 hover:bg-muted/70"
                      >
                        <ImagePlus className="mx-auto mb-3 h-10 w-10 text-muted-foreground/60" />
                        <div className="font-medium text-foreground">Click to upload or drag and drop</div>
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
                  </div>

                  <Alert className="border-blue-200/50 bg-blue-50/50 hidden">
                    <LockIcon className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm text-blue-900">
                      <h4 className="font-medium">Privacy & Security</h4>
                        Your documents are encrypted and used only for regulatory KYC compliance. We never share them with third parties.
                    </AlertDescription>
                  </Alert>
                </>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className={step > 1 ? "flex-1" : "w-full"}
                >
                  {submitting ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      {step === 4 ? "Submitting..." : "Processing..."}
                    </>
                  ) : (
                    step === 4 ? "Submit for Verification" : "Continue"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
     </div> 
    {/* </UserLayout> */}
    
      </>
  );
}
