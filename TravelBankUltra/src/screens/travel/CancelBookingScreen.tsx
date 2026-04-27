import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList } from '../../types';
import * as Haptics from 'expo-haptics';

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;
type RouteType = RouteProp<TravelStackParamList, 'CancelBooking'>;

const CancelBookingScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const handleCancel = () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); navigation.goBack(); };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButton}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Cancel Booking</Text>
        <View style={{ width: 30 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.placeholder, { color: colors.text }]}>Cancel Booking</Text>
        <TouchableOpacity onPress={handleCancel} style={[styles.button, { backgroundColor: colors.error }]}><Text style={styles.buttonText}>Confirm Cancellation</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { fontSize: 24 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { padding: 16 },
  placeholder: { fontSize: 18, marginBottom: 20, textAlign: 'center', marginTop: 100 },
  button: { padding: 16, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
});

export default CancelBookingScreen;
