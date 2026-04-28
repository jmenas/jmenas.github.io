import React from 'react';
import { motion } from 'motion/react';
import { BarChart3 } from 'lucide-react';

interface StatCardProps {
  title: string;
  description: string;
  data: Record<number, number>;
}

export default function StatCard({ title, description, data }: StatCardProps) {
  const years = Object.keys(data).map(Number).sort();
  const maxValue = Math.max(...Object.values(data), 1);

  return (
    <div className="bg-bg-secondary border border-border-dark rounded-xl p-6 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
        <BarChart3 size={80} />
      </div>
      
      <div className="flex items-center gap-3 mb-8 border-b border-border-dark pb-4">
        <div className="p-2 bg-bg-primary border border-border-dark rounded">
          <BarChart3 className="text-accent-gold" size={16} />
        </div>
        <div>
          <h3 className="text-sm font-bold font-display uppercase tracking-widest leading-none mb-1">{title}</h3>
          <p className="text-[10px] text-text-secondary italic leading-none">{description}</p>
        </div>
      </div>
      
      <div className="flex items-end gap-3 h-40 pt-4 px-2">
        {years.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest opacity-30 italic">
            No archives found
          </div>
        ) : (
          years.map(year => (
            <div key={year} className="flex-1 flex flex-col items-center gap-3 group">
              <div className="relative w-full flex items-end justify-center h-full">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data[year] / maxValue) * 100}%` }}
                  className="w-full bg-accent-gold/20 group-hover:bg-accent-gold/40 rounded-t border-t border-x border-accent-gold/30 transition-all duration-300"
                />
                <div className="absolute -top-6 text-[9px] font-mono font-bold text-accent-gold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-bg-primary px-1.5 py-0.5 rounded border border-border-dark shadow-lg">
                  {data[year]}
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold text-text-secondary group-hover:text-text-primary transition-colors">{year}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
