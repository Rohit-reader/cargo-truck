import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'TRADER' | 'PROVIDER' | 'ADMIN';

export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  phone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['TRADER', 'PROVIDER', 'ADMIN'], required: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
