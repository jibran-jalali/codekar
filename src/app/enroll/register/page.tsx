"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  CheckCircle2, 
  ArrowLeft, 
  Loader2, 
  Phone, 
  Instagram, 
  CreditCard, 
  Building2,
  User,
  Hash,
  Fingerprint,
  Users,
  Copy,
  Sparkles,
  Calendar,
  ArrowRight,
  Send,
  Mail
} from "lucide-react";
import Link from "next/link";
import { enrollUser, getCohortById, validatePromoCode } from "../actions";
import { toast } from "sonner";

interface Cohort {
  id: string;
  name: string;
  dates: string;
  time: string;
  original_price: number;
  sale_price: number | null;
  sale_tag: string | null;
  total_spots: number;
  spots_taken: number;
  description: string;
  delivery_type: string;
}

function RegisterContent() {
  const searchParams = useSearchParams();
  const cohortId = searchParams.get("cohort");
  
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showInstructions, setShowInstructions] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
    profession: "",
    joining_type: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    async function loadCohort() {
      if (cohortId) {
        const result = await getCohortById(cohortId);
        if (result.data) {
          setCohort(result.data);
          if (result.data.delivery_type && result.data.delivery_type !== "both") {
            setFormData(prev => ({ ...prev, joining_type: result.data.delivery_type }));
          }
        }
      }
    }
    loadCohort();
  }, [cohortId]);

  useEffect(() => {
    const { name, age, phone, email, profession, joining_type } = formData;
    const isValid = name.trim() !== "" && 
                   age.trim() !== "" && 
                   phone.trim() !== "" && 
                   email.trim() !== "" && 
                   profession.trim() !== "" &&
                   joining_type.trim() !== "";
    setFormValid(isValid);
  }, [formData]);

  const originalPrice = cohort?.original_price ?? 3500;
  const salePrice = cohort?.sale_price ?? originalPrice;
  const currentPrice = discountApplied ? Math.max(0, salePrice - discountAmount) : salePrice;
  const isFreeWorkshop = currentPrice <= 0;

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    
    const result = await validatePromoCode(promoCode);
    if (result.success && result.data) {
      setDiscountAmount(result.data.discount_amount);
      setDiscountApplied(true);
      toast.success(`Promo code applied! PKR ${result.data.discount_amount.toLocaleString()} off!`);
    } else {
      toast.error(result.error || "Invalid promo code");
      setDiscountApplied(false);
      setDiscountAmount(0);
    }
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
      } else {
        throw new Error("Clipboard API not available");
      }
    } catch {
      // Fallback for environments where clipboard API is blocked
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success(`${label} copied!`);
      } catch {
        toast.error(`Could not copy ${label}. Please select and copy manually.`);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 1 && formValid) {
      if (isFreeWorkshop) {
        await handleSubmitPayment();
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitPayment = async () => {
    setLoading(true);
    
    try {
      const result = await enrollUser({
        name: formData.name,
        age: parseInt(formData.age) || 0,
        phone: formData.phone,
        email: formData.email,
        profession: formData.profession,
        joining_type: formData.joining_type,
        promo_code: discountApplied ? promoCode.toUpperCase() : null,
        price_paid: currentPrice,
        cohort_id: cohortId || undefined,
        cohort_name: cohort?.name,
        cohort_dates: cohort?.dates,
        cohort_time: cohort?.time,
      });

      if (result.success) {
        setSubmitted(true);
        toast.success(isFreeWorkshop ? "Registration confirmed! Check your email." : "Payment confirmation submitted! Check your email.");
      } else {
        toast.error(result.error || "Failed to submit enrollment");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isFull = cohort ? cohort.spots_taken >= cohort.total_spots : false;

  if (submitted) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-lg w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-14 h-14 text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">{isFreeWorkshop ? "You're In!" : "You're Almost In!"}</h1>
          <div className="space-y-4 text-white/60">
            <p className="text-lg">
              We&apos;ve received your registration for <span className="text-white font-bold">{cohort?.name}</span>.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-white font-bold text-sm">Confirmation Email Sent</p>
                  <p className="text-xs">Check your inbox at <span className="text-white">{formData.email}</span></p>
                </div>
              </div>
              {isFreeWorkshop ? (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-white font-bold text-sm">Spot Confirmed</p>
                    <p className="text-xs">No payment is required for this free workshop.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-white font-bold text-sm">Send Payment Screenshot</p>
                    <p className="text-xs">WhatsApp your bank transfer screenshot to confirm your spot.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 space-y-3">
            {!isFreeWorkshop && (
              <a 
                href="https://wa.me/923390053713" 
                target="_blank"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-bold rounded-2xl transition-all w-full"
              >
                <Phone className="w-5 h-5" />
                Send Screenshot on WhatsApp
              </a>
            )}
            <Button asChild variant="outline" className="border-white/10 hover:bg-white/5 text-white px-8 py-4 text-lg font-bold rounded-2xl w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (cohort && isFull) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-white">Sold Out</h1>
          <p className="text-white/60 text-lg">
            Sorry, all spots for <span className="text-white font-bold">{cohort.name}</span> have been filled. Please check our other available cohorts.
          </p>
          <div className="pt-8">
            <Button asChild className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg font-bold rounded-2xl">
              <Link href="/enroll">View Other Cohorts</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white py-8 px-4 md:py-16">
      <div className="container max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1 text-xs font-medium text-white/60 mb-2">
            <Sparkles className="w-3 h-3 text-yellow-500" />
            <span>Registration Portal</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            {currentStep === 1 ? "Your Details" : "Complete Payment"}
          </h1>
          <p className="text-white/40 text-sm md:text-base max-w-md mx-auto">
            {currentStep === 1 
              ? isFreeWorkshop ? "Fill in your information to confirm your free registration." : "Fill in your information to proceed to payment." 
              : "Transfer the amount and confirm your payment."}
          </p>
        </div>

        {/* Step Indicator */}
        {!isFreeWorkshop && (
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {[1, 2].map((step) => (
              <div key={step} className="space-y-2">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${currentStep >= step ? 'bg-white' : 'bg-white/10'}`}></div>
                <p className={`text-[10px] uppercase tracking-widest text-center font-bold ${currentStep >= step ? 'text-white' : 'text-white/20'}`}>
                  {step === 1 ? "Details" : "Payment"}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Cohort Summary */}
        <Card className="bg-white/5 border-white/10 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <p className="font-bold text-sm">{cohort?.name || "Workshop"}</p>
                <p className="text-white/40 text-xs flex items-center gap-2">
                  {cohort?.dates} <span className="text-white/20">•</span> {cohort?.time}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">{isFreeWorkshop ? "Free" : `PKR ${currentPrice.toLocaleString()}`}</p>
              {discountApplied && (
                <p className="text-green-500 text-[10px] font-bold">PROMO APPLIED</p>
              )}
            </div>
          </div>
          </Card>
  
          {/* Instructions Step */}
          {showInstructions ? (
            <Card className="bg-[#111] border-white/5 p-6 md:p-8 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">Registration Steps</h2>
                  <p className="text-white/40 text-sm">Please follow these steps to secure your spot:</p>
                </div>
                
                <div className="space-y-4">
                  {(isFreeWorkshop
                    ? [
                        "Fill out the registration form",
                        "Submit your free registration",
                        "Check your email for confirmation"
                      ]
                    : [
                        "Fill out the registration form",
                        "Send payment to the provided account",
                        "Send the payment screenshot to the given phone number"
                      ]).map((step, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-sm font-medium pt-1.5">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={() => setShowInstructions(false)}
                    className="w-full bg-white hover:bg-gray-100 text-black h-14 rounded-xl text-lg font-bold transition-all shadow-xl active:scale-[0.98]"
                  >
                    OK, Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <>
              {/* Step 1: Form */}
              {currentStep === 1 && (

          <Card className="bg-[#111] border-white/5 p-6 md:p-8 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-right-4 duration-300">
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-white/40">Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Jibran Jalali"
                  required
                  className="bg-[#1a1a1a] border-white/5 h-12 rounded-xl text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-xs font-bold uppercase tracking-widest text-white/40">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="22"
                    required
                    className="bg-[#1a1a1a] border-white/5 h-12 rounded-xl text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-white/40">WhatsApp</Label>
                  <Input
                    id="phone"
                    placeholder="0339..."
                    required
                    type="tel"
                    className="bg-[#1a1a1a] border-white/5 h-12 rounded-xl text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-white/40">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="bg-[#1a1a1a] border-white/5 h-12 rounded-xl text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profession" className="text-xs font-bold uppercase tracking-widest text-white/40">Current Profession</Label>
                <Input
                  id="profession"
                  placeholder="e.g. Student / Designer"
                  required
                  className="bg-[#1a1a1a] border-white/5 h-12 rounded-xl text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Joining Method</Label>
                {cohort?.delivery_type === "both" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, joining_type: "online" })}
                      className={`h-12 rounded-xl border text-sm font-bold transition-all ${
                        formData.joining_type === "online"
                          ? "bg-white text-black border-white shadow-lg shadow-white/10 scale-[1.02]"
                          : "bg-[#1a1a1a] text-white/40 border-white/5 hover:border-white/20"
                      }`}
                    >
                      Online
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, joining_type: "inperson" })}
                      className={`h-12 rounded-xl border text-sm font-bold transition-all ${
                        formData.joining_type === "inperson"
                          ? "bg-white text-black border-white shadow-lg shadow-white/10 scale-[1.02]"
                          : "bg-[#1a1a1a] text-white/40 border-white/5 hover:border-white/20"
                      }`}
                    >
                      In-person
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#1a1a1a] border border-white/5 h-12 rounded-xl text-white flex items-center px-4 text-sm font-bold capitalize">
                    {cohort?.delivery_type || "Online"}
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button 
                  type="submit"
                  className="w-full bg-white hover:bg-gray-100 text-black h-14 rounded-xl text-lg font-bold transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!formValid || loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <>
                      {isFreeWorkshop ? "Complete Free Registration" : "Continue to Payment"}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Step 2: Payment */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Price & Promo */}
            <Card className="bg-[#111] border-white/5 p-6 md:p-8 rounded-2xl shadow-2xl">
              <div className="space-y-6">
                <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111] p-6 rounded-2xl text-center space-y-2 border border-white/5">
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Amount to Pay</p>
                  <div className="flex items-center justify-center gap-3">
                    {cohort?.sale_price && cohort.sale_price < cohort.original_price && !discountApplied && (
                      <p className="text-lg text-white/20 line-through font-bold">PKR {cohort.original_price.toLocaleString()}</p>
                    )}
                    <p className="text-4xl md:text-5xl font-bold tracking-tight">PKR {currentPrice.toLocaleString()}</p>
                  </div>
                  
                  {cohort?.sale_tag && !discountApplied && (
                    <div className="mt-3 inline-block bg-yellow-500 text-black px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                      {cohort.sale_tag}
                    </div>
                  )}
                  
                  {discountApplied && (
                    <div className="mt-3 inline-block bg-green-500 text-black px-3 py-1 rounded-full text-[10px] font-bold tracking-widest">
                      PROMO APPLIED - SAVED PKR {discountAmount.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Have a Promo Code?</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="ENTER CODE"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="bg-[#1a1a1a] border-white/5 h-11 rounded-xl text-white placeholder:text-white/20 text-xs font-bold tracking-widest uppercase focus:border-white/20"
                    />
                    <Button 
                      type="button" 
                      onClick={handleApplyPromo}
                      variant="outline"
                      className="border-white/10 hover:bg-white/5 text-white text-[10px] font-bold uppercase h-11 px-4 rounded-xl"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Bank Details */}
            <Card className="bg-[#111] border-white/5 p-6 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <CreditCard className="w-32 h-32 rotate-12" />
              </div>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white/60" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">Bank Transfer Details</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-4 p-4 bg-[#1a1a1a] rounded-xl border border-white/5">
                    <div className="mt-0.5 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1 font-bold">Bank Name</p>
                      <p className="text-sm font-bold leading-snug">Meezan Bank - Sharah-e-Faisal</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-[#1a1a1a] rounded-xl border border-white/5">
                    <div className="mt-0.5 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <User className="w-4 h-4 text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1 font-bold">Account Title</p>
                      <p className="text-sm font-bold uppercase">Jibran Jalali</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleCopy("01110110259540", "Account Number")}
                    className="flex gap-4 p-4 bg-[#1a1a1a] rounded-xl border border-white/5 cursor-pointer transition-all hover:bg-white/[0.04] active:scale-[0.98] group"
                  >
                    <div className="mt-0.5 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <Hash className="w-4 h-4 text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1 font-bold">Account Number</p>
                      <p className="text-sm font-bold font-mono tracking-wider">01110110259540</p>
                    </div>
                    <div className="mt-2 text-white/20 group-hover:text-white/60 transition-colors">
                      <Copy className="w-4 h-4" />
                    </div>
                  </div>

                  <div 
                    onClick={() => handleCopy("PK75MEZN0001110110259540", "IBAN")}
                    className="flex gap-4 p-4 bg-[#1a1a1a] rounded-xl border border-white/5 cursor-pointer transition-all hover:bg-white/[0.04] active:scale-[0.98] group"
                  >
                    <div className="mt-0.5 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <Fingerprint className="w-4 h-4 text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1 font-bold">IBAN</p>
                      <p className="text-sm font-bold font-mono break-all leading-tight">PK75MEZN0001110110259540</p>
                    </div>
                    <div className="mt-2 text-white/20 group-hover:text-white/60 transition-colors">
                      <Copy className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                  <p className="text-[11px] text-yellow-500/80 text-center leading-relaxed">
                    <span className="font-bold uppercase">Important:</span> After transferring, click the button below to confirm. We&apos;ll send you an email with next steps.
                  </p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleSubmitPayment}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-14 rounded-xl text-lg font-bold transition-all shadow-xl active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    I Have Paid - Confirm Registration
                  </>
                )}
              </Button>
              
              <button 
                onClick={handleBackStep}
                className="w-full flex items-center justify-center gap-2 text-white/40 hover:text-white transition-all text-sm font-bold py-3"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Details
              </button>
            </div>
            </div>
          )}
        </>
      )}

      {/* Support */}

        <div className="pt-4 border-t border-white/5">
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest text-center mb-4">Need Help?</p>
          <div className="flex items-center justify-center gap-6">
            <a href="https://wa.me/923390053713" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
              +92 339 0053713
            </a>
            <a href="https://instagram.com/codekar_" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
              <Instagram className="w-4 h-4" />
              @codekar_
            </a>
          </div>
        </div>
        
        <div className="flex justify-center pt-4">
          <Link href="/enroll" className="flex items-center gap-2 text-white/20 hover:text-white transition-all text-xs font-bold uppercase tracking-widest group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Back to Workshops
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </main>
    }>
      <RegisterContent />
    </Suspense>
  );
}
