import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, StatusBar, RefreshControl, TextInput } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList, Hotel } from '../../types';
import { HotelCard } from '../../components/Card';
import { HotelSkeleton } from '../../components/Skeleton';
import { simulateLoading, generateHotels } from '../../utils/mockData';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;
type RouteType = RouteProp<TravelStackParamList, 'HotelResults'>;

const HotelResultsScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('price');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { loadHotels(); }, []);

  const loadHotels = async () => {
    setIsLoading(true);
    await simulateLoading(2000);
    const allHotels = generateHotels(40);
    setHotels(allHotels);
    setFilteredHotels(allHotels);
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHotels();
    setRefreshing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleHotelPress = (hotel: Hotel) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('HotelDetails', hotel);
  };

  const renderHeader = () => (
    <Animated.View entering={FadeInDown.duration(400)} style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.secondary }]}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButton}>←</Text></TouchableOpacity>
        <View>
          <Text style={styles.routeText}>{route.params?.location || 'Goa'}</Text>
          <Text style={styles.dateText}>{route.params?.checkIn || '2024-01-15'} - {route.params?.checkOut || '2024-01-18'}</Text>
        </View>
        <TouchableOpacity><Text style={styles.filterIcon}>⚙️</Text></TouchableOpacity>
      </View>
      <TextInput style={[styles.searchInput, { backgroundColor: colors.surface }]} placeholder="Search hotels..." placeholderTextColor={colors.textTertiary} value={searchQuery} onChangeText={setSearchQuery} />
      <View style={styles.sortContainer}>
        {(['price', 'rating'] as const).map((type) => (
          <TouchableOpacity key={type} onPress={() => { Haptics.selectionAsync(); setSortBy(type); }} style={[styles.sortButton, sortBy === type && { backgroundColor: colors.surface }]}>
            <Text style={[styles.sortText, { color: sortBy === type ? colors.primary : '#fff' }]}>{type === 'price' ? '💰 Price' : '⭐ Rating'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderHotel = ({ item, index }: { item: Hotel; index: number }) => (
    <HotelCard hotel={item} onPress={() => handleHotelPress(item)} index={index} />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.secondary} translucent />
      {renderHeader()}
      <View style={[styles.resultCount, { backgroundColor: colors.surface }]}>
        <Text style={[styles.resultText, { color: colors.text }]}>{filteredHotels.length} hotels found</Text>
        <Text style={[styles.resultSubtext, { color: colors.textSecondary }]}>{route.params?.guests || 2} Guest(s), {route.params?.rooms || 1} Room(s)</Text>
      </View>
      <FlatList data={filteredHotels} renderItem={renderHotel} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />} ListEmptyComponent={isLoading ? <><HotelSkeleton /><HotelSkeleton /><HotelSkeleton /></> : null} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backButton: { fontSize: 24, color: '#fff', marginRight: 16 },
  routeText: { fontSize: 20, fontWeight: '700', color: '#fff' },
  dateText: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  filterIcon: { fontSize: 20 },
  searchInput: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, fontSize: 16, marginBottom: 12 },
  sortContainer: { flexDirection: 'row', gap: 8 },
  sortButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  sortText: { fontSize: 13, fontWeight: '600' },
  resultCount: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, marginHorizontal: 16, marginTop: 16, borderRadius: 12 },
  resultText: { fontSize: 16, fontWeight: '600' },
  resultSubtext: { fontSize: 14 },
  listContent: { paddingTop: 16, paddingBottom: 100 },
});

export default HotelResultsScreen;
