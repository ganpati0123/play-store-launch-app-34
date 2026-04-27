import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width: skeletonWidth = '100%',
  height = 20,
  borderRadius = 8,
  style,
  count = 1,
}) => {
  const { colors } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const skeletons = Array.from({ length: count }, (_, i) => (
    <Animated.View
      key={i}
      style={[
        styles.skeleton,
        {
          width: skeletonWidth,
          height,
          borderRadius,
          backgroundColor: colors.skeleton,
          opacity,
        },
        style,
      ]}
    />
  ));

  return <View style={styles.container}>{skeletons}</View>;
};

export const FlightSkeleton: React.FC = () => {
  return (
    <View style={styles.flightCard}>
      <SkeletonLoader height={24} width={120} borderRadius={12} />
      <View style={styles.flightRow}>
        <SkeletonLoader height={40} width={60} borderRadius={8} />
        <View style={styles.flightInfo}>
          <SkeletonLoader height={16} width="80%" />
          <SkeletonLoader height={12} width="60%" style={{ marginTop: 8 }} />
        </View>
      </View>
      <SkeletonLoader height={20} width={80} borderRadius={10} />
    </View>
  );
};

export const HotelSkeleton: React.FC = () => {
  return (
    <View style={styles.hotelCard}>
      <SkeletonLoader height={150} borderRadius={16} />
      <View style={styles.hotelInfo}>
        <SkeletonLoader height={20} width="70%" />
        <SkeletonLoader height={14} width="50%" style={{ marginTop: 8 }} />
        <View style={styles.hotelRow}>
          <SkeletonLoader height={16} width={60} borderRadius={8} />
          <SkeletonLoader height={16} width={60} borderRadius={8} />
        </View>
      </View>
    </View>
  );
};

export const TransactionSkeleton: React.FC = () => {
  return (
    <View style={styles.transactionCard}>
      <SkeletonLoader height={40} width={40} borderRadius={20} />
      <View style={styles.transactionInfo}>
        <SkeletonLoader height={16} width="70%" />
        <SkeletonLoader height={12} width="40%" style={{ marginTop: 6 }} />
      </View>
      <SkeletonLoader height={16} width={60} borderRadius={8} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  skeleton: {
    marginVertical: 4,
  },
  flightCard: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
  },
  flightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  flightInfo: {
    flex: 1,
    gap: 8,
  },
  hotelCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  hotelInfo: {
    padding: 12,
    gap: 4,
  },
  hotelRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    gap: 12,
  },
  transactionInfo: {
    flex: 1,
    gap: 4,
  },
});

export default SkeletonLoader;
