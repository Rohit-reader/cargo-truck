import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  updateShipmentStatus,
  cancelBooking,
} from '../controllers/bookingController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { createBookingSchema, updateShipmentStatusSchema } from '../validators';

const router = Router();

router.use(authenticate);

router.post('/', requireRole('TRADER'), validate(createBookingSchema), createBooking);
router.get('/', getMyBookings);
router.get('/:id', getBookingById);
router.put('/:id/shipment-status', requireRole('PROVIDER', 'ADMIN'), validate(updateShipmentStatusSchema), updateShipmentStatus);
router.post('/:id/cancel', cancelBooking);

export default router;
