"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type FinalCTAProps = {
  guaranteeText: string;
};

const FinalCTA = ({ guaranteeText }: FinalCTAProps) => {
  return (
    <section className="w-full bg-black text-white py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center text-center space-y-6 md:space-y-8"
        >
            {/* Main Heading */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
            >
              Start building your first AI chatbot today.
            </motion.h2>
            
            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed mx-auto"
            >
              Join the next live online cohort and go from zero to a working customer support chatbot in 48 hours. Spots are strictly limited.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="inline-flex max-w-2xl items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm sm:text-base font-medium text-white/90 backdrop-blur-sm"
            >
              {guaranteeText}
            </motion.p>
            
            {/* CTA Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="pt-4"
            >
              <Link 
                href="/enroll" 
                className="inline-block group"
              >
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all shadow-xl h-14 px-10 py-4 bg-white text-black hover:bg-gray-100 font-bold"
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '16px',
                  }}
                >
                  Secure My Spot
                </motion.button>
              </Link>
            </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
