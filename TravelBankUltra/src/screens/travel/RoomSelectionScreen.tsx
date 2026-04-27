import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList, Hotel } from '../../types';
import { AnimatedButton } from '../../components/Button';
import { GlassCard } from '../../components/GlassCard';
import * as Haptics from 'expo-haptics';

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;
type RouteType = RouteProp<TravelStackParamList, 'RoomSelection'>;

const RoomSelectionScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const hotel = route.params;

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate('HotelPayment', { hotel });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.secondary }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButton}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Select Room</Text>
          <View style={{ width: 30 }} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {hotel.rooms.map((room) => (
          <GlassCard key={room.id}>
            <Text style={[styles.roomName, { color: colors.text }]}>{room.name}</Text>
            <Text style={[styles.roomPrice, { color: colors.primary }]}>₹{room.price.toLocaleString()}</Text>
            <AnimatedButton title="Book This Room" onPress={handleContinue} gradient style={styles.button} />
          </GlassCard>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { fontSize: 24, color: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  content: { padding: 16, paddingBottom: 100 },
  roomName: { fontSize: 18, fontWeight: '700' },
  roomPrice: { fontSize: 20, fontWeight: '700', marginVertical: 8 },
  button: { marginTop: 12 },
});

export default RoomSelectionScreen;
