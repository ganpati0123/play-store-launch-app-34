import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList, Flight, Passenger, Booking } from '../../types';
import { AnimatedButton } from '../../components/Button';
import { GlassCard } from '../../components/GlassCard';
import { Input } from '../../components/Input';
import { generateId, simulateLoading } from '../../utils/mockData';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;
type RouteType = RouteProp<TravelStackParamList, 'Payment'>;

const PaymentScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const { flight, passenger } = route.params;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (paymentMethod === 'card' && (!cardNumber || !expiry || !cvv)) {
      Alert.alert('Missing Details', 'Please enter card details');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsProcessing(true);
    await simulateLoading(3000);

    const booking: Booking = {
      id: generateId(),
      type: 'flight',
      status: 'confirmed',
      bookingDate: new Date().toISOString().split('T')[0],
      travelDate: flight.departure.date,
      details: flight,
      passengers: [passenger],
      totalAmount: flight.price,
      paymentMethod: 'Credit Card',
      pnr: Math.random().toString(36).substring(2, 8).toUpperCase(),
    };

    setIsProcessing(false);
    navigation.navigate('BookingConfirmation', { booking });
  };

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
    { id: 'upi', label: 'UPI', icon: '📱' },
    { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      <Animated.View entering={FadeIn.duration(300)} style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.primary }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4, 5].map((step) => (
            <View key={step} style={[styles.progressStep, step <= 5 && { backgroundColor: '#fff' }]} />
          ))}
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>💳 Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => {
                Haptics.selectionAsync();
                setPaymentMethod(method.id as any);
              }}
              style={[
                styles.paymentOption,
                { borderColor: paymentMethod === method.id ? colors.primary : colors.border },
                paymentMethod === method.id && { backgroundColor: colors.primary + '10' },
              ]}
            >
              <Text style={styles.paymentIcon}>{method.icon}</Text>
              <Text style={[styles.paymentLabel, { color: colors.text }]}>{method.label}</Text>
              <View style={[styles.radioOuter, { borderColor: paymentMethod === method.id ? colors.primary : colors.border }]}>
                {paymentMethod === method.id && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
              </View>
            </TouchableOpacity>
          ))}
        </GlassCard>

        {paymentMethod === 'card' && (
          <GlassCard>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>💳 Card Details</Text>
            <Input label="Card Number" placeholder="1234 5678 9012 3456" value={cardNumber} onChangeText={setCardNumber} keyboardType="numeric" />
            <View style={styles.cvvRow}>
              <View style={styles.expiryInput}>
                <Input label="Expiry" placeholder="MM/YY" value={expiry} onChangeText={setExpiry} keyboardType="numeric" />
              </View>
              <View style={styles.cvvInput}>
                <Input label="CVV" placeholder="123" value={cvv} onChangeText={setCvv} keyboardType="numeric" secureTextEntry />
              </View>
            </View>
          </GlassCard>
        )}

        {paymentMethod === 'upi' && (
          <GlassCard>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>📱 UPI Payment</Text>
            <Input label="UPI ID" placeholder="yourname@upi" />
            <Text style={[styles.upiNote, { color: colors.textSecondary }]}>You will receive a payment request on your UPI app</Text>
          </GlassCard>
        )}

        {paymentMethod === 'netbanking' && (
          <GlassCard>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🏦 Net Banking</Text>
            {['HDFC Bank', 'ICICI Bank', 'State Bank', 'Axis Bank'].map((bank) => (
              <TouchableOpacity key={bank} style={[styles.bankOption, { borderBottomColor: colors.border }]}>
                <Text style={[styles.bankName, { color: colors.text }]}>{bank}</Text>
              </TouchableOpacity>
            ))}
          </GlassCard>
        )}

        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>💰 Price Breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Base Fare</Text>
            <Text style={[styles.priceValue, { color: colors.text }]}>₹{Math.round(flight.price * 0.7).toLocaleString()}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Taxes & Fees</Text>
            <Text style={[styles.priceValue, { color: colors.text }]}>₹{Math.round(flight.price * 0.3).toLocaleString()}</Text>
          </View>
          <View style={[styles.priceRow, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginTop: 12 }]}>
            <Text style={[styles.totalLabel, { color: colors.text, fontWeight: '700' }]}>Total Amount</Text>
            <Text style={[styles.totalValue, { color: colors.primary, fontWeight: '700' }]}>₹{flight.price.toLocaleString()}</Text>
          </View>
        </GlassCard>

        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🛡️ Safety Guarantee</Text>
          <View style={styles.safetyRow}>
            <Text style={styles.safetyIcon}>🔒</Text>
            <Text style={[styles.safetyText, { color: colors.textSecondary }]}>256-bit SSL encryption for secure payments</Text>
          </View>
          <View style={styles.safetyRow}>
            <Text style={styles.safetyIcon}>✅</Text>
            <Text style={[styles.safetyText, { color: colors.textSecondary }]}>Instant booking confirmation</Text>
          </View>
          <View style={styles.safetyRow}>
            <Text style={styles.safetyIcon}>🛡️</Text>
            <Text style={[styles.safetyText, { color: colors.textSecondary }]}>Your data is protected with us</Text>
          </View>
        </GlassCard>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
        <View>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Payable Amount</Text>
          <Text style={[styles.totalPrice, { color: colors.text }]}>₹{flight.price.toLocaleString()}</Text>
        </View>
        <AnimatedButton 
          title={isProcessing ? 'Processing...' : `Pay ₹${flight.price.toLocaleString()}`} 
          onPress={handlePayment} 
          loading={isProcessing} 
          gradient 
          size="large" 
          style={styles.payButton} 
        />
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
  paymentOption: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 2, marginBottom: 12 },
  paymentIcon: { fontSize: 24, marginRight: 12 },
  paymentLabel: { flex: 1, fontSize: 16, fontWeight: '500' },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  cvvRow: { flexDirection: 'row', gap: 12 },
  expiryInput: { flex: 1 },
  cvvInput: { flex: 1 },
  upiNote: { fontSize: 14, marginTop: 8 },
  bankOption: { paddingVertical: 14, borderBottomWidth: 1 },
  bankName: { fontSize: 16 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  priceLabel: { fontSize: 14 },
  priceValue: { fontSize: 14, fontWeight: '600' },
  totalLabel: { fontSize: 16 },
  totalValue: { fontSize: 20 },
  safetyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  safetyIcon: { fontSize: 20 },
  safetyText: { flex: 1, fontSize: 14 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 34, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10 },
  totalLabel: { fontSize: 12 },
  totalPrice: { fontSize: 22, fontWeight: '700' },
  payButton: { minWidth: 160 },
});

export default PaymentScreen;
