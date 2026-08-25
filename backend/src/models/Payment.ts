import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  paymentId: string;
  bookingId: mongoose.Types.ObjectId;
  traderId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'Pending' | 'Successful' | 'Failed' | 'Refunded';
  paymentMethod: string;
  transactionRef: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    paymentId: { type: String, required: true, unique: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    traderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['Pending', 'Successful', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    paymentMethod: { type: String, default: 'Simulated Card/UPI' },
    transactionRef: { type: String, required: true },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
