// Core Types for TravelBank Ultra App

export type AppMode = 'travel' | 'banking';

export type ThemeMode = 'light' | 'dark';

// Flight Types
export interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  duration: string;
  price: number;
  seatsAvailable: number;
  class: 'economy' | 'business' | 'first';
  stops: number;
  aircraft: string;
}

export interface FlightSearchParams {
  tripType: 'one-way' | 'round' | 'multi';
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  class: 'economy' | 'business' | 'first';
}

export interface Seat {
  id: string;
  row: number;
  column: string;
  type: 'standard' | 'premium' | 'exit' | 'aisle' | 'middle';
  price: number;
  available: boolean;
}

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  passportNumber?: string;
  nationality: string;
}

// Hotel Types
export interface Hotel {
  id: string;
  name: string;
  location: string;
  address: string;
  rating: number;
  reviewCount: number;
  price: number;
  images: string[];
  amenities: string[];
  rooms: RoomType[];
  description: string;
  distance: string;
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  bedType: string;
  amenities: string[];
  available: number;
  cancellationPolicy: string;
}

export interface HotelSearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

// Train Types
export interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  class: 'sleeper' | 'ac' | 'first-class';
  stations: TrainStation[];
}

export interface TrainStation {
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  day: number;
}

export interface TrainSearchParams {
  from: string;
  to: string;
  date: string;
  class: string;
  passengers: number;
}

// Booking Types
export interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'train';
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  bookingDate: string;
  travelDate: string;
  details: Flight | Hotel | Train | Bus;
  passengers?: Passenger[];
  totalAmount: number;
  paymentMethod: string;
  pnr?: string;
}

export interface Bus {
  id: string;
  operator: string;
  busType: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  amenities: string[];
}

// Banking Types
export interface BankAccount {
  id: string;
  accountNumber: string;
  accountType: 'savings' | 'current' | 'fixed-deposit';
  balance: number;
  currency: string;
  holderName: string;
  bankName: string;
  ifscCode: string;
}

export interface Transaction {
  id: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  merchant: string;
  category: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  accountId: string;
  upiId?: string;
  merchantLogo?: string;
}

export interface CreditCard {
  id: string;
  cardNumber: string;
  holderName: string;
  expiryDate: string;
  cvv: string;
  type: 'visa' | 'mastercard' | 'rupay';
  limit: number;
  availableLimit: number;
  dueDate: string;
  lastPayment?: number;
}

export interface UPIContact {
  id: string;
  name: string;
  upiId: string;
  phone?: string;
  avatar?: string;
}

export interface Bill {
  id: string;
  category: 'electricity' | 'water' | 'gas' | 'mobile' | 'dth' | 'internet';
  provider: string;
  accountNumber: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  billDate: string;
  consumerName: string;
}

export interface Investment {
  id: string;
  type: 'fd' | 'mutual-fund' | 'gold' | 'stocks';
  name: string;
  amount: number;
  returns: number;
  returnsPercent: number;
  purchaseDate: string;
  currentValue: number;
  maturityDate?: string;
  tenure?: number;
  rate?: number;
}

export interface FixedDeposit {
  id: string;
  bankName: string;
  amount: number;
  tenure: number;
  interestRate: number;
  maturityAmount: number;
  startDate: string;
  maturityDate: string;
  compoundingFrequency: 'monthly' | 'quarterly' | 'annually';
}

export interface MutualFund {
  id: string;
  name: string;
  nav: number;
  units: number;
  investedAmount: number;
  currentValue: number;
  returns: number;
  returnsPercent: number;
  riskLevel: 'low' | 'medium' | 'high';
  category: string;
}

export interface GoldHolding {
  id: string;
  grams: number;
  buyPrice: number;
  currentPrice: number;
  currentValue: number;
  returns: number;
  purchaseDate: string;
}

// UI Types
export interface SkeletonData {
  width: string | number;
  height: number;
  borderRadius: number;
}

export interface ToastConfig {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface BottomSheetOption {
  icon: string;
  label: string;
  onPress: () => void;
}

// Filter Types
export interface FlightFilter {
  priceRange: [number, number];
  airlines: string[];
  stops: number[];
  departureTime: 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
  class: string;
}

export interface HotelFilter {
  priceRange: [number, number];
  rating: number;
  amenities: string[];
  propertyType: string[];
}

// Navigation Types
export type TravelStackParamList = {
  TravelHome: undefined;
  FlightSearch: undefined;
  FlightResults: FlightSearchParams;
  FlightDetails: Flight;
  SeatSelection: Flight;
  PassengerDetails: Flight;
  Payment: { flight: Flight; passenger: Passenger };
  BookingConfirmation: { booking: Booking };
  HotelSearch: undefined;
  HotelResults: HotelSearchParams;
  HotelDetails: Hotel;
  RoomSelection: Hotel;
  HotelBooking: Hotel;
  HotelPayment: { hotel: Hotel };
  HotelConfirmation: { booking: Booking };
  TrainSearch: undefined;
  TrainResults: TrainSearchParams;
  TrainDetails: Train;
  TrainSeatSelection: Train;
  PassengerForm: Train;
  TrainPayment: { train: Train };
  TrainConfirmation: { booking: Booking };
  BookingsList: undefined;
  BookingDetail: Booking;
  CancelBooking: Booking;
  ModifyBooking: Booking;
};

export type BankingStackParamList = {
  BankingHome: undefined;
  Accounts: undefined;
  TransactionDetail: Transaction;
  ReportIssue: Transaction;
  SupportChat: undefined;
  SendMoney: undefined;
  AmountEntry: UPIContact | undefined;
  ConfirmTransfer: { contact: UPIContact; amount: number; note: string };
  EnterPin: { contact: UPIContact; amount: number; note: string };
  TransferSuccess: { transaction: Transaction };
  TransferFailure: { error: string };
  BillsRecharge: undefined;
  BillCategory: undefined;
  EnterAccount: { category: Bill['category'] };
  BillDetails: Bill;
  BillPayment: Bill;
  PaymentSuccess: Bill;
  Investments: undefined;
  FDCalculator: undefined;
  FDConfirmation: FixedDeposit;
  MutualFundDetails: MutualFund;
  Portfolio: undefined;
};

// Context Types
export interface AppContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export interface UserDataType {
  favorites: string[];
  history: string[];
  settings: {
    notifications: boolean;
    biometrics: boolean;
    language: string;
    currency: string;
  };
  bookmarks: Booking[];
}
