export interface Book {
  title: string;
  author: string;
  pages: number;
  dateRead: string | null;
  rating: number;
  bookId: string;
  isbn: string;
}

export interface ReadingStats {
  totalBooks: number;
  totalPages: number;
  averageRating: number;
  booksByYear: Record<number, number>;
  pagesByYear: Record<number, number>;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  type: 'books' | 'pages' | 'rating' | 'special';
  isCompleted: boolean;
  rewardIcon: string;
  milestone: string;
}

export interface StoryNode {
  characterName: string;
  message: string;
  trigger: string; // e.g. "quest_completed", "first_load"
}
