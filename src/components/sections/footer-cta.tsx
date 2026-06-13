import React from 'react';
import Link from 'next/link';

/**
 * FooterCTA Component
 * 
 * Clones the final call-to-action section and minimal footer.
 * Features:
 * - Centered layout with high-contrast text.
 * - Prominent "Register for Next Workshop" button.
 * - Minimal footer with logo and copyright.
 */
const FooterCTA: React.FC = () => {
  return (
    <div className="bg-black text-white">
      {/* Final CTA Section */}
      <section className="py-24 md:py-32 flex flex-col items-center text-center">
        <div className="container px-6 max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-[36px] md:text-[48px] font-bold tracking-tight mb-6 leading-[1.2]">
            Ready to start coding in Karachi?
          </h2>
          <p className="text-[18px] text-[#d1d5db] mb-10 max-w-[768px] leading-[1.6]">
            Join our next 2-day workshop. Limited to 20 students per batch for personalized attention. Spots fill up fast!
          </p>
          
          <Link href="/enroll" className="inline-block">
            <button 
              className="bg-white text-black font-medium text-[14px] px-6 py-3 rounded-md transition-all hover:bg-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Register for Next Workshop
            </button>
          </Link>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container px-6 max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-[20px] font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-sans)' }}>
                CodeKar
              </span>
            </Link>
          </div>
          
          <div className="flex flex-col gap-1">
            <p className="text-[14px] text-[#d1d5db]/60">
              © All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FooterCTA;