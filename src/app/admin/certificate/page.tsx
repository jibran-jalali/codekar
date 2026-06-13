"use client";

import { useSearchParams } from "next/navigation";
import { Certificate } from "@/components/certificate";
import { Suspense } from "react";

function CertificatePreviewContent() {
  const searchParams = useSearchParams();
  
  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
    const enrollmentId = searchParams.get("enrollmentId") || "";
    const certificateId = searchParams.get("certificateId") || "";
    const cohortName = searchParams.get("cohortName") || "";
    const customDate = searchParams.get("date") || "";
  
      return (
        <div className="min-h-screen bg-[#111] flex flex-col items-center py-12 px-4 overflow-auto" suppressHydrationWarning>
        <div className="bg-white shadow-2xl mb-8">
          <Certificate 
            name={name}
            email={email}
            enrollmentId={enrollmentId}
            certificateIdProp={certificateId}
            cohortName={cohortName}
            customDate={customDate}
          />
        </div>

      <p className="text-white/40 text-sm font-medium uppercase tracking-widest">
        Official Certificate Preview • 1:1 Scale
      </p>
    </div>
  );
}

export default function CertificatePreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <CertificatePreviewContent />
    </Suspense>
  );
}
