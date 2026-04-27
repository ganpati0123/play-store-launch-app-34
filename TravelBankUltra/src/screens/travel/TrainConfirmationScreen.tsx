import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList } from '../../types';
import * as Haptics from 'expo-haptics';

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;

const TrainConfirmationScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const handleDone = () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); navigation.navigate('TravelHome'); };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <View style={styles.content}>
        <Text style={styles.successIcon}>🎉</Text>
        <Text style={[styles.successTitle, { color: colors.text }]}>Ticket Booked!</Text>
        <TouchableOpacity onPress={handleDone} style={[styles.button, { backgroundColor: colors.primary }]}><Text style={styles.buttonText}>View Bookings</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  successIcon: { fontSize: 60, marginBottom: 20 },
  successTitle: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  button: { padding: 16, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: '700' },
});

export default TrainConfirmationScreen;
