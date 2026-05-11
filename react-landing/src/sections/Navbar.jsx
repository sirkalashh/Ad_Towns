import { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';

/**
 * Sticky navigation bar with smooth scroll links.
 */
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegisterPage = location.pathname === '/register';
  const [showMobileCTA, setShowMobileCTA] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 680);
    };
    
    const handleScroll = () => {
      const mobile = window.innerWidth < 680;
      if (!mobile) {
        setShowMobileCTA(true);
        return;
      }

      const heroBtn = document.getElementById('hero-register-btn');
      if (heroBtn) {
        const rect = heroBtn.getBoundingClientRect();
        // Threshold: when Hero button hits or passes the navbar area
        const shouldShow = rect.top <= 100;
        setShowMobileCTA(shouldShow);
      } else if (window.location.pathname !== '/') {
        setShowMobileCTA(true);
      }
    };

    handleResize();
    handleScroll();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Remove showMobileCTA from dependency to prevent re-binding listeners

  return (
    <header className="relative sticky top-[36px] z-50 bg-white/90 backdrop-blur-md border-b border-gray-100/50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="AdTowns Logo" className="h-9 w-auto" />
          <span className="text-2xl font-bold tracking-tighter text-black font-heading">
            adtowns<span className="text-coral">.com</span>
          </span>
        </Link>
        <ul className="hidden min-[680px]:flex space-x-8">
          {[
            { id: 'features', label: 'About' },
            { id: 'categories', label: 'Categories' },
            { id: 'prizes', label: 'Prizes' },
            { id: 'cities', label: 'Cities' },
          ].map((sec) => (
            <li key={sec.id} className="relative">
              <ScrollLink
                to={sec.id}
                smooth={true}
                duration={500}
                offset={-80}
                className="cursor-pointer text-gray-600 hover:text-coral font-medium transition-colors text-[15px]"
                onClick={() => {
                  if (window.location.pathname !== '/') {
                    navigate('/');
                    setTimeout(() => {
                        const el = document.getElementById(sec.id);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
              >
                {sec.label}
              </ScrollLink>
            </li>
          ))}
        </ul>
        {/* CTA Button with reserved space to prevent layout shake */}
        <div className="relative h-[42px] min-w-[120px] sm:min-w-[180px] flex items-center justify-end">
          <motion.div
            className={isMobile ? "absolute right-0" : "relative"}
            initial={false}
            animate={{ 
              opacity: ((!isMobile || showMobileCTA) && !isRegisterPage) ? 1 : 0,
              scale: ((!isMobile || showMobileCTA) && !isRegisterPage) ? 1 : 0,
              rotate: ((!isMobile || showMobileCTA) && !isRegisterPage) ? 0 : 15,
              y: ((!isMobile || showMobileCTA) && !isRegisterPage) ? 0 : -20,
            }}
            style={{ 
              pointerEvents: ((!isMobile || showMobileCTA) && !isRegisterPage) ? 'auto' : 'none',
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <Button variant="primary" className="whitespace-nowrap flex items-center gap-2 group px-4 py-2 sm:px-[34px] sm:py-[15px] text-xs sm:text-[15px]" onClick={() => navigate('/register')}>
              Register Interest
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
          </motion.div>
        </div>
      </nav>
    </header>
  );
}
