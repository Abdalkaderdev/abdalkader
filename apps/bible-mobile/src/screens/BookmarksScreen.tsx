import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { VerseCard } from '@abdalkader/bible-ui';
import { BookmarkStorage, generateShareText } from '@abdalkader/bible-utils';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';

export default function BookmarksScreen() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const bookmarkStorage = new BookmarkStorage();

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const savedBookmarks = bookmarkStorage.getBookmarks();
    setBookmarks(savedBookmarks);
  };

  const handleRemoveBookmark = (bookmarkId: string) => {
    Alert.alert(
      'Remove Bookmark',
      'Are you sure you want to remove this bookmark?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            bookmarkStorage.removeBookmark(bookmarkId);
            loadBookmarks();
          },
        },
      ]
    );
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

  const clearAllBookmarks = () => {
    Alert.alert(
      'Clear All Bookmarks',
      'Are you sure you want to remove all bookmarks? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            bookmarkStorage.clearBookmarks();
            loadBookmarks();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookmarks</Text>
        {bookmarks.length > 0 && (
          <TouchableOpacity onPress={clearAllBookmarks} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {bookmarks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bookmark-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
          <Text style={styles.emptySubtitle}>
            Start bookmarking verses you love by tapping the bookmark icon on any verse
          </Text>
        </View>
      ) : (
        <View style={styles.bookmarksContainer}>
          <Text style={styles.countText}>
            {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}
          </Text>
          
          <View style={styles.bookmarksList}>
            {bookmarks.map((bookmark) => (
              <View key={bookmark.id} style={styles.bookmarkItem}>
                <VerseCard
                  verse={bookmark.verse}
                  onShare={handleShare}
                  onCopy={handleCopy}
                  isBookmarked={true}
                />
                <TouchableOpacity
                  onPress={() => handleRemoveBookmark(bookmark.id)}
                  style={styles.removeButton}
                >
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearButtonText: {
    color: '#ef4444',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  bookmarksContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  countText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  bookmarksList: {
    gap: 16,
  },
  bookmarkItem: {
    position: 'relative',
    marginBottom: 16,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
});
