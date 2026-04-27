import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList, Flight, Passenger } from '../../types';
import { AnimatedButton } from '../../components/Button';
import { GlassCard } from '../../components/GlassCard';
import { Input } from '../../components/Input';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;
type RouteType = RouteProp<TravelStackParamList, 'PassengerDetails'>;

const PassengerDetailsScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const flight = route.params;

  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      id: '1',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      nationality: 'Indian',
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const validateForm = () => {
    for (const p of passengers) {
      if (!p.firstName || !p.lastName || !p.email || !p.phone) {
        Alert.alert('Missing Details', 'Please fill in all passenger details');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return false;
      }
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsSubmitting(true);
    setTimeout(() => {
      navigation.navigate('Payment', { flight, passenger: passengers[0] });
    }, 1500);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      <Animated.View entering={FadeIn.duration(300)} style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.primary }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Passenger Details</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4, 5].map((step) => (
            <View key={step} style={[styles.progressStep, step <= 4 && { backgroundColor: '#fff' }]} />
          ))}
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>👤 Primary Passenger</Text>
          <View style={styles.nameRow}>
            <View style={styles.halfInput}>
              <Input
                label="First Name *"
                placeholder="Enter first name"
                value={passengers[0].firstName}
                onChangeText={(v) => updatePassenger(0, 'firstName', v)}
              />
            </View>
            <View style={styles.halfInput}>
              <Input
                label="Last Name *"
                placeholder="Enter last name"
                value={passengers[0].lastName}
                onChangeText={(v) => updatePassenger(0, 'lastName', v)}
              />
            </View>
          </View>
          <Input
            label="Email Address *"
            placeholder="email@example.com"
            value={passengers[0].email}
            onChangeText={(v) => updatePassenger(0, 'email', v)}
            keyboardType="email-address"
          />
          <Input
            label="Phone Number *"
            placeholder="+91 9876543210"
            value={passengers[0].phone}
            onChangeText={(v) => updatePassenger(0, 'phone', v)}
            keyboardType="phone-pad"
          />
          <Input
            label="Date of Birth"
            placeholder="DD/MM/YYYY"
            value={passengers[0].dateOfBirth}
            onChangeText={(v) => updatePassenger(0, 'dateOfBirth', v)}
          />
          <Input
            label="Nationality"
            placeholder="Indian"
            value={passengers[0].nationality}
            onChangeText={(v) => updatePassenger(0, 'nationality', v)}
          />
        </GlassCard>

        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📋 Flight Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Flight</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{flight.airline} {flight.flightNumber}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Route</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{flight.departure.city} → {flight.arrival.city}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Date</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{flight.departure.date}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Class</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{flight.class}</Text>
          </View>
          <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginTop: 12 }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>₹{flight.price.toLocaleString()}</Text>
          </View>
        </GlassCard>

        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📝 Important Information</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>• Carry a valid photo ID for check-in</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>• Report to check-in counter 2 hours before departure</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>• Web check-in opens 48 hours before departure</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>• Boarding gate closes 20 minutes before departure</Text>
        </GlassCard>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
        <View>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total</Text>
          <Text style={[styles.totalPrice, { color: colors.text }]}>₹{flight.price.toLocaleString()}</Text>
        </View>
        <AnimatedButton title="Proceed to Payment →" onPress={handleContinue} loading={isSubmitting} gradient size="large" style={styles.continueButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { fontSize: 24, color: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  progressBar: { flexDirection: 'row', gap: 6 },
  progressStep: { flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  content: { padding: 16, paddingBottom: 120 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  nameRow: { flexDirection: 'row', gap: 12 },
  halfInput: { flex: 1 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: '600' },
  totalLabel: { fontSize: 16, fontWeight: '700' },
  totalValue: { fontSize: 20, fontWeight: '700' },
  infoText: { fontSize: 14, marginBottom: 8, lineHeight: 20 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 34, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10 },
  totalLabel: { fontSize: 12 },
  totalPrice: { fontSize: 22, fontWeight: '700' },
  continueButton: { minWidth: 180 },
});

export default PassengerDetailsScreen;
