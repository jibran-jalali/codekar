"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const FAQSection = () => {
  const faqs = [
    {
      question: "Who's this workshop for?",
      answer: "Complete beginners in Pakistan who want a practical online skill. If you're non-technical and want to build chatbots for local businesses or freelance clients, this is for you. No coding background required - just bring your laptop and focus."
    },
    {
      question: "Do I need to know how to code?",
      answer: "Not at all. We start from scratch and use AI tools to help you build. The goal is simple: finish with a working chatbot, not sit through boring theory."
    },
    {
      question: "What will I actually build?",
      answer: "A real, working AI-powered customer support chatbot for a business - the exact kind of project local businesses like shops, salons, clinics, and online sellers will pay you to build. You'll walk away with a deployed chatbot you can show to potential freelance clients as proof of what you can do."
    },
    {
      question: "Is it online or in-person?",
      answer: "It's fully online. You'll join live video-call sessions for 2 days, build alongside the instructor, and get hands-on support when you get stuck."
    },
    // TODO: Confirm the exact chatbot-building stack before publishing specific tool names here.
    {
      question: "What tools are we using?",
      answer: "Beginner-friendly AI and chatbot-building tools. We'll help you set everything up step by step, so you can focus on building and deploying the chatbot instead of fighting with technical setup."
    },
    {
      question: "What if I get stuck?",
      answer: "Our instructors are with you throughout the 2 days. We debug together, answer questions live, and help you keep moving until your chatbot works."
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
      <div className="container px-5 md:px-8 mx-auto max-w-[1280px]">
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
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
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
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-[#a3e635] transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <h3 className="text-xl md:text-2xl font-semibold text-white leading-tight transition-colors group-hover:text-[#a3e635]">
                      {faq.question}
                    </h3>
                    <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-[640px]">
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
