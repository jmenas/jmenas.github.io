import { Quest } from './types';

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'apprentice_reader',
    title: 'The Apprentice\'s First Tome',
    description: 'Read your first book to begin your journey.',
    targetValue: 1,
    currentValue: 0,
    type: 'books',
    isCompleted: false,
    rewardIcon: '📜',
    milestone: 'You have mastered the basics of literacy in the realm.'
  },
  {
    id: 'page_turner',
    title: 'Bridge of a Thousand Pages',
    description: 'Read a total of 1,000 pages to cross the great knowledge chasm.',
    targetValue: 1000,
    currentValue: 0,
    type: 'pages',
    isCompleted: false,
    rewardIcon: '🌉',
    milestone: 'Your endurance is growing. The scholars take notice.'
  },
  {
    id: 'voracious_reader',
    title: 'The Dragon\'s Hoard of Books',
    description: 'Read 25 books to secure your place in the royal library.',
    targetValue: 25,
    currentValue: 0,
    type: 'books',
    isCompleted: false,
    rewardIcon: '💎',
    milestone: 'The Dragon of Ignorance has been defeated by your wisdom!'
  },
  {
    id: 'marathon_scholar',
    title: 'The Infinite Scroll',
    description: 'Surpass 10,000 pages in your lifetime reading quest.',
    targetValue: 10000,
    currentValue: 0,
    type: 'pages',
    isCompleted: false,
    rewardIcon: '📖',
    milestone: 'You are now an Arch-Mage of the Literary Arts.'
  }
];

export const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTQ3F5xqUaJykaac06E52irDyMowY2luiQ01aHZ_GoWG55HNjPsB2ZsqH5RvTPD4xqK6B6ajFwgOrZ-/pub?output=csv';
