import Fuse from 'fuse.js';
import { BibleVerse } from '@abdalkader/bible-data';

export interface SearchResult {
  item: BibleVerse;
  score?: number;
  refIndex?: number;
}

export interface SearchOptions {
  threshold?: number;
  keys?: string[];
  includeScore?: boolean;
  includeMatches?: boolean;
}

// Default search configuration
const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  threshold: 0.3,
  keys: ['text', 'book'],
  includeScore: true,
  includeMatches: true,
};

export class BibleSearch {
  private fuse: Fuse<BibleVerse>;

  constructor(verses: BibleVerse[], options: SearchOptions = {}) {
    const config = { ...DEFAULT_SEARCH_OPTIONS, ...options };
    
    this.fuse = new Fuse(verses, {
      threshold: config.threshold,
      keys: config.keys || ['text', 'book'],
      includeScore: config.includeScore,
      includeMatches: config.includeMatches,
    });
  }

  search(query: string): SearchResult[] {
    if (!query.trim()) return [];
    
    return this.fuse.search(query);
  }

  searchByBook(book: string): SearchResult[] {
    return this.fuse.search(book);
  }

  searchByChapter(book: string, chapter: number): SearchResult[] {
    const query = `${book} ${chapter}`;
    return this.fuse.search(query);
  }
}

// Format verse reference
export function formatVerseReference(verse: BibleVerse): string {
  return `${verse.book} ${verse.chapter}:${verse.verse}`;
}

// Format verse reference with version
export function formatVerseReferenceWithVersion(verse: BibleVerse): string {
  return `${verse.book} ${verse.chapter}:${verse.verse} (${verse.version})`;
}

// Parse verse reference (e.g., "John 3:16" -> { book: "John", chapter: 3, verse: 16 })
export function parseVerseReference(reference: string): { book: string; chapter: number; verse: number } | null {
  const match = reference.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!match) return null;

  return {
    book: match[1].trim(),
    chapter: parseInt(match[2], 10),
    verse: parseInt(match[3], 10),
  };
}

// Generate shareable text for verse
export function generateShareText(verse: BibleVerse): string {
  return `${verse.text}\n\n— ${formatVerseReferenceWithVersion(verse)}`;
}

// Generate shareable text for multiple verses
export function generateShareTextMultiple(verses: BibleVerse[]): string {
  if (verses.length === 0) return '';
  if (verses.length === 1) return generateShareText(verses[0]);

  const texts = verses.map(v => v.text);
  const references = verses.map(v => formatVerseReference(v));
  
  return `${texts.join(' ')}\n\n— ${references.join(', ')}`;
}

// Storage utilities for bookmarks
export interface Bookmark {
  id: string;
  verse: BibleVerse;
  createdAt: Date;
  note?: string;
}

export class BookmarkStorage {
  private storage: Storage;

  constructor(storage: Storage = localStorage) {
    this.storage = storage;
  }

  private getBookmarksKey(): string {
    return 'bible-app-bookmarks';
  }

  getBookmarks(): Bookmark[] {
    try {
      const data = this.storage.getItem(this.getBookmarksKey());
      if (!data) return [];
      
      const bookmarks = JSON.parse(data);
      return bookmarks.map((bookmark: any) => ({
        ...bookmark,
        createdAt: new Date(bookmark.createdAt),
      }));
    } catch {
      return [];
    }
  }

  addBookmark(verse: BibleVerse, note?: string): Bookmark {
    const bookmarks = this.getBookmarks();
    const bookmark: Bookmark = {
      id: `${verse.book}-${verse.chapter}-${verse.verse}-${Date.now()}`,
      verse,
      createdAt: new Date(),
      note,
    };

    bookmarks.push(bookmark);
    this.storage.setItem(this.getBookmarksKey(), JSON.stringify(bookmarks));
    
    return bookmark;
  }

  removeBookmark(id: string): boolean {
    const bookmarks = this.getBookmarks();
    const filtered = bookmarks.filter(bookmark => bookmark.id !== id);
    
    if (filtered.length === bookmarks.length) return false;
    
    this.storage.setItem(this.getBookmarksKey(), JSON.stringify(filtered));
    return true;
  }

  isBookmarked(verse: BibleVerse): boolean {
    const bookmarks = this.getBookmarks();
    return bookmarks.some(bookmark => 
      bookmark.verse.book === verse.book &&
      bookmark.verse.chapter === verse.chapter &&
      bookmark.verse.verse === verse.verse
    );
  }

  clearBookmarks(): void {
    this.storage.removeItem(this.getBookmarksKey());
  }
}

// Theme utilities
export type Theme = 'light' | 'dark' | 'auto';

export class ThemeManager {
  private storage: Storage;

  constructor(storage: Storage = localStorage) {
    this.storage = storage;
  }

  private getThemeKey(): string {
    return 'bible-app-theme';
  }

  getTheme(): Theme {
    try {
      const theme = this.storage.getItem(this.getThemeKey()) as Theme;
      return theme || 'auto';
    } catch {
      return 'auto';
    }
  }

  setTheme(theme: Theme): void {
    this.storage.setItem(this.getThemeKey(), theme);
    this.applyTheme(theme);
  }

  applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    if (theme === 'auto') {
      root.classList.remove('light', 'dark');
      root.style.colorScheme = 'auto';
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      root.style.colorScheme = theme;
    }
  }

  initializeTheme(): void {
    const theme = this.getTheme();
    this.applyTheme(theme);
  }
}
