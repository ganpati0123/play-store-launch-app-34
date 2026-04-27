import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, StatusBar, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList } from '../../types';
import { TrainCard } from '../../components/Card';
import { TrainSkeleton } from '../../components/Skeleton';
import { GlassCard } from '../../components/GlassCard';
import { simulateLoading, generateTrains, generateBookings } from '../../utils/mockData';
import { Train, Booking } from '../../types';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;

const TrainSearchScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [classType, setClassType] = useState<'all' | 'sleeper' | 'ac' | 'first-class'>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [trains, setTrains] = useState<Train[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    await simulateLoading(1500);
    setTrains(generateTrains(20));
    setBookings(generateBookings(5));
    setIsLoading(false);
  };

  const handleSearch = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsSearching(true);
    await simulateLoading(2000);
    setIsSearching(false);
    navigation.navigate('TrainResults', { from, to, date, class: classType, passengers: 1 });
  };

  const recentSearches = [
    { from: 'DEL', to: 'MUM', date: '2024-02-15' },
    { from: 'BLR', to: 'HYD', date: '2024-02-20' },
    { from: 'CCU', to: 'DEL', date: '2024-02-25' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.accent }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButton}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Search Trains</Text>
          <View style={{ width: 30 }} />
        </View>

        <GlassCard>
          <View style={styles.inputRow}>
            <View style={styles.inputBox}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>From</Text>
              <TouchableOpacity onPress={() => setFrom('DEL')} style={[styles.input, { backgroundColor: colors.inputBackground }]}><Text style={[styles.inputText, { color: from ? colors.text : colors.textTertiary }]}>{from || 'Select Station'}</Text></TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => { const t = from; setFrom(to); setTo(t); }} style={styles.swapButton}><Text>⇄</Text></TouchableOpacity>
            <View style={styles.inputBox}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>To</Text>
              <TouchableOpacity onPress={() => setTo('BOM')} style={[styles.input, { backgroundColor: colors.inputBackground }]}><Text style={[styles.inputText, { color: to ? colors.text : colors.textTertiary }]}>{to || 'Select Station'}</Text></TouchableOpacity>
            </View>
          </View>
          <View style={styles.dateRow}>
            <View style={[styles.dateInput, { backgroundColor: colors.inputBackground }]}><Text style={styles.dateIcon}>📅</Text><Text style={[styles.dateText, { color: colors.text }]}>{date}</Text></View>
          </View>
          <View style={styles.classRow}>
            {(['all', 'sleeper', 'ac', 'first-class'] as const).map((c) => (
              <TouchableOpacity key={c} onPress={() => { Haptics.selectionAsync(); setClassType(c); }} style={[styles.classButton, classType === c && { backgroundColor: colors.primary }]}>
                <Text style={[styles.classText, { color: classType === c ? '#fff' : colors.text }]}>{c === 'all' ? 'All' : c.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={handleSearch} style={[styles.searchButton, { backgroundColor: colors.primary }]}><Text style={styles.searchButtonText}>Search Trains 🔍</Text></TouchableOpacity>
        </GlassCard>
      </View>

      <FlatList
        data={trains.slice(0, 5)}
        renderItem={({ item, index }) => <TrainCard train={item} onPress={() => navigation.navigate('TrainDetails', item)} index={index} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🚂 Popular Train Routes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentSearches.map((r, i) => (
                <TouchableOpacity key={i} style={[styles.routeCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.routeCode, { color: colors.text }]}>{r.from} → {r.to}</Text>
                  <Text style={[styles.routeDate, { color: colors.textSecondary }]}>{r.date}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>📋 Recent Bookings</Text>
          </View>
        }
      />
    </View>
  );
};

import { ScrollView } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { fontSize: 24, color: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  inputBox: { flex: 1 },
  inputLabel: { fontSize: 12, fontWeight: '500', marginBottom: 8, textTransform: 'uppercase' },
  input: { padding: 14, borderRadius: 12 },
  inputText: { fontSize: 16, fontWeight: '600' },
  swapButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  dateRow: { marginTop: 16 },
  dateInput: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, gap: 10 },
  dateIcon: { fontSize: 18 },
  dateText: { fontSize: 16 },
  classRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  classButton: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: colors.surfaceVariant },
  classText: { fontSize: 12, fontWeight: '600' },
  searchButton: { marginTop: 20, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  searchButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  listContent: { padding: 16, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  routeCard: { padding: 16, borderRadius: 12, marginRight: 12, minWidth: 120 },
  routeCode: { fontSize: 16, fontWeight: '600' },
  routeDate: { fontSize: 12, marginTop: 4 },
});

export default TrainSearchScreen;
