import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { ProviderProfile } from '../models/ProviderProfile';
import { ProviderDocument } from '../models/ProviderDocument';
import { User } from '../models/User';
import { CargoListing } from '../models/CargoListing';
import { Booking } from '../models/Booking';
import { Payment } from '../models/Payment';
import { AuditLog } from '../models/AuditLog';

export const getProviderApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const providers = await ProviderProfile.find().sort({ createdAt: -1 });

    const results = await Promise.all(
      providers.map(async (provider) => {
        const user = await User.findById(provider.userId).select('email phone fullName');
        const documents = await ProviderDocument.find({ providerId: provider._id });
        return {
          ...provider.toObject(),
          userEmail: user?.email,
          userPhone: user?.phone,
          documents,
        };
      })
    );

    res.json({
      success: true,
      count: results.length,
      providers: results,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching applications.' });
  }
};

export const approveProvider = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const provider = await ProviderProfile.findById(req.params.id);
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider application not found.' });
      return;
    }

    provider.verificationStatus = 'Approved';
    provider.rejectionReason = undefined;
    await provider.save();

    // Verify documents
    await ProviderDocument.updateMany({ providerId: provider._id }, { status: 'Verified' });

    await AuditLog.create({
      userId: req.user?._id,
      userRole: 'ADMIN',
      action: 'APPROVE_PROVIDER',
      targetResource: 'ProviderProfile',
      details: `Approved provider application for ${provider.companyName}`,
    });

    res.json({
      success: true,
      message: `Provider '${provider.companyName}' has been Approved successfully.`,
      provider,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error approving provider.' });
  }
};

export const rejectProvider = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reason } = req.body;
    const provider = await ProviderProfile.findById(req.params.id);
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider application not found.' });
      return;
    }

    provider.verificationStatus = 'Rejected';
    provider.rejectionReason = reason || 'Documentation incomplete or invalid.';
    await provider.save();

    await AuditLog.create({
      userId: req.user?._id,
      userRole: 'ADMIN',
      action: 'REJECT_PROVIDER',
      targetResource: 'ProviderProfile',
      details: `Rejected provider application for ${provider.companyName}. Reason: ${provider.rejectionReason}`,
    });

    res.json({
      success: true,
      message: `Provider '${provider.companyName}' application rejected.`,
      provider,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error rejecting provider.' });
  }
};

export const suspendProvider = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const provider = await ProviderProfile.findById(req.params.id);
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    provider.verificationStatus = 'Suspended';
    await provider.save();

    // Also disable cargo listings
    await CargoListing.updateMany({ providerId: provider._id }, { status: 'Cancelled' });

    await AuditLog.create({
      userId: req.user?._id,
      userRole: 'ADMIN',
      action: 'SUSPEND_PROVIDER',
      targetResource: 'ProviderProfile',
      details: `Suspended provider account: ${provider.companyName}`,
    });

    res.json({
      success: true,
      message: `Provider '${provider.companyName}' suspended.`,
      provider,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error suspending provider.' });
  }
};

export const getPlatformAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalTraders = await User.countDocuments({ role: 'TRADER' });
    const totalProviders = await User.countDocuments({ role: 'PROVIDER' });
    const pendingApplications = await ProviderProfile.countDocuments({ verificationStatus: { $in: ['Pending', 'Under Review'] } });
    const approvedProviders = await ProviderProfile.countDocuments({ verificationStatus: 'Approved' });
    const activeCargoSpace = await CargoListing.countDocuments({ status: 'Available' });
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ bookingStatus: { $ne: 'Cancelled' } });
    const totalPayments = await Payment.countDocuments({ status: 'Successful' });

    const payments = await Payment.find({ status: 'Successful' });
    const platformRevenue = payments.reduce((sum, p) => sum + p.amount * 0.05, 0); // 5% fee
    const grossFreightVolume = payments.reduce((sum, p) => sum + p.amount, 0);

    // Calculate capacity utilization
    const listings = await CargoListing.find();
    let totalWeight = 0;
    let bookedWeight = 0;
    listings.forEach((l) => {
      totalWeight += l.totalWeightCapacity;
      bookedWeight += l.totalWeightCapacity - l.availableWeight;
    });
    const avgUtilization = totalWeight > 0 ? Math.round((bookedWeight / totalWeight) * 100) : 0;

    // Popular routes breakdown
    const bookings = await Booking.find();
    const routeCounts: { [key: string]: number } = {};
    bookings.forEach((b) => {
      const key = `${b.route.origin} → ${b.route.destination}`;
      routeCounts[key] = (routeCounts[key] || 0) + 1;
    });
    const popularRoutes = Object.entries(routeCounts)
      .map(([route, count]) => ({ route, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalTraders,
        totalProviders,
        pendingApplications,
        approvedProviders,
        activeCargoSpace,
        totalBookings,
        activeBookings,
        totalPayments,
        grossFreightVolume,
        platformRevenue: Math.round(platformRevenue),
        avgUtilization,
      },
      popularRoutes,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching analytics.' });
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: logs.length, logs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching audit logs.' });
  }
};

export const getAllTraders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const traders = await User.find({ role: 'TRADER' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: traders.length, traders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching traders.' });
  }
};
