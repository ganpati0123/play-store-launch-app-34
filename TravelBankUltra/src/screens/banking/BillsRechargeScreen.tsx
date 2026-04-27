import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BankingStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<BankingStackParamList>;

const BillsRechargeScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const categories = [
    { icon: '⚡', label: 'Electricity', color: '#F59E0B' },
    { icon: '💧', label: 'Water', color: '#3B82F6' },
    { icon: '🔥', label: 'Gas', color: '#EF4444' },
    { icon: '📱', label: 'Mobile', color: '#10B981' },
    { icon: '📺', label: 'DTH', color: '#8B5CF6' },
    { icon: '🌐', label: 'Internet', color: '#EC4899' },
  ];
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButton}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Pay Bills</Text>
        <View style={{ width: 30 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {categories.map((cat, i) => (
            <TouchableOpacity key={i} style={[styles.categoryItem, { backgroundColor: colors.surface }]}>
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}><Text style={styles.categoryEmoji}>{cat.icon}</Text></View>
              <Text style={[styles.categoryLabel, { color: colors.text }]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

import { TouchableOpacity } from 'react-native';
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { fontSize: 24, color: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  content: { padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryItem: { width: '31%', padding: 16, borderRadius: 16, alignItems: 'center' },
  categoryIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  categoryEmoji: { fontSize: 24 },
  categoryLabel: { fontSize: 12, fontWeight: '600' },
});

export default BillsRechargeScreen;
