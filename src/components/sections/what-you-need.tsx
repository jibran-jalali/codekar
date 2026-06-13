"use client";

import React from 'react';
import { Laptop, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatYouNeed = () => {
  return (
    <section 
      id="whatYouNeed" 
      className="py-16 md:py-24 bg-black text-white overflow-hidden"
    >
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10 md:mb-16"
          >
            <h2 
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-white tracking-tight leading-tight px-4"
            >
              What You&apos;ll Need
            </h2>
            <p 
              className="text-base md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed px-4"
            >
              Join from wherever you are. You just need a laptop, stable internet, and the focus to build your chatbot during the live online sessions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 lg:gap-12 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
                className="bg-[#111111] rounded-[24px] sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/10 relative overflow-hidden group transition-all duration-300 mx-0"
            >
              <div className="relative z-10">
                <div 
                  className="w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300"
                >
                  <div 
                    className="w-12 h-12 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-black/40 shadow-lg border border-white/10"
                  >
                    <Laptop className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>

                <h3 
                  className="text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-white transition-colors duration-300 group-hover:text-[#a3e635] leading-tight"
                >
                  Your Laptop
                </h3>
                <p 
                  className="text-white/80 leading-relaxed text-base md:text-lg transition-colors duration-300"
                >
                  Bring your laptop and charger. Any modern laptop will work - Windows, Mac, or Linux. 
                  Don&apos;t worry about software—we&apos;ll help you set up all the AI coding tools during the first session.
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
                className="bg-[#111111] rounded-[24px] sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/10 relative overflow-hidden group transition-all duration-300 mx-0"
            >
              <div className="relative z-10">
                <div 
                  className="w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300"
                >
                  <div 
                    className="w-12 h-12 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-black/40 shadow-lg border border-white/10"
                  >
                    <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>

                <h3 
                  className="text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-white transition-colors duration-300 group-hover:text-[#a3e635] leading-tight"
                >
                  Stable Internet
                </h3>
                <p 
                  className="text-white/80 leading-relaxed text-base md:text-lg transition-colors duration-300"
                >
                  Use a stable internet connection and join the video call from a quiet place. Keep a notebook or notes app open for client scripts, chatbot prompts, and setup steps.
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          </div>

      </div>
    </section>
  );
};

export default WhatYouNeed;
