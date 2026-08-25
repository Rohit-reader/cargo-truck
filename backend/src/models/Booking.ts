import mongoose, { Schema, Document } from 'mongoose';

export type PaymentStatus = 'Pending' | 'Successful' | 'Failed' | 'Refunded';
export type BookingStatus = 'Pending' | 'Confirmed' | 'Cargo Pickup Scheduled' | 'Cargo Picked Up' | 'In Transit' | 'Arrived at Destination' | 'Delivered' | 'Cancelled';

export interface IBooking extends Document {
  bookingNumber: string;
  traderId: mongoose.Types.ObjectId;
  traderName: string;
  traderEmail: string;
  cargoListingId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  providerName: string;
  route: {
    origin: string;
    destination: string;
    departureDate: Date;
    estimatedArrival: Date;
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
    pickupDate: Date;
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
    updatedAt: Date;
    updatedBy: string;
    note?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingNumber: { type: String, required: true, unique: true },
    traderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    traderName: { type: String, required: true },
    traderEmail: { type: String, required: true },
    cargoListingId: { type: Schema.Types.ObjectId, ref: 'CargoListing', required: true },
    providerId: { type: Schema.Types.ObjectId, ref: 'ProviderProfile', required: true },
    providerName: { type: String, required: true },
    route: {
      origin: { type: String, required: true },
      destination: { type: String, required: true },
      departureDate: { type: Date, required: true },
      estimatedArrival: { type: Date, required: true },
      transportMode: { type: String, required: true },
      containerNumber: { type: String, required: true },
    },
    cargoDetails: {
      cargoType: { type: String, required: true },
      description: { type: String, required: true },
      weightKg: { type: Number, required: true },
      volumeCbm: { type: Number, required: true },
      numberOfPackages: { type: Number, required: true },
      dimensions: { type: String },
    },
    pickupDetails: {
      pickupAddress: { type: String, required: true },
      pickupDate: { type: Date, required: true },
      specialInstructions: { type: String },
    },
    priceSummary: {
      baseFreight: { type: Number, required: true },
      platformFee: { type: Number, required: true },
      taxes: { type: Number, required: true },
      totalAmount: { type: Number, required: true },
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Successful', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    bookingStatus: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Cargo Pickup Scheduled',
        'Cargo Picked Up',
        'In Transit',
        'Arrived at Destination',
        'Delivered',
        'Cancelled',
      ],
      default: 'Pending',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now },
        updatedBy: { type: String, required: true },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
