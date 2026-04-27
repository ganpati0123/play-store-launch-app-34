import React from 'react';
import { StatusBar, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import MainNavigator from './src/navigation/MainNavigator';
import AIAssistant from './src/components/AIAssistant';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AppContent = () => {
  const { colors, theme, mode, toggleMode } = useTheme();

  const navigationTheme = theme === 'dark' ? {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      primary: colors.primary,
      border: colors.border,
    },
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      primary: colors.primary,
      border: colors.border,
    },
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NavigationContainer theme={navigationTheme}>
        <MainNavigator />
      </NavigationContainer>
      
      {/* Mode Toggle */}
      <Animated.View 
        entering={FadeInDown.delay(500).springify()}
        style={styles.modeToggleContainer}
      >
        <TouchableOpacity
          style={[styles.modeToggle, { backgroundColor: colors.primary }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            toggleMode();
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={mode === 'travel' ? ['#6366F1', '#8B5CF6'] : ['#10B981', '#34D399']}
            style={styles.modeGradient}
          >
            <Text style={styles.modeText}>
              {mode === 'travel' ? '✈️ Travel' : '🏦 Banking'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* AI Assistant */}
      <AIAssistant visible={true} />
    </View>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  modeToggleContainer: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 999,
  },
  modeToggle: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modeGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default App;
