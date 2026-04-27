import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BankingStackParamList } from '../../types';
import * as Haptics from 'expo-haptics';

type NavigationProp = NativeStackNavigationProp<BankingStackParamList>;

const SendMoneyScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const handleContactPress = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); navigation.navigate('AmountEntry', undefined); };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButton}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Send Money</Text>
        <View style={{ width: 30 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={handleContactPress} style={[styles.contactItem, { backgroundColor: colors.surface }]}><Text style={styles.contactIcon}>👤</Text><Text style={[styles.contactName, { color: colors.text }]}>Select Contact</Text></TouchableOpacity>
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
  contactItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12 },
  contactIcon: { fontSize: 32, marginRight: 12 },
  contactName: { fontSize: 16 },
});

export default SendMoneyScreen;
