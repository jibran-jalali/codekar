import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-black py-12 md:py-16">
      <div className="container mx-auto px-6 max-w-[1280px]">
        {/* Main Footer Content */}
        <div className="flex flex-col items-start space-y-4">
          {/* Logo Section */}
            <div className="logo-container">
              <a 
                href="/" 
                className="logo-link flex items-center"
                style={{
                  textDecoration: 'none'
                }}
              >
                <img 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Codekar-1766840680469.png?width=8000&height=8000&resize=contain" 
                  alt="CodeKar Logo" 
                  className="h-8 w-auto object-contain"
                />
              </a>
            </div>

          {/* Copyright Section */}
          <div className="flex items-center">
            <span 
              className="copyright-text"
              style={{
                color: '#a3e635',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
              }}
            >
              © All rights reserved
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;