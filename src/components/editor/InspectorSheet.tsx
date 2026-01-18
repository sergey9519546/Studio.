import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Scissors, Type, Trash2, X, Wand2 } from 'lucide-react';

interface InspectorSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedType: 'video' | 'audio' | 'text' | null;
}

export const InspectorSheet: React.FC<InspectorSheetProps> = ({ isOpen, onClose, selectedType }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 h-[45vh] bg-zinc-900 rounded-t-[32px] border-t border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col"
          >
             {/* Handle */}
             <div className="w-full flex justify-center pt-4 pb-2" onPointerDown={onClose}>
                 <div className="w-12 h-1.5 bg-zinc-700 rounded-full"></div>
             </div>

             <div className="flex-1 p-6 overflow-y-auto">
                 <div className="flex justify-between items-center mb-6">
                     <h3 className="text-lg font-bold text-white capitalize flex items-center gap-2">
                        {selectedType === 'video' && <Scissors size={18} className="text-blue-400" />}
                        {selectedType || 'Clip'} Settings
                     </h3>
                     <button onClick={onClose} className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                         <X size={20} />
                     </button>
                 </div>

                 {/* Contextual Tools */}
                 <div className="grid grid-cols-4 gap-3 mb-8">
                     {selectedType === 'video' && (
                         <>
                             <ToolButton icon={<Scissors size={20} />} label="Split" />
                             <ToolButton icon={<Volume2 size={20} />} label="Volume" />
                             <ToolButton icon={<Type size={20} />} label="Caption" />
                             <ToolButton icon={<Trash2 size={20} />} label="Delete" color="text-red-500" />
                         </>
                     )}

                     {(!selectedType || selectedType === 'audio') && (
                         <>
                             <ToolButton icon={<Volume2 size={20} />} label="Volume" />
                             <ToolButton icon={<Scissors size={20} />} label="Split" />
                             <ToolButton icon={<Trash2 size={20} />} label="Delete" color="text-red-500" />
                         </>
                     )}
                 </div>

                 {/* Generative AI Section */}
                 <div className="p-4 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-2xl border border-white/5">
                     <div className="flex items-center gap-2 mb-3">
                        <Wand2 size={16} className="text-purple-400" />
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Generative AI</h4>
                     </div>
                     <button className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm shadow-lg shadow-purple-900/20 active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <span>✨ Magic Enhance</span>
                     </button>
                 </div>
             </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ToolButton = ({ icon, label, color = "text-white" }: { icon: React.ReactNode, label: string, color?: string }) => (
    <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-zinc-800/50 hover:bg-zinc-800 active:scale-95 transition-all border border-white/5 w-full">
        <div className={`${color}`}>{icon}</div>
        <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">{label}</span>
    </button>
);
