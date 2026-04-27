import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList, Booking } from '../../types';
import { AnimatedButton } from '../../components/Button';
import { GlassCard } from '../../components/GlassCard';

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;
type RouteType = RouteProp<TravelStackParamList, 'BookingDetail'>;

const BookingDetailScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const booking = route.params;

  const handleCancel = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); navigation.navigate('CancelBooking', booking); };
  const handleModify = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); navigation.navigate('ModifyBooking', booking); };
  const handleShare = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <Animated.View entering={FadeIn.duration(300)} style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.primary }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButton}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Details</Text>
          <TouchableOpacity onPress={handleShare}><Text>📤</Text></TouchableOpacity>
        </View>
        <View style={styles.statusBadge}><Text style={styles.statusText}>{booking.status.toUpperCase()}</Text></View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <GlassCard>
          <Text style={[styles.bookingId, { color: colors.primary }]}>{booking.id}</Text>
          <Text style={[styles.bookingType, { color: colors.text }]}>{booking.type.charAt(0).toUpperCase() + booking.type.slice(1)} Booking</Text>
        </GlassCard>

        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📅 Travel Details</Text>
          <View style={styles.detailRow}><Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Travel Date</Text><Text style={[styles.detailValue, { color: colors.text }]}>{booking.travelDate}</Text></View>
          <View style={styles.detailRow}><Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Booking Date</Text><Text style={[styles.detailValue, { color: colors.text }]}>{booking.bookingDate}</Text></View>
          {booking.pnr && <View style={styles.detailRow}><Text style={[styles.detailLabel, { color: colors.textSecondary }]}>PNR</Text><Text style={[styles.detailValue, { color: colors.primary }]}>{booking.pnr}</Text></View>}
        </GlassCard>

        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>💰 Payment Details</Text>
          <View style={styles.detailRow}><Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Total Amount</Text><Text style={[styles.detailValue, { color: colors.primary, fontWeight: '700' }]}>₹{booking.totalAmount.toLocaleString()}</Text></View>
          <View style={styles.detailRow}><Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Payment Method</Text><Text style={[styles.detailValue, { color: colors.text }]}>{booking.paymentMethod}</Text></View>
        </GlassCard>

        <View style={styles.actionButtons}>
          <AnimatedButton title="Modify Booking" onPress={handleModify} variant="outline" size="large" />
          <AnimatedButton title="Cancel Booking" onPress={handleCancel} variant="ghost" size="large" style={{ color: colors.error }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { fontSize: 24, color: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  statusBadge: { alignSelf: 'flex-start', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#6366F1', fontSize: 12, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 40 },
  bookingId: { fontSize: 24, fontWeight: '700' },
  bookingType: { fontSize: 16, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 14, fontWeight: '600' },
  actionButtons: { gap: 12, marginTop: 16 },
});

export default BookingDetailScreen;
