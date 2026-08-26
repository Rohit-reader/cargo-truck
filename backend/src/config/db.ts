import mongoose from 'mongoose';
import dns from 'dns';

export const connectDB = async (): Promise<void> => {
  try {
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (dnsErr) {
      console.warn('[MongoDB] Custom DNS set failed:', dnsErr);
    }

    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartcargo';
    await mongoose.connect(connStr);
    console.log(`[MongoDB] Connected successfully`);
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    process.exit(1);
  }
};

