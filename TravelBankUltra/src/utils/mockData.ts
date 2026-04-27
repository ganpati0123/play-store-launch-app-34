import {
  Flight,
  Hotel,
  Train,
  Bus,
  Booking,
  Transaction,
  BankAccount,
  CreditCard,
  UPIContact,
  Bill,
  Investment,
  FixedDeposit,
  MutualFund,
  GoldHolding,
  Seat,
  Passenger,
} from '../types';

// Utility function to generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Utility function to generate random date
export const generateRandomDate = (daysAhead: number = 30): string => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead) + 1);
  return date.toISOString().split('T')[0];
};

// Utility function to generate random time
export const generateRandomTime = (): string => {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Airlines list
const airlines = [
  { name: 'Air India', logo: 'https://logo.clearbit.com/airindia.in' },
  { name: 'IndiGo', logo: 'https://logo.clearbit.com/goindigo.in' },
  { name: 'SpiceJet', logo: 'https://logo.clearbit.com/spicejet.com' },
  { name: 'AirAsia', logo: 'https://logo.clearbit.com/airasia.com' },
  { name: 'Vistara', logo: 'https://logo.clearbit.com/airvistara.com' },
  { name: 'Akasa Air', logo: 'https://logo.clearbit.com/akasaair.com' },
  { name: 'Air Canada', logo: 'https://logo.clearbit.com/aircanada.com' },
  { name: 'British Airways', logo: 'https://logo.clearbit.com/britishairways.com' },
  { name: 'Emirates', logo: 'https://logo.clearbit.com/emirates.com' },
  { name: 'Qatar Airways', logo: 'https://logo.clearbit.com/qatarairways.com' },
];

// Cities list
const cities = [
  { code: 'DEL', name: 'New Delhi', full: 'Indira Gandhi International Airport' },
  { code: 'BOM', name: 'Mumbai', full: 'Chhatrapati Shivaji Maharaj International Airport' },
  { code: 'BLR', name: 'Bangalore', full: 'Kempegowda International Airport' },
  { code: 'HYD', name: 'Hyderabad', full: 'Rajiv Gandhi International Airport' },
  { code: 'CHE', name: 'Chennai', full: 'Chennai International Airport' },
  { code: 'CCU', name: 'Kolkata', full: 'Netaji Subhas Chandra Bose International Airport' },
  { code: 'GOI', name: 'Goa', full: 'Dabolim Airport' },
  { code: 'PNQ', name: 'Pune', full: 'Pune Airport' },
  { code: 'MAA', name: 'Chennai', full: 'Chennai International Airport' },
  { code: 'JAI', name: 'Jaipur', full: 'Jaipur International Airport' },
  { code: 'AMD', name: 'Ahmedabad', full: 'Sardar Vallabhbhai Patel International Airport' },
  { code: 'LKO', name: 'Lucknow', full: 'Chaudhary Charan Singh International Airport' },
];

// Hotel chains
const hotelChains = [
  'Taj Hotels',
  'Marriott',
  'Hyatt',
  'Hilton',
  'ITC Hotels',
  'The Leela',
  'Radisson',
  'Courtyard by Marriott',
  'Four Points',
  'Holiday Inn',
];

// Generate mock flights
export const generateFlights = (count: number = 50): Flight[] => {
  const flights: Flight[] = [];
  for (let i = 0; i < count; i++) {
    const fromCity = cities[Math.floor(Math.random() * cities.length)];
    let toCity = cities[Math.floor(Math.random() * cities.length)];
    while (toCity.code === fromCity.code) {
      toCity = cities[Math.floor(Math.random() * cities.length)];
    }
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const departureHour = Math.floor(Math.random() * 24);
    const arrivalHour = (departureHour + Math.floor(Math.random() * 12) + 1) % 24;
    const price = Math.floor(Math.random() * 15000) + 2000;
    
    flights.push({
      id: `FL${1000 + i}`,
      airline: airline.name,
      airlineLogo: airline.logo,
      flightNumber: `${airline.name.substring(0, 2).toUpperCase()}${100 + Math.floor(Math.random() * 900)}`,
      departure: {
        airport: fromCity.code,
        city: fromCity.name,
        time: `${departureHour.toString().padStart(2, '0')}:${(Math.floor(Math.random() * 60)).toString().padStart(2, '0')}`,
        date: generateRandomDate(),
      },
      arrival: {
        airport: toCity.code,
        city: toCity.name,
        time: `${arrivalHour.toString().padStart(2, '0')}:${(Math.floor(Math.random() * 60)).toString().padStart(2, '0')}`,
        date: generateRandomDate(),
      },
      duration: `${Math.floor(Math.random() * 12) + 1}h ${Math.floor(Math.random() * 60)}m`,
      price,
      seatsAvailable: Math.floor(Math.random() * 50) + 1,
      class: ['economy', 'business', 'first'][Math.floor(Math.random() * 3)] as 'economy' | 'business' | 'first',
      stops: Math.floor(Math.random() * 3),
      aircraft: ['Boeing 737', 'Airbus A320', 'Boeing 777', 'Airbus A350', 'Boeing 787'][Math.floor(Math.random() * 5)],
    });
  }
  return flights.sort((a, b) => a.price - b.price);
};

// Generate seat map for a flight
export const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = [15, 20, 25, 30];
  const row = rows[Math.floor(Math.random() * rows.length)];
  const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  for (let r = 1; r <= row; r++) {
    for (const col of columns) {
      const isAvailable = Math.random() > 0.3;
      const isExit = r === 5 || r === 15 || r === 25;
      const isAisle = col === 'C' || col === 'D';
      
      seats.push({
        id: `${r}${col}`,
        row: r,
        column: col,
        type: isExit ? 'exit' : isAisle ? 'aisle' : Math.random() > 0.5 ? 'middle' : 'standard',
        price: isExit ? 500 : isAisle ? 200 : 0,
        available: isAvailable,
      });
    }
  }
  return seats;
};

