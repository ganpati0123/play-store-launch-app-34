# TravelBank Ultra - React Native Expo App

A premium dual-identity travel and banking mobile application built with React Native and Expo. The app seamlessly switches between Travel Mode (flights, hotels, trains) and Banking Mode (accounts, payments, investments).

## Features

### Travel Mode
- **Flight Search**: One-way, round-trip, and multi-city flight booking
- **Flight Results**: Sortable/filterable results with price, duration, and departure time
- **Flight Details**: Comprehensive flight information with fare rules and baggage allowance
- **Seat Selection**: Interactive seat map with real-time pricing
- **Passenger Details**: Passenger information form with validation
- **Payment**: Multiple payment methods (Card, UPI, Net Banking)
- **Booking Confirmation**: Complete booking summary with PNR
- **Hotel Search**: Location-based hotel search with dates and guest selection
- **Hotel Results**: Filterable hotel listings with map view
- **Hotel Details**: Room types, amenities, reviews
- **Train Search**: Train and bus booking
- **My Bookings**: View all bookings with status tracking

### Banking Mode
- **Account Overview**: Balance, recent transactions, credit cards
- **Send Money**: UPI payments with QR scan and contact selection
- **Bill Payments**: Electricity, water, gas, mobile, DTH, internet
- **Investments**: FD, Mutual Funds, Gold with portfolio tracking
- **Transaction History**: Detailed transaction logs with reporting

## Technical Features

- **5 Bottom Tabs** with Stack Navigation
- **4+ Levels** of navigation depth in every tab
- **Every card/item** is tappable with detailed screens
- **Bottom Sheet Modals** for quick actions
- **Pull to Refresh** and **Skeleton Loaders**
- **Glassmorphism + Neumorphism** design elements
- **Gradient Backgrounds** throughout
- **Micro-animations** on every touch (scale, spring, fade)
- **Haptic Feedback** on all buttons
- **Dark Mode + Light Mode** with smooth transitions
- **Floating AI Assistant** on every screen
- **AsyncStorage** for user data persistence
- **TypeScript** with full interfaces

## Tech Stack

- React Native (Expo)
- TypeScript
- React Navigation (Native Stack + Bottom Tabs)
- React Native Reanimated 2
- React Native Gesture Handler
- Expo LinearGradient
- Expo Blur View
- Expo Haptics
- AsyncStorage
- @gorhom/bottom-sheet

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AIAssistant.tsx
│   ├── BottomSheet.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── GlassCard.tsx
│   ├── Input.tsx
│   └── Skeleton.tsx
├── context/            # App context (Theme)
├── navigation/         # Navigation configuration
├── screens/
│   ├── banking/       # Banking mode screens
│   └── travel/       # Travel mode screens
├── types/             # TypeScript interfaces
└── utils/            # Mock data and utilities
```

## Installation

```bash
# Install dependencies
npm install

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios
```

## Design Highlights

- Premium Telegram-quality interface
- Deep navigation with 4+ levels per tab
- Mock data with realistic loading states
- Responsive and accessible UI
- Premium visual effects throughout
