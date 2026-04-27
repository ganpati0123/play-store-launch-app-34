import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BankingStackParamList, Transaction } from '../../types';
import * as Haptics from 'expo-haptics';

type NavigationProp = NativeStackNavigationProp<BankingStackParamList>;
type RouteType = RouteProp<BankingStackParamList, 'TransactionDetail'>;

const TransactionDetailScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const transaction = route.params;

  const handleReportIssue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('ReportIssue', transaction);
  };

  const handleDownload = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButton}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>
        <View style={{ width: 30 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.amountCard, { backgroundColor: transaction.type === 'credit' ? colors.success : colors.error }]}>
          <Text style={styles.amountIcon}>{transaction.type === 'credit' ? '📥' : '📤'}</Text>
          <Text style={styles.amountText}>{transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}</Text>
          <Text style={styles.statusText}>{transaction.status}</Text>
        </View>
        <View style={[styles.detailCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Transaction Details</Text>
          <View style={styles.detailRow}><Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Merchant</Text><Text style={[styles.detailValue, { color: colors.text }]}>{transaction.merchant}</Text></View>
          <View style={styles.detailRow}><Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Category</Text><Text style={[styles.detailValue, { color: colors.text }]}>{transaction.category}</Text></View>
          <View style={styles.detailRow}><Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Date</Text><Text style={[styles.detailValue, { color: colors.text }]}>{transaction.date}</Text></View>
          <View style={styles.detailRow}><Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Time</Text><Text style={[styles.detailValue, { color: colors.text }]}>{transaction.time}</Text></View>
          <View style={styles.detailRow}><Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Transaction ID</Text><Text style={[styles.detailValue, { color: colors.text }]}>{transaction.id}</Text></View>
          <View style={styles.detailRow}><Text style={[styles.detailLabel, { color: colors.textSecondary }]}>UPI ID</Text><Text style={[styles.detailValue, { color: colors.text }]}>{transaction.upiId}</Text></View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleDownload} style={[styles.actionButton, { backgroundColor: colors.surface }]}><Text style={styles.actionIcon}>📥</Text><Text style={[styles.actionText, { color: colors.text }]}>Download</Text></TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={[styles.actionButton, { backgroundColor: colors.surface }]}><Text style={styles.actionIcon}>📤</Text><Text style={[styles.actionText, { color: colors.text }]}>Share</Text></TouchableOpacity>
          <TouchableOpacity onPress={handleReportIssue} style={[styles.actionButton, { backgroundColor: colors.surface }]}><Text style={styles.actionIcon}>⚠️</Text><Text style={[styles.actionText, { color: colors.text }]}>Report</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { fontSize: 24, color: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  content: { padding: 16 },
  amountCard: { padding: 30, borderRadius: 20, alignItems: 'center', marginBottom: 20 },
  amountIcon: { fontSize: 40, marginBottom: 10 },
  amountText: { fontSize: 36, fontWeight: '700', color: '#fff' },
  statusText: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 8, textTransform: 'uppercase' },
  detailCard: { padding: 20, borderRadius: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 14, fontWeight: '600' },
  actions: { flexDirection: 'row', justifyContent: 'space-around' },
  actionButton: { padding: 16, borderRadius: 16, alignItems: 'center', flex: 1, marginHorizontal: 4 },
  actionIcon: { fontSize: 24, marginBottom: 8 },
  actionText: { fontSize: 12, fontWeight: '600' },
});

export default TransactionDetailScreen;
