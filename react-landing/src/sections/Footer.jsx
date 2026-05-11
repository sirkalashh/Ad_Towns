import React from 'react';
import { motion } from 'framer-motion';

// Custom SVG Icons to avoid Lucide export issues
const InstagramIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const SocialLink = ({ href, icon: Icon, brandColor, gradient }) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative p-3 flex items-center justify-center group"
      whileHover="hover"
      initial="initial"
    >
      {/* Hover background glow - Apple style */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-15 blur-xl transition-all duration-500"
        style={{ background: gradient || brandColor }}
        variants={{
          hover: { scale: 1.5, opacity: 0.2 }
        }}
      />
      
      {/* The Icon container */}
      <div className="relative z-10 overflow-hidden">
        {/* Grayscale Icon (Default) */}
        <Icon 
          className="w-6 h-6 text-gray-400 transition-all duration-500 group-hover:opacity-0 group-hover:scale-150" 
          strokeWidth={1.5}
        />
        
        {/* Colorful Icon (Hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-110">
          <Icon 
            className="w-6 h-6" 
            style={{ 
              stroke: brandColor,
              fill: brandColor === '#1877F2' ? '#1877F2' : 'none', // Fill for FB
              strokeWidth: 2
            }} 
          />
        </div>
      </div>

      {/* Underline/Indicator - Apple style */}
      <motion.div 
        className="absolute -bottom-1 w-0 h-0.5 rounded-full transition-all duration-500 group-hover:w-4"
        style={{ background: brandColor }}
      />
    </motion.a>
  );
};

export default function Footer() {
  return (
    <footer id="footer" className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex flex-col items-center"
          >
            <img src="/logo.png" alt="AdTowns Logo" className="h-14 w-auto mb-4 grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer" />
            <div className="text-2xl font-bold tracking-tighter text-black font-heading mb-6">
              adtowns.in
            </div>
          </motion.div>

          {/* Social Links Section */}
          <div className="flex items-center gap-6 mb-10">
            <SocialLink 
              href="https://www.instagram.com/adtowns_in/" 
              icon={InstagramIcon} 
              brandColor="#E4405F"
              gradient="linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)"
            />
            <SocialLink 
              href="https://www.facebook.com/AdTowns.in" 
              icon={FacebookIcon} 
              brandColor="#1877F2"
            />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-400 font-medium tracking-tight">
            © {new Date().getFullYear()} adtowns.in · India's Local Marketplace.
          </p>
          
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group relative inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-[0.2em]"
          >
            Back to Top
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ↑
            </motion.span>
          </button>
        </div>
      </div>
    </footer>
  );
}


