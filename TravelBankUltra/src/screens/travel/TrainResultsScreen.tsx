import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, StatusBar, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TravelStackParamList, Train } from '../../types';
import { TrainCard } from '../../components/Card';
import { TrainSkeleton } from '../../components/Skeleton';
import { simulateLoading, generateTrains } from '../../utils/mockData';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<TravelStackParamList>;
type RouteType = RouteProp<TravelStackParamList, 'TrainResults'>;

const TrainResultsScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const [trains, setTrains] = useState<Train[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadTrains(); }, []);

  const loadTrains = async () => {
    setIsLoading(true);
    await simulateLoading(2000);
    setTrains(generateTrains(30));
    setIsLoading(false);
  };

  const onRefresh = async () => { setRefreshing(true); await loadTrains(); setRefreshing(false); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); };
  const handleTrainPress = (train: Train) => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); navigation.navigate('TrainDetails', train); };

  const renderHeader = () => (
    <Animated.View entering={FadeInDown.duration(400)} style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.accent }]}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButton}>←</Text></TouchableOpacity>
        <View><Text style={styles.routeText}>{route.params?.from || 'DEL'} → {route.params?.to || 'BOM'}</Text><Text style={styles.dateText}>{route.params?.date || '2024-01-15'}</Text></View>
        <TouchableOpacity><Text style={styles.filterIcon}>⚙️</Text></TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.accent} translucent />
      {renderHeader()}
      <View style={[styles.resultCount, { backgroundColor: colors.surface }]}><Text style={[styles.resultText, { color: colors.text }]}>{trains.length} trains found</Text></View>
      <FlatList data={trains} renderItem={({ item, index }) => <TrainCard train={item} onPress={() => handleTrainPress(item)} index={index} />} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />} ListEmptyComponent={isLoading ? <><TrainSkeleton /><TrainSkeleton /><TrainSkeleton /></> : null} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  backButton: { fontSize: 24, color: '#fff', marginRight: 16 },
  routeText: { fontSize: 20, fontWeight: '700', color: '#fff' },
  dateText: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  filterIcon: { fontSize: 20 },
  resultCount: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, marginHorizontal: 16, marginTop: 16, borderRadius: 12 },
  resultText: { fontSize: 16, fontWeight: '600' },
  listContent: { paddingTop: 16, paddingBottom: 100 },
});

export default TrainResultsScreen;
