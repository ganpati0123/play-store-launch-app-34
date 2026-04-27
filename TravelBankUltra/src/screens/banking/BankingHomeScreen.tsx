import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BankingStackParamList } from '../../types';
import { GlassCard } from '../../components/GlassCard';
import { AnimatedButton } from '../../components/Button';
import { simulateLoading, generateAccounts, generateTransactions, generateCreditCards, generateBills, generateInvestments } from '../../utils/mockData';

type NavigationProp = NativeStackNavigationProp<BankingStackParamList>;

const BankingHomeScreen: React.FC = () => {
  const { colors, theme, toggleTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    await simulateLoading(1000);
    setAccounts(generateAccounts());
    setTransactions(generateTransactions(10));
    setCards(generateCreditCards());
  };

  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); };

  const quickActions = [
    { icon: '💸', label: 'Send Money', screen: 'SendMoney' },
    { icon: '📄', label: 'Pay Bills', screen: 'BillsRecharge' },
    { icon: '📱', label: 'Recharge', screen: 'BillsRecharge' },
    { icon: '📊', label: 'Invest', screen: 'Investments' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={['#1E293B', '#0F172A']} style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <View><Text style={styles.greeting}>Good Morning,</Text><Text style={styles.userName}>John Doe</Text></View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleTheme(); }} style={styles.iconButton}><Text>🌙</Text></TouchableOpacity>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsContainer}>
          {accounts.map((account, i) => (
            <TouchableOpacity key={i} onPress={() => navigation.navigate('Accounts')} activeOpacity={0.9}>
              <Animated.View entering={FadeInUp.delay(i * 100)} style={styles.accountCard}>
                <Text style={styles.accountType}>{account.accountType.toUpperCase()}</Text>
                <Text style={styles.accountNumber}>{account.accountNumber}</Text>
                <Text style={styles.accountBalance}>₹{account.balance.toLocaleString()}</Text>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} contentContainerStyle={styles.content}>
        <View style={styles.quickActions}>
          {quickActions.map((action, i) => (
            <TouchableOpacity key={i} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); navigation.navigate(action.screen as any); }} style={[styles.actionItem, { backgroundColor: colors.surface }]}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={[styles.actionLabel, { color: colors.text }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text><TouchableOpacity><Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text></TouchableOpacity></View>
          {transactions.slice(0, 5).map((txn, i) => (
            <TouchableOpacity key={i} onPress={() => navigation.navigate('TransactionDetail', txn)} style={[styles.transactionItem, { backgroundColor: colors.surface }]}>
              <View style={[styles.txnIcon, { backgroundColor: txn.type === 'credit' ? colors.success + '20' : colors.error + '20' }]}><Text>{txn.type === 'credit' ? '📥' : '📤'}</Text></View>
              <View style={styles.txnInfo}><Text style={[styles.txnMerchant, { color: colors.text }]}>{txn.merchant}</Text><Text style={[styles.txnDate, { color: colors.textSecondary }]}>{txn.date}</Text></View>
              <Text style={[styles.txnAmount, { color: txn.type === 'credit' ? colors.success : colors.error }]}>{txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.text }]}>Your Cards</Text></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {cards.map((card, i) => (
              <TouchableOpacity key={i} onPress={() => navigation.navigate('Accounts')} style={styles.creditCard}>
                <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.cardGradient}>
                  <Text style={styles.cardNumber}>{card.cardNumber}</Text>
                  <View style={styles.cardDetails}><Text style={styles.cardHolder}>{card.holderName}</Text><Text style={styles.cardExpiry}>{card.expiryDate}</Text></View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  userName: { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerActions: { flexDirection: 'row', gap: 12 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  cardsContainer: { gap: 12 },
  accountCard: { width: 280, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 20, marginRight: 12 },
  accountType: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  accountNumber: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 12 },
  accountBalance: { fontSize: 28, fontWeight: '700', color: '#fff' },
  content: { padding: 16, paddingBottom: 100 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  actionItem: { alignItems: 'center', padding: 16, borderRadius: 16, width: '23%' },
  actionIcon: { fontSize: 24, marginBottom: 8 },
  actionLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  seeAll: { fontSize: 14, fontWeight: '600' },
  transactionItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, marginBottom: 8 },
  txnIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txnInfo: { flex: 1, marginLeft: 12 },
  txnMerchant: { fontSize: 16, fontWeight: '600' },
  txnDate: { fontSize: 12, marginTop: 2 },
  txnAmount: { fontSize: 16, fontWeight: '700' },
  creditCard: { width: 300, height: 180, borderRadius: 20, overflow: 'hidden', marginRight: 12 },
  cardGradient: { flex: 1, padding: 20, justifyContent: 'flex-end' },
  cardNumber: { fontSize: 20, fontWeight: '700', color: '#fff', letterSpacing: 2, marginBottom: 20 },
  cardDetails: { flexDirection: 'row', justifyContent: 'space-between' },
  cardHolder: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  cardExpiry: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
});

export default BankingHomeScreen;
