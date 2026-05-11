import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const StarField = ({ count = 300, className = "" }) => {
  const stars = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.1,
      depth: Math.floor(Math.random() * 3), // 0: far, 1: mid, 2: near
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.depth === 2 ? star.size * 1.5 : star.size,
            height: star.depth === 2 ? star.size * 1.5 : star.size,
            opacity: star.opacity,
            boxShadow: star.depth === 2 ? '0 0 10px 1px rgba(255, 255, 255, 0.4)' : 'none',
          }}
          animate={{
            opacity: [star.opacity, star.opacity * 0.3, star.opacity],
            scale: star.depth === 2 ? [1, 1.4, 1] : [1, 1.2, 1],
            x: [0, Math.random() * 20 - 10, 0],
            y: [0, Math.random() * 20 - 10, 0],
          }}
          transition={{
            duration: star.duration * 2,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle nebula gradients for atmospheric depth */}
      <div className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 20% 30%, rgba(255, 184, 0, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 87, 87, 0.05) 0%, transparent 50%)'
        }}
      />
    </div>
  );
};

export default StarField;
