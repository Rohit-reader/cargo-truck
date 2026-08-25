import mongoose, { Schema, Document } from 'mongoose';

export type TransportMode = 'Road' | 'Rail' | 'Sea' | 'Air' | 'Multimodal';
export type VerificationStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Suspended';

export interface IProviderProfile extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
  contactPerson: string;
  businessAddress: string;
  city: string;
  state: string;
  country: string;
  transportModes: TransportMode[];
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  dataQualityScore: number; // 0-100
  rating: number; // e.g. 4.8
  totalReviews: number;
  totalCompletedShipments: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderProfileSchema = new Schema<IProviderProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    businessAddress: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'India' },
    transportModes: [{ type: String, enum: ['Road', 'Rail', 'Sea', 'Air', 'Multimodal'], required: true }],
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Suspended'],
      default: 'Pending',
    },
    rejectionReason: { type: String },
    dataQualityScore: { type: Number, default: 85, min: 0, max: 100 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    totalCompletedShipments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ProviderProfile = mongoose.model<IProviderProfile>('ProviderProfile', ProviderProfileSchema);
