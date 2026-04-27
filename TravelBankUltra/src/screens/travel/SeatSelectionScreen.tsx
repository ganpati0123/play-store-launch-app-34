import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList, Flight, Seat } from '../../types';
import { AnimatedButton } from '../../components/Button';
import { GlassCard } from '../../components/GlassCard';
import { generateSeats, simulateLoading } from '../../utils/mockData';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;
type RouteType = RouteProp<TravelStackParamList, 'SeatSelection'>;

const SeatSelectionScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const flight = route.params;

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const seatPrice = selectedSeat?.price || 0;
  const totalPrice = flight.price + seatPrice;

  useEffect(() => {
    loadSeats();
  }, []);

  const loadSeats = async () => {
    setIsLoading(true);
    await simulateLoading(1500);
    setSeats(generateSeats());
    setIsLoading(false);
  };

  const handleSeatSelect = (seat: Seat) => {
    if (!seat.available) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (selectedSeat?.id === seat.id) {
      setSelectedSeat(null);
    } else {
      setSelectedSeat(seat);
    }
  };

  const handleContinue = () => {
    if (!selectedSeat) {
      Alert.alert('Select Seat', 'Please select a seat to continue');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate('PassengerDetails', flight);
  };

  const getSeatColor = (seat: Seat) => {
    if (!seat.available) return colors.textTertiary;
    if (selectedSeat?.id === seat.id) return colors.primary;
    switch (seat.type) {
      case 'exit': return colors.warning;
      case 'aisle': return colors.info;
      case 'premium': return colors.secondary;
      default: return colors.success;
    }
  };

  const rows = Array.from(new Set(seats.map(s => s.row)));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      <Animated.View entering={FadeIn.duration(300)} style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.primary }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Seat</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={styles.flightInfo}>
          <Text style={styles.flightRoute}>{flight.departure.city} → {flight.arrival.city}</Text>
          <Text style={styles.flightDate}>{flight.departure.date}</Text>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <GlassCard>
          <Text style={[styles.legendTitle, { color: colors.text }]}>Legend</Text>
          <View style={styles.legendRow}>
            {[
              { color: colors.success, label: 'Standard' },
              { color: colors.warning, label: 'Exit Row' },
              { color: colors.info, label: 'Aisle' },
              { color: colors.secondary, label: 'Premium' },
              { color: colors.textTertiary, label: 'Occupied' },
            ].map((item, i) => (
              <View key={i} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>{item.label}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        <View style={styles.seatMapContainer}>
          <View style={styles.seatFront}>
            <Text style={[styles.seatFrontText, { color: colors.textSecondary }]}>FRONT</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.seatMap}>
              {rows.map((row, rowIndex) => (
                <View key={row} style={styles.seatRow}>
                  <Text style={[styles.rowNumber, { color: colors.textTertiary }]}>{row}</Text>
                  {seats.filter(s => s.row === row).slice(0, 3).map((seat) => (
                    <TouchableOpacity
                      key={seat.id}
                      onPress={() => handleSeatSelect(seat)}
                      disabled={!seat.available}
                      style={[
                        styles.seat,
                        { backgroundColor: getSeatColor(seat), opacity: seat.available ? 1 : 0.4 },
                        selectedSeat?.id === seat.id && styles.selectedSeat,
                      ]}
                    >
                      <Text style={styles.seatLabel}>{seat.column}</Text>
                    </TouchableOpacity>
                  ))}
                  <View style={styles.seatGap} />
                  {seats.filter(s => s.row === row).slice(3).map((seat) => (
                    <TouchableOpacity
                      key={seat.id}
                      onPress={() => handleSeatSelect(seat)}
                      disabled={!seat.available}
                      style={[
                        styles.seat,
                        { backgroundColor: getSeatColor(seat), opacity: seat.available ? 1 : 0.4 },
                        selectedSeat?.id === seat.id && styles.selectedSeat,
                      ]}
                    >
                      <Text style={styles.seatLabel}>{seat.column}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {selectedSeat && (
          <GlassCard>
            <Text style={[styles.selectedTitle, { color: colors.text }]}>Selected Seat</Text>
            <View style={styles.selectedInfo}>
              <Text style={[styles.selectedSeatNumber, { color: colors.primary }]}>Seat {selectedSeat.id}</Text>
              <Text style={[styles.selectedType, { color: colors.textSecondary }]}>{selectedSeat.type} Row</Text>
              <Text style={[styles.selectedPrice, { color: colors.text }]}>+₹{selectedSeat.price}</Text>
            </View>
          </GlassCard>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
        <View>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total Price</Text>
          <Text style={[styles.totalPrice, { color: colors.text }]}>₹{totalPrice.toLocaleString()}</Text>
        </View>
        <AnimatedButton title="Continue →" onPress={handleContinue} gradient size="large" style={styles.continueButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  backButton: { fontSize: 24, color: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  flightInfo: { alignItems: 'center' },
  flightRoute: { fontSize: 16, color: '#fff', fontWeight: '600' },
  flightDate: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  content: { padding: 16, paddingBottom: 120 },
  legendTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 16, height: 16, borderRadius: 4 },
  legendLabel: { fontSize: 12 },
  seatMapContainer: { marginTop: 20 },
  seatFront: { alignItems: 'center', paddingVertical: 12 },
  seatFrontText: { fontSize: 14, fontWeight: '600' },
  seatMap: { paddingHorizontal: 20 },
  seatRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 4 },
  rowNumber: { width: 24, fontSize: 12, fontWeight: '600' },
  seat: { width: 32, height: 36, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  selectedSeat: { borderWidth: 3, borderColor: '#fff' },
  seatLabel: { fontSize: 10, fontWeight: '700', color: '#fff' },
  seatGap: { width: 16 },
  selectedTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  selectedInfo: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  selectedSeatNumber: { fontSize: 20, fontWeight: '700' },
  selectedType: { fontSize: 14 },
  selectedPrice: { fontSize: 16, fontWeight: '600', marginLeft: 'auto' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 34, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10 },
  totalLabel: { fontSize: 12 },
  totalPrice: { fontSize: 22, fontWeight: '700' },
  continueButton: { minWidth: 140 },
});

export default SeatSelectionScreen;
