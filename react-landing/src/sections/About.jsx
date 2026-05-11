import React, { useRef, useState, useEffect } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

const aboutCards = [
  {
    icon: "🏪",
    accentColor: "rgba(216, 90, 48, 0.02)",
    accentGlow: "rgba(216, 90, 48, 0.08)",
    borderFrom: "#fbc2eb", /* Light pinkish orange */
    borderMid: "#f6d365",  /* Light gold */
    title: "Local sellers & vendors",
    desc: "Open your online shop on AdTowns. Reach thousands of local buyers in your city browsing daily. No tech skills needed. Our AI writes your shop description for you. You keep 100% of your revenue — zero commission.",
    tagText: "Vendors can win grand prizes",
    tagColor: "#993C1D",
    tagBg: "rgba(216, 90, 48, 0.03)",
    tagBorder: "rgba(216, 90, 48, 0.08)",
  },
  {
    icon: "🛍️",
    accentColor: "rgba(29, 158, 117, 0.02)",
    accentGlow: "rgba(29, 158, 117, 0.08)",
    borderFrom: "#84fab0", /* Light mint */
    borderMid: "#8fd3f4",  /* Light sky */
    title: "Buyers & visitors",
    desc: "Discover the best local deals in your city — restaurants, salons, gyms, doctors and more. Browse by category, connect via WhatsApp and get exclusive deals only available on AdTowns. Shop local, save more.",
    tagText: "Visitors can win grand prizes",
    tagColor: "#085041",
    tagBg: "rgba(29, 158, 117, 0.03)",
    tagBorder: "rgba(29, 158, 117, 0.08)",
  },
  {
    icon: "🤝",
    accentColor: "rgba(108, 99, 200, 0.02)",
    accentGlow: "rgba(108, 99, 200, 0.08)",
    borderFrom: "#a18cd1", /* Light lavender */
    borderMid: "#fbc2eb",  /* Light pink */
    title: "Referrers & promoters",
    desc: "Know a business that should be on AdTowns? Refer them and earn rewards. The more businesses you bring to your city, the higher your chances of winning big in our grand prize competition.",
    tagText: "Referrals can win grand prizes",
    tagColor: "#3C3489",
    tagBg: "rgba(108, 99, 200, 0.03)",
    tagBorder: "rgba(108, 99, 200, 0.08)",
  }
];

function LiquidGlassCard({ card, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const frameRef = useRef(null);

  // Disable tilt entirely on touch/mobile devices
  const isMobileDevice = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  const shouldReduceMotion = useReducedMotion();

  // Scroll detection for mobile
  const isInView = useInView(cardRef, {
    amount: 0.4,
    margin: "-15% 0px -15% 0px"
  });

  useEffect(() => {
    if (isMobileDevice) {
      setIsHovered(isInView && !shouldReduceMotion);
    }
  }, [isInView, isMobileDevice, shouldReduceMotion]);

  const handleMouseMove = (e) => {
    if (isMobileDevice || !cardRef.current) return;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const rect = cardRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      setTilt({ x: dy * -10, y: dx * 10 });
    });
  };

  const handleMouseLeave = () => {
    if (isMobileDevice) return;
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    if (isMobileDevice) return;
    setIsHovered(true);
  };

  const animDelay = index * 0.15;

  return (
    <div
      ref={cardRef}
      className={`liquid-glass-card${isHovered && isMobileDevice ? ' mobile-hover' : ''}`}
      style={{
        '--accent-color': card.accentColor,
        '--accent-glow': card.accentGlow,
        '--border-from': card.borderFrom,
        '--border-mid': card.borderMid,
        '--tilt-x': `${tilt.x}deg`,
        '--tilt-y': `${tilt.y}deg`,
        '--anim-delay': `${animDelay}s`,
        transform: isMobileDevice
          ? isHovered && !shouldReduceMotion ? 'scale(1.02)' : 'none'
          : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isMobileDevice
          ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease'
          : isHovered
          ? 'transform 0.08s ease-out, box-shadow 0.4s ease'
          : 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
        /* Apply hover styles when isHovered is true on mobile */
        ...(isMobileDevice && isHovered ? {
          boxShadow: `
            0 2px 0px rgba(255, 255, 255, 0.9) inset,
            0 -1px 0 rgba(255, 255, 255, 0.4) inset,
            0 40px 80px -16px rgba(0, 0, 0, 0.18),
            0 16px 40px -12px rgba(0, 0, 0, 0.12),
            0 0 0 1px rgba(255, 255, 255, 0.7) inset,
            0 0 60px -20px ${card.accentGlow || 'rgba(216, 90, 48, 0.3)'}
          `
        } : {})
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Chromatic spinning border */}
      <div className="glass-border-spin" style={{ '--b-from': card.borderFrom, '--b-mid': card.borderMid }} />

      {/* Caustic light blobs */}
      <div className="glass-caustic glass-caustic-1" style={{ animationDelay: `${animDelay}s` }} />
      <div className="glass-caustic glass-caustic-2" style={{ animationDelay: `${animDelay + 1.3}s` }} />

      {/* Specular highlight (top-edge gleam) */}
      <div className={`glass-specular${isHovered ? ' glass-specular--active' : ''}`} />

      {/* Glass inner content layer */}
      <div className="glass-inner">
        {/* Icon orb */}
        <div className="glass-icon-orb" style={{ '--orb-accent': card.accentColor, '--orb-glow': card.accentGlow }}>
          <span className="glass-icon-emoji">{card.icon}</span>
          <div className="orb-inner-shine" />
        </div>

        {/* Text */}
        <h3 className="glass-card-title">{card.title}</h3>
        <p className="glass-card-desc">{card.desc}</p>

        {/* Tag chip */}
        <span
          className="glass-tag"
          style={{
            color: card.tagColor,
            background: card.tagBg,
            borderColor: card.tagBorder,
          }}
        >
          <span className="glass-tag-dot" style={{ background: card.tagColor }} />
          {card.tagText}
        </span>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="about-section">
      {/* SVG liquid displacement filter */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="liquid-glass-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.012"
              numOctaves="3"
              seed="5"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Background gradient mesh blobs */}
      <div className="about-mesh-blob about-mesh-blob-1" />
      <div className="about-mesh-blob about-mesh-blob-2" />
      <div className="about-mesh-blob about-mesh-blob-3" />

      <div className="about-inner">
        {/* Header */}
        <div className="about-header">
          <span className="about-eyebrow">Who is AdTowns for</span>
          <h2 className="about-heading">
            Built for <span className="text-coral">every Indian business</span>
          </h2>
          <p className="about-subtext">
            Whether you sell food, fashion, services or skills — AdTowns has a home for you. And it's not just for sellers.
          </p>
        </div>

        {/* Cards grid */}
        <div className="about-cards-grid">
          {aboutCards.map((card, idx) => (
            <LiquidGlassCard key={idx} card={card} index={idx} />
          ))}
        </div>
      </div>

      <div className="mt-12 md:mt-20 h-px bg-gray-200 w-full" />
    </section>
  );
}
