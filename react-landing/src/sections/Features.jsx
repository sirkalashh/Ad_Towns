import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useReducedMotion } from 'framer-motion';

const steps = [
  { n: 1, t: "Register your interest", d: "Sign up today with your name, business and city. Secure your shop position before anyone else in your area. No payment needed at this stage." },
  { n: 2, t: "Claim your online shop", d: "At launch, complete your shop profile — upload your image, write your best deal and add your WhatsApp number. Our AI assistant helps you craft the perfect description in seconds." },
  { n: 3, t: "Go live to your city", d: "Your shop goes live instantly. Thousands of buyers in your city can discover your deals and contact you directly via WhatsApp — no middlemen, no commission." },
  { n: 4, t: "Track everything", d: "Your seller dashboard shows daily views, customer taps and engagement. Get AI-powered weekly performance reports sent directly to your WhatsApp every Monday." },
  { n: 5, t: "Set occasion specials", d: "Create deals for birthdays, anniversaries and festivals. AdTowns automatically recommends your special offer to buyers whose occasion is coming up — smart, effortless marketing." },
  { n: 6, t: "Enter and win", d: "Register now and you're automatically entered into the grand prize competition. Vendors, visitors and referrals all get a chance to win cars, flats, bikes, cash and much more." },
];

const categories = [
  { ico: "🍽️", name: "Food", sub: "Restaurants, cafes, street food, cloud kitchens", bg: "#FAECE7" },
  { ico: "👗", name: "Fashion", sub: "Clothing, jewellery, tailoring, footwear", bg: "#FBEAF0" },
  { ico: "🏥", name: "Medical", sub: "Clinics, pharmacies, labs, dental, eye care", bg: "#E1F5EE" },
  { ico: "💆", name: "Spa", sub: "Spas, massage, wellness, ayurveda", bg: "#EEEDFE" },
  { ico: "💪", name: "Gym", sub: "Gyms, yoga, fitness, CrossFit, martial arts", bg: "#EAF3DE" },
  { ico: "🎉", name: "Events", sub: "Planners, photographers, DJs, decorators", bg: "#FAEEDA" },
  { ico: "🚀", name: "Startups", sub: "Tech startups, SaaS, D2C, new businesses", bg: "#E6F1FB" },
  { ico: "🎨", name: "Talents", sub: "Artists, tutors, coaches, freelancers", bg: "#FCEBEB" },
  { ico: "✨", name: "Miscellaneous", sub: "Repair, travel, pets, printing & more", bg: "#F1EFE8" },
];

