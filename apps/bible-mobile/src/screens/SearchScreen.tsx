import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SearchInput, VerseCard } from '@abdalkader/bible-ui';
import { SAMPLE_VERSES } from '@abdalkader/bible-data';
import { BibleSearch, BookmarkStorage, generateShareText } from '@abdalkader/bible-utils';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const bibleSearch = new BibleSearch(SAMPLE_VERSES);
  const bookmarkStorage = new BookmarkStorage();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    setTimeout(() => {
      const results = bibleSearch.search(query);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const handleBookmark = async (verse: any) => {
    bookmarkStorage.addBookmark(verse);
    Alert.alert('Bookmarked', 'Verse added to your bookmarks');
  };

  const handleShare = async (verse: any) => {
    const shareText = generateShareText(verse);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(shareText);
    } else {
      await Clipboard.setStringAsync(shareText);
      Alert.alert('Copied', 'Verse copied to clipboard');
    }
  };

  const handleCopy = async (verse: any) => {
    const shareText = generateShareText(verse);
    await Clipboard.setStringAsync(shareText);
    Alert.alert('Copied', 'Verse copied to clipboard');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchSection}>
        <Text style={styles.title}>Search God's Word</Text>
        <Text style={styles.subtitle}>Find verses, explore topics, and discover God's truth</Text>
        
        <View style={styles.searchContainer}>
          <SearchInput
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search Bible verses..."
            showClear={!!searchQuery}
            onClear={() => {
              setSearchQuery('');
              setSearchResults([]);
            }}
            isLoading={isSearching}
          />
        </View>
      </View>

      {searchResults.length > 0 && (
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>
            Found {searchResults.length} verse{searchResults.length !== 1 ? 's' : ''}
          </Text>
          
          <View style={styles.resultsContainer}>
            {searchResults.map((result, index) => (
              <View key={`${result.item.book}-${result.item.chapter}-${result.item.verse}-${index}`} style={styles.resultItem}>
                <VerseCard
                  verse={result.item}
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                  onCopy={handleCopy}
                  isBookmarked={bookmarkStorage.isBookmarked(result.item)}
                />
              </View>
            ))}
          </View>
        </View>
      )}

      {searchResults.length === 0 && searchQuery === '' && (
        <View style={styles.suggestionsSection}>
          <Text style={styles.suggestionsTitle}>Search Suggestions</Text>
          <Text style={styles.suggestionsSubtitle}>Try searching for:</Text>
          
          <View style={styles.suggestionsList}>
            {['love', 'faith', 'hope', 'peace', 'joy', 'grace', 'mercy', 'forgiveness'].map((term) => (
              <View key={term} style={styles.suggestionItem}>
                <Text 
                  style={styles.suggestionText}
                  onPress={() => handleSearch(term)}
                >
                  {term}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  searchContainer: {
    marginBottom: 16,
  },
  resultsSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  resultsContainer: {
    gap: 16,
  },
  resultItem: {
    marginBottom: 16,
  },
  suggestionsSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  suggestionsSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionItem: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  suggestionText: {
    color: '#3b82f6',
    fontWeight: '500',
  },
});
