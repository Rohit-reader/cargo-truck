import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Payment } from '../models/Payment';
import { Booking } from '../models/Booking';
import { ProviderProfile } from '../models/ProviderProfile';
import { AuditLog } from '../models/AuditLog';

export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookingId, paymentMethod } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    if (req.user?.role === 'TRADER' && booking.traderId.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: 'Unauthorized to pay for this booking.' });
      return;
    }

    let payment = await Payment.findOne({ bookingId: booking._id });
    if (!payment) {
      payment = await Payment.create({
        paymentId: `PAY-${Date.now().toString().slice(-6)}`,
        bookingId: booking._id,
        traderId: booking.traderId,
        amount: booking.priceSummary.totalAmount,
        currency: 'INR',
        status: 'Pending',
        paymentMethod: paymentMethod || 'Simulated Gateway',
        transactionRef: `TXN-${Date.now()}`,
      });
    }

    // Simulate backend payment success verification
    payment.status = 'Successful';
    payment.paidAt = new Date();
    payment.paymentMethod = paymentMethod || 'Simulated Card / NetBanking';
    await payment.save();

    booking.paymentStatus = 'Successful';
    booking.bookingStatus = 'Confirmed';
    booking.statusHistory.push({
      status: 'Confirmed',
      updatedAt: new Date(),
      updatedBy: req.user?.fullName || 'Trader',
      note: `Payment of ₹${payment.amount} successful. Booking confirmed.`,
    });
    await booking.save();

    await AuditLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: 'PAYMENT_VERIFIED',
      targetResource: 'Payment',
      details: `Payment of ₹${payment.amount} verified for Booking ${booking.bookingNumber}`,
    });

    res.json({
      success: true,
      message: 'Payment processed successfully. Booking confirmed!',
      booking,
      payment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error verifying payment.' });
  }
};

export const getPayments = async (req: AuthRequest, res: Response): Promise<void> => {
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
      if (providerProfile) {
        const bookings = await Booking.find({ providerId: providerProfile._id }).select('_id');
        const bookingIds = bookings.map((b) => b._id);
        query.bookingId = { $in: bookingIds };
      } else {
        res.json({ success: true, payments: [] });
        return;
      }
    } else if (req.user.role === 'ADMIN') {
      query = {};
    }

    const payments = await Payment.find(query).populate('bookingId').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching payments.' });
  }
};
