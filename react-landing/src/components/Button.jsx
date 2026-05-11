import { motion } from "framer-motion";

/**
 * Reusable button component.
 * `variant` can be "primary" or "secondary".
 */
export default function Button({ children, onClick, variant = "primary", type = "button", className = "", ...props }) {
  const baseClasses = "px-[34px] py-[15px] rounded-[22px] text-[15px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 flex items-center justify-center";
  const variants = {
    primary: "bg-coral text-white font-bold hover:bg-[#993C1D] focus-visible:ring-coral",
    secondary: "bg-white/60 backdrop-blur-sm border border-black/5 text-[#0f0f0f] font-semibold hover:bg-white/80 focus-visible:ring-gray-300 shadow-sm",
  };
  const classes = `${baseClasses} ${variants[variant] || variants.primary} ${className}`;
  
  return (
    <motion.button 
      type={type} 
      className={classes} 
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
