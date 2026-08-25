import mongoose, { Schema, Document } from 'mongoose';

export type TraderType = 'Exporter' | 'Importer' | 'Both';

export interface ITraderProfile extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
  traderType: TraderType;
  city: string;
  state: string;
  country: string;
  gstNumber?: string;
  iecCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TraderProfileSchema = new Schema<ITraderProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true, trim: true },
    traderType: { type: String, enum: ['Exporter', 'Importer', 'Both'], default: 'Exporter' },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'India' },
    gstNumber: { type: String, trim: true },
    iecCode: { type: String, trim: true },
  },
  { timestamps: true }
);

export const TraderProfile = mongoose.model<ITraderProfile>('TraderProfile', TraderProfileSchema);
