"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * HeroSection Component
 * 
 * Clones the hero section of the CodeKar online workshop website.
 * Features:
 * - "Workshops Open" status badge
 * - Large headline with specific line breaks
 * - Description text
 * - Dark CTA button with inner arrow icon
 * - Large rounded workshop image with testimonial card overlay
 */
const HeroSection: React.FC = () => {
  return (
    <section className="bg-[#1a1a1a] min-h-screen flex items-center pt-20 pb-12 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Left Column: Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-6 md:space-y-8 max-w-2xl"
            >
              {/* Status Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
              >
                <div className="w-2 h-2 bg-[#a3e635] rounded-full animate-pulse shadow-[0_0_8px_rgba(163,230,53,0.8)]"></div>
                <span className="text-white text-xs sm:text-sm font-medium tracking-tight">Workshops Open</span>
              </motion.div>

                {/* Headline */}
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-[28px] xs:text-[32px] sm:text-[44px] md:text-[56px] lg:text-[72px] font-bold leading-[1.1] sm:leading-[1.1] text-white tracking-tight"
                  >
                  Build a real AI customer support chatbot in 2 days.<br className="hidden sm:block" />
                  No coding required.
                </motion.h1>

                {/* Description */}
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-base sm:text-lg md:text-xl text-[#d1d5db] max-w-lg leading-relaxed"
                >
                  A 2-day live online workshop for complete beginners. Walk away with a working AI chatbot you built yourself — and a path to your first paying freelance client.
                </motion.p>


                  {/* CTA Buttons */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-start gap-4 pt-2"
                  >
                    <Link href="/enroll" className="group">
                      <button 
                        className="relative overflow-hidden bg-white hover:bg-gray-100 text-black rounded-full flex items-center gap-3 pl-6 pr-1.5 py-1.5 h-[56px] text-base font-bold tracking-tight shadow-xl transition-all active:scale-95"
                      >
                        <span className="relative z-10">Secure My Spot</span>
                        <span className="relative z-10 inline-flex items-center justify-center rounded-full bg-black text-white h-10 w-10 shadow-sm transition-transform group-hover:translate-x-0.5">
                          <ArrowRight className="w-4 h-4 stroke-[2.5px]" />
                        </span>
                      </button>
                    </Link>
                  </motion.div>

            </motion.div>

          {/* Right Column: Visual Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full"
            >
              {/* Main Interactive Workshop Image */}
              <div className="relative overflow-hidden rounded-[24px] md:rounded-[40px] shadow-2xl group">
                <Image 
                  alt="CodeKar live online workshop" 
                  width={800} 
                  height={700}
                  priority
                  className="object-cover w-full h-[320px] sm:h-[400px] md:h-[600px] lg:h-[700px] transition-transform duration-700 group-hover:scale-105" 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/af3cba43-be74-4f38-93a0-5902b069d318-codekar-chi-vercel-app/assets/images/images_1.png"
                />
                {/* Dark overlay for better text contrast if needed */}
                <div className="absolute inset-0 bg-black/5"></div>
              </div>

              {/* Testimonial Overlay Card */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="absolute bottom-4 left-4 right-4 md:bottom-8 md:right-8 lg:max-w-[380px] md:left-auto bg-white/10 backdrop-blur-xl rounded-[20px] md:rounded-[24px] p-4 md:p-6 border border-white/20 shadow-2xl transform transition-transform hover:scale-[1.02]"
              >
                {/* Star Ratings */}
                <div className="flex items-center gap-1 mb-2 md:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-[#fbbf24] fill-[#fbbf24]" />
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <p className="text-white text-xs sm:text-sm md:text-base leading-relaxed font-normal">
                  &quot;The workshop was highly insightful, well-organized, and provided valuable hands-on experience that exceeded my expectations.&quot;
                </p>
              </motion.div>
            </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
