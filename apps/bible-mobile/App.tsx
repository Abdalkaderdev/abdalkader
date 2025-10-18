import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider } from './src/components/ThemeProvider';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import BookmarksScreen from './src/screens/BookmarksScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Search') {
                  iconName = focused ? 'search' : 'search-outline';
                } else if (route.name === 'Bookmarks') {
                  iconName = focused ? 'bookmark' : 'bookmark-outline';
                } else if (route.name === 'Settings') {
                  iconName = focused ? 'settings' : 'settings-outline';
                } else {
                  iconName = 'help-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#3b82f6',
              tabBarInactiveTintColor: '#6b7280',
              tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopColor: '#e5e7eb',
              },
              headerStyle: {
                backgroundColor: '#ffffff',
                borderBottomColor: '#e5e7eb',
              },
              headerTintColor: '#374151',
              headerTitleStyle: {
                fontWeight: '600',
              },
            })}
          >
            <Tab.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'Daily Verse' }}
            />
            <Tab.Screen 
              name="Search" 
              component={SearchScreen}
              options={{ title: 'Search Bible' }}
            />
            <Tab.Screen 
              name="Bookmarks" 
              component={BookmarksScreen}
              options={{ title: 'My Bookmarks' }}
            />
            <Tab.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
