export interface BibleBook {
  id: string;
  name: string;
  testament: 'old' | 'new';
  chapters: number;
  order: number;
}

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  version: string;
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: BibleVerse[];
}

// Sample Bible books data
export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { id: 'genesis', name: 'Genesis', testament: 'old', chapters: 50, order: 1 },
  { id: 'exodus', name: 'Exodus', testament: 'old', chapters: 40, order: 2 },
  { id: 'leviticus', name: 'Leviticus', testament: 'old', chapters: 27, order: 3 },
  { id: 'numbers', name: 'Numbers', testament: 'old', chapters: 36, order: 4 },
  { id: 'deuteronomy', name: 'Deuteronomy', testament: 'old', chapters: 34, order: 5 },
  { id: 'joshua', name: 'Joshua', testament: 'old', chapters: 24, order: 6 },
  { id: 'judges', name: 'Judges', testament: 'old', chapters: 21, order: 7 },
  { id: 'ruth', name: 'Ruth', testament: 'old', chapters: 4, order: 8 },
  { id: '1samuel', name: '1 Samuel', testament: 'old', chapters: 31, order: 9 },
  { id: '2samuel', name: '2 Samuel', testament: 'old', chapters: 24, order: 10 },
  { id: '1kings', name: '1 Kings', testament: 'old', chapters: 22, order: 11 },
  { id: '2kings', name: '2 Kings', testament: 'old', chapters: 25, order: 12 },
  { id: '1chronicles', name: '1 Chronicles', testament: 'old', chapters: 29, order: 13 },
  { id: '2chronicles', name: '2 Chronicles', testament: 'old', chapters: 36, order: 14 },
  { id: 'ezra', name: 'Ezra', testament: 'old', chapters: 10, order: 15 },
  { id: 'nehemiah', name: 'Nehemiah', testament: 'old', chapters: 13, order: 16 },
  { id: 'esther', name: 'Esther', testament: 'old', chapters: 10, order: 17 },
  { id: 'job', name: 'Job', testament: 'old', chapters: 42, order: 18 },
  { id: 'psalms', name: 'Psalms', testament: 'old', chapters: 150, order: 19 },
  { id: 'proverbs', name: 'Proverbs', testament: 'old', chapters: 31, order: 20 },
  { id: 'ecclesiastes', name: 'Ecclesiastes', testament: 'old', chapters: 12, order: 21 },
  { id: 'songofsongs', name: 'Song of Songs', testament: 'old', chapters: 8, order: 22 },
  { id: 'isaiah', name: 'Isaiah', testament: 'old', chapters: 66, order: 23 },
  { id: 'jeremiah', name: 'Jeremiah', testament: 'old', chapters: 52, order: 24 },
  { id: 'lamentations', name: 'Lamentations', testament: 'old', chapters: 5, order: 25 },
  { id: 'ezekiel', name: 'Ezekiel', testament: 'old', chapters: 48, order: 26 },
  { id: 'daniel', name: 'Daniel', testament: 'old', chapters: 12, order: 27 },
  { id: 'hosea', name: 'Hosea', testament: 'old', chapters: 14, order: 28 },
  { id: 'joel', name: 'Joel', testament: 'old', chapters: 3, order: 29 },
  { id: 'amos', name: 'Amos', testament: 'old', chapters: 9, order: 30 },
  { id: 'obadiah', name: 'Obadiah', testament: 'old', chapters: 1, order: 31 },
  { id: 'jonah', name: 'Jonah', testament: 'old', chapters: 4, order: 32 },
  { id: 'micah', name: 'Micah', testament: 'old', chapters: 7, order: 33 },
  { id: 'nahum', name: 'Nahum', testament: 'old', chapters: 3, order: 34 },
  { id: 'habakkuk', name: 'Habakkuk', testament: 'old', chapters: 3, order: 35 },
  { id: 'zephaniah', name: 'Zephaniah', testament: 'old', chapters: 3, order: 36 },
  { id: 'haggai', name: 'Haggai', testament: 'old', chapters: 2, order: 37 },
  { id: 'zechariah', name: 'Zechariah', testament: 'old', chapters: 14, order: 38 },
  { id: 'malachi', name: 'Malachi', testament: 'old', chapters: 4, order: 39 },

  // New Testament
  { id: 'matthew', name: 'Matthew', testament: 'new', chapters: 28, order: 40 },
  { id: 'mark', name: 'Mark', testament: 'new', chapters: 16, order: 41 },
  { id: 'luke', name: 'Luke', testament: 'new', chapters: 24, order: 42 },
  { id: 'john', name: 'John', testament: 'new', chapters: 21, order: 43 },
  { id: 'acts', name: 'Acts', testament: 'new', chapters: 28, order: 44 },
  { id: 'romans', name: 'Romans', testament: 'new', chapters: 16, order: 45 },
  { id: '1corinthians', name: '1 Corinthians', testament: 'new', chapters: 16, order: 46 },
  { id: '2corinthians', name: '2 Corinthians', testament: 'new', chapters: 13, order: 47 },
  { id: 'galatians', name: 'Galatians', testament: 'new', chapters: 6, order: 48 },
  { id: 'ephesians', name: 'Ephesians', testament: 'new', chapters: 6, order: 49 },
  { id: 'philippians', name: 'Philippians', testament: 'new', chapters: 4, order: 50 },
  { id: 'colossians', name: 'Colossians', testament: 'new', chapters: 4, order: 51 },
  { id: '1thessalonians', name: '1 Thessalonians', testament: 'new', chapters: 5, order: 52 },
  { id: '2thessalonians', name: '2 Thessalonians', testament: 'new', chapters: 3, order: 53 },
  { id: '1timothy', name: '1 Timothy', testament: 'new', chapters: 6, order: 54 },
  { id: '2timothy', name: '2 Timothy', testament: 'new', chapters: 4, order: 55 },
  { id: 'titus', name: 'Titus', testament: 'new', chapters: 3, order: 56 },
  { id: 'philemon', name: 'Philemon', testament: 'new', chapters: 1, order: 57 },
  { id: 'hebrews', name: 'Hebrews', testament: 'new', chapters: 13, order: 58 },
  { id: 'james', name: 'James', testament: 'new', chapters: 5, order: 59 },
  { id: '1peter', name: '1 Peter', testament: 'new', chapters: 5, order: 60 },
  { id: '2peter', name: '2 Peter', testament: 'new', chapters: 3, order: 61 },
  { id: '1john', name: '1 John', testament: 'new', chapters: 5, order: 62 },
  { id: '2john', name: '2 John', testament: 'new', chapters: 1, order: 63 },
  { id: '3john', name: '3 John', testament: 'new', chapters: 1, order: 64 },
  { id: 'jude', name: 'Jude', testament: 'new', chapters: 1, order: 65 },
  { id: 'revelation', name: 'Revelation', testament: 'new', chapters: 22, order: 66 },
];

