import mongoose, { Schema, Document } from 'mongoose';

export type DocumentType = 'Business Registration' | 'GST Certificate' | 'PAN' | 'Transport License' | 'Address Proof';

export interface IProviderDocument extends Document {
  providerId: mongoose.Types.ObjectId;
  documentType: DocumentType;
  fileUrl: string;
  originalName: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  uploadedAt: Date;
}

const ProviderDocumentSchema = new Schema<IProviderDocument>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: 'ProviderProfile', required: true },
    documentType: {
      type: String,
      enum: ['Business Registration', 'GST Certificate', 'PAN', 'Transport License', 'Address Proof'],
      required: true,
    },
    fileUrl: { type: String, required: true },
    originalName: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ProviderDocument = mongoose.model<IProviderDocument>('ProviderDocument', ProviderDocumentSchema);
