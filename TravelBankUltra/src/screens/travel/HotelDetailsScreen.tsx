import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList, Hotel } from '../../types';
import { AnimatedButton } from '../../components/Button';
import { GlassCard } from '../../components/GlassCard';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;
type RouteType = RouteProp<TravelStackParamList, 'HotelDetails'>;

const HotelDetailsScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const hotel = route.params;

  const [selectedRoom, setSelectedRoom] = useState(hotel.rooms[0]);
  const [selectedTab, setSelectedTab] = useState<'rooms' | 'amenities' | 'reviews'>('rooms');

  const handleBookRoom = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate('RoomSelection', hotel);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      <Animated.View style={[styles.headerImage, { height: 250 }]}>
        <Image source={{ uri: hotel.images[0] }} style={styles.image} />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={StyleSheet.absoluteFill} />
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
          <TouchableOpacity style={styles.favBtn}><Text>❤️</Text></TouchableOpacity>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.hotelLocation}>📍 {hotel.location}</Text>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.ratingCard, { backgroundColor: colors.surface }]}>
          <View><Text style={[styles.rating, { color: colors.primary }]}>★ {hotel.rating}</Text><Text style={[styles.reviews, { color: colors.textSecondary }]}>({hotel.reviewCount} reviews)</Text></View>
          <View><Text style={[styles.distance, { color: colors.text }]}>{hotel.distance}</Text></View>
        </View>

        <View style={[styles.tabs, { backgroundColor: colors.surface }]}>
          {(['rooms', 'amenities', 'reviews'] as const).map((tab) => (
            <TouchableOpacity key={tab} onPress={() => { Haptics.selectionAsync(); setSelectedTab(tab); }} style={[styles.tab, selectedTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}>
              <Text style={[styles.tabText, { color: selectedTab === tab ? colors.primary : colors.textSecondary }]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedTab === 'rooms' && (
          <Animated.View entering={FadeIn.duration(300)}>
            {hotel.rooms.map((room) => (
              <GlassCard key={room.id}>
                <View style={styles.roomHeader}>
                  <View><Text style={[styles.roomName, { color: colors.text }]}>{room.name}</Text><Text style={[styles.roomDesc, { color: colors.textSecondary }]}>{room.description}</Text></View>
                  <Text style={[styles.roomPrice, { color: colors.primary }]}>₹{room.price.toLocaleString()}</Text>
                </View>
                <View style={styles.roomDetails}><Text style={[styles.roomInfo, { color: colors.textSecondary }]}>👤 Max {room.maxGuests} Guests</Text><Text style={[styles.roomInfo, { color: colors.textSecondary }]}>🛏️ {room.bedType}</Text></View>
                <View style={styles.roomAmenities}>
                  {room.amenities.slice(0, 4).map((a, i) => <View key={i} style={[styles.amenityTag, { backgroundColor: colors.surfaceVariant }]}><Text style={[styles.amenityText, { color: colors.textSecondary }]}>{a}</Text></View>)}
                </View>
                <TouchableOpacity onPress={() => { Haptics.selectionAsync(); setSelectedRoom(room); }} style={[styles.selectButton, { backgroundColor: selectedRoom.id === room.id ? colors.primary : colors.surfaceVariant }]}>
                  <Text style={{ color: selectedRoom.id === room.id ? '#fff' : colors.text }}>{selectedRoom.id === room.id ? 'Selected' : 'Select Room'}</Text>
                </TouchableOpacity>
              </GlassCard>
            ))}
          </Animated.View>
        )}

        {selectedTab === 'amenities' && (
          <GlassCard>
            <View style={styles.amenitiesGrid}>
              {hotel.amenities.map((a, i) => <View key={i} style={[styles.amenityItem, { backgroundColor: colors.surfaceVariant }]}><Text style={styles.amenityEmoji}>{['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Parking', 'Room Service'][i % 8]}</Text><Text style={[styles.amenityName, { color: colors.text }]}>{a}</Text></View>)}
            </View>
          </GlassCard>
        )}

        {selectedTab === 'reviews' && (
          <GlassCard>
            <Text style={[styles.reviewsTitle, { color: colors.text }]}>Guest Reviews</Text>
            {[5, 4, 3].map((stars) => (
              <View key={stars} style={styles.reviewItem}>
                <Text style={[styles.reviewStars, { color: colors.text }]}>{'⭐'.repeat(stars)}</Text>
                <Text style={[styles.reviewText, { color: colors.textSecondary }]}>Great stay! Highly recommended.</Text>
              </View>
            ))}
          </GlassCard>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
        <View><Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total Price</Text><Text style={[styles.totalPrice, { color: colors.text }]}>₹{selectedRoom.price.toLocaleString()}</Text></View>
        <AnimatedButton title="Book Now →" onPress={handleBookRoom} gradient size="large" style={styles.bookButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerImage: { width, position: 'relative' },
  image: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  headerButtons: { position: 'absolute', top: 50, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 20 },
  favBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  headerContent: { position: 'absolute', bottom: 20, left: 20 },
  hotelName: { fontSize: 24, fontWeight: '700', color: '#fff' },
  hotelLocation: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  content: { padding: 16, paddingBottom: 120 },
  ratingCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 16 },
  rating: { fontSize: 20, fontWeight: '700' },
  reviews: { fontSize: 14 },
  distance: { fontSize: 14 },
  tabs: { flexDirection: 'row', borderRadius: 16, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabText: { fontSize: 14, fontWeight: '600' },
  roomHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  roomName: { fontSize: 18, fontWeight: '700' },
  roomDesc: { fontSize: 13, marginTop: 4 },
  roomPrice: { fontSize: 20, fontWeight: '700' },
  roomDetails: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  roomInfo: { fontSize: 13 },
  roomAmenities: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  amenityTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  amenityText: { fontSize: 11 },
  selectButton: { paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  amenityItem: { width: '30%', padding: 12, borderRadius: 12, alignItems: 'center' },
  amenityEmoji: { fontSize: 24, marginBottom: 4 },
  amenityName: { fontSize: 11, textAlign: 'center' },
  reviewsTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  reviewItem: { marginBottom: 12 },
  reviewStars: { fontSize: 14, marginBottom: 4 },
  reviewText: { fontSize: 14 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 34, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10 },
  totalLabel: { fontSize: 12 },
  totalPrice: { fontSize: 22, fontWeight: '700' },
  bookButton: { minWidth: 140 },
});

export default HotelDetailsScreen;
