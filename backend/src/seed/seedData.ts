import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { TraderProfile } from '../models/TraderProfile';
import { ProviderProfile } from '../models/ProviderProfile';
import { ProviderDocument } from '../models/ProviderDocument';
import { CargoListing } from '../models/CargoListing';
import { Booking } from '../models/Booking';
import { Payment } from '../models/Payment';
import { Conversation, Message } from '../models/Conversation';
import { AuditLog } from '../models/AuditLog';
import { TraderRequest } from '../models/TraderRequest';

dotenv.config();

export const seedDatabase = async (forceClear: boolean = false) => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartcargo';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(connStr);
    }

    const existingUsers = await User.countDocuments();
    if (existingUsers > 0 && !forceClear) {
      // Check if admin@gmail.com exists; if not, force clear & seed
      const adminExists = await User.findOne({ email: 'admin@gmail.com' });
      if (adminExists) {
        console.log('[Seed] Database already contains updated seed data. Skipping auto-seed.');
        return;
      }
    }

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await TraderProfile.deleteMany({});
    await ProviderProfile.deleteMany({});
    await ProviderDocument.deleteMany({});
    await CargoListing.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    await AuditLog.deleteMany({});
    await TraderRequest.deleteMany({});

    console.log('[Seed] Creating demo users...');
    const defaultPassword = await bcrypt.hash('12345', 10);

    // 1. Admin Account
    const adminUser = await User.create({
      email: 'admin@gmail.com',
      password: defaultPassword,
      role: 'ADMIN',
      fullName: 'System Administrator',
      phone: '+919876543210',
    });

    // 2. Trader Account
    const traderUser = await User.create({
      email: 'trader@gmail.com',
      password: defaultPassword,
      role: 'TRADER',
      fullName: 'Rajesh Kumar',
      phone: '+919840123456',
    });

    const traderProfile = await TraderProfile.create({
      userId: traderUser._id,
      companyName: 'Apex Global Exports',
      traderType: 'Exporter',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      gstNumber: '33AAAAA0000A1Z5',
      iecCode: '0405060708',
    });

    // 3. Approved Provider Account
    const providerUser = await User.create({
      email: 'provider@gmail.com',
      password: defaultPassword,
      role: 'PROVIDER',
      fullName: 'Vikram Seth',
      phone: '+919444112233',
    });

    const providerProfile = await ProviderProfile.create({
      userId: providerUser._id,
      companyName: 'Chennai Ocean Logistics',
      contactPerson: 'Vikram Seth',
      businessAddress: 'Harbour Maritime House, Rajaji Salai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      transportModes: ['Sea', 'Road', 'Multimodal'],
      verificationStatus: 'Approved',
      dataQualityScore: 94,
      rating: 4.8,
      totalReviews: 28,
      totalCompletedShipments: 142,
    });

    await ProviderDocument.create({
      providerId: providerProfile._id,
      documentType: 'Business Registration',
      fileUrl: '/uploads/demo-biz-reg.pdf',
      originalName: 'ChennaiOceanLogistics_Reg.pdf',
      status: 'Verified',
    });

    await ProviderDocument.create({
      providerId: providerProfile._id,
      documentType: 'GST Certificate',
      fileUrl: '/uploads/demo-gst.pdf',
      originalName: 'GST_Certificate_2026.pdf',
      status: 'Verified',
    });

    // 4. Pending Provider Account (for testing Admin review flow)
    const pendingProviderUser = await User.create({
      email: 'pending_provider@gmail.com',
      password: defaultPassword,
      role: 'PROVIDER',
      fullName: 'Sanjay Patel',
      phone: '+919822001122',
    });

    const pendingProviderProfile = await ProviderProfile.create({
      userId: pendingProviderUser._id,
      companyName: 'Express Cargo Lines',
      contactPerson: 'Sanjay Patel',
      businessAddress: '102 Transport Hub, GIDC',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      transportModes: ['Road', 'Rail'],
      verificationStatus: 'Under Review',
      dataQualityScore: 78,
      rating: 4.2,
      totalReviews: 5,
    });

    await ProviderDocument.create({
      providerId: pendingProviderProfile._id,
      documentType: 'Transport License',
      fileUrl: '/uploads/demo-transport-license.pdf',
      originalName: 'Gujarat_Transport_License.pdf',
      status: 'Pending',
    });

    console.log('[Seed] Creating sample cargo listings...');
    const now = new Date();
    const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 86400000);

    const cargoListingsData = [
      {
        providerId: providerProfile._id,
        providerName: providerProfile.companyName,
        providerRating: 4.8,
        isVerifiedProvider: true,
        transportMode: 'Sea',
        containerType: '20 FT',
        containerNumber: 'MSCU-902144-8',
        origin: 'Chennai',
        destination: 'Dubai',
        departureDate: addDays(now, 5),
        estimatedArrival: addDays(now, 12),
        pickupLocation: 'Chennai Port Container Freight Station',
        totalWeightCapacity: 18000,
        availableWeight: 12000,
        totalVolumeCapacity: 38,
        availableVolume: 32,
        pricePerKg: 45,
        pricePerCbm: 1200,
        acceptedCargoType: 'Textiles, Engineering Goods, General Goods',
        status: 'Available',
      },
      {
        providerId: providerProfile._id,
        providerName: providerProfile.companyName,
        providerRating: 4.8,
        isVerifiedProvider: true,
        transportMode: 'Sea',
        containerType: '40 FT',
        containerNumber: 'CMAU-110842-1',
        origin: 'Chennai',
        destination: 'Singapore',
        departureDate: addDays(now, 8),
        estimatedArrival: addDays(now, 14),
        pickupLocation: 'Kattupalli Port Terminal',
        totalWeightCapacity: 26000,
        availableWeight: 22000,
        totalVolumeCapacity: 67,
        availableVolume: 55,
        pricePerKg: 60,
        pricePerCbm: 1500,
        acceptedCargoType: 'Electronics, Automotive Parts, Garments',
        status: 'Available',
      },
      {
        providerId: providerProfile._id,
        providerName: providerProfile.companyName,
        providerRating: 4.8,
        isVerifiedProvider: true,
        transportMode: 'Sea',
        containerType: '20 FT',
        containerNumber: 'MEDU-440219-3',
        origin: 'Chennai',
        destination: 'Colombo',
        departureDate: addDays(now, 3),
        estimatedArrival: addDays(now, 6),
        pickupLocation: 'Chennai Port Gate 10',
        totalWeightCapacity: 15000,
        availableWeight: 8500,
        totalVolumeCapacity: 33,
        availableVolume: 25,
        pricePerKg: 35,
        pricePerCbm: 950,
        acceptedCargoType: 'Agricultural Products, Spices, Hardware',
        status: 'Available',
      },
      {
        providerId: providerProfile._id,
        providerName: providerProfile.companyName,
        providerRating: 4.8,
        isVerifiedProvider: true,
        transportMode: 'Rail',
        containerType: '40 FT High Cube',
        containerNumber: 'CONCOR-77102-R',
        origin: 'Chennai',
        destination: 'Mumbai',
        departureDate: addDays(now, 2),
        estimatedArrival: addDays(now, 5),
        pickupLocation: 'ICD Tondiarpet Rail Terminal',
        totalWeightCapacity: 24000,
        availableWeight: 15000,
        totalVolumeCapacity: 76,
        availableVolume: 40,
        pricePerKg: 18,
        pricePerCbm: 500,
        acceptedCargoType: 'Industrial Components, Consumer Goods',
        status: 'Available',
      },
      {
        providerId: providerProfile._id,
        providerName: providerProfile.companyName,
        providerRating: 4.8,
        isVerifiedProvider: true,
        transportMode: 'Road',
        containerType: 'Other',
        containerNumber: 'TN-01-AX-9912',
        origin: 'Coimbatore',
        destination: 'Chennai',
        departureDate: addDays(now, 1),
        estimatedArrival: addDays(now, 2),
        pickupLocation: 'Peelamedu Industrial Estate',
        totalWeightCapacity: 12000,
        availableWeight: 9000,
        totalVolumeCapacity: 35,
        availableVolume: 28,
        pricePerKg: 12,
        pricePerCbm: 350,
        acceptedCargoType: 'Cotton Yarn, Machinery Parts',
        status: 'Available',
      },
      {
        providerId: providerProfile._id,
        providerName: providerProfile.companyName,
        providerRating: 4.8,
        isVerifiedProvider: true,
        transportMode: 'Road',
        containerType: '20 FT',
        containerNumber: 'KA-03-MK-4001',
        origin: 'Bangalore',
        destination: 'Chennai',
        departureDate: addDays(now, 2),
        estimatedArrival: addDays(now, 3),
        pickupLocation: 'Hosur Logistics Park Gate 2',
        totalWeightCapacity: 14000,
        availableWeight: 11000,
        totalVolumeCapacity: 34,
        availableVolume: 30,
        pricePerKg: 14,
        pricePerCbm: 400,
        acceptedCargoType: 'Precision Goods, Electrical Components',
        status: 'Available',
      },
    ];

    const seededListings = await CargoListing.insertMany(cargoListingsData);

    console.log('[Seed] Creating sample booking...');
    const firstListing = seededListings[0];

    const sampleBooking = await Booking.create({
      bookingNumber: 'SCS-BK-882190-1044',
      traderId: traderUser._id,
      traderName: traderUser.fullName,
      traderEmail: traderUser.email,
      cargoListingId: firstListing._id,
      providerId: providerProfile._id,
      providerName: providerProfile.companyName,
      route: {
        origin: firstListing.origin,
        destination: firstListing.destination,
        departureDate: firstListing.departureDate,
        estimatedArrival: firstListing.estimatedArrival,
        transportMode: firstListing.transportMode,
        containerNumber: firstListing.containerNumber,
      },
      cargoDetails: {
        cargoType: 'Garments & Handloom Goods',
        description: 'Cotton garments packed in 80 corrugated cartons',
        weightKg: 2000,
        volumeCbm: 6,
        numberOfPackages: 80,
        dimensions: '120x80x100 cm per pallet',
      },
      pickupDetails: {
        pickupAddress: 'Plot 45, Guindy Industrial Estate, Chennai 600032',
        pickupDate: addDays(now, 4),
        specialInstructions: 'Handle with care. Keep away from moisture.',
      },
      priceSummary: {
        baseFreight: 90000,
        platformFee: 4500,
        taxes: 17010,
        totalAmount: 111510,
      },
      paymentStatus: 'Successful',
      bookingStatus: 'Confirmed',
      statusHistory: [
        {
          status: 'Pending',
          updatedAt: addDays(now, -2),
          updatedBy: traderUser.fullName,
          note: 'Booking requested.',
        },
        {
          status: 'Confirmed',
          updatedAt: addDays(now, -2),
          updatedBy: traderUser.fullName,
          note: 'Payment of ₹1,11,510 received. Booking confirmed.',
        },
      ],
    });

    await Payment.create({
      paymentId: 'PAY-882190',
      bookingId: sampleBooking._id,
      traderId: traderUser._id,
      amount: 111510,
      currency: 'INR',
      status: 'Successful',
      paymentMethod: 'Simulated Card Payment',
      transactionRef: 'TXN-998822110',
      paidAt: addDays(now, -2),
    });

    const sampleConversation = await Conversation.create({
      bookingId: sampleBooking._id,
      traderId: traderUser._id,
      providerUserId: providerUser._id,
      lastMessage: 'Your cargo pickup has been scheduled for Thursday morning.',
      lastMessageAt: addDays(now, -1),
      unreadCountTrader: 0,
      unreadCountProvider: 0,
    });

    await Message.create({
      conversationId: sampleConversation._id,
      bookingId: sampleBooking._id,
      senderId: traderUser._id,
      senderName: traderUser.fullName,
      senderRole: 'TRADER',
      text: 'Hello, please confirm if 80 cartons can be picked up from our Guindy warehouse.',
      createdAt: addDays(now, -2),
    });

    await Message.create({
      conversationId: sampleConversation._id,
      bookingId: sampleBooking._id,
      senderId: providerUser._id,
      senderName: providerUser.fullName,
      senderRole: 'PROVIDER',
      text: 'Your cargo pickup has been scheduled for Thursday morning. Our vehicle driver will contact you prior to arrival.',
      createdAt: addDays(now, -1),
    });

    await AuditLog.create({
      userId: adminUser._id,
      userRole: 'ADMIN',
      action: 'SYSTEM_SEED',
      targetResource: 'System',
      details: 'Initial database seeding completed with updated credentials.',
    });

    console.log('[Seed] Seeding sample trader requests for container optimization...');
    await TraderRequest.create([
      {
        traderId: traderUser._id,
        traderName: traderUser.fullName,
        traderEmail: traderUser.email,
        origin: 'Chennai',
        destination: 'Dubai',
        transportMode: 'Sea',
        weightKg: 2500,
        volumeCbm: 8,
        cargoType: 'Textiles & Leather Apparel',
        targetDepartureDate: addDays(now, 5),
        status: 'Pending',
      },
      {
        traderId: traderUser._id,
        traderName: traderUser.fullName,
        traderEmail: traderUser.email,
        origin: 'Chennai',
        destination: 'Dubai',
        transportMode: 'Sea',
        weightKg: 4000,
        volumeCbm: 12,
        cargoType: 'Automotive Precision Tools',
        targetDepartureDate: addDays(now, 5),
        status: 'Pending',
      },
      {
        traderId: traderUser._id,
        traderName: traderUser.fullName,
        traderEmail: traderUser.email,
        origin: 'Chennai',
        destination: 'Dubai',
        transportMode: 'Sea',
        weightKg: 3500,
        volumeCbm: 9,
        cargoType: 'Spices & Organic Tea',
        targetDepartureDate: addDays(now, 5),
        status: 'Pending',
      },
      {
        traderId: traderUser._id,
        traderName: traderUser.fullName,
        traderEmail: traderUser.email,
        origin: 'Chennai',
        destination: 'Singapore',
        transportMode: 'Sea',
        weightKg: 5000,
        volumeCbm: 14,
        cargoType: 'Electronic Hardware',
        targetDepartureDate: addDays(now, 8),
        status: 'Pending',
      },
      {
        traderId: traderUser._id,
        traderName: traderUser.fullName,
        traderEmail: traderUser.email,
        origin: 'Chennai',
        destination: 'Mumbai',
        transportMode: 'Rail',
        weightKg: 6000,
        volumeCbm: 18,
        cargoType: 'Industrial Valves',
        targetDepartureDate: addDays(now, 2),
        status: 'Pending',
      },
    ]);

    console.log('[Seed] Data seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('Credentials Created:');
    console.log('1. Admin:    admin@gmail.com    / 12345');
    console.log('2. Trader:   trader@gmail.com   / 12345');
    console.log('3. Provider: provider@gmail.com / 12345 (Approved)');
    console.log('4. Provider: pending_provider@gmail.com / 12345 (Pending)');
    console.log('----------------------------------------------------');
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
  }
};

// Run directly if invoked from CLI
if (require.main === module) {
  seedDatabase(true).then(() => mongoose.connection.close());
}
