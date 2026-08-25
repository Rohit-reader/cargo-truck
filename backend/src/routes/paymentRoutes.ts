import { Router } from 'express';
import { verifyPayment, getPayments } from '../controllers/paymentController';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { paymentVerifySchema } from '../validators';

const router = Router();

router.use(authenticate);

router.post('/verify', validate(paymentVerifySchema), verifyPayment);
router.get('/', getPayments);

export default router;
