import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/authMiddleware';
import { Booking, BookingStatus } from '../models/Booking';
import { CargoListing } from '../models/CargoListing';
import { ProviderProfile } from '../models/ProviderProfile';
import { Payment } from '../models/Payment';
import { Conversation } from '../models/Conversation';
import { AuditLog } from '../models/AuditLog';

const generateBookingNumber = (): string => {
  const prefix = 'SCS-BK';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
};

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'TRADER') {
      res.status(403).json({ success: false, message: 'Only registered Traders can book cargo space.' });
      return;
    }

    const { cargoListingId, cargoDetails, pickupDetails } = req.body;

    const reqWeight = Number(cargoDetails.weightKg);
    const reqVolume = Number(cargoDetails.volumeCbm);

    // ATOMIC CAPACITY CHECK & DECREMENT
    // Query condition ensures sufficient capacity exists at the exact moment of update
    const updatedListing = await CargoListing.findOneAndUpdate(
      {
        _id: cargoListingId,
        status: 'Available',
        availableWeight: { $gte: reqWeight },
        availableVolume: { $gte: reqVolume },
      },
      {
        $inc: {
          availableWeight: -reqWeight,
          availableVolume: -reqVolume,
        },
      },
      { new: true }
    );

    if (!updatedListing) {
      res.status(400).json({
        success: false,
        message: 'Insufficient cargo capacity or container is no longer available.',
      });
      return;
    }

    // Check if fully booked now
    if (updatedListing.availableWeight <= 0 || updatedListing.availableVolume <= 0) {
      updatedListing.status = 'Fully Booked';
      await updatedListing.save();
    }

    const providerProfile = await ProviderProfile.findById(updatedListing.providerId);
    if (!providerProfile) {
      // Rollback listing capacity
      await CargoListing.findByIdAndUpdate(cargoListingId, {
        $inc: { availableWeight: reqWeight, availableVolume: reqVolume },
        status: 'Available',
      });
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    // Calculate Pricing
    const baseFreight = Math.round(
      Math.max(reqWeight * updatedListing.pricePerKg, reqVolume * updatedListing.pricePerCbm)
    );
    const platformFee = Math.round(baseFreight * 0.05); // 5% fee
    const taxes = Math.round((baseFreight + platformFee) * 0.18); // 18% GST/tax
    const totalAmount = baseFreight + platformFee + taxes;

    const bookingNumber = generateBookingNumber();

    const booking = await Booking.create({
      bookingNumber,
      traderId: req.user._id,
      traderName: req.user.fullName,
      traderEmail: req.user.email,
      cargoListingId: updatedListing._id,
      providerId: providerProfile._id,
      providerName: providerProfile.companyName,
      route: {
        origin: updatedListing.origin,
        destination: updatedListing.destination,
        departureDate: updatedListing.departureDate,
        estimatedArrival: updatedListing.estimatedArrival,
        transportMode: updatedListing.transportMode,
        containerNumber: updatedListing.containerNumber,
      },
      cargoDetails: {
        cargoType: cargoDetails.cargoType,
        description: cargoDetails.description,
        weightKg: reqWeight,
        volumeCbm: reqVolume,
        numberOfPackages: cargoDetails.numberOfPackages,
        dimensions: cargoDetails.dimensions,
      },
      pickupDetails: {
        pickupAddress: pickupDetails.pickupAddress,
        pickupDate: new Date(pickupDetails.pickupDate),
        specialInstructions: pickupDetails.specialInstructions,
      },
      priceSummary: {
        baseFreight,
        platformFee,
        taxes,
        totalAmount,
      },
      paymentStatus: 'Pending',
      bookingStatus: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          updatedAt: new Date(),
          updatedBy: req.user.fullName,
          note: 'Booking created. Awaiting payment.',
        },
      ],
    });

    // Create Initial Payment Record
    const paymentId = `PAY-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    await Payment.create({
      paymentId,
      bookingId: booking._id,
      traderId: req.user._id,
      amount: totalAmount,
      currency: 'INR',
      status: 'Pending',
      paymentMethod: 'Simulated Gateway',
      transactionRef: `TXN-${Date.now()}`,
    });

    // Initialize Chat Conversation for this booking
    await Conversation.create({
      bookingId: booking._id,
      traderId: req.user._id,
      providerUserId: providerProfile.userId,
      lastMessage: 'Booking created. You can now chat directly regarding shipment arrangements.',
      lastMessageAt: new Date(),
    });

    await AuditLog.create({
      userId: req.user._id,
      userRole: 'TRADER',
      action: 'CREATE_BOOKING',
      targetResource: 'Booking',
      details: `Created booking ${bookingNumber} for ${reqWeight} KG / ${reqVolume} CBM on route ${updatedListing.origin} -> ${updatedListing.destination}`,
    });

    res.status(201).json({
      success: true,
      message: 'Space reserved successfully. Proceed to payment to confirm booking.',
      booking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error creating booking.' });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    let query: any = {};
    if (req.user.role === 'TRADER') {
      query.traderId = req.user._id;
    } else if (req.user.role === 'PROVIDER') {
      const providerProfile = await ProviderProfile.findOne({ userId: req.user._id });
      if (!providerProfile) {
        res.json({ success: true, bookings: [] });
        return;
      }
      query.providerId = providerProfile._id;
    } else if (req.user.role === 'ADMIN') {
      query = {};
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching bookings.' });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    // Resource ownership check
    if (req.user?.role === 'TRADER' && booking.traderId.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: 'Access denied to this booking.' });
      return;
    }

    if (req.user?.role === 'PROVIDER') {
      const providerProfile = await ProviderProfile.findOne({ userId: req.user._id });
      if (!providerProfile || booking.providerId.toString() !== providerProfile._id.toString()) {
        res.status(403).json({ success: false, message: 'Access denied to this booking.' });
        return;
      }
    }

    const payment = await Payment.findOne({ bookingId: booking._id });
    const conversation = await Conversation.findOne({ bookingId: booking._id });

    res.json({
      success: true,
      booking,
      payment,
      conversationId: conversation?._id,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching booking details.' });
  }
};

export const updateShipmentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, note } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    if (req.user?.role === 'PROVIDER') {
      const providerProfile = await ProviderProfile.findOne({ userId: req.user._id });
      if (!providerProfile || booking.providerId.toString() !== providerProfile._id.toString()) {
        res.status(403).json({ success: false, message: 'Only assigned provider can update shipment status.' });
        return;
      }
    } else if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Traders cannot update shipment status.' });
      return;
    }

    booking.bookingStatus = status as BookingStatus;
    booking.statusHistory.push({
      status: status as BookingStatus,
      updatedAt: new Date(),
      updatedBy: req.user?.fullName || 'System',
      note,
    });

    await booking.save();

    if (status === 'Delivered') {
      await ProviderProfile.findByIdAndUpdate(booking.providerId, {
        $inc: { totalCompletedShipments: 1 },
      });
    }

    await AuditLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: 'UPDATE_SHIPMENT_STATUS',
      targetResource: 'Booking',
      details: `Booking ${booking.bookingNumber} status updated to '${status}'`,
    });

    res.json({
      success: true,
      message: `Shipment status updated to '${status}'.`,
      booking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error updating shipment status.' });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    if (booking.bookingStatus === 'Cancelled') {
      res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
      return;
    }

    // Restore Capacity on CargoListing
    await CargoListing.findByIdAndUpdate(booking.cargoListingId, {
      $inc: {
        availableWeight: booking.cargoDetails.weightKg,
        availableVolume: booking.cargoDetails.volumeCbm,
      },
      status: 'Available',
    });

    booking.bookingStatus = 'Cancelled';
    if (booking.paymentStatus === 'Successful') {
      booking.paymentStatus = 'Refunded';
      await Payment.findOneAndUpdate({ bookingId: booking._id }, { status: 'Refunded' });
    }

    booking.statusHistory.push({
      status: 'Cancelled',
      updatedAt: new Date(),
      updatedBy: req.user?.fullName || 'User',
      note: 'Booking cancelled. Reserved capacity restored.',
    });

    await booking.save();

    await AuditLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: 'CANCEL_BOOKING',
      targetResource: 'Booking',
      details: `Booking ${booking.bookingNumber} cancelled`,
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully and capacity restored.',
      booking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error cancelling booking.' });
  }
};
