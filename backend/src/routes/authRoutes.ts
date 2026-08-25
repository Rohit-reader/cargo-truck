import { Router } from 'express';
import { registerTrader, registerProvider, login, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { registerTraderSchema, registerProviderSchema, loginSchema } from '../validators';

const router = Router();

router.post('/register-trader', validate(registerTraderSchema), registerTrader);
router.post('/register-provider', validate(registerProviderSchema), registerProvider);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);

export default router;
