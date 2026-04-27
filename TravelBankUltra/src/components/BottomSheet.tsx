import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface BottomSheetOption {
  key: string;
  label: string;
  icon: string;
  onPress: () => void;
  destructive?: boolean;
}

interface CustomBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  options: BottomSheetOption[];
  children?: React.ReactNode;
  snapPoints?: (string | number)[];
  enablePanDownToClose?: boolean;
  showCloseButton?: boolean;
}

export const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({
  isVisible,
  onClose,
  title,
  subtitle,
  options,
  children,
  snapPoints = ['50%'],
  enablePanDownToClose = true,
  showCloseButton = true,
}) => {
  const { colors, theme } = useTheme();
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const snapPointsArray = useMemo(() => snapPoints, [snapPoints]);

  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isVisible]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.6}
      />
    ),
    []
  );

  const handleOptionPress = (option: BottomSheetOption) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    option.onPress();
    onClose();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPointsArray}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={enablePanDownToClose}
      backgroundStyle={{ backgroundColor: colors.bottomSheet }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
    >
      <BottomSheetView style={styles.contentContainer}>
        {title && (
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {subtitle}
              </Text>
            )}
          </View>
        )}

        {options.length > 0 && (
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[styles.optionItem, { borderBottomColor: colors.border }]}
                onPress={() => handleOptionPress(option)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    { color: option.destructive ? colors.error : colors.text },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {children && <View style={styles.childrenContainer}>{children}</View>}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

interface QuickActionSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onCancel?: () => void;
  onModify?: () => void;
}

export const QuickActionSheet: React.FC<QuickActionSheetProps> = ({
  isVisible,
  onClose,
  onShare,
  onDownload,
  onCancel,
  onModify,
}) => {
  const { colors } = useTheme();

  const options: BottomSheetOption[] = [
    { key: 'share', label: 'Share Details', icon: '📤', onPress: onShare || (() => {}) },
    { key: 'download', label: 'Download Ticket', icon: '📥', onPress: onDownload || (() => {}) },
    { key: 'modify', label: 'Modify Booking', icon: '✏️', onPress: onModify || (() => {}) },
    { key: 'cancel', label: 'Cancel Booking', icon: '❌', onPress: onCancel || (() => {}), destructive: true },
  ];

  return (
    <CustomBottomSheet
      isVisible={isVisible}
      onClose={onClose}
      title="Quick Actions"
      options={options}
    />
  );
};

interface FilterSheetProps {
  isVisible: boolean;
  onClose: () => void;
  filters: any;
  onApply: (filters: any) => void;
  onReset: () => void;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({
  isVisible,
  onClose,
  filters,
  onApply,
  onReset,
}) => {
  const { colors } = useTheme();

  return (
    <CustomBottomSheet
      isVisible={isVisible}
      onClose={onClose}
      title="Filters"
      snapPoints={['70%']}
      options={[
        { key: 'apply', label: 'Apply Filters', icon: '✅', onPress: () => onApply(filters) },
        { key: 'reset', label: 'Reset All', icon: '🔄', onPress: onReset },
      ]}
    >
      <ScrollView style={styles.filterContent}>
        <Text style={[styles.filterTitle, { color: colors.text }]}>Price Range</Text>
        <View style={styles.filterOptions}>
          <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.filterChipText, { color: colors.primary }]}>Under ₹5,000</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.filterChipText, { color: colors.text }]}>₹5,000 - ₹10,000</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.filterChipText, { color: colors.text }]}>₹10,000 - ₹20,000</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.filterChipText, { color: colors.text }]}>Above ₹20,000</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.filterTitle, { color: colors.text, marginTop: 20 }]}>Stops</Text>
        <View style={styles.filterOptions}>
          <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.filterChipText, { color: colors.primary }]}>Non-stop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.filterChipText, { color: colors.text }]}>1 Stop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.filterChipText, { color: colors.text }]}>2+ Stops</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.filterTitle, { color: colors.text, marginTop: 20 }]}>Airlines</Text>
        <View style={styles.filterOptions}>
          <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.filterChipText, { color: colors.primary }]}>IndiGo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.filterChipText, { color: colors.text }]}>Air India</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.filterChipText, { color: colors.text }]}>SpiceJet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.filterChipText, { color: colors.text }]}>Vistara</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </CustomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  optionsContainer: {
    gap: 0,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionIcon: {
    fontSize: 22,
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  childrenContainer: {
    marginTop: 20,
  },
  filterContent: {
    flex: 1,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CustomBottomSheet;
