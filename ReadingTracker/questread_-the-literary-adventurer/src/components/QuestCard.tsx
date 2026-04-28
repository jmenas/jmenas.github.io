import React from 'react';
import { motion } from 'motion/react';
import { Trophy, CheckCircle2 } from 'lucide-react';
import { Quest } from '../types';
import { cn } from '../lib/utils';

interface QuestCardProps {
  quest: Quest;
}

export default function QuestCard({ quest }: QuestCardProps) {
  const progress = Math.min(100, (quest.currentValue / quest.targetValue) * 100);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={cn(
        "relative overflow-hidden bg-bg-secondary border rounded-xl p-6 transition-all duration-300",
        quest.isCompleted 
          ? "border-accent-gold shadow-[0_0_20px_rgba(212,175,55,0.15)]" 
          : "border-border-dark hover:border-border-light shadow-2xl"
      )}
    >
      {/* Subtle Glow for Completed Quests */}
      {quest.isCompleted && (
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent-gold opacity-10 blur-3xl pointer-events-none"></div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 flex items-center justify-center rounded-lg text-2xl border transition-all",
            quest.isCompleted 
              ? "bg-accent-gold text-bg-primary border-accent-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]" 
              : "bg-bg-primary text-text-secondary border-border-dark"
          )}>
            {quest.rewardIcon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-lg font-bold font-display uppercase tracking-tight">{quest.title}</h3>
              {quest.isCompleted && (
                <span className="text-[9px] bg-border-dark text-accent-gold px-2 py-0.5 rounded border border-border-light font-sans font-bold">COMPLETED</span>
              )}
            </div>
            <p className="text-xs text-text-secondary leading-tight line-clamp-2 italic">{quest.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-text-secondary font-sans font-bold">
          <span>Progress</span>
          <span className="font-mono text-accent-gold">{quest.currentValue.toLocaleString()} / {quest.targetValue.toLocaleString()}</span>
        </div>
        <div className="h-2 w-full bg-bg-primary rounded-full overflow-hidden border border-border-dark">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full transition-shadow duration-500",
              quest.isCompleted ? "bg-accent-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" : "bg-text-secondary"
            )}
          />
        </div>
      </div>

      {quest.isCompleted && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-5 pt-4 border-t border-border-dark text-xs text-accent-gold italic flex items-start gap-2"
        >
          <span className="text-lg leading-none">✦</span>
          <span>{quest.milestone}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
