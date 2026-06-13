"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

const NotForSection = () => {
  const points = [
    "People looking for a magic \"get rich quick\" button.",
    "Anyone who wants to spend months learning legacy syntax and math.",
    "Those unwilling to show up live and put in the work for 2 days."
  ];

  return (
    <section className="w-full bg-[#f9fafb] py-16 md:py-32 overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <div className="flex flex-col items-center text-center mb-10 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex mb-4"
            >
              <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                Important
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-black px-4 leading-tight"
            >
              Who this is NOT for
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            {points.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-gray-200 shadow-sm flex flex-col items-center text-center group hover:border-red-100 transition-colors duration-300"
              >
                <div className="bg-red-50 p-3 sm:p-4 rounded-full mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                </div>
                <p className="text-base sm:text-lg md:text-xl font-medium text-gray-900 leading-snug">
                  {point}
                </p>
              </motion.div>
            ))}
          </div>

      </div>
    </section>
  );
};

export default NotForSection;
