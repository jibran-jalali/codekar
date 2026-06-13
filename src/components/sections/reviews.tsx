"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: "Fatima",
    role: "Startup Founder",
    content: "As a non-technical founder, I always felt at the mercy of my developers. This workshop changed everything. In just 48 hours, I built a fully functional customer support bot that handles 80% of our common queries. The best part wasn't just the bot, but the confidence I gained in understanding what's possible with AI. I no longer feel like I'm speaking a different language when talking to tech teams. This is a game-changer for anyone in Pakistan looking to compete globally.",
    long: true
  },
  {
    name: "Sameed",
    role: "Freelancer",
    content: "Mind-blowing experience. I went from zero coding knowledge to launching my first AI app in two days. Highly recommended for everyone!",
    long: false
  },
  {
    name: "Ahsan",
    role: "Senior Educator",
    content: "I was skeptical about building real apps without math or syntax, but CodeKar proved me wrong. The live sessions were intense but incredibly rewarding. I built a personalized learning assistant for my students. The workflow they teach is so much more efficient than traditional methods. If you're a student in Karachi looking to level up your skills before graduating, this workshop is the fastest way to do it. Worth every rupee.",
    long: true
  },
  {
    name: "Zoya",
    role: "Product Designer",
    content: "The best investment I've made this year. Simple, direct, and results-oriented. It completely changed how I think about building products.",
    long: false
  }
];

const ReviewsSection = () => {
  return (
    <section id="reviews" className="w-full bg-white py-16 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <div className="flex flex-col items-center text-center mb-10 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex mb-4"
            >
              <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                Wall of Love
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-black leading-tight px-4"
            >
              What our students say
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 max-w-5xl mx-auto">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-gray-100 shadow-sm flex flex-col"
              >
                <div className="flex gap-1 mb-4 md:mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <Quote className="w-5 h-5 sm:w-8 sm:h-8 text-blue-200 mb-4" />
                
                <p className={`text-gray-700 leading-relaxed mb-6 md:mb-8 ${review.long ? 'text-sm sm:text-base md:text-lg' : 'text-base sm:text-lg md:text-xl font-medium italic'}`}>
                  "{review.content}"
                </p>
                
                <div className="flex items-center gap-3 md:gap-4 mt-auto">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-base sm:text-xl">
                    {review.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">{review.name}</h4>
                    <p className="text-[10px] sm:text-sm text-gray-500">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

      </div>
    </section>
  );
};

export default ReviewsSection;
