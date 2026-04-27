import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BankingStackParamList } from '../../types';
import * as Haptics from 'expo-haptics';

type NavigationProp = NativeStackNavigationProp<BankingStackParamList>;

const InvestmentsScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const investments = [
    { icon: '🏦', label: 'Fixed Deposits', desc: 'Secure returns' },
    { icon: '📈', label: 'Mutual Funds', desc: 'Growth potential' },
    { icon: '🥇', label: 'Gold', desc: 'Digital gold' },
    { icon: '📊', label: 'Stocks', desc: 'Direct equity' },
  ];
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButton}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Investments</Text>
        <View style={{ width: 30 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {investments.map((inv, i) => (
          <TouchableOpacity key={i} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); navigation.navigate('FDCalculator'); }} style={[styles.investItem, { backgroundColor: colors.surface }]}>
            <Text style={styles.investIcon}>{inv.icon}</Text>
            <View style={styles.investInfo}><Text style={[styles.investLabel, { color: colors.text }]}>{inv.label}</Text><Text style={[styles.investDesc, { color: colors.textSecondary }]}>{inv.desc}</Text></View>
          </TouchableOpacity>
        ))}
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
  investItem: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 16, marginBottom: 12 },
  investIcon: { fontSize: 32 },
  investInfo: { marginLeft: 16 },
  investLabel: { fontSize: 18, fontWeight: '600' },
  investDesc: { fontSize: 14, marginTop: 2 },
});

export default InvestmentsScreen;
