import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  gradient?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  gradient = false,
  ...props
}) => {
  const { colors, theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(!!props.value);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsFilled(!!props.value);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.inputBackground,
      borderColor: error
        ? colors.error
        : isFocused
        ? colors.primary
        : colors.border,
      color: colors.text,
    },
    icon && { paddingLeft: 48 },
    rightIcon && { paddingRight: 48 },
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          { transform: [{ scale: scaleAnim }] },
          gradient && {
            backgroundColor: 'transparent',
            overflow: 'hidden',
          },
        ]}
      >
        {gradient && isFocused && (
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: 12, opacity: 0.1 },
            ]}
          />
        )}
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: colors.surfaceVariant }]}>
            {icon}
          </View>
        )}
        <TextInput
          style={inputStyle}
          placeholderTextColor={colors.textTertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onRightIconPress?.();
            }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onPress?: () => void;
  icon?: React.ReactNode;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onPress,
  icon,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.searchContainer,
        {
          backgroundColor: colors.inputBackground,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.searchIcon}>
        {icon || (
          <Text style={{ color: colors.textTertiary, fontSize: 18 }}>🔍</Text>
        )}
      </View>
      <Text style={[styles.searchText, { color: value ? colors.text : colors.textTertiary }]}>
        {value || placeholder}
      </Text>
      {value && (
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onChangeText('');
          }}
        >
          <Text style={{ color: colors.textTertiary, fontSize: 18 }}>✕</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
    borderRadius: 12,
    borderWidth: 1.5,
  },
  input: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  iconContainer: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    borderRadius: 8,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
  },
});

export default Input;
