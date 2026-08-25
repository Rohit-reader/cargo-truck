import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { TraderProfile } from '../models/TraderProfile';
import { ProviderProfile } from '../models/ProviderProfile';
import { AuthRequest } from '../middleware/authMiddleware';
import { AuditLog } from '../models/AuditLog';

const generateToken = (id: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'smartcargo_jwt_super_secret_key_2026_secure';
  return jwt.sign({ id, role }, secret, { expiresIn: '7d' });
};

export const registerTrader = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, password, companyName, traderType, city, state, country, gstNumber, iecCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email address is already registered.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'TRADER',
      fullName,
      phone,
    });

    const traderProfile = await TraderProfile.create({
      userId: user._id,
      companyName,
      traderType,
      city,
      state,
      country: country || 'India',
      gstNumber,
      iecCode,
    });

    const token = generateToken(user._id.toString(), user.role);

    await AuditLog.create({
      userId: user._id,
      userRole: 'TRADER',
      action: 'REGISTER_TRADER',
      targetResource: 'User',
      details: `Trader registered: ${companyName} (${email})`,
    });

    res.status(201).json({
      success: true,
      message: 'Trader registration successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        phone: user.phone,
        profile: traderProfile,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during trader registration.' });
  }
};

export const registerProvider = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, password, companyName, businessAddress, city, state, country, transportModes } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email address is already registered.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'PROVIDER',
      fullName,
      phone,
    });

    const providerProfile = await ProviderProfile.create({
      userId: user._id,
      companyName,
      contactPerson: fullName,
      businessAddress,
      city,
      state,
      country: country || 'India',
      transportModes,
      verificationStatus: 'Pending',
    });

    const token = generateToken(user._id.toString(), user.role);

    await AuditLog.create({
      userId: user._id,
      userRole: 'PROVIDER',
      action: 'REGISTER_PROVIDER',
      targetResource: 'User',
      details: `Provider registered: ${companyName} (${email})`,
    });

    res.status(201).json({
      success: true,
      message: 'Provider application submitted successfully. Pending Admin verification.',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        phone: user.phone,
        profile: providerProfile,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during provider registration.' });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    let profile = null;
    if (user.role === 'TRADER') {
      profile = await TraderProfile.findOne({ userId: user._id });
    } else if (user.role === 'PROVIDER') {
      profile = await ProviderProfile.findOne({ userId: user._id });
    }

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        phone: user.phone,
        profile,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during login.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    let profile = null;
    if (req.user.role === 'TRADER') {
      profile = await TraderProfile.findOne({ userId: req.user._id });
    } else if (req.user.role === 'PROVIDER') {
      profile = await ProviderProfile.findOne({ userId: req.user._id });
    }

    res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        fullName: req.user.fullName,
        phone: req.user.phone,
        profile,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching user profile.' });
  }
};