// Generate mock hotels
export const generateHotels = (count: number = 40): Hotel[] => {
  const hotels: Hotel[] = [];
  const amenities = [
    'Free WiFi',
    'Pool',
    'Spa',
    'Gym',
    'Restaurant',
    'Bar',
    'Room Service',
    'Parking',
    'Airport Shuttle',
    'Business Center',
    'Laundry',
    'Concierge',
    'Pet Friendly',
    'Beach Access',
    'Kids Club',
  ];
  
  for (let i = 0; i < count; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const chain = hotelChains[Math.floor(Math.random() * hotelChains.length)];
    const hotelAmenities = amenities.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 8) + 4);
    const rating = (Math.random() * 2 + 3).toFixed(1);
    const price = Math.floor(Math.random() * 8000) + 1500;
    
    hotels.push({
      id: `HTL${1000 + i}`,
      name: `${chain} ${city.name}`,
      location: city.name,
      address: `${Math.floor(Math.random() * 500) + 1}, ${city.name}, India`,
      rating: parseFloat(rating),
      reviewCount: Math.floor(Math.random() * 2000) + 100,
      price,
      images: [
        `https://picsum.photos/seed/${i}a/400/300`,
        `https://picsum.photos/seed/${i}b/400/300`,
        `https://picsum.photos/seed/${i}c/400/300`,
      ],
      amenities: hotelAmenities,
      rooms: [
        {
          id: `R${i}1`,
          name: 'Standard Room',
          description: 'Comfortable room with all basic amenities',
          price: price,
          maxGuests: 2,
          bedType: 'Queen',
          amenities: ['AC', 'TV', 'WiFi'],
          available: Math.floor(Math.random() * 10) + 1,
          cancellationPolicy: 'Free cancellation until 24h before check-in',
        },
        {
          id: `R${i}2`,
          name: 'Deluxe Room',
          description: 'Spacious room with premium amenities',
          price: price * 1.5,
          maxGuests: 3,
          bedType: 'King',
          amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Safe'],
          available: Math.floor(Math.random() * 8) + 1,
          cancellationPolicy: 'Free cancellation until 48h before check-in',
        },
        {
          id: `R${i}3`,
          name: 'Suite',
          description: 'Luxurious suite with separate living area',
          price: price * 2.5,
          maxGuests: 4,
          bedType: 'King',
          amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Safe', 'Jacuzzi', 'Butler Service'],
          available: Math.floor(Math.random() * 5) + 1,
          cancellationPolicy: 'Non-refundable',
        },
      ],
      description: `Experience luxury at ${chain} ${city.name}. Located in the heart of the city, our hotel offers world-class amenities and impeccable service.`,
      distance: `${(Math.random() * 10 + 1).toFixed(1)} km from ${city.name} Airport`,
    });
  }
  return hotels.sort((a, b) => a.price - b.price);
};

