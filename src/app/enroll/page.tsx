"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Users, ArrowLeft, X, Bell, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getActiveCohorts, joinWaitlist } from "./actions";

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

  useEffect(() => {
    async function loadCohorts() {
      const result = await getActiveCohorts();
      if (result.data) {
        setCohorts(result.data);
      }
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

  const hasInPerson = cohorts.some(c => c.delivery_type === "inperson" || c.delivery_type === "both");
  const hasOnline = cohorts.some(c => c.delivery_type === "online" || c.delivery_type === "both");

  return (
    <main className="min-h-screen bg-black text-white py-16 px-4">
      <div className="container max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            CodeKar — Karachi Workshops
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
            Join our 2-day beginner-friendly workshop in Karachi. Learn to code with AI and build real apps for personal projects, school, or your career.
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
              {hasInPerson && hasOnline ? "In-person & Online" : hasOnline ? "Online" : "In-person · Karachi"}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <Users className="w-4 h-4 text-white/60" />
            <span className="text-sm">Limited Spots</span>
          </div>
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
                const hasSale = cohort.sale_price && cohort.sale_price < cohort.original_price;
                
                const deliveryText = cohort.delivery_type === "both" 
                  ? "In-person & Online" 
                  : cohort.delivery_type === "online" 
                    ? "Online" 
                    : "In-person";

                const buttonText = cohort.delivery_type === "both"
                  ? "Register Now"
                  : `Register (${deliveryText})`;

                return (
                  <Card key={cohort.id} className={`bg-[#1a1a1a] border-white/10 rounded-2xl p-6 md:p-8 ${isFull ? 'opacity-80' : ''}`}>
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h2 className="text-xl md:text-2xl font-bold text-white">{cohort.name}</h2>
                            {isFull ? (
                              <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                FULL
                              </span>
                            ) : (
                              <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
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
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-white/40 line-through">PKR {cohort.original_price.toLocaleString()}</span>
                                {cohort.sale_tag && (
                                  <span className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-yellow-500/30 uppercase tracking-wider">
                                    {cohort.sale_tag}
                                  </span>
                                )}
                              </div>
                            )}
                            <p className="text-xl font-bold text-white">
                              PKR {(cohort.sale_price || cohort.original_price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`rounded-xl p-4 ${isFull ? 'bg-red-900/20 border-red-700/30' : 'bg-gradient-to-r from-yellow-900/20 to-yellow-800/10 border-yellow-700/30'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isFull ? (
                              <>
                                <Users className="w-4 h-4 text-red-500" />
                                <span className="text-red-400 text-sm font-medium uppercase tracking-tight">No Seats Available</span>
                              </>
                            ) : (
                              <>
                                <Users className="w-4 h-4 text-yellow-500" />
                                <span className="text-yellow-400 text-sm font-medium">Spots available</span>
                              </>
                            )}
                          </div>
                          <span className={`${isFull ? 'text-red-400' : 'text-yellow-400'} font-bold`}>{isFull ? '0' : spotsAvailable}</span>
                        </div>
                      </div>

                      <p className="text-white/60 text-sm leading-relaxed">
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
                          <Button className="w-full bg-white hover:bg-gray-100 text-black font-bold py-6 rounded-xl text-base transition-all">
                            {buttonText}
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
