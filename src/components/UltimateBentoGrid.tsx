import { motion } from 'framer-motion';
import {
    Database,
    FileText,
    Film,
    Image as ImageIcon,
    Palette,
    Sparkles,
    Target,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import React from 'react';

/**
 * ULTIMATE BENTO GRID — DESIGN GOD MODE
 * 
 * Philosophy: Asymmetric beauty. Weighted importance. Computational elegance.
 * Inspired by: Apple Vision Pro UI, Notion 2.0, Linear Dashboard
 */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    }
  }
};

interface BentoCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  gradient: string;
  className?: string;
  children?: React.ReactNode;
}

const BentoCard: React.FC<BentoCardProps> = ({ 
  title, 
  description, 
  icon, 
  gradient, 
  className = '',
  children 
}) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ 
        scale: 1.02,
        transition: { type: 'spring', stiffness: 400, damping: 17 }
      }}
      className={`
        group relative overflow-hidden rounded-3xl border border-border-subtle
        bg-gradient-to-br ${gradient}
        backdrop-blur-xl shadow-card hover:shadow-float
        transition-shadow duration-500
        ${className}
      `}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-xl" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-primary shadow-glow"
          />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-ink-primary mb-2 tracking-tight">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-ink-secondary leading-relaxed mb-4">
            {description}
          </p>
        )}

        {/* Custom content */}
        {children && (
          <div className="flex-1 mt-auto">
            {children}
          </div>
        )}
      </div>

      {/* Hover gradient effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
      </div>
    </motion.div>
  );
};

const UltimateBentoGrid: React.FC = () => {
  return (
    <div className="min-h-screen bg-app p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1800px] mx-auto grid grid-cols-12 gap-6 auto-rows-[180px]"
      >
        {/* 1. HERO CARD — Massive impact (4 cols x 2 rows) */}
        <BentoCard
          title="Creative Brief"
          description="The vision, constraints, and soul of your project. Every word matters."
          icon={<FileText size={24} className="text-primary" />}
          gradient="from-surface to-subtle"
          className="col-span-12 md:col-span-4 row-span-2"
        >
          <div className="mt-4 space-y-3">
            <div className="h-3 bg-ink-primary/10 rounded-full w-full" />
            <div className="h-3 bg-ink-primary/10 rounded-full w-5/6" />
            <div className="h-3 bg-ink-primary/10 rounded-full w-4/6" />
          </div>
        </BentoCard>

        {/* 2. VISUAL INTELLIGENCE — Wide feature (5 cols x 2 rows) */}
        <BentoCard
          title="Asset Library"
          description="AI-analyzed visuals. Every image tells a computational story."
          icon={<ImageIcon size={24} className="text-ink-secondary" />}
          gradient="from-subtle to-surface"
          className="col-span-12 md:col-span-5 row-span-2"
        >
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="aspect-square rounded-xl bg-gradient-to-br from-subtle to-border-subtle shadow-sm"
              />
            ))}
          </div>
        </BentoCard>

        {/* 3. METADATA STACK — Vertical emphasis (3 cols x 2 rows) */}
        <BentoCard
          title="Deliverables"
          description="16:9, 4K, 60fps. Precision matters."
          icon={<Target size={24} className="text-ink-secondary" />}
          gradient="from-surface to-subtle"
          className="col-span-12 md:col-span-3 row-span-2"
        >
          <div className="space-y-2 mt-4 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-ink-tertiary">FORMAT</span>
              <span className="font-bold text-ink-primary">16:9</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-tertiary">RES</span>
              <span className="font-bold text-ink-primary">4K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-tertiary">FPS</span>
              <span className="font-bold text-ink-primary">60</span>
            </div>
          </div>
        </BentoCard>

        {/* 4. AI INSIGHTS — Compact power (3 cols x 1 row) - ONLY CARD WITH COLOR */}
        <BentoCard
          title="Gemini Insights"
          icon={<Sparkles size={20} className="text-primary" />}
          gradient="from-primary-tint to-surface"
          className="col-span-12 md:col-span-3 row-span-1"
        >
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 bg-border-subtle rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '78%' }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full bg-primary"
              />
            </div>
            <span className="text-xs font-bold text-primary">78%</span>
          </div>
        </BentoCard>

        {/* 5. TEAM — Social proof (3 cols x 1 row) */}
        <BentoCard
          title="Team"
          icon={<Users size={20} className="text-ink-secondary" />}
          gradient="from-subtle to-surface"
          className="col-span-12 md:col-span-3 row-span-1"
        >
          <div className="flex -space-x-2 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-subtle to-border-subtle border-2 border-white shadow-sm"
              />
            ))}
          </div>
        </BentoCard>

        {/* 6. MOOD BOARD — Aesthetic showcase (3 cols x 1 row) */}
        <BentoCard
          title="Mood Palette"
          icon={<Palette size={20} className="text-ink-secondary" />}
          gradient="from-surface to-subtle"
          className="col-span-12 md:col-span-3 row-span-1"
        >
          <div className="flex gap-1 mt-2">
            {/* Subtle hint of edge colors only in mood palette */}
            <div className="flex-1 h-6 rounded-lg shadow-sm bg-gradient-to-br from-subtle to-border-subtle" />
            <div className="flex-1 h-6 rounded-lg shadow-sm bg-[#18C9AE]/20" />
            <div className="flex-1 h-6 rounded-lg shadow-sm bg-primary/20" />
            <div className="flex-1 h-6 rounded-lg shadow-sm bg-[#E14BF7]/20" />
            <div className="flex-1 h-6 rounded-lg shadow-sm bg-gradient-to-br from-subtle to-border-subtle" />
          </div>
        </BentoCard>

        {/* 7. ACTIVITY PULSE — Live data (3 cols x 1 row) */}
        <BentoCard
          title="Activity"
          icon={<TrendingUp size={20} className="text-ink-secondary" />}
          gradient="from-subtle to-surface"
          className="col-span-12 md:col-span-3 row-span-1"
        >
          <div className="flex items-end gap-1 h-12 mt-2">
            {[40, 70, 50, 90, 60, 80, 95].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex-1 bg-border-subtle rounded-t"
              />
            ))}
          </div>
        </BentoCard>

        {/* 8. INTELLIGENCE HUB — Context engine (4 cols x 1 row) */}
        <BentoCard
          title="Project Intelligence"
          description="PDFs, URLs, and context—all indexed for AI."
          icon={<Database size={20} className="text-ink-secondary" />}
          gradient="from-surface to-subtle"
          className="col-span-12 md:col-span-4 row-span-1"
        >
          <div className="flex items-center gap-2 mt-2">
            <div className="px-2 py-1 bg-subtle rounded text-xs font-mono text-ink-secondary">12 sources</div>
            <div className="px-2 py-1 bg-subtle rounded text-xs font-mono text-ink-secondary">847 chunks</div>
          </div>
        </BentoCard>

        {/* 9. SCRIPTS — Creative output (5 cols x 1 row) */}
        <BentoCard
          title="Generated Scripts"
          description="3 drafts ready. AI never sleeps."
          icon={<Film size={20} className="text-ink-secondary" />}
          gradient="from-subtle to-surface"
          className="col-span-12 md:col-span-5 row-span-1"
        >
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {['v1.2', 'v2.0', 'v2.1'].map((version) => (
              <div
                key={version}
                className="px-3 py-1.5 bg-surface border border-border-subtle rounded-lg text-xs font-bold text-ink-primary whitespace-nowrap"
              >
                {version}
              </div>
            ))}
          </div>
        </BentoCard>

        {/* 10. QUICK ACTION — CTA (3 cols x 1 row) - Primary blue for CTA */}
        <BentoCard
          title="Launch Studio"
          icon={<Zap size={20} className="text-primary" />}
          gradient="from-primary-tint to-surface"
          className="col-span-12 md:col-span-3 row-span-1"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-2 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-sm"
          >
            Start Writing →
          </motion.button>
        </BentoCard>
      </motion.div>

      {/* Floating stats overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-8 right-8 px-6 py-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-float border border-border-subtle"
      >
        <div className="text-xs font-mono text-ink-tertiary mb-1">COMPUTATIONAL STATUS</div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-ink-primary">System Optimal</span>
        </div>
      </motion.div>
    </div>
  );
};

export default UltimateBentoGrid;
