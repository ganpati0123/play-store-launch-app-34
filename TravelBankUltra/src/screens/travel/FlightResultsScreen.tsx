import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  StatusBar,
  TextInput,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList, Flight } from '../../types';
import { FlightCard } from '../../components/Card';
import { FlightSkeleton } from '../../components/Skeleton';
import { AnimatedButton } from '../../components/Button';
import { simulateLoading, generateFlights, generateSeats } from '../../utils/mockData';
import { FilterSheet, QuickActionSheet } from '../../components/BottomSheet';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;
type RouteType = RouteProp<TravelStackParamList, 'FlightResults'>;

const FlightResultsScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');

  const filterButtonScale = useSharedValue(1);

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    setIsLoading(true);
    await simulateLoading(2000);
    const allFlights = generateFlights(50);
    setFlights(allFlights);
    setFilteredFlights(allFlights);
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFlights();
    setRefreshing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleFlightPress = (flight: Flight) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('FlightDetails', flight);
  };

  const handleSort = (type: 'price' | 'duration' | 'departure') => {
    Haptics.selectionAsync();
    setSortBy(type);
    const sorted = [...filteredFlights].sort((a, b) => {
      switch (type) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        case 'departure':
          return a.departure.time.localeCompare(b.departure.time);
        default:
          return 0;
      }
    });
    setFilteredFlights(sorted);
  };

  const handleFilterApply = (filters: any) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSelectedFilters(filters);
    setFilterSheetVisible(false);
    // Apply filters
    let result = [...flights];
    if (filters.priceRange) {
      result = result.filter(
        (f) => f.price >= filters.priceRange[0] && f.price <= filters.priceRange[1]
      );
    }
    setFilteredFlights(result);
  };

  const renderHeader = () => (
    <View>
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[
          styles.header,
          { paddingTop: insets.top + 10, backgroundColor: colors.primary },
        ]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.routeText}>
              {route.params?.from || 'DEL'} → {route.params?.to || 'BOM'}
            </Text>
            <Text style={styles.dateText}>
              {route.params?.departureDate || '2024-01-15'} • {route.params?.passengers || 1} Passenger(s)
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              filterButtonScale.value = withSpring(0.9, { damping: 10 });
              setFilterSheetVisible(true);
            }}
          >
            <View style={[styles.filterButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={styles.filterIcon}>⚙️</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <TextInput
            style={[styles.searchInput, { backgroundColor: colors.surface }]}
            placeholder="Search flights..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.sortContainer}>
          <TouchableOpacity
            onPress={() => handleSort('price')}
            style={[
              styles.sortButton,
              sortBy === 'price' && { backgroundColor: colors.surface },
            ]}
          >
            <Text
              style={[
                styles.sortText,
                { color: sortBy === 'price' ? colors.primary : '#fff' },
              ]}
            >
              💰 Price
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSort('duration')}
            style={[
              styles.sortButton,
              sortBy === 'duration' && { backgroundColor: colors.surface },
            ]}
          >
            <Text
              style={[
                styles.sortText,
                { color: sortBy === 'duration' ? colors.primary : '#fff' },
              ]}
            >
              ⏱️ Duration
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSort('departure')}
            style={[
              styles.sortButton,
              sortBy === 'departure' && { backgroundColor: colors.surface },
            ]}
          >
            <Text
              style={[
                styles.sortText,
                { color: sortBy === 'departure' ? colors.primary : '#fff' },
              ]}
            >
              🕐 Departure
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={[styles.resultCount, { backgroundColor: colors.surface }]}>
        <Text style={[styles.resultText, { color: colors.text }]}>
          {filteredFlights.length} flights found
        </Text>
        <Text style={[styles.resultSubtext, { color: colors.textSecondary }]}>
          {route.params?.class || 'Economy'} class
        </Text>
      </View>
    </View>
  );

  const renderFlight = ({ item, index }: { item: Flight; index: number }) => (
    <FlightCard
      flight={item}
      onPress={() => handleFlightPress(item)}
      index={index}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
        translucent
      />
      
      {renderHeader()}

      <FlatList
        data={filteredFlights}
        renderItem={renderFlight}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <>
              <FlightSkeleton />
              <FlightSkeleton />
              <FlightSkeleton />
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No flights found
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Try adjusting your filters
              </Text>
            </View>
          )
        }
      />

      <FilterSheet
        isVisible={filterSheetVisible}
        onClose={() => setFilterSheetVisible(false)}
        filters={selectedFilters}
        onApply={handleFilterApply}
        onReset={() => {
          setSelectedFilters({});
          setFilteredFlights(flights);
          setFilterSheetVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    fontSize: 24,
    color: '#fff',
    marginRight: 16,
  },
  headerCenter: {
    flex: 1,
  },
  routeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: 18,
  },
  searchBar: {
    marginBottom: 16,
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '600',
  },
  resultCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultSubtext: {
    fontSize: 14,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default FlightResultsScreen;
