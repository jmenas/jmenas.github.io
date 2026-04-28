/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book as BookIcon, 
  Map as MapIcon, 
  Trophy, 
  Scroll, 
  User, 
  ArrowRight,
  TrendingUp,
  LayoutDashboard,
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  Library
} from 'lucide-react';
import { Book, ReadingStats, Quest } from './types';
import { INITIAL_QUESTS, CSV_URL } from './constants';
import { cn } from './lib/utils';

// Components
import QuestCard from './components/QuestCard';
import StatCard from './components/StatCard';
import BookList from './components/BookList';
import CharacterOverlay from './components/CharacterOverlay';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quest' | 'library' | 'stats'>('quest');
  const [characterMessage, setCharacterMessage] = useState<{name: string, text: string} | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(CSV_URL);
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedBooks: Book[] = results.data.map((row: any) => ({
            title: row.Title || 'Unknown Title',
            author: row.Author || 'Unknown Author',
            pages: parseInt(row['Number of Pages']) || 0,
            dateRead: row['Date Read'] || null,
            rating: parseInt(row['My Rating']) || 0,
            bookId: row['Book Id'] || Math.random().toString(36).substr(2, 9),
            isbn: row.ISBN || '',
          })).filter(b => b.dateRead); // Only count books that have been read for the tracker
          
          setBooks(parsedBooks);
          setLoading(false);
          
          // Initial greeting
          setTimeout(() => {
            setCharacterMessage({
              name: 'The Royal Librarian',
              text: "Welcome, weary traveler! I see you've brought your scrolls of knowledge. Let's see what adventures you've undertaken."
            });
          }, 1000);
        },
        error: (err: any) => {
          setError('Failed to parse the treasury records.');
          setLoading(false);
        }
      });
    } catch (err) {
      setError('The connection to the Great Library was severed.');
      setLoading(false);
    }
  };

  const stats = useMemo((): ReadingStats => {
    const totalBooks = books.length;
    const totalPages = books.reduce((sum, b) => sum + b.pages, 0);
    const ratings = books.filter(b => b.rating > 0);
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, b) => sum + b.rating, 0) / ratings.length 
      : 0;

    const booksByYear: Record<number, number> = {};
    const pagesByYear: Record<number, number> = {};

    books.forEach(b => {
      if (b.dateRead) {
        const year = new Date(b.dateRead).getFullYear();
        if (!isNaN(year)) {
          booksByYear[year] = (booksByYear[year] || 0) + 1;
          pagesByYear[year] = (pagesByYear[year] || 0) + b.pages;
        }
      }
    });

    return { totalBooks, totalPages, averageRating, booksByYear, pagesByYear };
  }, [books]);

  const quests = useMemo((): Quest[] => {
    return INITIAL_QUESTS.map(q => {
      let currentValue = 0;
      if (q.type === 'books') currentValue = stats.totalBooks;
      if (q.type === 'pages') currentValue = stats.totalPages;
      
      const isCompleted = currentValue >= q.targetValue;
      return { ...q, currentValue, isCompleted };
    });
  }, [stats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center font-serif text-text-primary">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <BookIcon size={48} className="text-accent-gold" />
        </motion.div>
        <p className="text-xl italic animate-pulse tracking-widest uppercase opacity-70">Unrolling ancient scrolls...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center font-serif text-text-primary p-6 text-center">
        <Scroll size={64} className="text-red-900/50 mb-4" />
        <h1 className="text-3xl font-bold mb-2">A Blight on the Records</h1>
        <p className="text-lg opacity-60">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-8 py-3 bg-accent-gold text-bg-primary font-bold rounded border border-accent-gold/50 hover:bg-white transition-all shadow-lg uppercase tracking-widest text-sm"
        >
          Try to reconnect
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-serif overflow-x-hidden selection:bg-accent-gold selection:text-bg-primary pb-24 md:pb-0">
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-50"></div>

      {/* Header */}
      <header className="sticky top-0 bg-bg-primary/95 backdrop-blur-sm border-b border-border-dark z-40 px-4 py-4 mb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-gold rounded-full gold-glow">
              <Scroll className="text-bg-primary" size={20} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight uppercase">QuestRead</h1>
              <p className="text-[10px] md:text-xs font-sans uppercase tracking-[0.3em] text-text-secondary">Official Realm Chronicler</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-4">
            <NavButton 
              active={activeTab === 'quest'} 
              onClick={() => setActiveTab('quest')} 
              icon={<MapIcon size={16} />}
              label="Quest Log" 
            />
            <NavButton 
              active={activeTab === 'library'} 
              onClick={() => setActiveTab('library')} 
              icon={<Library size={16} />}
              label="Library Archives" 
            />
            <NavButton 
              active={activeTab === 'stats'} 
              onClick={() => setActiveTab('stats')} 
              icon={<TrendingUp size={16} />}
              label="Scroll of Stats" 
            />
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-4">
        <AnimatePresence mode="wait">
          {activeTab === 'quest' && (
            <motion.div
              key="quest"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold flex items-center gap-3 italic">
                    <span className="text-accent-gold tracking-tighter">✦</span> Active Quests
                  </h2>
                  <div className="text-[10px] font-bold uppercase tracking-widest bg-bg-secondary px-4 py-2 rounded border border-border-light text-text-secondary">
                    {quests.filter(q => q.isCompleted).length} / {quests.length} Completed
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {quests.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                  ))}
                </div>
              </section>

              {/* Quick Summary Section */}
              <section className="bg-bg-secondary border border-border-dark rounded-xl p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent-gold opacity-[0.03] blur-[60px] pointer-events-none"></div>
                <div className="relative z-10">
                  <h3 className="text-xs uppercase tracking-[0.3em] text-text-secondary border-b border-border-dark pb-3 mb-6">Adventurer Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-text-secondary mb-1">Books Read</p>
                      <p className="text-3xl font-bold text-text-primary">{stats.totalBooks}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-text-secondary mb-1">Pages Read</p>
                      <p className="text-3xl font-bold text-text-primary">{stats.totalPages.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-text-secondary mb-1">Royal Rating</p>
                      <p className="text-3xl font-bold text-accent-gold">{stats.averageRating.toFixed(1)}<span className="text-sm opacity-50 ml-1">/ 5</span></p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-text-secondary mb-1">Rank</p>
                      <p className="text-3xl font-bold text-text-primary">Lvl {Math.floor(stats.totalPages / 500) + 1}</p>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <BookList books={books} />
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="Historical Archives" 
                  description="Books read per year"
                  data={stats.booksByYear}
                />
                <StatCard 
                  title="Volume of Knowledge" 
                  description="Pages read per year"
                  data={stats.pagesByYear}
                />
                <div className="bg-[#fef3c7] border-2 border-[#b45309]/30 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center">
                  <TrendingUp size={48} className="text-[#b45309] mb-4" />
                  <h3 className="text-xl font-bold mb-2">Rising Star</h3>
                  <p className="text-sm opacity-70">You read an average of {(stats.totalPages / (stats.totalBooks || 1)).toFixed(0)} pages per tome.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-bg-secondary text-text-primary px-6 py-2 flex justify-around items-center border-t border-border-dark z-50 shadow-2xl">
        <MobileNavButton 
          active={activeTab === 'quest'} 
          onClick={() => setActiveTab('quest')} 
          icon={<MapIcon size={20} />} 
        />
        <MobileNavButton 
          active={activeTab === 'library'} 
          onClick={() => setActiveTab('library')} 
          icon={<Library size={20} />} 
        />
        <MobileNavButton 
          active={activeTab === 'stats'} 
          onClick={() => setActiveTab('stats')} 
          icon={<TrendingUp size={20} />} 
        />
      </nav>

      {/* Character Dialogue Overlay */}
      <AnimatePresence>
        {characterMessage && (
          <CharacterOverlay 
            message={characterMessage} 
            onClose={() => setCharacterMessage(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 px-6 py-2 rounded transition-all duration-300 font-display text-[10px] uppercase tracking-widest border",
        active 
          ? "bg-bg-secondary text-accent-gold border-border-light shadow-2xl" 
          : "text-text-secondary border-transparent hover:text-text-primary"
      )}
    >
      <span className={active ? "text-accent-gold" : "opacity-50"}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function MobileNavButton({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative p-4 transition-all duration-300",
        active ? "text-accent-gold scale-125" : "text-text-secondary opacity-60"
      )}
    >
      {icon}
      {active && (
        <motion.div 
          layoutId="mobile-nav-indicator"
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-gold rounded-full gold-glow" 
        />
      )}
    </button>
  );
}
