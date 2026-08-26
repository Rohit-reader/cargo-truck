import mongoose, { Schema, Document } from 'mongoose';
import { TransportMode } from './ProviderProfile';

export interface ITraderRequest extends Document {
  traderId: mongoose.Types.ObjectId;
  traderName: string;
  traderEmail: string;
  origin: string;
  destination: string;
  transportMode?: TransportMode | 'All';
  weightKg: number;
  volumeCbm: number;
  cargoType: string;
  targetDepartureDate: Date;
  status: 'Pending' | 'Matched' | 'Booked' | 'Offered';
  offeredListingId?: mongoose.Types.ObjectId;
  offeredPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

const TraderRequestSchema = new Schema<ITraderRequest>(
  {
    traderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    traderName: { type: String, required: true },
    traderEmail: { type: String, required: true },
    origin: { type: String, required: true, trim: true, index: true },
    destination: { type: String, required: true, trim: true, index: true },
    transportMode: { type: String, default: 'All' },
    weightKg: { type: Number, required: true, min: 1 },
    volumeCbm: { type: Number, required: true, min: 1 },
    cargoType: { type: String, default: 'General Cargo' },
    targetDepartureDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Matched', 'Booked', 'Offered'],
      default: 'Pending',
    },
    offeredListingId: { type: Schema.Types.ObjectId, ref: 'CargoListing' },
    offeredPrice: { type: Number },
  },
  { timestamps: true }
);

export const TraderRequest = mongoose.model<ITraderRequest>('TraderRequest', TraderRequestSchema);
