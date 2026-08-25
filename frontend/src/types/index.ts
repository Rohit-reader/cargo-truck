export type UserRole = 'TRADER' | 'PROVIDER' | 'ADMIN';
export type TransportMode = 'Road' | 'Rail' | 'Sea' | 'Air' | 'Multimodal';
export type ContainerType = '20 FT' | '40 FT' | '40 FT High Cube' | 'Other';
export type VerificationStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Suspended';
export type BookingStatus = 'Pending' | 'Confirmed' | 'Cargo Pickup Scheduled' | 'Cargo Picked Up' | 'In Transit' | 'Arrived at Destination' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Successful' | 'Failed' | 'Refunded';

export interface IUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone: string;
  profile?: any;
}

export interface ITraderProfile {
  _id: string;
  userId: string;
  companyName: string;
  traderType: 'Exporter' | 'Importer' | 'Both';
  city: string;
  state: string;
  country: string;
  gstNumber?: string;
  iecCode?: string;
}

export interface IProviderProfile {
  _id: string;
  userId: string;
  companyName: string;
  contactPerson: string;
  businessAddress: string;
  city: string;
  state: string;
  country: string;
  transportModes: TransportMode[];
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  dataQualityScore: number;
  rating: number;
  totalReviews: number;
  totalCompletedShipments: number;
}

export interface ICargoListing {
  _id: string;
  providerId: string;
  providerName: string;
  providerRating: number;
  isVerifiedProvider: boolean;
  transportMode: TransportMode;
  containerType: ContainerType;
  containerNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  estimatedArrival: string;
  pickupLocation: string;
  totalWeightCapacity: number;
  availableWeight: number;
  totalVolumeCapacity: number;
  availableVolume: number;
  pricePerKg: number;
  pricePerCbm: number;
  acceptedCargoType: string;
  status: 'Available' | 'Fully Booked' | 'Cancelled' | 'Completed';
  createdAt: string;
}

export interface IBooking {
  _id: string;
  bookingNumber: string;
  traderId: string;
  traderName: string;
  traderEmail: string;
  cargoListingId: string;
  providerId: string;
  providerName: string;
  route: {
    origin: string;
    destination: string;
    departureDate: string;
    estimatedArrival: string;
    transportMode: string;
    containerNumber: string;
  };
  cargoDetails: {
    cargoType: string;
    description: string;
    weightKg: number;
    volumeCbm: number;
    numberOfPackages: number;
    dimensions?: string;
  };
  pickupDetails: {
    pickupAddress: string;
    pickupDate: string;
    specialInstructions?: string;
  };
  priceSummary: {
    baseFreight: number;
    platformFee: number;
    taxes: number;
    totalAmount: number;
  };
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  statusHistory: Array<{
    status: BookingStatus;
    updatedAt: string;
    updatedBy: string;
    note?: string;
  }>;
  createdAt: string;
}

export interface IPayment {
  _id: string;
  paymentId: string;
  bookingId: string;
  traderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  transactionRef: string;
  paidAt?: string;
  createdAt: string;
}

export interface IConversation {
  _id: string;
  bookingId: IBooking;
  traderId: string;
  providerUserId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCountTrader: number;
  unreadCountProvider: number;
}

export interface IMessage {
  _id: string;
  conversationId: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

export interface IAuditLog {
  _id: string;
  userId?: string;
  userRole?: string;
  action: string;
  targetResource: string;
  details: string;
  createdAt: string;
}
