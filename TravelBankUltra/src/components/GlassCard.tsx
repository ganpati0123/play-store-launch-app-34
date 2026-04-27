import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: 'low' | 'medium' | 'high';
  gradient?: boolean;
  onPress?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 'medium',
  gradient = false,
}) => {
  const { colors, theme } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const blurAmount = intensity === 'low' ? 10 : intensity === 'medium' ? 20 : 30;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] },
        style,
      ]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      {gradient ? (
        <LinearGradient
          colors={theme === 'dark' 
            ? ['rgba(30, 41, 59, 0.9)', 'rgba(51, 65, 85, 0.8)'] 
            : ['rgba(255, 255, 255, 0.9)', 'rgba(248, 250, 252, 0.8)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <BlurView intensity={blurAmount} tint={theme} style={styles.blur}>
            {children}
          </BlurView>
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.solidBackground,
            {
              backgroundColor: colors.glass,
              borderColor: colors.border,
            },
          ]}
        >
          <BlurView intensity={blurAmount} tint={theme} style={styles.blur}>
            {children}
          </BlurView>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientBackground: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  solidBackground: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  blur: {
    flex: 1,
    padding: 16,
  },
});

export default GlassCard;
