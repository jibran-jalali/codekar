"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const COUNTRY_CODES = [
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+86", country: "China", flag: "🇨🇳" },
];

interface StudentLeadFormProps {
  onClose?: () => void;
}

export function StudentLeadForm({ onClose }: StudentLeadFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+92",
    phone: "",
    city: "",
    country: "Pakistan",
    consent: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      setError("Please enter a valid phone number");
      return;
    }
    if (!formData.city.trim()) {
      setError("Please enter your city");
      return;
    }
    if (!formData.country.trim()) {
      setError("Please enter your country");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: `${formData.countryCode} ${formData.phone}`,
          city: formData.city,
          country: formData.country,
          consent: formData.consent,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-white">Thank You!</h3>
        <p className="text-white/60 text-sm max-w-sm mx-auto">
          We've received your information. Our team will reach out to you soon with exciting updates about CodeKar programs!
        </p>
        {onClose && (
          <Button onClick={onClose} variant="outline" className="mt-4 border-white/20 text-white hover:bg-white/10">
            Close
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label className="text-white/80 text-sm">Full Name *</Label>
        <Input
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="bg-white/5 border-white/10 h-11 text-white placeholder:text-white/30"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white/80 text-sm">Email Address *</Label>
        <Input
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-white/5 border-white/10 h-11 text-white placeholder:text-white/30"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white/80 text-sm">Phone Number *</Label>
        <div className="flex gap-2">
          <select
            value={formData.countryCode}
            onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
            className="bg-white/5 border border-white/10 rounded-md h-11 px-3 text-white text-sm w-28 focus:outline-none focus:ring-1 focus:ring-white/30"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code} className="bg-black">
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <Input
            type="tel"
            placeholder="3001234567"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
            className="bg-white/5 border-white/10 h-11 text-white placeholder:text-white/30 flex-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-white/80 text-sm">City *</Label>
          <Input
            placeholder="e.g. Karachi"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="bg-white/5 border-white/10 h-11 text-white placeholder:text-white/30"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-white/80 text-sm">Country *</Label>
          <Input
            placeholder="e.g. Pakistan"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="bg-white/5 border-white/10 h-11 text-white placeholder:text-white/30"
          />
        </div>
      </div>

      <div className="flex items-start gap-3 pt-2">
        <Checkbox
          id="consent"
          checked={formData.consent}
          onCheckedChange={(checked) => setFormData({ ...formData, consent: checked === true })}
          className="mt-0.5 border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
        />
        <Label htmlFor="consent" className="text-white/50 text-xs leading-relaxed cursor-pointer">
          I agree to be contacted about CodeKar programs and updates.
        </Label>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-black hover:bg-gray-100 h-12 font-bold text-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Get Started"
        )}
      </Button>
    </form>
  );
}
