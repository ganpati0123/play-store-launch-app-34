import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Platform,
  StatusBar,
  Animated,
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
  SlideInRight,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList, FlightSearchParams } from '../../types';
import { GlassCard } from '../../components/GlassCard';
import { AnimatedButton } from '../../components/Button';
import { Input } from '../../components/Input';
import { simulateLoading, cities, generateFlights } from '../../utils/mockData';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;

const FlightSearchScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  
  const [tripType, setTripType] = useState<'one-way' | 'round' | 'multi'>('round');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState<'economy' | 'business' | 'first'>('economy');
  const [isSearching, setIsSearching] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);

  const swapAnim = useSharedValue(0);
  const searchButtonScale = useSharedValue(1);

  const tripTypes = [
    { id: 'one-way', label: 'One Way' },
    { id: 'round', label: 'Round Trip' },
    { id: 'multi', label: 'Multi-City' },
  ];

  const classes = [
    { id: 'economy', label: 'Economy', price: 1 },
    { id: 'business', label: 'Business', price: 2.5 },
    { id: 'first', label: 'First Class', price: 4 },
  ];

  const handleSwapCities = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    swapAnim.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(0, { duration: 150 })
    );
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const swapStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${swapAnim.value * 180}deg` }],
  }));

  const handleSearch = async () => {
    if (!fromCity || !toCity) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    searchButtonScale.value = withSequence(
      withSpring(0.95, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );

    setIsSearching(true);
    await simulateLoading(2000);

    const searchParams: FlightSearchParams = {
      tripType,
      from: fromCity,
      to: toCity,
      departureDate,
      returnDate: tripType === 'round' ? returnDate : undefined,
      passengers,
      class: travelClass,
    };

    setIsSearching(false);
    navigation.navigate('FlightResults', searchParams);
  };

  const adjustPassengers = (delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newValue = passengers + delta;
    if (newValue >= 1 && newValue <= 9) {
      setPassengers(newValue);
    }
  };

  const selectCity = (city: string, type: 'from' | 'to') => {
    Haptics.selectionAsync();
    if (type === 'from') {
      setFromCity(city);
      setShowFromPicker(false);
    } else {
      setToCity(city);
      setShowToPicker(false);
    }
  };

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
          <Text style={styles.headerTitle}>Search Flights</Text>
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.tripTypeContainer}>
          {tripTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => {
                Haptics.selectionAsync();
                setTripType(type.id as 'one-way' | 'round' | 'multi');
              }}
              style={[
                styles.tripTypeButton,
                tripType === type.id && { backgroundColor: '#fff' },
              ]}
            >
              <Text
                style={[
                  styles.tripTypeText,
                  { color: tripType === type.id ? '#6366F1' : '#fff' },
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <GlassCard style={styles.searchCard}>
          <View style={styles.cityRow}>
            <View style={styles.cityInput}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>From</Text>
              <TouchableOpacity
                style={[styles.citySelector, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowFromPicker(true);
                }}
              >
                <Text style={[styles.cityCode, { color: fromCity ? colors.text : colors.textTertiary }]}>
                  {fromCity || 'Select City'}
                </Text>
                <Text style={[styles.cityName, { color: colors.textTertiary }]}>
                  {fromCity ? cities.find(c => c.code === fromCity)?.name : ''}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleSwapCities}>
              <Animated.View style={[styles.swapButton, swapStyle]}>
                <Text style={styles.swapIcon}>⇄</Text>
              </Animated.View>
            </TouchableOpacity>

            <View style={styles.cityInput}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>To</Text>
              <TouchableOpacity
                style={[styles.citySelector, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowToPicker(true);
                }}
              >
                <Text style={[styles.cityCode, { color: toCity ? colors.text : colors.textTertiary }]}>
                  {toCity || 'Select City'}
                </Text>
                <Text style={[styles.cityName, { color: colors.textTertiary }]}>
                  {toCity ? cities.find(c => c.code === toCity)?.name : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateInput}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Departure</Text>
              <TouchableOpacity
                style={[styles.dateSelector, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateIcon}>📅</Text>
                <Text style={[styles.dateText, { color: colors.text }]}>{departureDate}</Text>
              </TouchableOpacity>
            </View>

            {tripType === 'round' && (
              <View style={styles.dateInput}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Return</Text>
                <TouchableOpacity
                  style={[styles.dateSelector, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
                  onPress={() => setShowReturnDatePicker(true)}
                >
                  <Text style={styles.dateIcon}>📅</Text>
                  <Text style={[styles.dateText, { color: colors.text }]}>
                    {returnDate || 'Select Date'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.passengerRow}>
            <View>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Passengers</Text>
              <View style={[styles.passengerSelector, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                <TouchableOpacity onPress={() => adjustPassengers(-1)} style={styles.passengerButton}>
                  <Text style={[styles.passengerButtonText, { color: colors.primary }]}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.passengerCount, { color: colors.text }]}>{passengers}</Text>
                <TouchableOpacity onPress={() => adjustPassengers(1)} style={styles.passengerButton}>
                  <Text style={[styles.passengerButtonText, { color: colors.primary }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Class</Text>
              <View style={styles.classSelector}>
                {classes.map((cls) => (
                  <TouchableOpacity
                    key={cls.id}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setTravelClass(cls.id as 'economy' | 'business' | 'first');
                    }}
                    style={[
                      styles.classButton,
                      travelClass === cls.id && { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.classText,
                        { color: travelClass === cls.id ? '#fff' : colors.textSecondary },
                      ]}
                    >
                      {cls.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <AnimatedButton
            title={isSearching ? 'Searching Flights...' : 'Search Flights 🔍'}
            onPress={handleSearch}
            loading={isSearching}
            gradient
            size="large"
            style={styles.searchButton}
          />
        </GlassCard>

        <View style={styles.popularRoutes}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🔥 Popular Routes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.routesContainer}>
            {[
              { from: 'DEL', to: 'BOM', price: '₹4,500' },
              { from: 'DEL', to: 'BLR', price: '₹5,200' },
              { from: 'BOM', to: 'GOI', price: '₹3,800' },
              { from: 'DEL', to: 'CCU', price: '₹4,900' },
              { from: 'BLR', to: 'HYD', price: '₹3,200' },
            ].map((route, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.routeCard, { backgroundColor: colors.surface }]}
                onPress={() => {
                  setFromCity(route.from);
                  setToCity(route.to);
                }}
              >
                <Text style={[styles.routeCode, { color: colors.text }]}>{route.from}</Text>
                <Text style={styles.routeArrow}>→</Text>
                <Text style={[styles.routeCode, { color: colors.text }]}>{route.to}</Text>
                <Text style={[styles.routePrice, { color: colors.primary }]}>{route.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.features}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>✨ Why Book With Us</Text>
          <View style={styles.featureGrid}>
            {[
              { icon: '💰', title: 'Best Prices', desc: 'Price match guarantee' },
              { icon: '🎁', title: 'Cashback', desc: 'Up to 10% back' },
              { icon: '🛡️', title: 'Secure Booking', desc: '256-bit encryption' },
              { icon: '📞', title: '24/7 Support', desc: 'Always here to help' },
            ].map((feature, index) => (
              <View key={index} style={[styles.featureCard, { backgroundColor: colors.surface }]}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={[styles.featureTitle, { color: colors.text }]}>{feature.title}</Text>
                <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>{feature.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {showFromPicker && (
        <View style={styles.pickerOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowFromPicker(false)} />
          <View style={[styles.pickerModal, { backgroundColor: colors.surface }]}>
            <Text style={[styles.pickerTitle, { color: colors.text }]}>Select Departure City</Text>
            <ScrollView style={styles.pickerList}>
              {cities.map((city) => (
                <TouchableOpacity
                  key={city.code}
                  style={[styles.pickerItem, { borderBottomColor: colors.border }]}
                  onPress={() => selectCity(city.code, 'from')}
                >
                  <Text style={[styles.pickerCityCode, { color: colors.text }]}>{city.code}</Text>
                  <Text style={[styles.pickerCityName, { color: colors.textSecondary }]}>{city.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {showToPicker && (
        <View style={styles.pickerOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowToPicker(false)} />
          <View style={[styles.pickerModal, { backgroundColor: colors.surface }]}>
            <Text style={[styles.pickerTitle, { color: colors.text }]}>Select Arrival City</Text>
            <ScrollView style={styles.pickerList}>
              {cities.map((city) => (
                <TouchableOpacity
                  key={city.code}
                  style={[styles.pickerItem, { borderBottomColor: colors.border }]}
                  onPress={() => selectCity(city.code, 'to')}
                >
                  <Text style={[styles.pickerCityCode, { color: colors.text }]}>{city.code}</Text>
                  <Text style={[styles.pickerCityName, { color: colors.textSecondary }]}>{city.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 24,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  tripTypeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 4,
  },
  tripTypeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tripTypeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  searchCard: {
    padding: 20,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  cityInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  citySelector: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  cityCode: {
    fontSize: 18,
    fontWeight: '700',
  },
  cityName: {
    fontSize: 12,
    marginTop: 4,
  },
  swapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  swapIcon: {
    fontSize: 22,
    color: '#fff',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  dateInput: {
    flex: 1,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  dateIcon: {
    fontSize: 18,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  passengerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  passengerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  passengerButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  passengerButtonText: {
    fontSize: 22,
    fontWeight: '600',
  },
  passengerCount: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 20,
  },
  classSelector: {
    flexDirection: 'row',
    gap: 6,
  },
  classButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  classText: {
    fontSize: 12,
    fontWeight: '500',
  },
  searchButton: {
    marginTop: 24,
  },
  popularRoutes: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  routesContainer: {
    gap: 12,
    paddingVertical: 4,
  },
  routeCard: {
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 140,
  },
  routeCode: {
    fontSize: 20,
    fontWeight: '700',
  },
  routeArrow: {
    fontSize: 16,
    color: '#6366F1',
    marginVertical: 4,
  },
  routePrice: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  features: {
    marginTop: 24,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  featureDesc: {
    fontSize: 12,
    marginTop: 4,
  },
  pickerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  pickerModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: height * 0.6,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerList: {
    maxHeight: height * 0.5,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 16,
  },
  pickerCityCode: {
    fontSize: 16,
    fontWeight: '700',
    width: 40,
  },
  pickerCityName: {
    fontSize: 14,
  },
});

export default FlightSearchScreen;
