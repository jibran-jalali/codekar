"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const FAQSection = () => {
  const faqs = [
    {
      question: "Who's this workshop for?",
      answer: "Complete beginners who want to learn coding! Students, professionals looking to upskill, or anyone with a project idea. No coding background required—just bring your laptop and enthusiasm."
    },
    {
      question: "Do I need to know how to code?",
      answer: "Not at all! We start from scratch. You'll learn to code using AI tools as your assistant. Our 2-day hands-on approach gets you building immediately, no boring theory."
    },
    {
      question: "What will I actually build?",
      answer: "A real, working app or website that you can use, show off, or add to your portfolio. Perfect for personal projects, school assignments, or to showcase when applying for jobs."
    },
    {
      question: "Is it online or in-person?",
      answer: "We host 2-day in-person workshops in Karachi, Pakistan. Face-to-face learning with hands-on support from instructors throughout the entire workshop."
    },
    {
      question: "What tools are we using?",
      answer: "Modern, beginner-friendly tools: v0 + Cursor for AI-assisted coding, Next.js + Supabase for building real apps. We'll help you set everything up—don't worry about the technical setup."
    },
    {
      question: "What if I get stuck?",
      answer: "Our instructors are there with you throughout the 2 days! We provide hands-on support, debug together, and make sure everyone succeeds. Plus, you'll join our community for continued support after the workshop."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section id="faq" className="w-full py-16 md:py-24 bg-black text-white overflow-hidden">
      <div className="container px-4 md:px-8 mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Title Area */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-4 md:space-y-6 lg:col-span-5"
            >
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                  Frequently Asked
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#a3e635] to-[#1a2e05]">
                    Questions
                  </span>
                </h2>
                <p className="text-base sm:text-xl text-white/70 font-normal leading-relaxed">
                  Everything you want to know about CodeKar.
                </p>
              </div>
            </motion.div>

            {/* FAQ List */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-0 lg:col-span-7"
            >
              {faqs.map((faq, index) => (
                  <motion.div 
                    key={index} 
                    variants={itemVariants}
                    className="flex gap-4 py-6 md:py-8 border-t border-white/10 group last:border-b hover:bg-white/[0.02] transition-colors px-0 md:px-4 rounded-lg"
                  >
                  <div className="flex-shrink-0 pt-1">
                    <ArrowRight className="w-4 h-4 md:w-6 md:h-6 text-[#a3e635] transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <h3 className="text-lg md:text-2xl font-semibold text-white leading-tight transition-colors group-hover:text-[#a3e635]">
                      {faq.question}
                    </h3>
                    <p className="text-sm md:text-lg text-white/70 leading-relaxed max-w-[640px]">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;