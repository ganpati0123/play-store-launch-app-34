import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp, useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList, Flight, Booking } from '../../types';
import { AnimatedButton } from '../../components/Button';
import { GlassCard } from '../../components/GlassCard';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;
type RouteType = RouteProp<TravelStackParamList, 'BookingConfirmation'>;

const BookingConfirmationScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const booking = route.params.booking;

  const confettiAnim = useSharedValue(0);

  React.useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    confettiAnim.value = withSpring(1, { damping: 10, stiffness: 100 });
  }, []);

  const handleViewBooking = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('BookingDetail', booking);
  };

  const handleBookAnother = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('FlightSearch');
  };

  const confettiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: confettiAnim.value }],
    opacity: confettiAnim.value,
  }));

  const isFlight = booking.type === 'flight';
  const flight = isFlight ? booking.details as Flight : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View style={[styles.confettiContainer, confettiStyle]}>
          <Text style={styles.confetti}>🎉</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(500)} style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: colors.success }]}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={[styles.successTitle, { color: colors.text }]}>Booking Confirmed!</Text>
          <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
            Your {booking.type} has been successfully booked
          </Text>
        </Animated.View>

        <GlassCard>
          <View style={styles.bookingIdRow}>
            <Text style={[styles.bookingIdLabel, { color: colors.textSecondary }]}>Booking ID</Text>
            <Text style={[styles.bookingIdValue, { color: colors.primary }]}>{booking.id}</Text>
          </View>
          {booking.pnr && (
            <View style={styles.pnrRow}>
              <Text style={[styles.pnrLabel, { color: colors.textSecondary }]}>PNR Number</Text>
              <Text style={[styles.pnrValue, { color: colors.text }]}>{booking.pnr}</Text>
            </View>
          )}
        </GlassCard>

        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📋 Booking Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Type</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Travel Date</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{booking.travelDate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
              <Text style={styles.statusText}>{booking.status}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Amount Paid</Text>
            <Text style={[styles.detailValue, { color: colors.primary, fontWeight: '700' }]}>
              ₹{booking.totalAmount.toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Payment Method</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{booking.paymentMethod}</Text>
          </View>
        </GlassCard>

        {flight && (
          <GlassCard>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>✈️ Flight Details</Text>
            
            <View style={styles.flightHeader}>
              <Text style={[styles.airlineName, { color: colors.text }]}>{flight.airline}</Text>
              <Text style={[styles.flightNumber, { color: colors.textSecondary }]}>{flight.flightNumber}</Text>
            </View>
            
            <View style={styles.flightRoute}>
              <View>
                <Text style={[styles.routeTime, { color: colors.text }]}>{flight.departure.time}</Text>
                <Text style={[styles.routeCity, { color: colors.textSecondary }]}>{flight.departure.city}</Text>
              </View>
              <View style={styles.routeLine}>
                <Text style={[styles.duration, { color: colors.textTertiary }]}>{flight.duration}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.routeTime, { color: colors.text }]}>{flight.arrival.time}</Text>
                <Text style={[styles.routeCity, { color: colors.textSecondary }]}>{flight.arrival.city}</Text>
              </View>
            </View>
          </GlassCard>
        )}

        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📝 Important Instructions</Text>
          <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
            • Please carry a valid photo ID for check-in
          </Text>
          <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
            • Report to check-in counter 2 hours before departure
          </Text>
          <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
            • Web check-in opens 48 hours before departure
          </Text>
          <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
            • Boarding gate closes 20 minutes before departure
          </Text>
        </GlassCard>

        <View style={styles.actionButtons}>
          <AnimatedButton
            title="View Booking"
            onPress={handleViewBooking}
            gradient
            size="large"
            style={styles.primaryButton}
          />
          <AnimatedButton
            title="Book Another Flight"
            onPress={handleBookAnother}
            variant="outline"
            size="large"
            style={styles.secondaryButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  confettiContainer: { alignItems: 'center', marginBottom: 20 },
  confetti: { fontSize: 60 },
  successContainer: { alignItems: 'center', marginBottom: 24 },
  successIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successIconText: { fontSize: 40, color: '#fff', fontWeight: '700' },
  successTitle: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  successSubtitle: { fontSize: 16, textAlign: 'center' },
  bookingIdRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  bookingIdLabel: { fontSize: 14 },
  bookingIdValue: { fontSize: 18, fontWeight: '700' },
  pnrRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pnrLabel: { fontSize: 14 },
  pnrValue: { fontSize: 18, fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 14, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  flightHeader: { marginBottom: 16 },
  airlineName: { fontSize: 18, fontWeight: '700' },
  flightNumber: { fontSize: 14 },
  flightRoute: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  routeTime: { fontSize: 20, fontWeight: '700' },
  routeCity: { fontSize: 14 },
  routeLine: { flex: 1, alignItems: 'center' },
  duration: { fontSize: 12 },
  instructionText: { fontSize: 14, marginBottom: 8, lineHeight: 20 },
  actionButtons: { gap: 12, marginTop: 16 },
  primaryButton: {},
  secondaryButton: {},
});

export default BookingConfirmationScreen;
