import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  getProviderProfile,
  updateProviderProfile,
  uploadDocument,
  getMyCargoListings,
  fillMyContainer,
  sendCargoOffer,
} from '../controllers/providerController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

const router = Router();

router.use(authenticate, requireRole('PROVIDER'));

router.get('/me', getProviderProfile);
router.put('/me', updateProviderProfile);
router.post('/documents', upload.single('document'), uploadDocument);
router.get('/listings', getMyCargoListings);

// Fill My Container & Direct Offer routes
router.get('/fill-my-container/:listingId', fillMyContainer);
router.post('/send-offer', sendCargoOffer);

export default router;
