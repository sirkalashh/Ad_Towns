import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from '../sections/Hero';
import Fomo from '../sections/Fomo';
import About from '../sections/About';
import Features from '../sections/Features';
import Prizes from '../sections/Prizes';
import Cities from '../sections/Cities';
import PromiseSection from '../sections/Promise';
import SEO from '../components/SEO';
import StarField from '../components/StarField';

export default function Home() {
  const { scrollY } = useScroll();

  // iOS Card Stack effect: As user scrolls down 800px, the Hero shrinks into a background card
  const heroScale = useTransform(scrollY, [0, 800], [1, 0.9]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0.4]);
  const heroY = useTransform(scrollY, [0, 500], ["0px", "-20px"]);
  const heroRadius = useTransform(scrollY, [0, 300], ["0px", "40px"]);

  return (
    <div className="bg-[#050507] relative" style={{ background: 'radial-gradient(circle at top center, #0c0c14 0%, #050507 100%)' }}>
      <SEO />
      <StarField count={200} className="opacity-40" />
      {/* Sticky Hero Background */}
      <div className="h-auto md:min-h-screen w-full relative md:sticky top-0 overflow-visible">
        <motion.div 
          className="w-full h-full bg-bg md:shadow-2xl"
          style={{
            scale: heroScale,
            y: heroY,
            borderRadius: heroRadius,
            transformOrigin: "top center"
          }}
        >
          <Hero opacity={heroOpacity} />
        </motion.div>
      </div>

      {/* The overlapping content sheet */}
      <div className="relative z-20 bg-bg w-full rounded-t-[40px] shadow-[0_-40px_80px_rgba(0,0,0,0.15)] pb-10">
        {/* Subtle top indicator line like iOS sheets */}
        <div className="w-full flex justify-center pt-4 pb-2 absolute top-0 left-0">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full opacity-50"></div>
        </div>
        
        <Fomo />
        <About />
        <Features />
        <Prizes />
        <Cities />
        <PromiseSection />
      </div>

    </div>
  );
}
