"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Users, ArrowLeft, X, Bell, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { DEFAULT_ENROLLMENT_GUARANTEE_TEXT } from "@/lib/site-copy";
import { getActiveCohorts, getEnrollmentGuaranteeText, joinWaitlist } from "./actions";

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
  is_active: boolean;
  delivery_type: string;
}

export default function EnrollPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const [waitlistForm, setWaitlistForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [guaranteeText, setGuaranteeText] = useState(DEFAULT_ENROLLMENT_GUARANTEE_TEXT);

  useEffect(() => {
    async function loadCohorts() {
      const [result, savedGuaranteeText] = await Promise.all([
        getActiveCohorts(),
        getEnrollmentGuaranteeText(),
      ]);
      if (result.data) {
        setCohorts(result.data);
      }
      setGuaranteeText(savedGuaranteeText);
      setLoading(false);
    }
    loadCohorts();
  }, []);

  const openWaitlistModal = (cohort: Cohort) => {
    setSelectedCohort(cohort);
    setWaitlistForm({ name: "", email: "", phone: "" });
    setShowWaitlistModal(true);
  };

  const handleWaitlistSubmit = async () => {
    if (!selectedCohort) return;
    if (!waitlistForm.name || !waitlistForm.email || !waitlistForm.phone) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    const result = await joinWaitlist({
      name: waitlistForm.name,
      email: waitlistForm.email,
      phone: waitlistForm.phone,
      cohort_id: selectedCohort.id,
    });
    setSubmitting(false);
    if (result.success) {
      toast.success("You've been added to the waitlist! We'll contact you soon.");
      setShowWaitlistModal(false);
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white py-16 px-4">
      <div className="container max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            CodeKar Online Chatbot Workshop
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
            Join our 2-day beginner-friendly online workshop. Build a real AI customer support chatbot and learn how to show it to potential freelance clients.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <Calendar className="w-4 h-4 text-white/60" />
            <span className="text-sm">2-day intensive</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <MapPin className="w-4 h-4 text-white/60" />
            <span className="text-sm">
              Live Online
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <Users className="w-4 h-4 text-white/60" />
            <span className="text-sm">Limited Spots</span>
          </div>
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl border border-fuchsia-400/25 bg-gradient-to-r from-fuchsia-500/10 via-white/5 to-cyan-400/10 px-5 py-4 text-center text-sm md:text-base font-medium text-white/90 shadow-[0_0_40px_rgba(217,70,239,0.12)]">
          {guaranteeText}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="space-y-6">
              {cohorts.map((cohort) => {
                const spotsAvailable = cohort.total_spots - cohort.spots_taken;
                const isFull = spotsAvailable <= 0;
                const displayPrice = cohort.sale_price ?? cohort.original_price;
                const isFreeWorkshop = displayPrice <= 0;
                const hasSale = cohort.sale_price !== null && cohort.sale_price < cohort.original_price;
                
                const deliveryText = "Online";

                const buttonText = isFreeWorkshop ? "Register Free" : `Register (${deliveryText})`;

                return (
                  <Card key={cohort.id} className={`group relative bg-[#0a0a0a] border border-white/10 hover:border-white/20 rounded-[24px] p-6 md:p-8 overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1 ${isFull ? 'opacity-80' : ''}`}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="space-y-6 md:space-y-8 relative z-10">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h2 className="text-xl md:text-2xl font-bold text-white">{cohort.name}</h2>
                            {isFull ? (
                              <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                FULL
                              </span>
                            ) : (
                              <span className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(232,121,249,0.3)]">
                                NEW
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{cohort.dates}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{cohort.time}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                            <MapPin className="w-4 h-4 text-white/60" />
                            <span className="text-sm text-white/80 capitalize">{deliveryText}</span>
                          </div>
                          <div className="text-right">
                            {hasSale && (
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-sm text-white/40 line-through">PKR {cohort.original_price.toLocaleString()}</span>
                                {cohort.sale_tag && (
                                  <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                    {cohort.sale_tag}
                                  </span>
                                )}
                              </div>
                            )}
                            <p className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                              {isFreeWorkshop ? "Free" : `PKR ${displayPrice.toLocaleString()}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`rounded-xl p-4 ${isFull ? 'bg-red-900/10 border border-red-500/20' : 'bg-white/5 border border-white/10 backdrop-blur-md'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isFull ? (
                              <>
                                <Users className="w-4 h-4 text-red-500" />
                                <span className="text-red-400 text-sm font-medium uppercase tracking-tight">No Seats Available</span>
                              </>
                            ) : (
                              <>
                                <Users className="w-4 h-4 text-[#a3e635]" />
                                <span className="text-white/80 text-sm font-medium">Spots available</span>
                              </>
                            )}
                          </div>
                          <span className={`${isFull ? 'text-red-400' : 'text-[#a3e635]'} font-bold`}>{isFull ? '0' : spotsAvailable}</span>
                        </div>
                      </div>

                      <p className="text-white/70 font-light text-sm leading-relaxed">
                        {cohort.description}
                      </p>

                      {isFull ? (
                          <Button 
                            onClick={() => openWaitlistModal(cohort)}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 rounded-xl text-base transition-all"
                          >
                            <Bell className="w-4 h-4 mr-2" />
                            Get Contacted for Next Cohort
                          </Button>
                        ) : (
                          <Link href={`/enroll/register?cohort=${cohort.id}`}>
                            <Button className="w-full relative overflow-hidden bg-white hover:bg-gray-100 text-black font-bold py-6 rounded-xl text-base shadow-xl transition-all hover:scale-[1.02] active:scale-95 group">
                              <span className="relative z-10">{buttonText}</span>
                            </Button>
                          </Link>
                      )}
                    </div>
                  </Card>
                );
              })}
          </div>
        )}

        <div className="flex justify-center pt-4">
            <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>

        {showWaitlistModal && selectedCohort && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <Card className="bg-[#111] border-white/10 p-6 rounded-2xl w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Get Contacted</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowWaitlistModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-white/60 text-sm mb-6">
                This cohort is full. Leave your details and we&apos;ll contact you about the next available cohort.
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Name</Label>
                  <Input
                    className="bg-[#1a1a1a] border-white/10 text-white"
                    placeholder="Your name"
                    value={waitlistForm.name}
                    onChange={(e) => setWaitlistForm({ ...waitlistForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Email</Label>
                  <Input
                    type="email"
                    className="bg-[#1a1a1a] border-white/10 text-white"
                    placeholder="your@email.com"
                    value={waitlistForm.email}
                    onChange={(e) => setWaitlistForm({ ...waitlistForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Phone</Label>
                  <Input
                    className="bg-[#1a1a1a] border-white/10 text-white"
                    placeholder="03XX-XXXXXXX"
                    value={waitlistForm.phone}
                    onChange={(e) => setWaitlistForm({ ...waitlistForm, phone: e.target.value })}
                  />
                </div>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 mt-2"
                  onClick={handleWaitlistSubmit}
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Notify Me"}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>
  );
}
