import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getProviderProfile, uploadDocument, getDocuments } from '../controllers/providerController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

const router = Router();

router.use(authenticate, requireRole('PROVIDER'));

router.get('/profile', getProviderProfile);
router.get('/documents', getDocuments);
router.post('/documents', upload.single('document'), uploadDocument);

export default router;
