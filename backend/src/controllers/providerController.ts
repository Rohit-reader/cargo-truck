import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { ProviderProfile } from '../models/ProviderProfile';
import { ProviderDocument } from '../models/ProviderDocument';
import { CargoListing } from '../models/CargoListing';
import { AuditLog } from '../models/AuditLog';
import { optimizeContainerFill } from '../services/containerOptimizationService';
import { TraderRequest } from '../models/TraderRequest';

export const getProviderProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await ProviderProfile.findOne({ userId: req.user?._id });
    if (!profile) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const documents = await ProviderDocument.find({ providerId: profile._id });

    res.json({
      success: true,
      profile,
      documents,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching provider profile.' });
  }
};

export const updateProviderProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let profile = await ProviderProfile.findOne({ userId: req.user?._id });
    if (!profile) {
      profile = new ProviderProfile({
        userId: req.user?._id,
        companyName: req.body.companyName || 'My Logistics Company',
        contactPerson: req.user?.fullName,
        city: req.body.city || 'Chennai',
        state: req.body.state || 'Tamil Nadu',
        country: 'India',
        businessAddress: req.body.businessAddress || 'Logistics Hub',
        transportModes: req.body.transportModes || ['Sea'],
      });
    }

    Object.assign(profile, req.body);
    await profile.save();

    res.json({
      success: true,
      message: 'Provider profile updated successfully.',
      profile,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error updating provider profile.' });
  }
};

export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await ProviderProfile.findOne({ userId: req.user?._id });
    if (!profile) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded.' });
      return;
    }

    const { documentType } = req.body;

    const document = await ProviderDocument.create({
      providerId: profile._id,
      documentType: documentType || 'Business Registration',
      fileUrl: `/uploads/${req.file.filename}`,
      originalName: req.file.originalname,
      status: 'Pending',
    });

    profile.verificationStatus = 'Under Review';
    await profile.save();

    await AuditLog.create({
      userId: req.user?._id,
      userRole: 'PROVIDER',
      action: 'UPLOAD_DOCUMENT',
      targetResource: 'ProviderDocument',
      details: `Uploaded ${document.documentType}: ${req.file.originalname}`,
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully and queued for verification.',
      document,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error uploading document.' });
  }
};

export const getMyCargoListings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await ProviderProfile.findOne({ userId: req.user?._id });
    if (!profile) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const listings = await CargoListing.find({ providerId: profile._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching provider cargo listings.' });
  }
};

// Fill My Container Optimization Endpoint
export const fillMyContainer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { listingId } = req.params;
    const listing = await CargoListing.findById(listingId);
    if (!listing) {
      res.status(404).json({ success: false, message: 'Container listing not found.' });
      return;
    }

    // Run container optimization service
    const optimizationResult = await optimizeContainerFill(listing);

    res.json({
      success: true,
      optimization: optimizationResult,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error optimizing container fill.' });
  }
};

// Send direct booking offer to trader request
export const sendCargoOffer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { requestId, listingId, offeredPrice } = req.body;

    const traderRequest = await TraderRequest.findById(requestId);
    if (!traderRequest) {
      res.status(404).json({ success: false, message: 'Trader request not found.' });
      return;
    }

    traderRequest.status = 'Offered';
    traderRequest.offeredListingId = listingId;
    traderRequest.offeredPrice = offeredPrice;
    await traderRequest.save();

    res.json({
      success: true,
      message: `Direct booking offer sent to trader ${traderRequest.traderName}.`,
      traderRequest,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error sending cargo offer.' });
  }
};
