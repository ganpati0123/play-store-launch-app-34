import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { TravelStackParamList, BankingStackParamList } from '../types';

// Travel Screens
import TravelHomeScreen from '../screens/travel/TravelHomeScreen';
import FlightSearchScreen from '../screens/travel/FlightSearchScreen';
import FlightResultsScreen from '../screens/travel/FlightResultsScreen';
import FlightDetailsScreen from '../screens/travel/FlightDetailsScreen';
import SeatSelectionScreen from '../screens/travel/SeatSelectionScreen';
import PassengerDetailsScreen from '../screens/travel/PassengerDetailsScreen';
import PaymentScreen from '../screens/travel/PaymentScreen';
import BookingConfirmationScreen from '../screens/travel/BookingConfirmationScreen';
import HotelSearchScreen from '../screens/travel/HotelSearchScreen';
import HotelResultsScreen from '../screens/travel/HotelResultsScreen';
import HotelDetailsScreen from '../screens/travel/HotelDetailsScreen';
import RoomSelectionScreen from '../screens/travel/RoomSelectionScreen';
import HotelBookingScreen from '../screens/travel/HotelBookingScreen';
import HotelPaymentScreen from '../screens/travel/HotelPaymentScreen';
import HotelConfirmationScreen from '../screens/travel/HotelConfirmationScreen';
import TrainSearchScreen from '../screens/travel/TrainSearchScreen';
import TrainResultsScreen from '../screens/travel/TrainResultsScreen';
import TrainDetailsScreen from '../screens/travel/TrainDetailsScreen';
import TrainSeatSelectionScreen from '../screens/travel/TrainSeatSelectionScreen';
import PassengerFormScreen from '../screens/travel/PassengerFormScreen';
import TrainPaymentScreen from '../screens/travel/TrainPaymentScreen';
import TrainConfirmationScreen from '../screens/travel/TrainConfirmationScreen';
import BookingsListScreen from '../screens/travel/BookingsListScreen';
import BookingDetailScreen from '../screens/travel/BookingDetailScreen';
import CancelBookingScreen from '../screens/travel/CancelBookingScreen';
import ModifyBookingScreen from '../screens/travel/ModifyBookingScreen';

// Banking Screens
import BankingHomeScreen from '../screens/banking/BankingHomeScreen';
import AccountsScreen from '../screens/banking/AccountsScreen';
import SendMoneyScreen from '../screens/banking/SendMoneyScreen';
import BillsRechargeScreen from '../screens/banking/BillsRechargeScreen';
import InvestmentsScreen from '../screens/banking/InvestmentsScreen';
import FDCalculatorScreen from '../screens/banking/FDCalculatorScreen';

const TravelStack = createNativeStackNavigator<TravelStackParamList>();
const BankingStack = createNativeStackNavigator<BankingStackParamList>();
const Tab = createBottomTabNavigator();

const TravelStackNavigator = () => {
  const { colors } = useTheme();
  return (
    <TravelStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <TravelStack.Screen name="TravelHome" component={TravelHomeScreen} />
      <TravelStack.Screen name="FlightSearch" component={FlightSearchScreen} />
      <TravelStack.Screen name="FlightResults" component={FlightResultsScreen} />
      <TravelStack.Screen name="FlightDetails" component={FlightDetailsScreen} />
      <TravelStack.Screen name="SeatSelection" component={SeatSelectionScreen} />
      <TravelStack.Screen name="PassengerDetails" component={PassengerDetailsScreen} />
      <TravelStack.Screen name="Payment" component={PaymentScreen} />
      <TravelStack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
      <TravelStack.Screen name="HotelSearch" component={HotelSearchScreen} />
      <TravelStack.Screen name="HotelResults" component={HotelResultsScreen} />
      <TravelStack.Screen name="HotelDetails" component={HotelDetailsScreen} />
      <TravelStack.Screen name="RoomSelection" component={RoomSelectionScreen} />
      <TravelStack.Screen name="HotelBooking" component={HotelBookingScreen} />
      <TravelStack.Screen name="HotelPayment" component={HotelPaymentScreen} />
      <TravelStack.Screen name="HotelConfirmation" component={HotelConfirmationScreen} />
      <TravelStack.Screen name="TrainSearch" component={TrainSearchScreen} />
      <TravelStack.Screen name="TrainResults" component={TrainResultsScreen} />
      <TravelStack.Screen name="TrainDetails" component={TrainDetailsScreen} />
      <TravelStack.Screen name="TrainSeatSelection" component={TrainSeatSelectionScreen} />
      <TravelStack.Screen name="PassengerForm" component={PassengerFormScreen} />
      <TravelStack.Screen name="TrainPayment" component={TrainPaymentScreen} />
      <TravelStack.Screen name="TrainConfirmation" component={TrainConfirmationScreen} />
      <TravelStack.Screen name="BookingsList" component={BookingsListScreen} />
      <TravelStack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <TravelStack.Screen name="CancelBooking" component={CancelBookingScreen} />
      <TravelStack.Screen name="ModifyBooking" component={ModifyBookingScreen} />
    </TravelStack.Navigator>
  );
};

const BankingStackNavigator = () => {
  const { colors } = useTheme();
  return (
    <BankingStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <BankingStack.Screen name="BankingHome" component={BankingHomeScreen} />
      <BankingStack.Screen name="Accounts" component={AccountsScreen} />
      <BankingStack.Screen name="SendMoney" component={SendMoneyScreen} />
      <BankingStack.Screen name="BillsRecharge" component={BillsRechargeScreen} />
      <BankingStack.Screen name="Investments" component={InvestmentsScreen} />
      <BankingStack.Screen name="FDCalculator" component={FDCalculatorScreen} />
    </BankingStack.Navigator>
  );
};

const TabBarIcon = ({ icon, focused, color }: { icon: string; focused: boolean; color: string }) => (
  <View style={styles.tabIconContainer}>
    <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.6 }]}>{icon}</Text>
  </View>
);

const MainNavigator = () => {
  const { colors, mode, setMode, theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          elevation: 0,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="TravelTab"
        component={mode === 'travel' ? TravelStackNavigator : BankingStackNavigator}
        options={{
          tabBarLabel: mode === 'travel' ? 'Travel' : 'Banking',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              icon={mode === 'travel' ? '✈️' : '🏦'}
              focused={focused}
              color={color}
            />
          ),
        }}
        listeners={({}) => ({
          tabPress: (e) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        })}
      />
      <Tab.Screen
        name="Flights"
        component={TravelStackNavigator}
        options={{
          tabBarLabel: 'Flights',
          tabBarIcon: ({ focused, color }) => <TabBarIcon icon="✈️" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Hotels"
        component={TravelStackNavigator}
        options={{
          tabBarLabel: 'Hotels',
          tabBarIcon: ({ focused, color }) => <TabBarIcon icon="🏨" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Trains"
        component={TravelStackNavigator}
        options={{
          tabBarLabel: 'Trains',
          tabBarIcon: ({ focused, color }) => <TabBarIcon icon="🚆" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Banking"
        component={BankingStackNavigator}
        options={{
          tabBarLabel: 'Bank',
          tabBarIcon: ({ focused, color }) => <TabBarIcon icon="🏦" focused={focused} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
  },
});

export default MainNavigator;
