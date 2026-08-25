import { Router } from 'express';
import {
  getProviderApplications,
  approveProvider,
  rejectProvider,
  suspendProvider,
  getPlatformAnalytics,
  getAuditLogs,
  getAllTraders,
} from '../controllers/adminController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/providers', getProviderApplications);
router.post('/providers/:id/approve', approveProvider);
router.post('/providers/:id/reject', rejectProvider);
router.post('/providers/:id/suspend', suspendProvider);
router.get('/analytics', getPlatformAnalytics);
router.get('/audit-logs', getAuditLogs);
router.get('/traders', getAllTraders);

export default router;
