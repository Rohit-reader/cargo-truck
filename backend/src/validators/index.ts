import { z } from 'zod';

export const registerTraderSchema = z.object({
  fullName: z.string().min(2, 'Full Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  companyName: z.string().min(2, 'Company Name is required'),
  traderType: z.enum(['Exporter', 'Importer', 'Both']).default('Exporter'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().default('India'),
  gstNumber: z.string().optional(),
  iecCode: z.string().optional(),
});

export const registerProviderSchema = z.object({
  fullName: z.string().min(2, 'Contact Person Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  companyName: z.string().min(2, 'Company Name is required'),
  businessAddress: z.string().min(5, 'Business Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().default('India'),
  transportModes: z.array(z.enum(['Road', 'Rail', 'Sea', 'Air', 'Multimodal'])).min(1, 'Select at least one transport mode'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createCargoSchema = z.object({
  transportMode: z.enum(['Road', 'Rail', 'Sea', 'Air', 'Multimodal']),
  containerType: z.enum(['20 FT', '40 FT', '40 FT High Cube', 'Other']),
  containerNumber: z.string().min(3, 'Container number is required'),
  origin: z.string().min(2, 'Origin location is required'),
  destination: z.string().min(2, 'Destination location is required'),
  departureDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid departure date'),
  estimatedArrival: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid arrival date'),
  pickupLocation: z.string().min(2, 'Pickup location is required'),
  totalWeightCapacity: z.number().positive('Total weight must be positive'),
  availableWeight: z.number().nonnegative('Available weight cannot be negative'),
  totalVolumeCapacity: z.number().positive('Total volume must be positive'),
  availableVolume: z.number().nonnegative('Available volume cannot be negative'),
  pricePerKg: z.number().positive('Price per KG must be positive'),
  pricePerCbm: z.number().positive('Price per CBM must be positive'),
  acceptedCargoType: z.string().default('General Cargo'),
});

export const searchCargoSchema = z.object({
  origin: z.string().optional(),
  destination: z.string().optional(),
  transportMode: z.string().optional(),
  departureDate: z.string().optional(),
  minWeight: z.string().optional(),
  minVolume: z.string().optional(),
  sortBy: z.enum(['price', 'departure', 'rating', 'availableSpace']).optional(),
});

export const createBookingSchema = z.object({
  cargoListingId: z.string().min(1, 'Cargo Listing ID is required'),
  cargoDetails: z.object({
    cargoType: z.string().min(2, 'Cargo type is required'),
    description: z.string().min(2, 'Description is required'),
    weightKg: z.number().positive('Weight must be positive'),
    volumeCbm: z.number().positive('Volume must be positive'),
    numberOfPackages: z.number().int().positive('Package count must be at least 1'),
    dimensions: z.string().optional(),
  }),
  pickupDetails: z.object({
    pickupAddress: z.string().min(5, 'Pickup address is required'),
    pickupDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid pickup date'),
    specialInstructions: z.string().optional(),
  }),
});

export const paymentVerifySchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  paymentMethod: z.string().default('Simulated Card/UPI'),
});

export const updateShipmentStatusSchema = z.object({
  status: z.enum([
    'Cargo Pickup Scheduled',
    'Cargo Picked Up',
    'In Transit',
    'Arrived at Destination',
    'Delivered',
  ]),
  note: z.string().optional(),
});
