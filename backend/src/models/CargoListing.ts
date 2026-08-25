import mongoose, { Schema, Document } from 'mongoose';
import { TransportMode } from './ProviderProfile';

export type ContainerType = '20 FT' | '40 FT' | '40 FT High Cube' | 'Other';
export type CargoListingStatus = 'Available' | 'Fully Booked' | 'Cancelled' | 'Completed';

export interface ICargoListing extends Document {
  providerId: mongoose.Types.ObjectId;
  providerName: string;
  providerRating: number;
  isVerifiedProvider: boolean;
  transportMode: TransportMode;
  containerType: ContainerType;
  containerNumber: string;
  origin: string;
  destination: string;
  departureDate: Date;
  estimatedArrival: Date;
  pickupLocation: string;
  totalWeightCapacity: number; // in KG
  availableWeight: number; // in KG
  totalVolumeCapacity: number; // in CBM
  availableVolume: number; // in CBM
  pricePerKg: number; // in INR / local currency
  pricePerCbm: number;
  acceptedCargoType: string;
  status: CargoListingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const CargoListingSchema = new Schema<ICargoListing>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: 'ProviderProfile', required: true },
    providerName: { type: String, required: true },
    providerRating: { type: Number, default: 4.8 },
    isVerifiedProvider: { type: Boolean, default: true },
    transportMode: { type: String, enum: ['Road', 'Rail', 'Sea', 'Air', 'Multimodal'], required: true },
    containerType: { type: String, enum: ['20 FT', '40 FT', '40 FT High Cube', 'Other'], required: true },
    containerNumber: { type: String, required: true, trim: true },
    origin: { type: String, required: true, trim: true, index: true },
    destination: { type: String, required: true, trim: true, index: true },
    departureDate: { type: Date, required: true, index: true },
    estimatedArrival: { type: Date, required: true },
    pickupLocation: { type: String, required: true, trim: true },
    totalWeightCapacity: { type: Number, required: true, min: 0 },
    availableWeight: { type: Number, required: true, min: 0 },
    totalVolumeCapacity: { type: Number, required: true, min: 0 },
    availableVolume: { type: Number, required: true, min: 0 },
    pricePerKg: { type: Number, required: true, min: 0 },
    pricePerCbm: { type: Number, required: true, min: 0 },
    acceptedCargoType: { type: String, required: true, trim: true, default: 'General Cargo' },
    status: {
      type: String,
      enum: ['Available', 'Fully Booked', 'Cancelled', 'Completed'],
      default: 'Available',
    },
  },
  { timestamps: true }
);

export const CargoListing = mongoose.model<ICargoListing>('CargoListing', CargoListingSchema);
