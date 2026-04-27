import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList, Train } from '../../types';
import { AnimatedButton } from '../../components/Button';
import { GlassCard } from '../../components/GlassCard';

const { width } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;
type RouteType = RouteProp<TravelStackParamList, 'TrainDetails'>;

const TrainDetailsScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const train = route.params;
  const buttonScale = useSharedValue(1);

  const handleSelectSeat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    buttonScale.value = withSequence(withSpring(0.95), withSpring(1));
    navigation.navigate('TrainSeatSelection', train);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <Animated.View entering={FadeIn.duration(300)} style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.accent }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButton}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Train Details</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={styles.trainCard}>
          <Text style={styles.trainName}>{train.trainName}</Text>
          <Text style={styles.trainNumber}>#{train.trainNumber}</Text>
        </View>
        <View style={styles.routeCard}>
          <View><Text style={styles.timeText}>{train.departureTime}</Text><Text style={styles.cityText}>{train.from}</Text></View>
          <View style={styles.routeLine}><Text style={styles.durationText}>{train.duration}</Text><View style={styles.line} /><Text style={styles.stopsText}>{train.class}</Text></View>
          <View style={{ alignItems: 'flex-end' }}><Text style={styles.timeText}>{train.arrivalTime}</Text><Text style={styles.cityText}>{train.to}</Text></View>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🚂 Train Information</Text>
          <View style={styles.infoRow}><Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Train Number</Text><Text style={[styles.infoValue, { color: colors.text }]}>#{train.trainNumber}</Text></View>
          <View style={styles.infoRow}><Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Class</Text><Text style={[styles.infoValue, { color: colors.text }]}>{train.class}</Text></View>
          <View style={styles.infoRow}><Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Available Seats</Text><Text style={[styles.infoValue, { color: colors.text }]}>{train.seatsAvailable}</Text></View>
        </GlassCard>
        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🛤️ Route Schedule</Text>
          {train.stations.map((station, i) => (
            <View key={i} style={styles.stationItem}>
              <View style={[styles.stationDot, { backgroundColor: i === 0 || i === train.stations.length - 1 ? colors.primary : colors.border }]} />
              <View style={styles.stationInfo}><Text style={[styles.stationName, { color: colors.text }]}>{station.stationName}</Text><Text style={[styles.stationTime, { color: colors.textSecondary }]}>{station.arrivalTime} - {station.departureTime} (Day {station.day})</Text></View>
            </View>
          ))}
        </GlassCard>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
        <View><Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Price</Text><Text style={[styles.totalPrice, { color: colors.text }]}>₹{train.price}</Text></View>
        <AnimatedButton title="Select Seats →" onPress={handleSelectSeat} gradient size="large" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { fontSize: 24, color: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  trainCard: { alignItems: 'center', padding: 16 },
  trainName: { fontSize: 22, fontWeight: '700', color: '#fff' },
  trainNumber: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  routeCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeText: { fontSize: 24, fontWeight: '700', color: '#fff' },
  cityText: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  routeLine: { flex: 1, alignItems: 'center' },
  durationText: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  line: { width: '80%', height: 2, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 8 },
  stopsText: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  content: { padding: 16, paddingBottom: 100 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: '600' },
  stationItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  stationDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  stationInfo: {},
  stationName: { fontSize: 14, fontWeight: '600' },
  stationTime: { fontSize: 12, marginTop: 2 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 34, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  totalLabel: { fontSize: 12 },
  totalPrice: { fontSize: 22, fontWeight: '700' },
});

export default TrainDetailsScreen;
