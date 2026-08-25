import { Router } from 'express';
import {
  getCargoListings,
  getCargoListingById,
  createCargoListing,
  updateCargoListing,
  deleteCargoListing,
} from '../controllers/cargoController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { createCargoSchema } from '../validators';

const router = Router();

router.get('/', getCargoListings);
router.get('/:id', getCargoListingById);
router.post('/', authenticate, requireRole('PROVIDER'), validate(createCargoSchema), createCargoListing);
router.put('/:id', authenticate, requireRole('PROVIDER', 'ADMIN'), updateCargoListing);
router.delete('/:id', authenticate, requireRole('PROVIDER', 'ADMIN'), deleteCargoListing);

export default router;
