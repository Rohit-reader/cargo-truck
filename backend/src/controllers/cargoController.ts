import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { CargoListing } from '../models/CargoListing';
import { ProviderProfile } from '../models/ProviderProfile';
import { AuditLog } from '../models/AuditLog';
import { calculateIntelligentMatch } from '../services/intelligentMatchingService';
import { TraderRequest } from '../models/TraderRequest';

export const getCargoListings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { origin, destination, transportMode, departureDate, minWeight, minVolume, sortBy } = req.query;

    const query: any = { status: 'Available' };

    if (origin) {
      query.origin = { $regex: new RegExp(origin as string, 'i') };
    }
    if (destination) {
      query.destination = { $regex: new RegExp(destination as string, 'i') };
    }
    if (transportMode && transportMode !== 'All') {
      query.transportMode = transportMode;
    }
    if (departureDate) {
      const parsedDate = new Date(departureDate as string);
      if (!isNaN(parsedDate.getTime())) {
        query.departureDate = { $gte: parsedDate };
      }
    }
    if (minWeight) {
      query.availableWeight = { $gte: Number(minWeight) };
    }
    if (minVolume) {
      query.availableVolume = { $gte: Number(minVolume) };
    }

    let sortOption: any = { departureDate: 1 };
    if (sortBy === 'price') {
      sortOption = { pricePerKg: 1 };
    } else if (sortBy === 'rating') {
      sortOption = { providerRating: -1 };
    } else if (sortBy === 'availableSpace') {
      sortOption = { availableWeight: -1 };
    } else if (sortBy === 'departure') {
      sortOption = { departureDate: 1 };
    }

    const cargoListings = await CargoListing.find(query).sort(sortOption);

    res.json({
      success: true,
      count: cargoListings.length,
      cargoListings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching cargo listings.' });
  }
};

export const intelligentMatchCargo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { origin, destination, transportMode, departureDate, reqWeight, reqVolume, cargoType } = req.body;

    const weight = Number(reqWeight) || 1000;
    const volume = Number(reqVolume) || 4;

    // Build search query for available containers
    const query: any = {
      status: 'Available',
      availableWeight: { $gte: weight },
      availableVolume: { $gte: volume },
    };

    if (origin) query.origin = { $regex: new RegExp(origin, 'i') };
    if (destination) query.destination = { $regex: new RegExp(destination, 'i') };
    if (transportMode && transportMode !== 'All') query.transportMode = transportMode;

    const candidates = await CargoListing.find(query);

    // Run Intelligent Matching Scoring Engine
    const targetDate = departureDate ? new Date(departureDate) : undefined;
    const matchResults = calculateIntelligentMatch(candidates, weight, volume, targetDate);

    // Save/record trader request inquiry if trader is authenticated
    if (req.user && req.user.role === 'TRADER' && origin && destination) {
      await TraderRequest.create({
        traderId: req.user._id,
        traderName: req.user.fullName,
        traderEmail: req.user.email,
        origin,
        destination,
        transportMode: transportMode || 'All',
        weightKg: weight,
        volumeCbm: volume,
        cargoType: cargoType || 'General Cargo',
        targetDepartureDate: targetDate || new Date(),
        status: matchResults.length > 0 ? 'Matched' : 'Pending',
      });
    }

    res.json({
      success: true,
      count: matchResults.length,
      matchResults,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error running intelligent matching.' });
  }
};

export const getCargoListingById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cargoListing = await CargoListing.findById(req.params.id);
    if (!cargoListing) {
      res.status(404).json({ success: false, message: 'Cargo space listing not found.' });
      return;
    }

    const providerProfile = await ProviderProfile.findById(cargoListing.providerId);

    res.json({
      success: true,
      cargoListing,
      provider: providerProfile,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching cargo details.' });
  }
};

export const createCargoListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'PROVIDER') {
      res.status(403).json({ success: false, message: 'Only providers can create cargo listings.' });
      return;
    }

    const providerProfile = await ProviderProfile.findOne({ userId: req.user._id });
    if (!providerProfile) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    if (providerProfile.verificationStatus !== 'Approved') {
      res.status(403).json({
        success: false,
        message: 'Your provider application must be Approved by Admin before publishing cargo space.',
      });
      return;
    }

    const {
      transportMode,
      containerType,
      containerNumber,
      origin,
      destination,
      departureDate,
      estimatedArrival,
      pickupLocation,
      totalWeightCapacity,
      availableWeight,
      totalVolumeCapacity,
      availableVolume,
      pricePerKg,
      pricePerCbm,
      acceptedCargoType,
    } = req.body;

    const cargoListing = await CargoListing.create({
      providerId: providerProfile._id,
      providerName: providerProfile.companyName,
      providerRating: providerProfile.rating,
      isVerifiedProvider: true,
      transportMode,
      containerType,
      containerNumber,
      origin,
      destination,
      departureDate: new Date(departureDate),
      estimatedArrival: new Date(estimatedArrival),
      pickupLocation,
      totalWeightCapacity,
      availableWeight: availableWeight !== undefined ? availableWeight : totalWeightCapacity,
      totalVolumeCapacity,
      availableVolume: availableVolume !== undefined ? availableVolume : totalVolumeCapacity,
      pricePerKg,
      pricePerCbm,
      acceptedCargoType: acceptedCargoType || 'General Cargo',
      status: 'Available',
    });

    await AuditLog.create({
      userId: req.user._id,
      userRole: 'PROVIDER',
      action: 'CREATE_CARGO_LISTING',
      targetResource: 'CargoListing',
      details: `Published container ${containerNumber} on route ${origin} -> ${destination}`,
    });

    res.status(201).json({
      success: true,
      message: 'Cargo space published successfully.',
      cargoListing,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error creating cargo listing.' });
  }
};

export const updateCargoListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cargoListing = await CargoListing.findById(req.params.id);
    if (!cargoListing) {
      res.status(404).json({ success: false, message: 'Cargo listing not found.' });
      return;
    }

    if (req.user?.role !== 'ADMIN') {
      const providerProfile = await ProviderProfile.findOne({ userId: req.user?._id });
      if (!providerProfile || cargoListing.providerId.toString() !== providerProfile._id.toString()) {
        res.status(403).json({ success: false, message: 'Unauthorized to modify this cargo listing.' });
        return;
      }
    }

    Object.assign(cargoListing, req.body);
    await cargoListing.save();

    res.json({
      success: true,
      message: 'Cargo listing updated successfully.',
      cargoListing,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error updating cargo listing.' });
  }
};

export const deleteCargoListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cargoListing = await CargoListing.findById(req.params.id);
    if (!cargoListing) {
      res.status(404).json({ success: false, message: 'Cargo listing not found.' });
      return;
    }

    if (req.user?.role !== 'ADMIN') {
      const providerProfile = await ProviderProfile.findOne({ userId: req.user?._id });
      if (!providerProfile || cargoListing.providerId.toString() !== providerProfile._id.toString()) {
        res.status(403).json({ success: false, message: 'Unauthorized to cancel this cargo listing.' });
        return;
      }
    }

    cargoListing.status = 'Cancelled';
    await cargoListing.save();

    res.json({
      success: true,
      message: 'Cargo listing cancelled successfully.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error cancelling cargo listing.' });
  }
};