// Generate mock trains
export const generateTrains = (count: number = 30): Train[] => {
  const trains: Train[] = [];
  const trainNames = [
    'Rajdhani Express',
    'Shatabdi Express',
    'Garib Rath',
    'Duronto Express',
    'Intercity Express',
    'Vande Bharat',
    'Tejas Express',
    'Humsafar Express',
    'Jan Shatabdi',
    'Maharaja Express',
  ];
  
  for (let i = 0; i < count; i++) {
    const fromCity = cities[Math.floor(Math.random() * cities.length)];
    let toCity = cities[Math.floor(Math.random() * cities.length)];
    while (toCity.code === fromCity.code) {
      toCity = cities[Math.floor(Math.random() * cities.length)];
    }
    const trainName = trainNames[Math.floor(Math.random() * trainNames.length)];
    const departureHour = Math.floor(Math.random() * 24);
    const duration = Math.floor(Math.random() * 20) + 2;
    const arrivalHour = (departureHour + duration) % 24;
    const price = Math.floor(Math.random() * 2000) + 300;
    
    trains.push({
      id: `TR${10000 + i}`,
      trainNumber: `${Math.floor(Math.random() * 90000) + 10000}`,
      trainName,
      from: fromCity.name,
      to: toCity.name,
      departureTime: `${departureHour.toString().padStart(2, '0')}:00`,
      arrivalTime: `${arrivalHour.toString().padStart(2, '0')}:00`,
      duration: `${duration}h ${Math.floor(Math.random() * 60)}m`,
      price,
      seatsAvailable: Math.floor(Math.random() * 100) + 10,
      class: ['sleeper', 'ac', 'first-class'][Math.floor(Math.random() * 3)] as 'sleeper' | 'ac' | 'first-class',
      stations: [
        { stationName: fromCity.name, arrivalTime: '--:--', departureTime: `${departureHour.toString().padStart(2, '0')}:00`, day: 1 },
        { stationName: 'Intermediate Station 1', arrivalTime: `${(departureHour + Math.floor(duration / 3)).toString().padStart(2, '0')}:00`, departureTime: `${(departureHour + Math.floor(duration / 3) + 1).toString().padStart(2, '0')}:00`, day: 1 },
        { stationName: 'Intermediate Station 2', arrivalTime: `${(departureHour + Math.floor(2 * duration / 3)).toString().padStart(2, '0')}:00`, departureTime: `${(departureHour + Math.floor(2 * duration / 3) + 1).toString().padStart(2, '0')}:00`, day: 1 },
        { stationName: toCity.name, arrivalTime: `${arrivalHour.toString().padStart(2, '0')}:00`, departureTime: '--:--', day: 1 },
      ],
    });
  }
  return trains.sort((a, b) => a.price - b.price);
};

