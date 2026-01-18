import React from 'react';
import { motion } from 'framer-motion';

interface LiquidInterfaceProps {
  children: React.ReactNode;
  className?: string;
}

export function LiquidContainer({ children, className = '' }: LiquidInterfaceProps) {
  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      {/* Ambient background gradients - Monochromatic */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-zinc-800/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-zinc-700/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Glass Surface */}
      <div className="relative z-10 w-full h-full backdrop-blur-[20px] bg-white/5 border border-white/10 shadow-[inset_0_0_100px_rgba(255,255,255,0.05)] text-white overflow-hidden">
        {children}
      </div>
    </div>
  );
}

interface LiquidButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  isActive?: boolean;
}

export function LiquidButton({ onClick, children, isActive = false }: LiquidButtonProps) {
  return (
    <motion.button
      className={`relative px-6 py-3 rounded-full font-medium text-sm transition-colors overflow-hidden group
        ${isActive ? 'text-black' : 'text-white hover:text-white/90'}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Fluid Background - Active State (Sliding Pill) */}
      {isActive && (
        <motion.div
          className="absolute inset-0 z-[-1] rounded-full filter blur-[8px] bg-white"
          layoutId="liquid-bg"
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      )}

      {/* Inactive State Background */}
      {!isActive && (
        <div className="absolute inset-0 z-[-1] rounded-full filter blur-[8px] bg-white/10 transition-colors duration-300" />
      )}

      {/* Liquid morphing effect on hover - pseudo-element simulation via another div */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

export function LiquidToolbar({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex items-center gap-4 p-2 rounded-full bg-black/20 backdrop-blur-xl border border-white/5 shadow-2xl"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
    >
      {children}
    </motion.div>
  );
}
