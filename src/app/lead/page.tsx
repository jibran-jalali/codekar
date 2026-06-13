"use client";

import { StudentLeadForm } from "@/components/student-lead-form";
import { Card } from "@/components/ui/card";

export default function LeadCapturePage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="bg-[#0A0A0A] border-white/10 p-6 sm:p-8 rounded-2xl w-full max-w-md">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Get Started with CodeKar</h1>
            <p className="text-white/60 text-sm">
              Join thousands of students learning to build websites with AI. Fill out the form below and we'll reach out with program details.
            </p>
          </div>
          <StudentLeadForm />
        </div>
      </Card>
    </main>
  );
}
