"use client";

import React, { useRef } from 'react';
import { toPng } from 'html-to-image';

import { toast } from "sonner";

interface CertificateProps {
  name: string;
  email?: string;
  enrollmentId?: string;
  certificateIdProp?: string;
  cohortName?: string;
  customDate?: string;
  onGenerate?: (dataUrl: string) => void;
}

export const Certificate = ({ name, email, enrollmentId, certificateIdProp, cohortName, customDate, onGenerate }: CertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState(customDate || new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }));

  // Use stored certificateId if provided, otherwise fallback to pseudo-unique one
  const certificateId = certificateIdProp || (enrollmentId ? `CK-${enrollmentId.slice(0, 8).toUpperCase()}-${new Date().getFullYear()}` : `CK-TEMP-${Math.random().toString(36).substring(7).toUpperCase()}`);

    const downloadCertificate = async () => {
      if (certificateRef.current === null) return;
      try {
        const dataUrl = await toPng(certificateRef.current, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          width: 1000,
          height: 700,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
            width: '1000px',
            height: '700px',
          }
        });
        const link = document.createElement('a');
        link.download = `Certificate-${name}.png`;
        link.href = dataUrl;
        link.click();
        toast.success("Certificate downloaded!");
      } catch (err) {
        console.error('oops, something went wrong!', err);
        toast.error("Failed to download certificate");
      }
    };

    const handleSendEmail = async () => {
      if (certificateRef.current === null || !email) return;
      setSending(true);
      const toastId = toast.loading("Generating and sending certificate...");
      try {
        const dataUrl = await toPng(certificateRef.current, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          width: 1000,
          height: 700,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
            width: '1000px',
            height: '700px',
          }
        });

      const res = await fetch("/api/send-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          enrollmentId,
          certificateImage: dataUrl,
        }),
      });

      if (res.ok) {
        toast.success("Certificate sent successfully to " + email, { id: toastId });
      } else {
        toast.error("Failed to send certificate", { id: toastId });
      }
    } catch (err) {
      console.error('Email sending failed', err);
      toast.error("Error sending email", { id: toastId });
    } finally {
      setSending(false);
    }
  };

    return (
      <div className="flex flex-col items-center">
              <div
                ref={certificateRef}
                className="relative bg-white text-black flex flex-col items-center justify-center font-montserrat overflow-hidden shrink-0"
                style={{
                  width: '1000px',
                  height: '700px',
                  minWidth: '1000px',
                  minHeight: '700px',
                  backgroundColor: 'white',
                }}
              >
              {/* Subtle Watermark Branding - Robust Centering */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.01] pointer-events-none select-none z-0"
                style={{ transform: 'translate(-50%, -50%) rotate(-12deg)' }}
              >
                <div className="text-[140px] font-black tracking-tighter uppercase whitespace-nowrap">
                  {'{'}codekar{'}'}
                </div>
              </div>

            {/* Minimalist Top Gradient Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-black"></div>

            {/* Main Content Container - Balanced Layout */}
            <div className="relative z-10 flex flex-col items-center w-full h-full py-32 px-24 justify-between scale-[0.93] transform-gpu">
              
              {/* Branding Block - Top */}
              <div className="flex flex-col items-center mb-4">
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center rotate-45 mb-4">
                  <div className="text-white text-base font-black -rotate-45">{'{'}</div>
                </div>
                
                <div className="flex flex-col items-center opacity-80">
                  <div className="flex items-center text-xl font-mono font-black text-black tracking-tighter">
                    <span>{'{'}</span>
                    <span className="mx-0.5">codekar</span>
                    <span>{'}'}</span>
                  </div>
                  <div className="w-8 h-0.5 bg-black mt-1 opacity-20"></div>
                </div>
              </div>

              {/* Primary Information Column - Centered */}
              <div className="text-center flex flex-col items-center w-full flex-1 justify-center py-2">
                <h1 className="text-4xl font-black mb-8 text-black tracking-[0.4em] uppercase leading-tight">
                  OFFICIAL CERTIFICATE<br />OF COMPLETION
                </h1>

                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4 font-bold">This is to certify that</p>
                
                <h2 className="text-6xl font-black text-black mb-6 tracking-tight capitalize py-2">
                  {name}
                </h2>

                <div className="max-w-xl mb-8 space-y-6">
                  <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
                    has successfully completed the intensive professional development workshop, demonstrating exceptional proficiency and active engagement in all practical sessions.
                  </p>
                  
                  <div className="bg-gray-50/50 py-3 px-10 rounded border border-gray-100 flex flex-col gap-1.5">
                    <div className="flex justify-center items-baseline gap-2">
                      <span className="text-[8px] font-black text-black uppercase tracking-widest opacity-40">Workshop:</span>
                      <span className="text-[13px] font-bold text-black">{cohortName || "Artificial Intelligence Workshop"}</span>
                    </div>
                    <div className="flex justify-center items-baseline gap-2">
                      <span className="text-[8px] font-black text-black uppercase tracking-widest opacity-40">Conducted by:</span>
                      <span className="text-[13px] font-bold text-black">CodeKar</span>
                </div>

                  <div className="absolute bottom-6 right-8 opacity-40">
                    <p className="text-[7px] font-mono font-medium text-black uppercase tracking-wider">
                      Certificate ID: {certificateId}
                    </p>
                  </div>
                </div>

              </div>



                <div className="group relative">
                  <p className="text-[8px] font-black text-black uppercase tracking-[0.2em] mb-1">Date of Completion</p>
                  <p className="text-[13px] font-bold text-black">{internalDate}</p>
                </div>
              </div>

              {/* Bottom Section: Signatures and ID */}
              <div className="w-full flex flex-col items-center gap-6 mt-4">
                <div className="w-full flex justify-between px-20">
                  <div className="flex flex-col items-center w-52 scale-[0.9]">
                    <div className="font-signature text-3xl text-black mb-1">Jibran</div>
                    <div className="w-full h-px bg-black mb-2"></div>
                    <p className="font-bold text-[9px] text-black uppercase tracking-wider">Jibran Jalali</p>
                    <p className="text-gray-400 text-[7px] uppercase font-bold tracking-[0.1em] mt-1">Authorized Signature</p>
                  </div>

                  <div className="flex flex-col items-center w-52 scale-[0.9]">
                    <div className="font-signature text-3xl text-black mb-1">Ayan Humyaun</div>
                    <div className="w-full h-px bg-black mb-2"></div>
                    <p className="font-bold text-[9px] text-black uppercase tracking-wider">Ayan Humyaun</p>
                    <p className="text-gray-400 text-[7px] uppercase font-bold tracking-[0.1em] mt-1">Authorized Signature</p>
                  </div>
                  </div>
                </div>
              </div>

            </div>

        
        <div className="flex flex-col items-center gap-4 mt-6">
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Completion Date:</span>
            <input 
              type="text" 
              value={internalDate}
              onChange={(e) => setInternalDate(e.target.value)}
              className="bg-white border border-gray-200 rounded px-2 py-1 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black w-40"
              placeholder="December 31, 2025"
            />
          </div>

          <div className="flex gap-2">
            <button 
              onClick={downloadCertificate}
              className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest shadow-lg shadow-black/10"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Download PDF
            </button>
            {email && (
              <button 
                onClick={handleSendEmail}
                disabled={sending}
                className="px-6 py-2 bg-white text-black border-2 border-black rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
              >
                {sending ? (
                  <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                )}
                {sending ? "Sending..." : "Send via Email"}
              </button>
            )}
          </div>
        </div>

    </div>
  );
};
