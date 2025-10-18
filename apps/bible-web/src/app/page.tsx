'use client';

import { useState } from 'react';
import { Button, VerseCard, SearchInput } from '@abdalkader/bible-ui';
import { getDailyVerse, SAMPLE_VERSES } from '@abdalkader/bible-data';
import { BibleSearch, BookmarkStorage, generateShareText } from '@abdalkader/bible-utils';
import { Search, BookOpen, Heart, Settings } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  
  const bibleSearch = new BibleSearch(SAMPLE_VERSES);
  const bookmarkStorage = new BookmarkStorage();
  const dailyVerse = getDailyVerse();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    setTimeout(() => {
      const results = bibleSearch.search(query);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const handleBookmark = (verse: any) => {
    const bookmark = bookmarkStorage.addBookmark(verse);
    setBookmarks(prev => [...prev, bookmark]);
  };

  const handleShare = (verse: any) => {
    const shareText = generateShareText(verse);
    if (navigator.share) {
      navigator.share({
        title: `${verse.book} ${verse.chapter}:${verse.verse}`,
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  const handleCopy = (verse: any) => {
    const shareText = generateShareText(verse);
    navigator.clipboard.writeText(shareText);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bible-bg/80 backdrop-blur-md border-b border-bible-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-bible-primary" />
              <h1 className="text-2xl font-bold text-bible-text">Bible App</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4" />
                Bookmarks
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-bible-text mb-4">
              Search God's Word
            </h2>
            <p className="text-bible-text-secondary text-lg">
              Find verses, explore topics, and discover God's truth
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <SearchInput
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search Bible verses..."
              showClear={!!searchQuery}
              onClear={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              isLoading={isSearching}
            />
          </div>
        </section>

        {/* Daily Verse */}
        <section className="mb-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-bible-text mb-2">
              Daily Verse
            </h3>
            <p className="text-bible-text-secondary">
              Start your day with God's word
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <VerseCard
              verse={dailyVerse}
              onBookmark={handleBookmark}
              onShare={handleShare}
              onCopy={handleCopy}
              isBookmarked={bookmarkStorage.isBookmarked(dailyVerse)}
            />
          </div>
        </section>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <section className="mb-12">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-bible-text mb-2">
                Search Results
              </h3>
              <p className="text-bible-text-secondary">
                Found {searchResults.length} verse{searchResults.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <VerseCard
                  key={`${result.item.book}-${result.item.chapter}-${result.item.verse}-${index}`}
                  verse={result.item}
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                  onCopy={handleCopy}
                  isBookmarked={bookmarkStorage.isBookmarked(result.item)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Popular Verses */}
        {searchResults.length === 0 && (
          <section>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-bible-text mb-2">
                Popular Verses
              </h3>
              <p className="text-bible-text-secondary">
                Explore these well-loved scriptures
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {SAMPLE_VERSES.slice(1).map((verse, index) => (
                <VerseCard
                  key={`${verse.book}-${verse.chapter}-${verse.verse}-${index}`}
                  verse={verse}
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                  onCopy={handleCopy}
                  isBookmarked={bookmarkStorage.isBookmarked(verse)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-bible-border bg-bible-bg/50 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-bible-text-secondary">
            <p className="mb-2">
              Bible App by{' '}
              <a 
                href="https://abdalkader.dev" 
                className="text-bible-primary hover:text-bible-primary-hover"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abdalkader
              </a>
            </p>
            <p className="text-sm">
              Scripture taken from the Holy Bible, New International Version®, NIV®
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
