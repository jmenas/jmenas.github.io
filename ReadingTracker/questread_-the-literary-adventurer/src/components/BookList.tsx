import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Star, Book as BookIcon, Calendar, Hash } from 'lucide-react';
import { Book } from '../types';
import { cn } from '../lib/utils';

interface BookListProps {
  books: Book[];
}

export default function BookList({ books }: BookListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'pages'>('date');

  const filteredBooks = books
    .filter(b => 
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.dateRead || '').getTime() - new Date(a.dateRead || '').getTime();
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'pages') return b.pages - a.pages;
      return 0;
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent-gold transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search the archives by title or author..."
            className="w-full pl-12 pr-4 py-3 bg-bg-secondary border border-border-dark rounded focus:outline-none focus:border-accent-gold transition-colors font-serif italic text-text-primary placeholder:text-text-secondary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          <SortButton active={sortBy === 'date'} onClick={() => setSortBy('date')} label="Recently Read" />
          <SortButton active={sortBy === 'rating'} onClick={() => setSortBy('rating')} label="Highest Rating" />
          <SortButton active={sortBy === 'pages'} onClick={() => setSortBy('pages')} label="Length" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.bookId}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 1) }}
              className="bg-bg-secondary border border-border-dark p-6 rounded-lg shadow-xl hover:border-accent-gold transition-all flex flex-col group relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-accent-gold opacity-0 group-hover:opacity-[0.03] blur-2xl transition-opacity pointer-events-none"></div>

              <div className="flex gap-6 mb-6">
                <div className="shrink-0 w-24 h-36 bg-bg-primary border border-border-dark rounded shadow-lg overflow-hidden relative group-hover:border-accent-gold transition-colors">
                  {book.isbn ? (
                    <img 
                      src={`https://covers.openlibrary.org/b/isbn/${book.isbn.replace(/[^0-9X]/g, '')}-M.jpg?default=false`}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4YjczNTUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSI0IiB5PSIzIiB3aWR0aD0iMTYiIGhlaWdodD0iMTgiIHJ4PSIyIi8+PGxpbmUgeDE9IjgiIHkxPSIzIiB4Mj0iOCIgeTI9IjIxIi8+PC9zdmc+'; // Minimalist SVG book icon fallback
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-secondary opacity-30">
                      <BookIcon size={32} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-bold text-lg leading-tight mb-2 group-hover:text-accent-gold transition-colors line-clamp-3">{book.title}</h4>
                  <p className="text-xs text-text-secondary uppercase tracking-widest font-sans italic truncate">by {book.author}</p>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      className={cn(
                        i < book.rating ? "text-accent-gold fill-accent-gold" : "text-border-light"
                      )} 
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border-dark">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-text-secondary">
                    <Hash size={10} className="text-accent-gold" />
                    <span>{book.pages} pages</span>
                  </div>
                  {book.dateRead && (
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-text-secondary">
                      <Calendar size={10} className="text-accent-gold" />
                      <span>{new Date(book.dateRead).getFullYear()}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredBooks.length === 0 && (
        <div className="py-20 text-center opacity-40 italic">
          <BookIcon size={64} className="mx-auto mb-4 opacity-20 text-accent-gold" />
          <p className="text-xl uppercase tracking-widest">No such scrolls exist in our library...</p>
        </div>
      )}
    </div>
  );
}

function SortButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded text-[10px] uppercase tracking-[0.2em] transition-all border shrink-0",
        active 
          ? "bg-bg-secondary text-accent-gold border-accent-gold shadow-[0_0_10px_rgba(212,175,55,0.2)]" 
          : "bg-bg-secondary border-border-dark text-text-secondary hover:text-text-primary hover:border-border-light"
      )}
    >
      {label}
    </button>
  );
}
