import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BankingStackParamList, Transaction, UPIContact } from '../../types';
import { AnimatedButton } from '../../components/Button';
import { GlassCard } from '../../components/GlassCard';
import { Input } from '../../components/Input';
import { simulateLoading } from '../../utils/mockData';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<BankingStackParamList>;
type RouteType = RouteProp<BankingStackParamList, 'ConfirmTransfer'>;

const ConfirmTransferScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  
  const { contact, amount, note } = route.params;
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsProcessing(true);
    await simulateLoading(2000);
    setIsProcessing(false);
    navigation.navigate('TransferSuccess' as any, {
      transaction: {
        id: 'TXN' + Date.now(),
        type: 'debit',
        amount: amount,
        description: note || 'Transfer to ' + contact.name,
        merchant: contact.name,
        category: 'Transfer',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        status: 'completed' as const,
        accountId: 'ACC001',
        upiId: contact.upiId,
      }
    });
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      <Animated.View entering={FadeIn.duration(300)} style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.primary }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirm Transfer</Text>
          <View style={{ width: 30 }} />
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <GlassCard>
          <View style={styles.recipientSection}>
            <View style={[styles.recipientAvatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.recipientAvatarText}>{contact.name.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={[styles.recipientName, { color: colors.text }]}>{contact.name}</Text>
            <Text style={[styles.recipientUPI, { color: colors.textSecondary }]}>{contact.upiId}</Text>
          </View>
        </GlassCard>

        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>💰 Transfer Details</Text>
          <View style={styles.amountRow}>
            <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>Amount</Text>
            <Text style={[styles.amountValue, { color: colors.primary }]}>₹{amount.toLocaleString()}</Text>
          </View>
          {note && (
            <View style={styles.noteRow}>
              <Text style={[styles.noteLabel, { color: colors.textSecondary }]}>Note</Text>
              <Text style={[styles.noteValue, { color: colors.text }]}>{note}</Text>
            </View>
          )}
          <View style={styles.dateRow}>
            <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Date & Time</Text>
            <Text style={[styles.dateValue, { color: colors.text }]}>{new Date().toLocaleString()}</Text>
          </View>
        </GlassCard>

        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>💳 From Account</Text>
          <View style={styles.accountRow}>
            <View style={[styles.accountIcon, { backgroundColor: colors.primary + '20' }]}>
              <Text style={styles.accountIconText}>🏦</Text>
            </View>
            <View style={styles.accountInfo}>
              <Text style={[styles.accountNumber, { color: colors.text }]}>Savings Account</Text>
              <Text style={[styles.accountBalance, { color: colors.textSecondary }]}>₹1,25,450.00</Text>
            </View>
          </View>
        </GlassCard>

        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🛡️ Safety Check</Text>
          <View style={styles.safetyItem}>
            <Text style={styles.safetyIcon}>✅</Text>
            <Text style={[styles.safetyText, { color: colors.textSecondary }]}>Recipient verified</Text>
          </View>
          <View style={styles.safetyItem}>
            <Text style={styles.safetyIcon}>🔒</Text>
            <Text style={[styles.safetyText, { color: colors.textSecondary }]}>UPI ID verified</Text>
          </View>
          <View style={styles.safetyItem}>
            <Text style={styles.safetyIcon}>🛡️</Text>
            <Text style={[styles.safetyText, { color: colors.textSecondary }]}>Transaction is secure</Text>
          </View>
        </GlassCard>

        <View style={styles.disclaimer}>
          <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
            By proceeding, you agree to our Terms of Service and UPI guidelines. 
            Please verify recipient details before confirming.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
        <AnimatedButton
          title="Cancel"
          onPress={handleCancel}
          variant="outline"
          size="large"
          style={styles.cancelButton}
        />
        <AnimatedButton
          title={isProcessing ? 'Processing...' : `Send ₹${amount.toLocaleString()}`}
          onPress={handleConfirm}
          loading={isProcessing}
          gradient
          size="large"
          style={styles.confirmButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { fontSize: 24, color: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  content: { padding: 16, paddingBottom: 140 },
  recipientSection: { alignItems: 'center', paddingVertical: 20 },
  recipientAvatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  recipientAvatarText: { fontSize: 32, fontWeight: '700', color: '#fff' },
  recipientName: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  recipientUPI: { fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  amountLabel: { fontSize: 14 },
  amountValue: { fontSize: 28, fontWeight: '700' },
  noteRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  noteLabel: { fontSize: 14 },
  noteValue: { fontSize: 14, fontWeight: '500' },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  dateLabel: { fontSize: 14 },
  dateValue: { fontSize: 14 },
  accountRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  accountIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  accountIconText: { fontSize: 24 },
  accountInfo: { flex: 1 },
  accountNumber: { fontSize: 16, fontWeight: '600' },
  accountBalance: { fontSize: 14, marginTop: 2 },
  safetyItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  safetyIcon: { fontSize: 18 },
  safetyText: { fontSize: 14 },
  disclaimer: { padding: 16, marginTop: 8 },
  disclaimerText: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 12, padding: 16, paddingBottom: 34, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10 },
  cancelButton: { flex: 1 },
  confirmButton: { flex: 2 },
});

export default ConfirmTransferScreen;
