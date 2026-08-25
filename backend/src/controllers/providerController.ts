import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { ProviderProfile } from '../models/ProviderProfile';
import { ProviderDocument } from '../models/ProviderDocument';
import { CargoListing } from '../models/CargoListing';
import { Booking } from '../models/Booking';
import { Payment } from '../models/Payment';
import { AuditLog } from '../models/AuditLog';

export const getProviderProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'PROVIDER') {
      res.status(403).json({ success: false, message: 'Access denied. Provider role required.' });
      return;
    }

    const provider = await ProviderProfile.findOne({ userId: req.user._id });
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const documents = await ProviderDocument.find({ providerId: provider._id });
    const activeCargo = await CargoListing.countDocuments({ providerId: provider._id, status: 'Available' });
    const totalBookings = await Booking.countDocuments({ providerId: provider._id });
    const pendingBookings = await Booking.countDocuments({ providerId: provider._id, bookingStatus: 'Pending' });

    // Calculate total earnings
    const providerBookings = await Booking.find({ providerId: provider._id, paymentStatus: 'Successful' }).select('_id priceSummary');
    const totalRevenue = providerBookings.reduce((sum, b) => sum + (b.priceSummary?.baseFreight || 0), 0);

    // Calculate capacity utilization rate
    const listings = await CargoListing.find({ providerId: provider._id });
    let totalCap = 0;
    let bookedCap = 0;
    listings.forEach((l) => {
      totalCap += l.totalWeightCapacity;
      bookedCap += l.totalWeightCapacity - l.availableWeight;
    });
    const utilizationRate = totalCap > 0 ? Math.round((bookedCap / totalCap) * 100) : 0;

    res.json({
      success: true,
      provider,
      documents,
      stats: {
        activeCargoSpace: activeCargo,
        totalBookings,
        pendingBookings,
        revenue: totalRevenue,
        utilizationRate,
        customerRating: provider.rating,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching provider profile.' });
  }
};

export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'PROVIDER') {
      res.status(403).json({ success: false, message: 'Only providers can upload documents.' });
      return;
    }

    const provider = await ProviderProfile.findOne({ userId: req.user._id });
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const { documentType } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ success: false, message: 'Please attach a document file.' });
      return;
    }

    const doc = await ProviderDocument.create({
      providerId: provider._id,
      documentType,
      fileUrl: `/uploads/${file.filename}`,
      originalName: file.originalname,
      status: 'Pending',
    });

    // Update provider application status if documents were pending
    if (provider.verificationStatus === 'Pending') {
      provider.verificationStatus = 'Under Review';
      await provider.save();
    }

    await AuditLog.create({
      userId: req.user._id,
      userRole: 'PROVIDER',
      action: 'UPLOAD_DOCUMENT',
      targetResource: 'ProviderDocument',
      details: `Uploaded document ${documentType}: ${file.originalname}`,
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully.',
      document: doc,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error uploading document.' });
  }
};

export const getDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const provider = await ProviderProfile.findOne({ userId: req.user?._id });
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const documents = await ProviderDocument.find({ providerId: provider._id });
    res.json({ success: true, documents });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching documents.' });
  }
};
