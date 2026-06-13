"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/**
 * WhatYouLearn Component
 * 
 * A section featuring a centered heading and a grid including a large 
 * feature card and a list of interactive toggleable items.
 */
export default function WhatYouLearn() {
  const [activeItem, setActiveItem] = useState("Zero-Syntax Development");

    const learningItems = [
      {
        title: "Zero-Syntax Development",
        description: "Stop memorizing code. We show you how to use AI to generate production-ready code in seconds. You focus on the architecture and logic; AI handles the heavy lifting. You'll build more in 48 hours than most people do in 4 months.",
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/af3cba43-be74-4f38-93a0-5902b069d318-codekar-chi-vercel-app/assets/images/images_2.png",
      },
      {
        title: "Full-Stack AI Workflows",
        description: "Master the tools that professional engineers use to move 10x faster. Connect databases, handle authentication, and deploy live applications. You're not just 'learning'; you're building a scalable software foundation.",
        // Using fallback image index for other items since only one specific asset was provided
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/af3cba43-be74-4f38-93a0-5902b069d318-codekar-chi-vercel-app/assets/images/images_2.png", 
      },
      {
        title: "Immediate Career Leverage",
        description: "Whether you're a student or a founder, these skills are your competitive advantage. You leave with a live, functional app that proves you can build in the AI era. No more theoretical knowledge—just real, visible results.",
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/af3cba43-be74-4f38-93a0-5902b069d318-codekar-chi-vercel-app/assets/images/images_2.png",
      },
    ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveItem((current) => {
        const index = learningItems.findIndex((item) => item.title === current);
        return learningItems[(index + 1) % learningItems.length].title;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [activeItem]);

  const currentContent = learningItems.find(item => item.title === activeItem) || learningItems[0];

  return (
    <section 
      id="whatWeDo" 
      className="w-full bg-white text-black py-24 md:py-32 overflow-hidden"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            What You’ll Learn
          </h2>
          <p className="text-lg text-gray-600 font-normal">
            A weekend of hands-on building. Here’s the path we follow.
          </p>
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Main Display Area (Feature Card) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-2"
          >
            <div className="relative h-[550px] md:h-[450px] overflow-hidden bg-[#1c1c1c] rounded-[32px] border border-white/5 shadow-2xl transition-all duration-500 ease-in-out">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeItem}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 grid grid-cols-1 md:grid-cols-2"
                >
                  {/* Text Content */}
                  <div className="p-8 md:p-12 flex flex-col justify-center gap-5 z-10">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 text-xs text-gray-400"
                    >
                      {/* Empty placeholder */}
                    </motion.div>
                    <motion.h3 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl md:text-3xl font-bold tracking-tight text-white"
                    >
                      {currentContent.title}
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-300 leading-relaxed max-w-prose text-base"
                    >
                      {currentContent.description}
                    </motion.p>
                  </div>
                  
                  {/* Image Area */}
                  <div className="relative w-full h-full min-h-[250px] md:min-h-full overflow-hidden">
                    <motion.div
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={currentContent.image}
                        alt={currentContent.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </motion.div>
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c1c] via-transparent to-transparent hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-transparent to-transparent md:hidden" />
                  </div>
                </motion.div>
              </AnimatePresence>

                {/* Decorative progress bar at bottom */}
                <div className="absolute left-0 right-0 bottom-0 h-[4px] bg-white/5">
                  <motion.div 
                    key={activeItem}
                    className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                </div>

            </div>
          </motion.div>

          {/* Navigation/Toggle List */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-3 lg:pt-2"
          >
            {learningItems.map((item, index) => (
              <motion.button
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveItem(item.title)}
                className={cn(
                  "flex items-center gap-4 rounded-2xl p-5 text-left transition-all duration-300 group relative overflow-hidden",
                  activeItem === item.title 
                    ? "bg-black text-white shadow-xl scale-[1.02]" 
                    : "hover:bg-gray-100/80 text-gray-500"
                )}
                whileHover={{ x: activeItem === item.title ? 0 : 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={cn(
                  "flex-shrink-0 h-3 w-3 rounded-full transition-all duration-300",
                  activeItem === item.title 
                    ? "bg-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                    : "bg-gray-300 group-hover:bg-gray-400"
                )} />
                <span className={cn(
                  "truncate text-base transition-all duration-300",
                  activeItem === item.title 
                    ? "font-bold" 
                    : "font-medium"
                )}>
                  {item.title}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}