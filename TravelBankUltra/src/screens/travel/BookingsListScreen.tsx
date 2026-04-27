import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList } from '../../types';
import { BookingCard } from '../../components/Card';
import { simulateLoading, generateBookings } from '../../utils/mockData';
import { Booking } from '../../types';

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;

const BookingsListScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'flight' | 'hotel' | 'train'>('all');

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    setIsLoading(true);
    await simulateLoading(1500);
    setBookings(generateBookings(15));
    setIsLoading(false);
  };

  const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.type === filter);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <Animated.View entering={FadeIn.duration(300)} style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.primary }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButton}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={styles.filterContainer}>
          {(['all', 'flight', 'hotel', 'train'] as const).map((f) => (
            <TouchableOpacity key={f} onPress={() => { Haptics.selectionAsync(); setFilter(f); }} style={[styles.filterButton, filter === f && { backgroundColor: colors.surface }]}>
              <Text style={[styles.filterText, { color: filter === f ? colors.primary : '#fff' }]}>{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {filteredBookings.map((booking, index) => (
          <BookingCard key={booking.id} booking={booking} onPress={() => navigation.navigate('BookingDetail', booking)} />
        ))}
        {filteredBookings.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={[styles.emptyText, { color: colors.text }]}>No bookings found</Text>
          </View>
        )}
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
  filterContainer: { flexDirection: 'row', gap: 8 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  filterText: { fontSize: 13, fontWeight: '600' },
  content: { padding: 16, paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '600' },
});

export default BookingsListScreen;