// Sample verses data (John 3:16 and a few others)
export const SAMPLE_VERSES: BibleVerse[] = [
  {
    book: 'John',
    chapter: 3,
    verse: 16,
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    version: 'NIV'
  },
  {
    book: 'Romans',
    chapter: 8,
    verse: 28,
    text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    version: 'NIV'
  },
  {
    book: 'Jeremiah',
    chapter: 29,
    verse: 11,
    text: 'For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future.',
    version: 'NIV'
  },
  {
    book: 'Philippians',
    chapter: 4,
    verse: 13,
    text: 'I can do all this through him who gives me strength.',
    version: 'NIV'
  },
  {
    book: 'Proverbs',
    chapter: 3,
    verse: 5,
    text: 'Trust in the Lord with all your heart and lean not on your own understanding.',
    version: 'NIV'
  }
];

// Daily verse generator
export function getDailyVerse(): BibleVerse {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const index = dayOfYear % SAMPLE_VERSES.length;
  return SAMPLE_VERSES[index];
}

// Get book by ID
export function getBookById(id: string): BibleBook | undefined {
  return BIBLE_BOOKS.find(book => book.id === id);
}

// Get books by testament
export function getBooksByTestament(testament: 'old' | 'new'): BibleBook[] {
  return BIBLE_BOOKS.filter(book => book.testament === testament);
}