// Generate mock bus
export const generateBuses = (count: number = 20): Bus[] => {
  const buses: Bus[] = [];
  const operators = [
    'Volvo',
    'Scania',
    'Mercedes',
    'Ashok Leyland',
    'Mahindra',
    'Eicher',
  ];
  const busTypes = [
    'AC Sleeper',
    'AC Seater',
    'Non-AC Sleeper',
    'Non-AC Seater',
    'Semi-Sleeper',
    'Volvo AC Sleeper',
    'Volvo AC Seater',
  ];
  
  for (let i = 0; i < count; i++) {
    const fromCity = cities[Math.floor(Math.random() * cities.length)];
    let toCity = cities[Math.floor(Math.random() * cities.length)];
    while (toCity.code === fromCity.code) {
      toCity = cities[Math.floor(Math.random() * cities.length)];
    }
    const departureHour = Math.floor(Math.random() * 24);
    const duration = Math.floor(Math.random() * 12) + 2;
    const arrivalHour = (departureHour + duration) % 24;
    const price = Math.floor(Math.random() * 1500) + 200;
    
    buses.push({
      id: `BUS${1000 + i}`,
      operator: operators[Math.floor(Math.random() * operators.length)],
      busType: busTypes[Math.floor(Math.random() * busTypes.length)],
      from: fromCity.name,
      to: toCity.name,
      departureTime: `${departureHour.toString().padStart(2, '0')}:00`,
      arrivalTime: `${arrivalHour.toString().padStart(2, '0')}:00`,
      duration: `${duration}h`,
      price,
      seatsAvailable: Math.floor(Math.random() * 30) + 5,
      amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket', 'Pillow', 'LED TV'].sort(() => 0.5 - Math.random()).slice(0, 4),
    });
  }
  return buses.sort((a, b) => a.price - b.price);
};

// Generate mock transactions
export const generateTransactions = (count: number = 100): Transaction[] => {
  const transactions: Transaction[] = [];
  const merchants = [
    'Amazon',
    'Flipkart',
    'Swiggy',
    'Zomato',
    'Netflix',
    'Spotify',
    'Myntra',
    'MakeMyTrip',
    'IRCTC',
    'Uber',
    'Ola',
    'Petrol Pump',
    'Grocery Store',
    'Restaurant',
    'Coffee Shop',
    'Pharmacy',
    'Hospital',
    'School Fees',
    'Utility Bill',
    'Mobile Recharge',
  ];
  const categories = [
    'Shopping',
    'Food',
    'Entertainment',
    'Travel',
    'Transport',
    'Utilities',
    'Healthcare',
    'Education',
    'Transfer',
    'Recharge',
  ];
  
  for (let i = 0; i < count; i++) {
    const isDebit = Math.random() > 0.3;
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    
    transactions.push({
      id: `TXN${100000 + i}`,
      type: isDebit ? 'debit' : 'credit',
      amount: isDebit ? Math.floor(Math.random() * 10000) + 100 : Math.floor(Math.random() * 50000) + 1000,
      description: isDebit ? `Payment to ${merchant}` : `Received from ${merchant}`,
      merchant,
      category: categories[Math.floor(Math.random() * categories.length)],
      date: date.toISOString().split('T')[0],
      time: generateRandomTime(),
      status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 10) > 1 ? 0 : Math.random() > 0.5 ? 1 : 2] as 'completed' | 'pending' | 'failed',
      accountId: 'ACC001',
      upiId: `${merchant.toLowerCase()}@upi`,
      merchantLogo: `https://logo.clearbit.com/${merchant.toLowerCase()}.com`,
    });
  }
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate mock accounts
export const generateAccounts = (): BankAccount[] => {
  return [
    {
      id: 'ACC001',
      accountNumber: `XXXX XXXX XXXX ${Math.floor(1000 + Math.random() * 9000)}`,
      accountType: 'savings',
      balance: Math.floor(Math.random() * 500000) + 50000,
      currency: 'INR',
      holderName: 'John Doe',
      bankName: 'TravelBank',
      ifscCode: 'TRVL0000001',
    },
    {
      id: 'ACC002',
      accountNumber: `XXXX XXXX XXXX ${Math.floor(1000 + Math.random() * 9000)}`,
      accountType: 'current',
      balance: Math.floor(Math.random() * 1000000) + 100000,
      currency: 'INR',
      holderName: 'John Doe',
      bankName: 'TravelBank',
      ifscCode: 'TRVL0000001',
    },
    {
      id: 'ACC003',
      accountNumber: `XXXX XXXX XXXX ${Math.floor(1000 + Math.random() * 9000)}`,
      accountType: 'fixed-deposit',
      balance: Math.floor(Math.random() * 500000) + 100000,
      currency: 'INR',
      holderName: 'John Doe',
      bankName: 'TravelBank',
      ifscCode: 'TRVL0000001',
    },
  ];
};

