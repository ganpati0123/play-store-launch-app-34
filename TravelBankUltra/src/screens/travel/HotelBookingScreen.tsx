import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList } from '../../types';
import * as Haptics from 'expo-haptics';

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;

const HotelBookingScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const handleContinue = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); navigation.navigate('HotelConfirmation' as any, { booking: {} as any }); };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.secondary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButton}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Hotel Booking</Text>
        <View style={{ width: 30 }} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.placeholder, { color: colors.text }]}>Hotel Booking Form</Text>
        <TouchableOpacity onPress={handleContinue} style={[styles.button, { backgroundColor: colors.primary }]}><Text style={styles.buttonText}>Confirm Booking</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { fontSize: 24, color: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  placeholder: { fontSize: 18, marginBottom: 20 },
  button: { padding: 16, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: '700' },
});

export default HotelBookingScreen;