export default function Features() {
  const stepsContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const shouldReduceMotion = useReducedMotion();
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    setIsMobileView(window.matchMedia('(max-width: 768px)').matches);
  }, []);

  const { scrollYProgress } = useScroll({
    target: stepsContainerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const newIndex = Math.min(steps.length - 1, Math.floor(latest * steps.length));
    if (newIndex !== activeIndex) {
      setDirection(newIndex > activeIndex ? 1 : -1);
      setActiveIndex(newIndex);
    }
  });

  const step = steps[activeIndex];

  return (
    <section id="features" className="bg-white relative z-10">

      {/* ─── Sticky Scroll Steps (How it works) ─── */}
      <div ref={stepsContainerRef} className="relative h-[500vh] w-full">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

          {/* Static header */}
          <div className="text-center mb-4 md:mb-8 z-10 px-4">
            <span className="text-coral font-bold uppercase tracking-wider text-sm">How it works</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold mt-2">
              Simple. Fast. <span className="text-coral">Powerful.</span>
            </h2>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 mb-6 md:mb-10 z-10">
            {steps.map((_, i) => (
              <div
                key={i}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === activeIndex ? '24px' : '8px',
                  height: '8px',
                  backgroundColor: i === activeIndex ? '#EF9F27' : '#E0E0E0',
                }}
              />
            ))}
          </div>

          {/* Single animated card — AnimatePresence mode="wait" guarantees only ONE in DOM */}
          <div className="relative w-full max-w-3xl px-6 flex items-center justify-center" style={{ minHeight: '280px' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step.n}
                custom={direction}
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-col items-center text-center w-full"
              >
                <div className="w-16 h-16 bg-coral text-white rounded-2xl flex items-center justify-center text-2xl font-extrabold mb-6 shadow-[0_10px_30px_rgba(239,159,39,0.3)]">
                  {step.n}
                </div>
                <h3 className="text-3xl md:text-5xl font-extrabold mb-5 leading-tight text-[#0f0f0f]">
                  {step.t}
                </h3>
                <p className="text-[#666] text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
                  {step.d}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Scroll hint on first step */}
          <AnimatePresence>
            {activeIndex === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute bottom-10 text-[13px] text-gray-400 flex flex-col items-center gap-1"
              >
                <span>Scroll to explore</span>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                >
                  ↓
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* ─── Categories & Pricing ─── */}
      <div className="max-w-7xl mx-auto px-4 pt-0 pb-16 md:py-32 bg-white relative z-20">

        {/* Categories */}
        <div id="categories" className="text-center mb-10 md:mb-16">
          <span className="text-coral font-bold uppercase tracking-wider text-sm">9 categories</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">Every business has <span className="text-coral">a home here</span></h2>
          <p className="text-text mt-4 max-w-2xl mx-auto text-lg">From home-cooked food to high-end spas — AdTowns covers every type of local business across India.</p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-32"
          style={{ perspective: isMobileView ? undefined : 1200 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: isMobileView ? 0.06 : 0.1 } } }}
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              variants={isMobileView ? {
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
              } : {
                hidden: { opacity: 0, z: -100, rotateX: 15, y: 40 },
                visible: { opacity: 1, z: 0, rotateX: 0, y: 0, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
              }}
              whileInView={isMobileView && !shouldReduceMotion ? {
                y: -6,
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                borderColor: "rgba(239, 159, 39, 0.3)",
              } : {}}
              viewport={isMobileView ? { amount: 0.4, margin: "-15% 0px -15% 0px" } : { once: true }}
              className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] md:hover:shadow-xl md:hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl category-icon-${cat.name.toLowerCase()}`}
                style={{ backgroundColor: cat.bg }}
              >
                <span className="relative z-10">{cat.ico}</span>
              </div>
              <div>
                <div className="font-bold text-lg">{cat.name}</div>
                <div className="text-sm text-gray-500 truncate max-w-[200px]">{cat.sub}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Floor pricing */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-20"
        >
          <div className="text-center mb-10">
            <span className="text-coral font-bold uppercase tracking-wider text-sm">Shop pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">Simple floor-based <span className="text-coral">pricing</span></h2>
            <p className="text-text mt-4 max-w-xl mx-auto text-lg">Every shop is the same size. Your floor position determines visibility — not your budget.</p>
          </div>

          <div className="bg-[#F5F4F0] rounded-[20px] border border-gray-200 overflow-hidden mb-4 max-w-4xl mx-auto shadow-lg">
            <div className="grid grid-cols-3 bg-black/5 px-5 py-3 border-b border-gray-200">
              <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-gray-500">Floor</span>
              <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-gray-500">Price (incl. GST)</span>
              <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-gray-500">Best for</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 px-5 py-4 border-b border-gray-200 items-center transition-colors hover:bg-black/5 bg-[rgba(239,159,39,0.05)] gap-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-semibold text-gray-900">Ground Floor</span>
                <span className="text-[9px] font-bold bg-[#EF9F27] text-white px-2 py-0.5 rounded">Premium</span>
              </div>
              <div className="font-heading text-[15px] font-extrabold text-coral">₹1,499.88/yr</div>
              <div className="text-[14px] text-gray-500">Maximum visibility · seen first by every visitor</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 px-5 py-4 border-b border-gray-200 items-center transition-colors hover:bg-black/5 bg-[rgba(239,159,39,0.05)] gap-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-semibold text-gray-900">1st Floor</span>
                <span className="text-[9px] font-bold bg-[#EF9F27] text-white px-2 py-0.5 rounded">Premium</span>
              </div>
              <div className="font-heading text-[15px] font-extrabold text-coral">₹1,499.88/yr</div>
              <div className="text-[14px] text-gray-500">High visibility · strong position for new businesses</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 px-5 py-4 border-b border-gray-200 items-center transition-colors hover:bg-black/5 gap-y-2">
              <div className="text-[16px] font-semibold text-gray-900">2nd Floor onwards</div>
              <div className="font-heading text-[15px] font-extrabold text-coral">₹999.88/yr</div>
              <div className="text-[14px] text-gray-500">Great value · equal exposure as you scroll</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 px-5 py-4 items-center transition-colors bg-[rgba(83,74,183,0.03)] gap-y-2">
              <div className="text-[13px] font-semibold text-gray-500">Startups, Talents & Misc</div>
              <div className="text-[13px] font-bold text-gray-500">₹499.88 – ₹999.88/yr</div>
              <div className="text-[14px] text-gray-500">Specially affordable for new & creative businesses</div>
            </div>
          </div>

          <p className="text-[14px] text-gray-500 text-center max-w-xl mx-auto">All prices include 18% GST · Valid for 1 full year · Every shop is the same size — floor only affects position</p>
        </motion.div>

      </div>
    </section>
  );
}
