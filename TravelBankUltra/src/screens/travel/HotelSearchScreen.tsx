import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList } from '../../types';
import { GlassCard } from '../../components/GlassCard';
import { HotelCard } from '../../components/Card';
import { HotelSkeleton } from '../../components/Skeleton';
import { Input } from '../../components/Input';
import { AnimatedButton } from '../../components/Button';
import { simulateLoading, generateHotels, cities } from '../../utils/mockData';
import { Hotel, HotelSearchParams } from '../../types';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;

const HotelSearchScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const searchAnim = useSharedValue(1);

  const handleSearch = async () => {
    if (!location) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    searchAnim.value = withSpring(0.95, { damping: 15 });
    setIsSearching(true);
    await simulateLoading(2000);
    
    const params: HotelSearchParams = {
      location,
      checkIn,
      checkOut: checkOut || checkIn,
      guests,
      rooms,
    };
    
    setIsSearching(false);
    searchAnim.value = withSpring(1, { damping: 15 });
    navigation.navigate('HotelResults', params);
  };

  const popularDestinations = [
    { name: 'Goa', image: 'https://picsum.photos/seed/goa/400/300', price: '₹2,500' },
    { name: 'Manali', image: 'https://picsum.photos/seed/manali/400/300', price: '₹3,200' },
    { name: 'Dubai', image: 'https://picsum.photos/seed/dubai/400/300', price: '₹8,500' },
    { name: 'Bali', image: 'https://picsum.photos/seed/bali/400/300', price: '₹7,000' },
    { name: 'Thailand', image: 'https://picsum.photos/seed/thailand/400/300', price: '₹6,500' },
    { name: 'Singapore', image: 'https://picsum.photos/seed/singapore/400/300', price: '₹9,000' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      <LinearGradient colors={theme === 'dark' ? ['#1E293B', '#0F172A'] : ['#EC4899', '#F472B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search Hotels</Text>
          <View style={{ width: 30 }} />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <GlassCard>
          <Input label="City / Location" placeholder="Enter city or hotel name" value={location} onChangeText={setLocation} />
          
          <View style={styles.dateRow}>
            <View style={styles.dateInput}>
              <Input label="Check-in" placeholder="Select date" value={checkIn} onChangeText={setCheckIn} />
            </View>
            <View style={styles.dateInput}>
              <Input label="Check-out" placeholder="Select date" value={checkOut} onChangeText={setCheckOut} />
            </View>
          </View>

          <View style={styles.guestRow}>
            <View>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Guests</Text>
              <View style={styles.counter}>
                <TouchableOpacity onPress={() => setGuests(Math.max(1, guests - 1))} style={styles.counterButton}>
                  <Text style={[styles.counterText, { color: colors.primary }]}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.counterValue, { color: colors.text }]}>{guests}</Text>
                <TouchableOpacity onPress={() => setGuests(Math.min(10, guests + 1))} style={styles.counterButton}>
                  <Text style={[styles.counterText, { color: colors.primary }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Rooms</Text>
              <View style={styles.counter}>
                <TouchableOpacity onPress={() => setRooms(Math.max(1, rooms - 1))} style={styles.counterButton}>
                  <Text style={[styles.counterText, { color: colors.primary }]}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.counterValue, { color: colors.text }]}>{rooms}</Text>
                <TouchableOpacity onPress={() => setRooms(Math.min(5, rooms + 1))} style={styles.counterButton}>
                  <Text style={[styles.counterText, { color: colors.primary }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <AnimatedButton title="Search Hotels 🔍" onPress={handleSearch} loading={isSearching} gradient size="large" style={styles.searchButton} />
        </GlassCard>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🏝️ Popular Destinations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.destinationsContainer}>
            {popularDestinations.map((dest, i) => (
              <TouchableOpacity key={i} style={styles.destinationCard}>
                <View style={[styles.destinationImage, { backgroundColor: colors.surfaceVariant }]} />
                <Text style={[styles.destinationName, { color: colors.text }]}>{dest.name}</Text>
                <Text style={[styles.destinationPrice, { color: colors.primary }]}>{dest.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>✨ Why Book With Us</Text>
          <View style={styles.featureGrid}>
            {[
              { icon: '💰', title: 'Best Prices', desc: 'Price match guarantee' },
              { icon: '🎁', title: 'Rewards', desc: 'Earn points on every booking' },
              { icon: '🛡️', title: 'Secure', desc: 'Your data is safe with us' },
              { icon: '📞', title: '24/7 Support', desc: 'We are always here to help' },
            ].map((f, i) => (
              <View key={i} style={[styles.featureCard, { backgroundColor: colors.surface }]}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={[styles.featureTitle, { color: colors.text }]}>{f.title}</Text>
                <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { fontSize: 24, color: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  content: { padding: 16, paddingBottom: 100 },
  dateRow: { flexDirection: 'row', gap: 12 },
  dateInput: { flex: 1 },
  guestRow: { flexDirection: 'row', gap: 20, marginTop: 8 },
  inputLabel: { fontSize: 12, fontWeight: '500', marginBottom: 8, textTransform: 'uppercase' },
  counter: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 12 },
  counterButton: { paddingHorizontal: 16, paddingVertical: 10 },
  counterText: { fontSize: 22, fontWeight: '600' },
  counterValue: { fontSize: 18, fontWeight: '700', paddingHorizontal: 20 },
  searchButton: { marginTop: 20 },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  destinationsContainer: { gap: 12 },
  destinationCard: { width: 140, marginRight: 12 },
  destinationImage: { height: 100, borderRadius: 12 },
  destinationName: { fontSize: 16, fontWeight: '600', marginTop: 8 },
  destinationPrice: { fontSize: 14, fontWeight: '600' },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureCard: { width: '47%', padding: 16, borderRadius: 16 },
  featureIcon: { fontSize: 24, marginBottom: 8 },
  featureTitle: { fontSize: 14, fontWeight: '600' },
  featureDesc: { fontSize: 12, marginTop: 4 },
});

export default HotelSearchScreen;
