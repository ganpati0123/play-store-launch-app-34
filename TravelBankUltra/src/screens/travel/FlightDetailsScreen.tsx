import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
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
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList, Flight } from '../../types';
import { AnimatedButton } from '../../components/Button';
import { GlassCard } from '../../components/GlassCard';
import { generateSeats } from '../../utils/mockData';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;
type RouteType = RouteProp<TravelStackParamList, 'FlightDetails'>;

const FlightDetailsScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const flight = route.params;

  const [selectedTab, setSelectedTab] = useState<'details' | 'fare' | 'baggage'>('details');
  const [showSeatMap, setShowSeatMap] = useState(false);

  const buttonScale = useSharedValue(1);

  const handleSelectSeats = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    buttonScale.value = withSequence(
      withSpring(0.95, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
    navigation.navigate('SeatSelection', flight);
  };

  const tabs = [
    { id: 'details', label: 'Details', icon: '📋' },
    { id: 'fare', label: 'Fare Rules', icon: '💰' },
    { id: 'baggage', label: 'Baggage', icon: '🧳' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={theme === 'dark'
          ? ['#1E293B', '#0F172A']
          : ['#6366F1', '#4F46E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <BlurView intensity={30} tint={theme} style={StyleSheet.absoluteFill} />

        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Flight Details</Text>
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.airlineCard}>
          <Image
            source={{ uri: flight.airlineLogo }}
            style={styles.airlineLogo}
            defaultSource={require('../../../assets/icon.png')}
          />
          <View style={styles.airlineInfo}>
            <Text style={styles.airlineName}>{flight.airline}</Text>
            <Text style={styles.flightNumber}>{flight.flightNumber}</Text>
          </View>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>₹{flight.price.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.routeCard}>
          <View style={styles.routePoint}>
            <Text style={styles.timeText}>{flight.departure.time}</Text>
            <Text style={styles.airportText}>{flight.departure.airport}</Text>
            <Text style={styles.cityText}>{flight.departure.city}</Text>
          </View>

          <View style={styles.routeLine}>
            <View style={styles.routeDuration}>
              <Text style={styles.durationText}>{flight.duration}</Text>
              <View style={styles.flightIcon}>
                <Text style={styles.flightIconText}>✈️</Text>
              </View>
            </View>
            <View style={[styles.line, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
            <Text style={styles.stopsText}>
              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
            </Text>
          </View>

          <View style={[styles.routePoint, { alignItems: 'flex-end' }]}>
            <Text style={styles.timeText}>{flight.arrival.time}</Text>
            <Text style={styles.airportText}>{flight.arrival.airport}</Text>
            <Text style={styles.cityText}>{flight.arrival.city}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={[styles.tabsContainer, { backgroundColor: colors.surface }]}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedTab(tab.id as any);
              }}
              style={[
                styles.tab,
                selectedTab === tab.id && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
              ]}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text
                style={[
                  styles.tabText,
                  { color: selectedTab === tab.id ? colors.primary : colors.textSecondary },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {selectedTab === 'details' && (
            <Animated.View entering={FadeIn.duration(300)}>
              <GlassCard>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  ✈️ Flight Information
                </Text>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Aircraft</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{flight.aircraft}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Class</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Duration</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{flight.duration}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Stops</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}
                  </Text>
                </View>
              </GlassCard>

              <GlassCard>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  📅 Schedule
                </Text>
                <View style={styles.scheduleItem}>
                  <View style={[styles.scheduleDot, { backgroundColor: colors.primary }]} />
                  <View>
                    <Text style={[styles.scheduleTime, { color: colors.text }]}>
                      {flight.departure.time} - {flight.departure.date}
                    </Text>
                    <Text style={[styles.schedulePlace, { color: colors.textSecondary }]}>
                      {flight.departure.city} ({flight.departure.airport})
                    </Text>
                  </View>
                </View>
                <View style={styles.scheduleLine} />
                <View style={styles.scheduleItem}>
                  <View style={[styles.scheduleDot, { backgroundColor: colors.secondary }]} />
                  <View>
                    <Text style={[styles.scheduleTime, { color: colors.text }]}>
                      {flight.arrival.time} - {flight.arrival.date}
                    </Text>
                    <Text style={[styles.schedulePlace, { color: colors.textSecondary }]}>
                      {flight.arrival.city} ({flight.arrival.airport})
                    </Text>
                  </View>
                </View>
              </GlassCard>

              <GlassCard>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  🏷️ Amenities
                </Text>
                <View style={styles.amenitiesGrid}>
                  {[
                    { icon: '📺', name: 'In-flight Entertainment' },
                    { icon: '🍱', name: 'Meal Included' },
                    { icon: '🔌', name: 'Power Outlets' },
                    { icon: '📶', name: 'WiFi' },
                    { icon: '🛋️', name: 'Extra Legroom' },
                    { icon: '🧸', name: 'Priority Boarding' },
                  ].map((amenity, index) => (
                    <View key={index} style={[styles.amenityItem, { backgroundColor: colors.surfaceVariant }]}>
                      <Text style={styles.amenityIcon}>{amenity.icon}</Text>
                      <Text style={[styles.amenityText, { color: colors.textSecondary }]}>
                        {amenity.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </GlassCard>
            </Animated.View>
          )}

          {selectedTab === 'fare' && (
            <Animated.View entering={FadeIn.duration(300)}>
              <GlassCard>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  💰 Fare Details
                </Text>
                <View style={styles.fareRow}>
                  <Text style={[styles.fareLabel, { color: colors.textSecondary }]}>
                    Base Fare (1 Adult)
                  </Text>
                  <Text style={[styles.fareValue, { color: colors.text }]}>
                    ₹{Math.round(flight.price * 0.7).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.fareRow}>
                  <Text style={[styles.fareLabel, { color: colors.textSecondary }]}>
                    Taxes & Fees
                  </Text>
                  <Text style={[styles.fareValue, { color: colors.text }]}>
                    ₹{Math.round(flight.price * 0.3).toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.fareRow, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginTop: 12 }]}>
                  <Text style={[styles.fareLabel, { color: colors.text, fontWeight: '700' }]}>Total</Text>
                  <Text style={[styles.fareValue, { color: colors.primary, fontWeight: '700', fontSize: 18 }]}>
                    ₹{flight.price.toLocaleString()}
                  </Text>
                </View>
              </GlassCard>

              <GlassCard>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  ❌ Cancellation Policy
                </Text>
                <View style={styles.policyItem}>
                  <Text style={[styles.policyTime, { color: colors.textSecondary }]}>
                    0-2 hours
                  </Text>
                  <Text style={[styles.policyFee, { color: colors.error }]}>
                    Non-refundable
                  </Text>
                </View>
                <View style={styles.policyItem}>
                  <Text style={[styles.policyTime, { color: colors.textSecondary }]}>
                    2-24 hours
                  </Text>
                  <Text style={[styles.policyFee, { color: colors.warning }]}>
                    60% refund
                  </Text>
                </View>
                <View style={styles.policyItem}>
                  <Text style={[styles.policyTime, { color: colors.textSecondary }]}>
                    24+ hours
                  </Text>
                  <Text style={[styles.policyFee, { color: colors.success }]}>
                    100% refund
                  </Text>
                </View>
              </GlassCard>
            </Animated.View>
          )}

          {selectedTab === 'baggage' && (
            <Animated.View entering={FadeIn.duration(300)}>
              <GlassCard>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  🧳 Baggage Allowance
                </Text>
                <View style={styles.baggageItem}>
                  <Text style={styles.baggageIcon}>💼</Text>
                  <View style={styles.baggageInfo}>
                    <Text style={[styles.baggageTitle, { color: colors.text }]}>
                      Cabin Baggage
                    </Text>
                    <Text style={[styles.baggageDesc, { color: colors.textSecondary }]}>
                      1 piece, max 7 kg
                    </Text>
                  </View>
                </View>
                <View style={styles.baggageItem}>
                  <Text style={styles.baggageIcon}>🛄</Text>
                  <View style={styles.baggageInfo}>
                    <Text style={[styles.baggageTitle, { color: colors.text }]}>
                      Check-in Baggage
                    </Text>
                    <Text style={[styles.baggageDesc, { color: colors.textSecondary }]}>
                      1 piece, max 15 kg
                    </Text>
                  </View>
                </View>
              </GlassCard>

              <GlassCard>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  ⚠️ Restrictions
                </Text>
                <Text style={[styles.restrictionText, { color: colors.textSecondary }]}>
                  • Lithium batteries must be in carry-on baggage
                </Text>
                <Text style={[styles.restrictionText, { color: colors.textSecondary }]}>
                  • No dangerous items allowed
                </Text>
                <Text style={[styles.restrictionText, { color: colors.textSecondary }]}>
                  • Liquids must be in containers under 100ml
                </Text>
              </GlassCard>
            </Animated.View>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
        <View>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total Price</Text>
          <Text style={[styles.totalPrice, { color: colors.text }]}>
            ₹{flight.price.toLocaleString()}
          </Text>
        </View>
        <AnimatedButton
          title="Select Seats →"
          onPress={handleSelectSeats}
          gradient
          size="large"
          style={styles.bookButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, overflow: 'hidden' },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { fontSize: 24, color: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  airlineCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16, marginBottom: 16 },
  airlineLogo: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff' },
  airlineInfo: { flex: 1, marginLeft: 12 },
  airlineName: { fontSize: 16, fontWeight: '600', color: '#fff' },
  flightNumber: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  priceTag: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  priceText: { fontSize: 18, fontWeight: '700', color: '#6366F1' },
  routeCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  routePoint: {},
  timeText: { fontSize: 24, fontWeight: '700', color: '#fff' },
  airportText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  cityText: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  routeLine: { flex: 1, alignItems: 'center', paddingHorizontal: 16 },
  routeDuration: { alignItems: 'center' },
  durationText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  flightIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  flightIconText: { fontSize: 16 },
  line: { width: '100%', height: 2, marginVertical: 8 },
  stopsText: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  content: { flex: 1 },
  tabsContainer: { flexDirection: 'row', marginHorizontal: 16, marginTop: 16, borderRadius: 16, padding: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6 },
  tabIcon: { fontSize: 16 },
  tabText: { fontSize: 14, fontWeight: '600' },
  tabContent: { padding: 16, gap: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: '600' },
  scheduleItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scheduleDot: { width: 12, height: 12, borderRadius: 6 },
  scheduleTime: { fontSize: 14, fontWeight: '600' },
  schedulePlace: { fontSize: 12, marginTop: 2 },
  scheduleLine: { width: 2, height: 30, marginLeft: 5, marginVertical: 8 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  amenityItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 8 },
  amenityIcon: { fontSize: 16 },
  amenityText: { fontSize: 12 },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  fareLabel: { fontSize: 14 },
  fareValue: { fontSize: 14, fontWeight: '600' },
  policyItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  policyTime: { fontSize: 14 },
  policyFee: { fontSize: 14, fontWeight: '600' },
  baggageItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 16 },
  baggageIcon: { fontSize: 32 },
  baggageTitle: { fontSize: 16, fontWeight: '600' },
  baggageDesc: { fontSize: 14, marginTop: 2 },
  restrictionText: { fontSize: 14, marginBottom: 8, lineHeight: 20 },
  bottomSpacer: { height: 100 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 34, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10 },
  totalLabel: { fontSize: 12 },
  totalPrice: { fontSize: 22, fontWeight: '700' },
  bookButton: { minWidth: 160 },
});

export default FlightDetailsScreen;
