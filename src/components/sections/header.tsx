"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

    const navLinks = [
      { name: "What you'll need", href: "#whatYouNeed" },
      { name: "Reviews", href: "#reviews" },
      { name: "FAQs", href: "#faq" },
    ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/70 backdrop-blur-2xl border-b border-white/10 shadow-lg" : "bg-transparent"
      }`}
      style={{ height: isScrolled ? "70px" : "90px" }}
    >
      <div className="max-w-[1400px] mx-auto h-full px-4 md:px-16 flex items-center justify-between relative">
        {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0 z-20"
          >
            <Link href="/" className="flex items-center group">
                <img 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Codekar-1766840680469.png?width=400&height=400&resize=contain" 
                  alt="CodeKar Logo" 
                  className="h-20 md:h-32 w-auto object-contain transition-transform group-hover:scale-110"
                />
            </Link>
          </motion.div>

        {/* Center Navigation - Desktop */}
        <nav className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <ul className="flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.li 
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <a
                  href={link.href}
                  className="inline-flex h-9 items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-[#f5f5f5] transition-all hover:bg-white/10 hover:text-white active:scale-95"
                >
                  {link.name}
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Right Action Button - Desktop */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex items-center justify-end z-20"
        >
          <Link href="/enroll">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-all h-10 px-6 bg-white text-black shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              Register for Workshop
            </motion.button>
          </Link>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex items-center justify-center p-3.5 text-white border border-white/10 rounded-full bg-white/5 hover:bg-white/10 transition-all active:scale-90"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden fixed inset-0 bg-black/95 backdrop-blur-3xl z-40 overflow-hidden pt-[70px]"
          >
            <nav className="container mx-auto px-6 py-8">
              <ul className="flex flex-col gap-5">
                {navLinks.map((link, index) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-2xl font-bold text-white/90 hover:text-[#a3e635] py-2 transition-colors"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
                <motion.li 
                  className="pt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link href="/enroll" onClick={() => setMobileMenuOpen(false)}>
                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-14 bg-white text-black font-bold rounded-full text-lg shadow-xl"
                    >
                      Register for Workshop
                    </motion.button>
                  </Link>
                </motion.li>
              </ul>
            </nav>
            {/* Background decorative element */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center opacity-10">
              <span className="text-6xl font-black tracking-tighter text-white">CODEKAR</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
