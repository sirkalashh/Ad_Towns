import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, animate, useMotionValue, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import Button from '../components/Button';

/* ─── Apple-Style Sticky CTA Bar ────────────────────────── */
// Only appears AFTER the user has scrolled past the hero buttons.
// Uses scroll position vs element offset — never fires on page load.
function HeroStickyBar({ triggerRef }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (!triggerRef.current) return;
    // getBoundingClientRect().bottom < 0 means the entire element
    // has scrolled above the top of the viewport → show the bar.
    const bottom = triggerRef.current.getBoundingClientRect().bottom;
    setVisible(bottom < 0);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="sticky-cta"
          className="hero-sticky-bar"
          initial={{ y: 100, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 420, damping: 40 }}
        >
          <div className="hero-sticky-inner">
            {/* Left: live status */}
            <div className="hero-sticky-label">
              <span className="hero-sticky-dot" />
              <span>Pre-launching · India</span>
            </div>

            {/* Thin divider */}
            <div className="hero-sticky-divider" />

            {/* Right: actions */}
            <div className="hero-sticky-actions">
              <button
                className="hero-sticky-secondary"
                onClick={() => {
                  const el = document.getElementById('features');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn more
              </button>
              <button
                className="hero-sticky-primary"
                onClick={() => navigate('/register')}
              >
                Register Interest ↗
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Stat Item Component ────────────────────────────────── */
function StatItem({ value, label, prefix = "", suffix = "", scrollY }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  const highlightWidth = useTransform(scrollY, [0, 400], ["0%", "100%"]);
  const highlightOpacity = useTransform(scrollY, [0, 200, 400], [0, 1, 1]);
  const scale = useTransform(scrollY, [0, 400], [1, 1.08]);
  
  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => setDisplayValue(Math.floor(latest))
      });
      return () => controls.stop();
    }
  }, [isInView, value, count]);

  const formattedNumber = new Intl.NumberFormat('en-IN').format(displayValue);

  return (
    <motion.div 
      ref={ref} 
      className="text-center relative px-2"
      style={{ scale }}
    >
      <div className="relative inline-block px-1">
        <motion.div 
          className="absolute bottom-[15%] left-0 h-[35%] bg-gold/25 rounded-[2px] -z-10"
          style={{ width: highlightWidth, opacity: highlightOpacity }}
        />
        <div className="text-[clamp(24px,4vw,32px)] font-extrabold text-[#0f0f0f] font-heading tabular-nums leading-none">
          {prefix}{formattedNumber}{suffix}
        </div>
      </div>
      <div className="text-[10px] font-bold text-[#888] mt-[4px] uppercase tracking-[0.1em]">
        {label}
      </div>
    </motion.div>
  );
}

/* ─── Hero Section ───────────────────────────────────────── */
export default function Hero({ opacity }) {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const ctaRef = useRef(null);

  const statsY = useTransform(scrollY, [0, 500], ["0px", "-30px"]);
  const contentY = useTransform(scrollY, [0, 500], ["0px", "-20px"]);
  const bgOpacity = useTransform(scrollY, [0, 600], [0.06, 0.18]);

  return (
    <>
      <section id="hero" className="hero-section relative">
        {/* Background Faded Logo */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center select-none">
          <motion.img
            src="/logo.png"
            alt=""
            className="w-[60%] max-w-[500px] pointer-events-none"
            style={{ 
              opacity: bgOpacity,
              y: useTransform(scrollY, [0, 1000], [0, 100]),
              scale: useTransform(scrollY, [0, 1000], [1, 1.05])
            }}
          />
        </div>
        <motion.div 
          className="relative z-10 max-w-[95%] md:max-w-[90%] lg:max-w-[850px] xl:max-w-[1000px] 2xl:max-w-[1100px] min-[1650px]:max-w-[760px] mx-auto px-6 text-center flex flex-col items-center"
          style={{ y: contentY }}
        >
          {/* Badge */}
          <motion.div 
            className="premium-badge inline-flex items-center gap-3 px-[26px] py-[10px] rounded-full text-[#854F0B] text-[15px] font-bold mb-3"
            style={{ opacity }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
            Pre-launching across India · Something big is coming
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="font-extrabold tracking-tight text-[#0f0f0f] leading-[1.07] mb-3"
            style={{ 
              fontSize: 'clamp(32px, 5vw, 60px)', 
              letterSpacing: 'clamp(-0.5px, -0.2vw, -2px)',
              opacity
            }}
          >
            India's new local marketplace.<br />
            <span className="text-coral">Your city.</span> <span className="text-gold">Your shop.</span><br />
            Your customers.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-[#555] leading-[1.6] max-w-[90%] md:max-w-[80%] lg:max-w-[700px] xl:max-w-[850px] 2xl:max-w-[900px] min-[1650px]:max-w-[580px] mx-auto mb-6"
            style={{ 
              fontSize: 'clamp(14px, 1.7vw, 18px)',
              opacity
            }}
          >
            AdTowns is about to change how India shops local. One platform.{' '}
            100 cities. 9 categories. Every local seller — from the tiniest home{' '}
            business to the biggest store — gets an equal opportunity to be discovered.
          </motion.p>

          {/* Stats */}
          <motion.div 
            className="flex flex-wrap justify-center gap-x-[clamp(16px,5vw,40px)] gap-y-5 mb-8 bg-white/30 backdrop-blur-md py-4 px-6 md:px-10 rounded-[28px] border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.02)]"
            style={{ opacity, y: statsY }}
          >
            <StatItem value={100} label="Indian cities" scrollY={scrollY} />
            <StatItem value={9} label="Categories" scrollY={scrollY} />
            <StatItem value={180000} label="Online shops" suffix="+" scrollY={scrollY} />
            <StatItem value={0} label="Commission on sales" prefix="₹" scrollY={scrollY} />
          </motion.div>

          {/* Buttons — ctaRef tracks when these leave viewport */}
          <div ref={ctaRef} className="flex flex-wrap justify-center gap-3 relative z-10">
            <Button id="hero-register-btn" variant="primary" onClick={() => navigate('/register')}>
              Register your interest now ↗
            </Button>
            <Button variant="secondary" onClick={() => {
              const el = document.getElementById('features');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>
              Learn more
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Sticky CTA — only fires after buttons leave viewport */}
      <HeroStickyBar triggerRef={ctaRef} />
    </>
  );
}
