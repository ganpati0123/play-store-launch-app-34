import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  StatusBar,
  Switch,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList } from '../types';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/Button';
import { SearchInput } from '../components/Input';
import { FlightCard, HotelCard, TrainCard, BookingCard } from '../components/Card';
import { FlightSkeleton, HotelSkeleton, TransactionSkeleton } from '../components/Skeleton';
import { simulateLoading, generateFlights, generateHotels, generateTrains, generateBookings } from '../utils/mockData';
import { Flight, Hotel, Train, Booking } from '../types';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;

const TravelHomeScreen: React.FC = () => {
  const { colors, theme, mode, setMode, toggleMode, toggleTheme, theme: currentTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [trains, setTrains] = useState<Train[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const headerScale = useSharedValue(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    await simulateLoading(1500);
    setFlights(generateFlights(10));
    setHotels(generateHotels(10));
    setTrains(generateTrains(10));
    setBookings(generateBookings(5));
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSearchPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleCategoryPress = (category: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    switch (category) {
      case 'flights':
        navigation.navigate('FlightSearch');
        break;
      case 'hotels':
        navigation.navigate('HotelSearch');
        break;
      case 'trains':
        navigation.navigate('TrainSearch');
        break;
      case 'buses':
        navigation.navigate('TrainSearch'); // Using train search for buses too
        break;
    }
  };

  const categories = [
    { id: 'flights', icon: '✈️', label: 'Flights', gradient: ['#6366F1', '#8B5CF6'] },
    { id: 'hotels', icon: '🏨', label: 'Hotels', gradient: ['#EC4899', '#F472B6'] },
    { id: 'trains', icon: '🚆', label: 'Trains', gradient: ['#10B981', '#34D399'] },
    { id: 'buses', icon: '🚌', label: 'Buses', gradient: ['#F59E0B', '#FBBF24'] },
  ];

  const deals = [
    { id: '1', title: 'Goa Getaway', subtitle: 'Flights + Hotel', discount: '40% OFF', color: '#6366F1' },
    { id: '2', title: 'Dubai Escape', subtitle: 'Round Trip Flights', discount: '25% OFF', color: '#EC4899' },
    { id: '3', title: 'Manali Adventure', subtitle: 'Hotels + Cab', discount: '35% OFF', color: '#10B981' },
  ];

  const renderHeader = () => (
    <Animated.View
      entering={FadeInDown.duration(600)}
      style={[
        styles.header,
        { paddingTop: insets.top + 10, backgroundColor: colors.background },
      ]}
    >
      <LinearGradient
        colors={theme === 'dark' ? ['#1E293B', '#0F172A'] : ['#6366F1', '#4F46E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <BlurView intensity={30} tint={theme} style={StyleSheet.absoluteFill} />
        
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good Morning,</Text>
              <Text style={styles.userName}>Travel Explorer! 🌍</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.themeToggle}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toggleTheme();
                }}
              >
                <Text style={styles.themeIcon}>{currentTheme === 'dark' ? '☀️' : '🌙'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search destinations, bookings..."
              onPress={handleSearchPress}
            />
          </View>

          <View style={styles.quickStats}>
            <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('BookingsList')}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statCard}>
              <Text style={styles.statValue}>₹45K</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statCard}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Points</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderCategories = () => (
    <Animated.View entering={FadeInUp.delay(200).duration(400)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => handleCategoryPress(category.id)}
            activeOpacity={0.8}
          >
            <Animated.View
              entering={FadeInDown.delay(index * 100).springify()}
              style={styles.categoryCard}
            >
              <LinearGradient
                colors={category.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.categoryGradient}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderDeals = () => (
    <Animated.View entering={FadeInUp.delay(300).duration(400)}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>🔥 Hot Deals</Text>
        <TouchableOpacity>
          <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dealsContainer}
      >
        {deals.map((deal, index) => (
          <TouchableOpacity key={deal.id} activeOpacity={0.9}>
            <Animated.View entering={SlideInRight.delay(index * 100)}>
              <LinearGradient
                colors={[deal.color, deal.color + 'CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.dealCard}
              >
                <Text style={styles.discountBadge}>{deal.discount}</Text>
                <Text style={styles.dealTitle}>{deal.title}</Text>
                <Text style={styles.dealSubtitle}>{deal.subtitle}</Text>
                <TouchableOpacity style={styles.dealButton}>
                  <Text style={styles.dealButtonText}>Book Now</Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderFlights = () => (
    <Animated.View entering={FadeInUp.delay(400).duration(400)}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>✈️ Recent Flights</Text>
        <TouchableOpacity onPress={() => navigation.navigate('FlightSearch')}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>Search</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <FlightSkeleton />
      ) : (
        flights.slice(0, 3).map((flight, index) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            index={index}
            onPress={() => navigation.navigate('FlightDetails', flight)}
          />
        ))
      )}
    </Animated.View>
  );

  const renderHotels = () => (
    <Animated.View entering={FadeInUp.delay(500).duration(400)}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>🏨 Popular Hotels</Text>
        <TouchableOpacity onPress={() => navigation.navigate('HotelSearch')}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>Search</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <HotelSkeleton />
      ) : (
        hotels.slice(0, 3).map((hotel, index) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            index={index}
            onPress={() => navigation.navigate('HotelDetails', hotel)}
          />
        ))
      )}
    </Animated.View>
  );

  const renderBookings = () => (
    <Animated.View entering={FadeInUp.delay(600).duration(400)}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>📋 Recent Bookings</Text>
        <TouchableOpacity onPress={() => navigation.navigate('BookingsList')}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>View All</Text>
        </TouchableOpacity>
      </View>
      {bookings.slice(0, 2).map((booking, index) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onPress={() => navigation.navigate('BookingDetail', booking)}
        />
      ))}
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {renderHeader()}
        {renderCategories()}
        <View style={styles.content}>
          {renderDeals()}
          {renderFlights()}
          {renderHotels()}
          {renderBookings()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: -40,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerContent: {
    gap: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIcon: {
    fontSize: 20,
  },
  searchContainer: {
    marginTop: 8,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  content: {
    paddingTop: 20,
    paddingBottom: 100,
    gap: 24,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  categoryCard: {
    width: 90,
    height: 90,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
  categoryGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  dealsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  dealCard: {
    width: width * 0.7,
    padding: 20,
    borderRadius: 20,
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: '#fff',
    color: '#000',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  dealTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  dealSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  dealButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  dealButtonText: {
    color: '#000',
    fontWeight: '600',
  },
});

export default TravelHomeScreen;
