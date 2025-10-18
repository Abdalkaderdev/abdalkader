import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { ThemeManager } from '@abdalkader/bible-utils';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(false);
  const themeManager = new ThemeManager();

  useEffect(() => {
    const currentTheme = themeManager.getTheme();
    setTheme(currentTheme);
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    themeManager.setTheme(newTheme);
  };

  const handleNotificationsToggle = (value: boolean) => {
    setNotifications(value);
    if (!value) {
      setDailyReminder(false);
    }
  };

  const handleDailyReminderToggle = (value: boolean) => {
    if (!notifications) {
      Alert.alert(
        'Enable Notifications',
        'Please enable notifications first to set daily reminders.',
        [{ text: 'OK' }]
      );
      return;
    }
    setDailyReminder(value);
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all bookmarks and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            // Clear bookmarks and settings
            Alert.alert('Success', 'All data has been cleared');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="color-palette-outline" size={24} color="#3b82f6" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Theme</Text>
              <Text style={styles.settingDescription}>Choose your preferred theme</Text>
            </View>
          </View>
        </View>

        <View style={styles.themeOptions}>
          {[
            { value: 'light', label: 'Light', icon: 'sunny-outline' },
            { value: 'dark', label: 'Dark', icon: 'moon-outline' },
            { value: 'auto', label: 'Auto', icon: 'phone-portrait-outline' },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.themeOption,
                theme === option.value && styles.themeOptionActive,
              ]}
              onPress={() => handleThemeChange(option.value as any)}
            >
              <Ionicons
                name={option.icon as any}
                size={20}
                color={theme === option.value ? '#ffffff' : '#6b7280'}
              />
              <Text
                style={[
                  styles.themeOptionText,
                  theme === option.value && styles.themeOptionTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications-outline" size={24} color="#3b82f6" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Receive notifications from the app</Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={handleNotificationsToggle}
            trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
            thumbColor={notifications ? '#ffffff' : '#ffffff'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="time-outline" size={24} color="#3b82f6" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Daily Verse Reminder</Text>
              <Text style={styles.settingDescription}>Get reminded to read your daily verse</Text>
            </View>
          </View>
          <Switch
            value={dailyReminder}
            onValueChange={handleDailyReminderToggle}
            trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
            thumbColor={dailyReminder ? '#ffffff' : '#ffffff'}
            disabled={!notifications}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="information-circle-outline" size={24} color="#3b82f6" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Version</Text>
              <Text style={styles.settingDescription}>1.0.0</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="help-circle-outline" size={24} color="#3b82f6" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Help & Support</Text>
              <Text style={styles.settingDescription}>Get help and contact support</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="star-outline" size={24} color="#3b82f6" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Rate App</Text>
              <Text style={styles.settingDescription}>Rate us on the App Store</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        
        <TouchableOpacity style={styles.settingItem} onPress={clearAllData}>
          <View style={styles.settingInfo}>
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
            <View style={styles.settingText}>
              <Text style={[styles.settingLabel, { color: '#ef4444' }]}>Clear All Data</Text>
              <Text style={styles.settingDescription}>Remove all bookmarks and settings</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Bible App by{' '}
          <Text style={styles.footerLink}>Abdalkader</Text>
        </Text>
        <Text style={styles.footerSubtext}>
          Scripture taken from the Holy Bible, New International Version®, NIV®
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    gap: 8,
  },
  themeOptionActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  themeOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  themeOptionTextActive: {
    color: '#ffffff',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  footerLink: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
});
