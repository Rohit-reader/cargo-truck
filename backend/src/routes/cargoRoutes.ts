import { Router } from 'express';
import {
  getCargoListings,
  getCargoListingById,
  createCargoListing,
  updateCargoListing,
  deleteCargoListing,
  intelligentMatchCargo,
} from '../controllers/cargoController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { createCargoSchema } from '../validators';

const router = Router();

// Public route: search cargo listings
router.get('/', getCargoListings);

// Optional Auth route: intelligent container matching
router.post('/intelligent-match', (req, res, next) => {
  if (req.headers.authorization) {
    return authenticate(req, res, () => intelligentMatchCargo(req, res));
  }
  return intelligentMatchCargo(req, res);
});

// Public route: get cargo details
router.get('/:id', getCargoListingById);

// Provider route: publish new cargo space
router.post(
  '/',
  authenticate,
  requireRole('PROVIDER'),
  validate(createCargoSchema),
  createCargoListing
);

// Provider/Admin route: update cargo listing
router.put('/:id', authenticate, requireRole('PROVIDER', 'ADMIN'), updateCargoListing);

// Provider/Admin route: delete/cancel cargo listing
router.delete('/:id', authenticate, requireRole('PROVIDER', 'ADMIN'), deleteCargoListing);

export default router;