// Generate mock credit cards
export const generateCreditCards = (): CreditCard[] => {
  return [
    {
      id: 'CC001',
      cardNumber: `4532 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      holderName: 'JOHN DOE',
      expiryDate: '12/26',
      cvv: '123',
      type: 'visa',
      limit: 500000,
      availableLimit: Math.floor(Math.random() * 400000) + 100000,
      dueDate: '25',
      lastPayment: Math.floor(Math.random() * 50000) + 10000,
    },
    {
      id: 'CC002',
      cardNumber: `5425 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      holderName: 'JOHN DOE',
      expiryDate: '08/27',
      cvv: '456',
      type: 'mastercard',
      limit: 750000,
      availableLimit: Math.floor(Math.random() * 600000) + 150000,
      dueDate: '20',
      lastPayment: Math.floor(Math.random() * 75000) + 15000,
    },
    {
      id: 'CC003',
      cardNumber: `6011 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      holderName: 'JOHN DOE',
      expiryDate: '03/25',
      cvv: '789',
      type: 'rupay',
      limit: 250000,
      availableLimit: Math.floor(Math.random() * 200000) + 50000,
      dueDate: '15',
      lastPayment: Math.floor(Math.random() * 25000) + 5000,
    },
  ];
};

// Generate mock UPI contacts
export const generateUPIContacts = (): UPIContact[] => {
  const contacts = [
    { name: 'Rahul Sharma', phone: '+91 9876543210' },
    { name: 'Priya Patel', phone: '+91 8765432109' },
    { name: 'Amit Kumar', phone: '+91 7654321098' },
    { name: 'Sneha Reddy', phone: '+91 6543210987' },
    { name: 'Vikram Singh', phone: '+91 5432109876' },
    { name: 'Anjali Gupta', phone: '+91 4321098765' },
    { name: 'Raj Malhotra', phone: '+91 3210987654' },
    { name: 'Meera Nair', phone: '+91 2109876543' },
    { name: 'Sanjay Joshi', phone: '+91 1098765432' },
    { name: 'Pooja Shah', phone: '+91 9988776655' },
    { name: 'Mom', phone: '+91 9123456789' },
    { name: 'Dad', phone: '+91 9876543210' },
    { name: 'Office', phone: '+91 40 12345678' },
    { name: 'Cab Driver', phone: '+91 9876543211' },
    { name: 'Milkman', phone: '+91 9876543212' },
  ];
  
  return contacts.map((contact, index) => ({
    id: `UPI${1000 + index}`,
    name: contact.name,
    upiId: `${contact.name.toLowerCase().replace(' ', '.')}@travelbank`,
    phone: contact.phone,
    avatar: `https://i.pravatar.cc/150?u=${index}`,
  }));
};

