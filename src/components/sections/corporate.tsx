"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/**
 * CorporateWorkshopSection component
 * 
 * Design Instructions:
 * Clone the corporate workshop CTA section featuring an H2 for team upskilling across Pakistan, 
 * a brief paragraph on customization, and a "Get Custom Proposal" white button 
 * styled as a horizontal banner on black background.
 */

const CorporateWorkshopSection = () => {
  return (
    <section className="w-full bg-black text-white py-16 md:py-24 overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-start gap-6 md:gap-8 md:flex-row md:items-center md:justify-between"
        >
          <div className="max-w-3xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.2] text-white"
            >
              Online chatbot workshops for teams across Pakistan
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-3 md:mt-4 text-[#d1d5db] text-base sm:text-lg lg:text-xl leading-relaxed"
            >
              Want your team to build practical AI customer support chatbots? We offer customized 2-day online workshops for teams across Pakistan. No coding background required.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex-shrink-0 mt-2 md:mt-0 w-full md:w-auto"
          >
            <Link 
              href="/enroll"
              className="group relative inline-flex w-full md:w-auto items-center justify-center whitespace-nowrap rounded-full bg-white px-6 md:px-8 py-3.5 md:py-4 text-sm md:text-base font-bold text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              Get Custom Proposal
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CorporateWorkshopSection;
