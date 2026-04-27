import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
  FadeOut,
  SlideInRight,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { Flight, Hotel, Train, Booking } from '../types';

const { width } = Dimensions.get('window');

interface FlightCardProps {
  flight: Flight;
  onPress: () => void;
  index?: number;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, onPress, index = 0 }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withSpring(0.97, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      entering={FadeIn.delay(index * 100).duration(300)}
      style={[styles.cardContainer, animatedStyle]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handlePress}
        style={[styles.card, { backgroundColor: colors.flightCard }]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.airlineInfo}>
            <Image
              source={{ uri: flight.airlineLogo }}
              style={styles.airlineLogo}
              defaultSource={require('../../assets/icon.png')}
            />
            <View>
              <Text style={[styles.airlineName, { color: colors.text }]}>
                {flight.airline}
              </Text>
              <Text style={[styles.flightNumber, { color: colors.textSecondary }]}>
                {flight.flightNumber}
              </Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: colors.primary }]}>
              ₹{flight.price.toLocaleString()}
            </Text>
            <Text style={[styles.perPerson, { color: colors.textTertiary }]}>
              per person
            </Text>
          </View>
        </View>

        <View style={styles.flightRoute}>
          <View style={styles.timeContainer}>
            <Text style={[styles.time, { color: colors.text }]}>
              {flight.departure.time}
            </Text>
            <Text style={[styles.airport, { color: colors.textSecondary }]}>
              {flight.departure.airport}
            </Text>
          </View>

          <View style={styles.durationContainer}>
            <Text style={[styles.duration, { color: colors.textTertiary }]}>
              {flight.duration}
            </Text>
            <View style={[styles.flightLine, { backgroundColor: colors.border }]}>
              <View style={[styles.flightDot, { backgroundColor: colors.primary }]} />
              {flight.stops > 0 && (
                <View style={[styles.stopDot, { backgroundColor: colors.warning }]} />
              )}
            </View>
            <Text style={[styles.stops, { color: colors.textTertiary }]}>
              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
            </Text>
          </View>

          <View style={[styles.timeContainer, { alignItems: 'flex-end' }]}>
            <Text style={[styles.time, { color: colors.text }]}>
              {flight.arrival.time}
            </Text>
            <Text style={[styles.airport, { color: colors.textSecondary }]}>
              {flight.arrival.airport}
            </Text>
          </View>
        </View>

        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
          <View style={styles.footerItem}>
            <Text style={[styles.footerLabel, { color: colors.textTertiary }]}>
              Seats
            </Text>
            <Text style={[styles.footerValue, { color: colors.text }]}>
              {flight.seatsAvailable} left
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={[styles.footerLabel, { color: colors.textTertiary }]}>
              Class
            </Text>
            <Text style={[styles.footerValue, { color: colors.text }]}>
              {flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={[styles.footerLabel, { color: colors.textTertiary }]}>
              Aircraft
            </Text>
            <Text style={[styles.footerValue, { color: colors.text }]}>
              {flight.aircraft}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface HotelCardProps {
  hotel: Hotel;
  onPress: () => void;
  index?: number;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onPress, index = 0 }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withSpring(0.97, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn.delay(index * 100).duration(300)}
      style={animatedStyle}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handlePress}
        style={[styles.hotelCard, { backgroundColor: colors.hotelCard }]}
      >
        <Image source={{ uri: hotel.images[0] }} style={styles.hotelImage} />
        <View style={styles.hotelInfo}>
          <View style={styles.hotelHeader}>
            <View style={styles.hotelNameContainer}>
              <Text style={[styles.hotelName, { color: colors.text }]} numberOfLines={1}>
                {hotel.name}
              </Text>
              <Text style={[styles.hotelLocation, { color: colors.textSecondary }]}>
                {hotel.location}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={[styles.rating, { color: colors.primary }]}>★ {hotel.rating}</Text>
              <Text style={[styles.reviewCount, { color: colors.textTertiary }]}>
                ({hotel.reviewCount})
              </Text>
            </View>
          </View>

          <Text style={[styles.hotelDistance, { color: colors.textTertiary }]}>
            {hotel.distance}
          </Text>

          <View style={styles.amenitiesRow}>
            {hotel.amenities.slice(0, 4).map((amenity, idx) => (
              <View
                key={idx}
                style={[styles.amenityBadge, { backgroundColor: colors.surfaceVariant }]}
              >
                <Text style={[styles.amenityText, { color: colors.textSecondary }]}>
                  {amenity}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.hotelFooter}>
            <View>
              <Text style={[styles.priceLabel, { color: colors.textTertiary }]}>
                Starting from
              </Text>
              <Text style={[styles.hotelPrice, { color: colors.primary }]}>
                ₹{hotel.price.toLocaleString()}
                <Text style={[styles.perNight, { color: colors.textTertiary }]}> /night</Text>
              </Text>
            </View>
            <View style={[styles.bookButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.bookButtonText}>View</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface TrainCardProps {
  train: Train;
  onPress: () => void;
  index?: number;
}

export const TrainCard: React.FC<TrainCardProps> = ({ train, onPress, index = 0 }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withSpring(0.97, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn.delay(index * 100).duration(300)}
      style={animatedStyle}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handlePress}
        style={[styles.trainCard, { backgroundColor: colors.trainCard }]}
      >
        <View style={styles.trainHeader}>
          <View>
            <Text style={[styles.trainName, { color: colors.text }]}>
              {train.trainName}
            </Text>
            <Text style={[styles.trainNumber, { color: colors.textSecondary }]}>
              #{train.trainNumber}
            </Text>
          </View>
          <Text style={[styles.trainPrice, { color: colors.primary }]}>
            ₹{train.price}
          </Text>
        </View>

        <View style={styles.trainRoute}>
          <View>
            <Text style={[styles.trainTime, { color: colors.text }]}>
              {train.departureTime}
            </Text>
            <Text style={[styles.trainCity, { color: colors.textSecondary }]}>
              {train.from}
            </Text>
          </View>
          <View style={styles.trainDuration}>
            <Text style={[styles.trainDurationText, { color: colors.textTertiary }]}>
              {train.duration}
            </Text>
            <View style={[styles.trainLine, { backgroundColor: colors.border }]} />
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.trainTime, { color: colors.text }]}>
              {train.arrivalTime}
            </Text>
            <Text style={[styles.trainCity, { color: colors.textSecondary }]}>
              {train.to}
            </Text>
          </View>
        </View>

        <View style={[styles.trainFooter, { borderTopColor: colors.border }]}>
          <View style={styles.trainFooterItem}>
            <Text style={[styles.trainFooterLabel, { color: colors.textTertiary }]}>
              Class
            </Text>
            <Text style={[styles.trainFooterValue, { color: colors.text }]}>
              {train.class.charAt(0).toUpperCase() + train.class.slice(1)}
            </Text>
          </View>
          <View style={styles.trainFooterItem}>
            <Text style={[styles.trainFooterLabel, { color: colors.textTertiary }]}>
              Seats
            </Text>
            <Text style={[styles.trainFooterValue, { color: colors.text }]}>
              {train.seatsAvailable} available
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onPress }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withSpring(0.97, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getTypeIcon = () => {
    switch (booking.type) {
      case 'flight':
        return '✈️';
      case 'hotel':
        return '🏨';
      case 'train':
        return '🚆';
      default:
        return '📄';
    }
  };

  const getDetails = () => {
    if (booking.type === 'flight') {
      const flight = booking.details as Flight;
      return `${flight.departure.city} → ${flight.arrival.city}`;
    } else if (booking.type === 'hotel') {
      const hotel = booking.details as Hotel;
      return hotel.name;
    } else {
      const train = booking.details as Train;
      return `${train.from} → ${train.to}`;
    }
  };

  const getStatusColor = () => {
    switch (booking.status) {
      case 'confirmed':
        return colors.success;
      case 'cancelled':
        return colors.error;
      case 'completed':
        return colors.info;
      default:
        return colors.warning;
    }
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handlePress}
        style={[styles.bookingCard, { backgroundColor: colors.surface }]}
      >
        <View style={styles.bookingHeader}>
          <View style={[styles.typeIcon, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={styles.typeIconText}>{getTypeIcon()}</Text>
          </View>
          <View style={styles.bookingInfo}>
            <Text style={[styles.bookingType, { color: colors.text }]}>
              {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
            </Text>
            <Text style={[styles.bookingDate, { color: colors.textSecondary }]}>
              Booked on {booking.bookingDate}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{booking.status}</Text>
          </View>
        </View>

        <Text style={[styles.bookingDetails, { color: colors.text }]}>
          {getDetails()}
        </Text>

        <View style={[styles.bookingFooter, { borderTopColor: colors.border }]}>
          <View>
            <Text style={[styles.bookingLabel, { color: colors.textTertiary }]}>
              Travel Date
            </Text>
            <Text style={[styles.bookingValue, { color: colors.text }]}>
              {booking.travelDate}
            </Text>
          </View>
          <View>
            <Text style={[styles.bookingLabel, { color: colors.textTertiary }]}>
              Amount
            </Text>
            <Text style={[styles.bookingValue, { color: colors.primary }]}>
              ₹{booking.totalAmount.toLocaleString()}
            </Text>
          </View>
          {booking.pnr && (
            <View>
              <Text style={[styles.bookingLabel, { color: colors.textTertiary }]}>
                PNR
              </Text>
              <Text style={[styles.bookingValue, { color: colors.text }]}>
                {booking.pnr}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  airlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  airlineLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  airlineName: {
    fontSize: 16,
    fontWeight: '600',
  },
  flightNumber: {
    fontSize: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
  },
  perPerson: {
    fontSize: 12,
  },
  flightRoute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  timeContainer: {
    alignItems: 'center',
  },
  time: {
    fontSize: 22,
    fontWeight: '700',
  },
  airport: {
    fontSize: 14,
    marginTop: 4,
  },
  durationContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  duration: {
    fontSize: 12,
    marginBottom: 6,
  },
  flightLine: {
    width: '100%',
    height: 2,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  flightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    left: 0,
  },
  stopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    left: '50%',
  },
  stops: {
    fontSize: 11,
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 11,
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  hotelCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  hotelImage: {
    width: '100%',
    height: 180,
  },
  hotelInfo: {
    padding: 16,
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hotelNameContainer: {
    flex: 1,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '700',
  },
  hotelLocation: {
    fontSize: 14,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 12,
    marginLeft: 4,
  },
  hotelDistance: {
    fontSize: 13,
    marginTop: 8,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 6,
  },
  amenityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  amenityText: {
    fontSize: 11,
  },
  hotelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  priceLabel: {
    fontSize: 12,
  },
  hotelPrice: {
    fontSize: 22,
    fontWeight: '700',
  },
  perNight: {
    fontSize: 14,
    fontWeight: '400',
  },
  bookButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  trainCard: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  trainName: {
    fontSize: 16,
    fontWeight: '600',
  },
  trainNumber: {
    fontSize: 12,
    marginTop: 2,
  },
  trainPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  trainRoute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  trainTime: {
    fontSize: 18,
    fontWeight: '600',
  },
  trainCity: {
    fontSize: 13,
    marginTop: 4,
  },
  trainDuration: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  trainDurationText: {
    fontSize: 12,
    marginBottom: 4,
  },
  trainLine: {
    width: '80%',
    height: 2,
    borderStyle: 'dashed',
  },
  trainFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
  },
  trainFooterItem: {
    alignItems: 'center',
  },
  trainFooterLabel: {
    fontSize: 11,
  },
  trainFooterValue: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  bookingCard: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeIconText: {
    fontSize: 20,
  },
  bookingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookingType: {
    fontSize: 16,
    fontWeight: '600',
  },
  bookingDate: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bookingDetails: {
    fontSize: 15,
    marginTop: 12,
    fontWeight: '500',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
  },
  bookingLabel: {
    fontSize: 11,
  },
  bookingValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
});

export default { FlightCard, HotelCard, TrainCard, BookingCard };