// Generate mock bills
export const generateBills = (): Bill[] => {
  const providers = {
    electricity: ['BSES', 'Tata Power', 'Maharashtra State Electricity', 'KSEB', 'PSPCL'],
    water: ['Delhi Jal Board', 'MWSSB', 'BMC', 'UWSC'],
    gas: ['GAIL', 'Indraprastha Gas', 'Mahanagar Gas'],
    mobile: ['Airtel', 'Jio', 'Vi', 'BSNL'],
    dth: ['Dish TV', 'Tata Sky', 'Sun Direct', 'Airtel Digital'],
    internet: ['Airtel', 'JioFiber', 'ACT', 'Spectra'],
  };
  
  const bills: Bill[] = [];
  
  Object.keys(providers).forEach((category) => {
    const categoryProviders = providers[category as keyof typeof providers];
    categoryProviders.forEach((provider, index) => {
      const isPaid = Math.random() > 0.4;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) - 15);
      
      bills.push({
        id: `BILL${category.substring(0, 3).toUpperCase()}${100 + index}`,
        category: category as Bill['category'],
        provider,
        accountNumber: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        amount: Math.floor(Math.random() * 5000) + 200,
        dueDate: dueDate.toISOString().split('T')[0],
        status: isPaid ? 'paid' : dueDate < new Date() ? 'overdue' : 'pending',
        billDate: new Date(dueDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        consumerName: 'John Doe',
      });
    });
  });
  
  return bills;
};

// Generate mock investments
export const generateInvestments = (): Investment[] => {
  const investments: Investment[] = [];
  
  // Fixed Deposits
  for (let i = 0; i < 5; i++) {
    const amount = Math.floor(Math.random() * 500000) + 50000;
    const tenure = Math.floor(Math.random() * 60) + 6;
    const rate = Math.random() * 3 + 5;
    const maturityAmount = amount + (amount * rate * tenure) / 1200;
    
    investments.push({
      id: `INVFD${100 + i}`,
      type: 'fd',
      name: `FD ${i + 1}`,
      amount,
      returns: maturityAmount - amount,
      returnsPercent: ((maturityAmount - amount) / amount) * 100,
      purchaseDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currentValue: maturityAmount,
      maturityDate: new Date(Date.now() + tenure * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tenure,
      rate,
    });
  }
  
  // Gold
  investments.push({
    id: 'INVGLD001',
    type: 'gold',
    name: 'Gold Savings',
    amount: 250000,
    returns: 35000,
    returnsPercent: 14,
    purchaseDate: '2023-01-15',
    currentValue: 285000,
  });
  
  return investments;
};

// Generate mutual funds
export const generateMutualFunds = (): MutualFund[] => {
  const funds = [
    { name: 'HDFC Top 100 Fund', category: 'Large Cap' },
    { name: 'ICICI Prudential Bluechip Fund', category: 'Large Cap' },
    { name: 'Mirae Asset Large Cap Fund', category: 'Large Cap' },
    { name: 'Axis Bluechip Fund', category: 'Large Cap' },
    { name: 'SBI Small Cap Fund', category: 'Small Cap' },
    { name: 'Kotak Small Cap Fund', category: 'Small Cap' },
    { name: 'Nippon India Small Cap', category: 'Small Cap' },
    { name: 'HDFC Mid Cap Fund', category: 'Mid Cap' },
    { name: 'L&T Mid Cap Fund', category: 'Mid Cap' },
    { name: 'Aditya Birla Sun Life Midcap', category: 'Mid Cap' },
    { name: 'DSP Tax Saver Fund', category: 'ELSS' },
    { name: 'Axis Long Term Equity Fund', category: 'ELSS' },
    { name: 'HDFC Hybrid Equity Fund', category: 'Hybrid' },
    { name: 'ICICI Prudential All Season Bond', category: 'Debt' },
    { name: 'Kotak Dynamic Bond Fund', category: 'Debt' },
  ];
  
  return funds.map((fund, index) => {
    const nav = Math.random() * 500 + 100;
    const investedAmount = Math.floor(Math.random() * 500000) + 10000;
    const units = investedAmount / nav;
    const currentNav = nav * (1 + (Math.random() * 0.4 - 0.1));
    const currentValue = units * currentNav;
    const returns = currentValue - investedAmount;
    
    return {
      id: `MF${100 + index}`,
      name: fund.name,
      nav,
      units,
      investedAmount,
      currentValue,
      returns,
      returnsPercent: (returns / investedAmount) * 100,
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      category: fund.category,
    };
  });
};

// Generate gold holdings
export const generateGoldHoldings = (): GoldHolding[] => {
  return [
    {
      id: 'GLD001',
      grams: 50,
      buyPrice: 5200,
      currentPrice: 6100,
      currentValue: 305000,
      returns: 45000,
      purchaseDate: '2022-06-15',
    },
    {
      id: 'GLD002',
      grams: 100,
      buyPrice: 5400,
      currentPrice: 6100,
      currentValue: 610000,
      returns: 70000,
      purchaseDate: '2023-01-10',
    },
  ];
};

// Generate mock bookings
export const generateBookings = (count: number = 20): Booking[] => {
  const bookings: Booking[] = [];
  const flights = generateFlights(10);
  const hotels = generateHotels(10);
  const trains = generateTrains(10);
  
  for (let i = 0; i < count; i++) {
    const type = ['flight', 'hotel', 'train'][Math.floor(Math.random() * 3)] as 'flight' | 'hotel' | 'train';
    const status = ['confirmed', 'cancelled', 'completed', 'pending'][Math.floor(Math.random() * 4)] as 'confirmed' | 'cancelled' | 'completed' | 'pending';
    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() - Math.floor(Math.random() * 90));
    
    let details: Booking['details'];
    let totalAmount: number;
    
    switch (type) {
      case 'flight':
        details = flights[Math.floor(Math.random() * flights.length)];
        totalAmount = (details as Flight).price * (Math.floor(Math.random() * 3) + 1);
        break;
      case 'hotel':
        details = hotels[Math.floor(Math.random() * hotels.length)];
        totalAmount = (details as Hotel).price * (Math.floor(Math.random() * 5) + 1);
        break;
      case 'train':
        details = trains[Math.floor(Math.random() * trains.length)];
        totalAmount = (details as Train).price * (Math.floor(Math.random() * 4) + 1);
        break;
    }
    
    bookings.push({
      id: `BK${100000 + i}`,
      type,
      status,
      bookingDate: bookingDate.toISOString().split('T')[0],
      travelDate: generateRandomDate(60),
      details,
      totalAmount,
      paymentMethod: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking'][Math.floor(Math.random() * 4)],
      pnr: type === 'flight' || type === 'train' ? Math.random().toString(36).substring(2, 8).toUpperCase() : undefined,
    });
  }
  
  return bookings.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
};

