"use client";

import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section 
      id="about" 
      className="w-full bg-white text-black py-24 md:py-32 overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column: Badge and Heading */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-3"
            >
              <div className="inline-flex">
                <span 
                  className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium tracking-tight"
                >
                  The Outcome
                </span>
              </div>
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-black tracking-tight"
              >
                Why this works
              </h2>
            </motion.div>

            {/* Right Column: Bullets */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="space-y-12 lg:pt-16"
            >
              <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight">Result-First Approach</h3>
                <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-normal">
                  We don't teach you syntax; we teach you how to ship. You leave with a working app, not a certificate of completion.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight">Leverage AI</h3>
                <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-normal">
                  Learn to use AI as your personal engineer. You focus on the logic and the idea; AI handles the execution.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight">Live Implementation</h3>
                <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-normal">
                  This isn't a pre-recorded course. You build in real-time with expert guidance to ensure you never get stuck.
                </p>
              </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;