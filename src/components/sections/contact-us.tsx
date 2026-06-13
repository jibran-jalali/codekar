import React from 'react';
import { Instagram, Phone } from 'lucide-react';

export default function ContactUs() {
  return (
    <section className="w-full bg-black pb-12">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="flex flex-col items-center space-y-6 pt-8 border-t border-white/5">
          <h2 className="text-white font-bold text-xl md:text-2xl">Contact Us</h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <a 
              href="https://instagram.com/codekar_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/60 hover:text-[#a3e635] transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#a3e635]/10 transition-colors">
                <Instagram className="w-5 h-5" />
              </div>
              <span className="font-medium">@codekar_</span>
            </a>
            <a 
              href="https://wa.me/923390053713" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/60 hover:text-[#a3e635] transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#a3e635]/10 transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <span className="font-medium">+92 339 0053713</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
