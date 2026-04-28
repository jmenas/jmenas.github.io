import React from 'react';
import { motion } from 'motion/react';
import { X, User, Sparkles } from 'lucide-react';

interface CharacterOverlayProps {
  message: { name: string; text: string };
  onClose: () => void;
}

export default function CharacterOverlay({ message, onClose }: CharacterOverlayProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:p-12 pointer-events-none">
      <div className="absolute inset-0 bg-bg-primary/40 backdrop-blur-sm pointer-events-none"></div>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="w-full max-w-2xl bg-bg-secondary text-text-primary rounded-xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative pointer-events-auto border-2 border-border-dark overflow-hidden"
      >
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-gold opacity-[0.03] blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 gold-gradient"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary hover:bg-bg-primary rounded-full transition-all"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10">
          <div className="shrink-0">
            <div className="w-24 h-24 bg-bg-primary rounded-xl flex items-center justify-center border-2 border-accent-gold shadow-2xl relative group">
              <User size={48} className="text-accent-gold group-hover:scale-110 transition-transform" />
              {/* Magical Sparkle Effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-3 -right-3 text-accent-gold"
              >
                <Sparkles size={24} />
              </motion.div>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-sm font-bold font-display uppercase tracking-[0.3em] text-accent-gold mb-3">{message.name}</h3>
            <div className="text-xl italic font-serif leading-relaxed text-[#f2e2ce]">
              "{message.text}"
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full sm:w-auto px-10 py-3 bg-accent-gold text-bg-primary font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-all shadow-xl rounded"
              >
                Accept Quest
              </motion.button>
              <span className="text-[10px] text-text-secondary uppercase tracking-widest animate-pulse">Waiting for your lead...</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
