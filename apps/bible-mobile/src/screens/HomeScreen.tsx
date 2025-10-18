import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { VerseCard } from '@abdalkader/bible-ui';
import { getDailyVerse, SAMPLE_VERSES } from '@abdalkader/bible-data';
import { BookmarkStorage, generateShareText } from '@abdalkader/bible-utils';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';

export default function HomeScreen() {
  const dailyVerse = getDailyVerse();
  const bookmarkStorage = new BookmarkStorage();

  const handleBookmark = async (verse: any) => {
    bookmarkStorage.addBookmark(verse);
  };

  const handleShare = async (verse: any) => {
    const shareText = generateShareText(verse);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(shareText);
    } else {
      await Clipboard.setStringAsync(shareText);
    }
  };

  const handleCopy = async (verse: any) => {
    const shareText = generateShareText(verse);
    await Clipboard.setStringAsync(shareText);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="book" size={32} color="#3b82f6" />
        <Text style={styles.title}>Bible App</Text>
        <Text style={styles.subtitle}>Daily Verse</Text>
      </View>

      <View style={styles.dailyVerseSection}>
        <Text style={styles.sectionTitle}>Today's Verse</Text>
        <Text style={styles.sectionSubtitle}>Start your day with God's word</Text>
        
        <View style={styles.verseContainer}>
          <VerseCard
            verse={dailyVerse}
            onBookmark={handleBookmark}
            onShare={handleShare}
            onCopy={handleCopy}
            isBookmarked={bookmarkStorage.isBookmarked(dailyVerse)}
          />
        </View>
      </View>

      <View style={styles.popularSection}>
        <Text style={styles.sectionTitle}>Popular Verses</Text>
        <Text style={styles.sectionSubtitle}>Explore these well-loved scriptures</Text>
        
        <View style={styles.versesGrid}>
          {SAMPLE_VERSES.slice(1).map((verse, index) => (
            <View key={`${verse.book}-${verse.chapter}-${verse.verse}-${index}`} style={styles.verseItem}>
              <VerseCard
                verse={verse}
                onBookmark={handleBookmark}
                onShare={handleShare}
                onCopy={handleCopy}
                isBookmarked={bookmarkStorage.isBookmarked(verse)}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  dailyVerseSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  verseContainer: {
    marginBottom: 16,
  },
  popularSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  versesGrid: {
    gap: 16,
  },
  verseItem: {
    marginBottom: 16,
  },
});