// Generate a mock passenger
export const generatePassenger = (): Passenger => {
  return {
    id: generateId(),
    firstName: ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emma'][Math.floor(Math.random() * 6)],
    lastName: ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 6)],
    email: `user${Math.floor(Math.random() * 10000)}@example.com`,
    phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    dateOfBirth: '1990-01-01',
    nationality: 'Indian',
  };
};

// Simulate loading delay
export const simulateLoading = (ms: number = 1500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Mock AI responses
export const mockAIResponses = [
  "Based on your travel history, I'd recommend checking out the flights to Goa this weekend - prices are currently very competitive!",
  "I see you've been looking at hotels in Delhi. Would you like me to notify you when prices drop?",
  "Your account balance is healthy! Consider investing in a Fixed Deposit for better returns.",
  "I noticed a bill is due in 3 days. Would you like me to set up an automatic payment?",
  "The best time to book flights for your next trip to Mumbai would be 2 weeks in advance.",
  "You have an upcoming flight booking. Would you like me to send you a reminder?",
  "Your credit card bill of ₹15,000 is due in 5 days. Would you like to pay it now?",
  "Based on your spending patterns, you might want to consider a travel card for your next trip.",
  "I've found some great deals on hotels in Bangalore for your travel dates!",
  "Your investment portfolio is up 12% this month. Great job!",
];

export const getRandomAIResponse = (): string => {
  return mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)];
};
