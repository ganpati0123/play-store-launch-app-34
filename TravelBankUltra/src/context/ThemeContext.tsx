import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, AppMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  colors: typeof lightColors;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
}

const lightColors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceVariant: '#F0F2F5',
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  secondary: '#EC4899',
  accent: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  success: '#10B981',
  info: '#3B82F6',
  gradient: ['#6366F1', '#8B5CF6'],
  cardGradient: ['#FFFFFF', '#F8FAFC'],
  glass: 'rgba(255, 255, 255, 0.7)',
  glassDark: 'rgba(0, 0, 0, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  skeleton: '#E5E7EB',
  skeletonHighlight: '#F3F4F6',
  tabBarActive: '#6366F1',
  tabBarInactive: '#9CA3AF',
  bottomSheet: '#FFFFFF',
  inputBackground: '#F9FAFB',
  flightCard: '#FFFFFF',
  hotelCard: '#FFFFFF',
  trainCard: '#FFFFFF',
  transactionCredit: '#10B981',
  transactionDebit: '#EF4444',
  positive: '#10B981',
  negative: '#EF4444',
  gold: '#F59E0B',
  silver: '#9CA3AF',
  bronze: '#CD7F32',
};

const darkColors = {
  background: '#0F172A',
  surface: '#1E293B',
  surfaceVariant: '#334155',
  primary: '#818CF8',
  primaryDark: '#6366F1',
  primaryLight: '#A5B4FC',
  secondary: '#F472B6',
  accent: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  border: '#374151',
  borderLight: '#4B5563',
  success: '#34D399',
  info: '#60A5FA',
  gradient: ['#818CF8', '#A78BFA'],
  cardGradient: ['#1E293B', '#334155'],
  glass: 'rgba(30, 41, 59, 0.8)',
  glassDark: 'rgba(0, 0, 0, 0.3)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  skeleton: '#374151',
  skeletonHighlight: '#4B5563',
  tabBarActive: '#818CF8',
  tabBarInactive: '#6B7280',
  bottomSheet: '#1E293B',
  inputBackground: '#374151',
  flightCard: '#1E293B',
  hotelCard: '#1E293B',
  trainCard: '#1E293B',
  transactionCredit: '#34D399',
  transactionDebit: '#F87171',
  positive: '#34D399',
  negative: '#F87171',
  gold: '#FBBF24',
  silver: '#9CA3AF',
  bronze: '#CD7F32',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [mode, setModeState] = useState<AppMode>('travel');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedMode = await AsyncStorage.getItem('mode');
      if (savedTheme) {
        setThemeState(savedTheme as ThemeMode);
      } else {
        setThemeState(systemColorScheme === 'dark' ? 'dark' : 'light');
      }
      if (savedMode) {
        setModeState(savedMode as AppMode);
      }
    } catch (error) {
      console.log('Error loading preferences:', error);
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const setMode = async (newMode: AppMode) => {
    setModeState(newMode);
    try {
      await AsyncStorage.setItem('mode', newMode);
    } catch (error) {
      console.log('Error saving mode:', error);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'travel' ? 'banking' : 'travel');
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        colors,
        mode,
        setMode,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
