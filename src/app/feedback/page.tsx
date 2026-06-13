"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Star, Loader2, CheckCircle2, ChevronRight, ChevronLeft, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { id: 1, title: "Identity", description: "Verify your details" },
  { id: 2, title: "Experience", description: "Your background & results" },
  { id: 3, title: "Ratings", description: "Detailed performance score" },
  { id: 4, title: "Feedback", description: "In your own words" },
];

function RatingGroup({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-white/80 font-medium text-xs sm:text-sm">{label}</label>
        <span className="text-white/40 text-[10px] sm:text-xs">{value || 0} / 5</span>
      </div>
      <div className="flex gap-1.5 sm:gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-all duration-200 active:scale-75"
          >
            <Star
              className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 transition-colors ${
                (hover || value) >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-white/10"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function FeedbackForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    enrollment_id: searchParams.get("id") || "",
    student_name: searchParams.get("name") || "",
    student_email: searchParams.get("email") || "",
    experience_level: "",
    built_website: "",
    rating: 0,
    instruction_rating: 0,
    ai_tools_rating: 0,
    pace_rating: 0,
    hands_on_rating: 0,
    comment: "",
    liked_most: "",
    to_improve: "",
    recommend: "",
    testimonial_permission: false,
  });

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep === 1 && (!formData.student_name || !formData.student_email)) {
      toast.error("Please ensure your name and email are present");
      return;
    }
    if (currentStep === 2 && (!formData.experience_level || !formData.built_website)) {
      toast.error("Please answer both questions");
      return;
    }
    if (currentStep === 3 && (formData.rating === 0 || formData.instruction_rating === 0 || formData.ai_tools_rating === 0 || formData.pace_rating === 0 || formData.hands_on_rating === 0)) {
      toast.error("Please provide all ratings");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!formData.recommend) {
      toast.error("Please tell us if you would recommend the workshop");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success("Feedback submitted successfully!");
      } else {
        toast.error("Failed to submit feedback");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <Card className="bg-[#0A0A0A] border-white/5 p-12 rounded-[2.5rem] text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white tracking-tight">Experience Logged.</h1>
              <p className="text-white/40 text-lg leading-relaxed">
                Thank you for your valuable feedback, <span className="text-white">{formData.student_name}</span>. Your insights help us push the boundaries of AI education.
              </p>
            </div>
            <Button 
              className="w-full bg-white text-black hover:bg-white/90 h-14 rounded-2xl text-lg font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => router.push("/")}
            >
              Back to CodeKar
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/10 selection:text-white flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-2xl relative z-10 space-y-8">
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/60 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Workshop Feedback
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            How was the experience?
          </h1>
          <p className="text-white/40 text-lg">
            Step {currentStep} of {steps.length}: {steps[currentStep-1].title}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-1 bg-white/5" />
          <div className="flex justify-between text-[10px] uppercase tracking-tighter text-white/20 font-bold">
            {steps.map(s => (
              <span key={s.id} className={currentStep >= s.id ? "text-white/60" : ""}>{s.title}</span>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <Card className="bg-[#0A0A0A] border-white/5 p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden relative min-h-[450px] md:min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex-1 space-y-6 md:space-y-8"
            >
              {currentStep === 1 && (
                <div className="space-y-6 md:space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-xl md:text-2xl font-semibold">First, let's confirm it's you.</h2>
                    <p className="text-white/40 text-sm md:text-base">These details are synced from your enrollment record.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-2">
                        <label className="text-white/40 text-[10px] md:text-sm font-medium ml-1">Full Name</label>
                        <input
                          type="text"
                          placeholder="Your name"
                          value={formData.student_name}
                          onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 text-sm md:text-base text-white outline-none focus:ring-1 focus:ring-white/40 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-white/40 text-[10px] md:text-sm font-medium ml-1">Email Address</label>
                        <input
                          type="text"
                          placeholder="Your email"
                          value={formData.student_email}
                          onChange={(e) => setFormData({ ...formData, student_email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 text-sm md:text-base text-white outline-none focus:ring-1 focus:ring-white/40 transition-all"
                        />
                      </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                    </div>
                    <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                      This feedback is specifically for the 2-day Website Building Workshop. Your response helps us maintain Apple-standard quality.
                    </p>
                  </div>
                </div>
              )}

                {currentStep === 2 && (
                  <div className="space-y-6 md:space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-xl md:text-2xl font-semibold">Your Background & Journey.</h2>
                      <p className="text-white/40 text-sm md:text-base">Help us understand where you started and where you landed.</p>
                    </div>
                    
                    <div className="space-y-3 md:space-y-4">
                      <label className="text-white/80 font-medium text-xs md:text-sm">What was your experience level before the workshop?</label>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
                        {["Non-Tech", "Beginner", "Intermediate", "Advanced"].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setFormData({ ...formData, experience_level: level })}
                            className={`p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all text-xs md:text-sm font-medium ${
                              formData.experience_level === level
                                ? "bg-white text-black border-white"
                                : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/10"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      <label className="text-white/80 font-medium text-xs md:text-sm">Did you build a working website by the end of Day 2?</label>
                      <div className="grid grid-cols-3 gap-2 md:gap-3">
                        {["Yes", "Partially", "No"].map((choice) => (
                          <button
                            key={choice}
                            type="button"
                            onClick={() => setFormData({ ...formData, built_website: choice })}
                            className={`p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all text-xs md:text-sm font-medium ${
                              formData.built_website === choice
                                ? "bg-white text-black border-white"
                                : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/10"
                            }`}
                          >
                            {choice}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6 md:space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-xl md:text-2xl font-semibold">Performance Metrics.</h2>
                      <p className="text-white/40 text-sm md:text-base">Rate the core aspects of the workshop on a scale of 1-5.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-8">
                      <RatingGroup 
                        label="Overall Experience" 
                        value={formData.rating} 
                        onChange={(v) => setFormData({ ...formData, rating: v })} 
                      />
                      <RatingGroup 
                        label="Clarity of Instruction" 
                        value={formData.instruction_rating} 
                        onChange={(v) => setFormData({ ...formData, instruction_rating: v })} 
                      />
                      <RatingGroup 
                        label="Usefulness of AI Tools" 
                        value={formData.ai_tools_rating} 
                        onChange={(v) => setFormData({ ...formData, ai_tools_rating: v })} 
                      />
                      <RatingGroup 
                        label="Pace of the Workshop" 
                        value={formData.pace_rating} 
                        onChange={(v) => setFormData({ ...formData, pace_rating: v })} 
                      />
                      <RatingGroup 
                        label="Hands-on Experience" 
                        value={formData.hands_on_rating} 
                        onChange={(v) => setFormData({ ...formData, hands_on_rating: v })} 
                      />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6 md:space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-xl md:text-2xl font-semibold">Final Thoughts.</h2>
                      <p className="text-white/40 text-sm md:text-base">Tell us what's on your mind.</p>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      <div className="space-y-2">
                        <label className="text-white/80 font-medium text-xs md:text-sm">What did you like the most?</label>
                        <textarea
                          className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 text-white min-h-[80px] md:min-h-[100px] focus:ring-1 focus:ring-white/40 outline-none transition-all resize-none text-xs md:text-sm"
                          placeholder="The specific AI tools, the teaching style..."
                          value={formData.liked_most}
                          onChange={(e) => setFormData({ ...formData, liked_most: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-white/80 font-medium text-xs md:text-sm">What can we improve?</label>
                        <textarea
                          className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 text-white min-h-[80px] md:min-h-[100px] focus:ring-1 focus:ring-white/40 outline-none transition-all resize-none text-xs md:text-sm"
                          placeholder="More time for Q&A, detailed slides..."
                          value={formData.to_improve}
                          onChange={(e) => setFormData({ ...formData, to_improve: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-3 md:space-y-4">
                        <label className="text-white/80 font-medium text-xs md:text-sm">Would you recommend this workshop to others?</label>
                        <div className="flex gap-2 md:gap-3">
                          {["Yes", "Maybe", "No"].map((choice) => (
                            <button
                              key={choice}
                              type="button"
                              onClick={() => setFormData({ ...formData, recommend: choice })}
                              className={`flex-1 py-2.5 md:py-3 rounded-xl border transition-all text-[10px] md:text-xs font-bold uppercase tracking-widest ${
                                formData.recommend === choice
                                  ? "bg-white text-black border-white"
                                  : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                              }`}
                            >
                              {choice}
                            </button>
                          ))}
                        </div>
                      </div>

                      <label className="flex items-center gap-3 group cursor-pointer p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <input
                          type="checkbox"
                          className="w-4 h-4 md:w-5 md:h-5 rounded-md md:rounded-lg border-white/10 bg-transparent checked:bg-white transition-all appearance-none border flex items-center justify-center after:content-['✓'] after:text-black after:text-[10px] md:after:text-xs after:hidden checked:after:block"
                          checked={formData.testimonial_permission}
                          onChange={(e) => setFormData({ ...formData, testimonial_permission: e.target.checked })}
                        />
                        <span className="text-[10px] md:text-xs text-white/60 font-medium leading-tight">
                          I give permission to use my feedback as a testimonial on the CodeKar website.
                        </span>
                      </label>
                    </div>
                  </div>
                )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/5 flex gap-3 md:gap-4">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="h-12 md:h-14 px-4 md:px-8 border-white/10 bg-transparent hover:bg-white/5 text-white rounded-xl md:rounded-2xl text-xs md:text-sm"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" /> Back
              </Button>
            )}
            <Button
              onClick={currentStep === steps.length ? handleSubmit : nextStep}
              disabled={loading}
              className={`h-12 md:h-14 flex-1 rounded-xl md:rounded-2xl font-bold text-base md:text-lg tracking-tight transition-all hover:scale-[1.01] active:scale-[0.99] ${
                currentStep === steps.length 
                  ? "bg-white text-black hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.1)]" 
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
              ) : currentStep === steps.length ? (
                <span className="flex items-center justify-center">Complete Feedback <Send className="w-4 h-4 md:w-5 md:h-5 ml-2" /></span>
              ) : (
                <span className="flex items-center justify-center">Next Step <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2" /></span>
              )}
            </Button>
          </div>
        </Card>

        {/* Footer info */}
        <p className="text-center text-white/20 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">
          © CodeKar Experience Design Team
        </p>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    }>
      <FeedbackForm />
    </Suspense>
  );
}
