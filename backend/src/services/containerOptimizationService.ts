import { ICargoListing } from '../models/CargoListing';
import { ITraderRequest, TraderRequest } from '../models/TraderRequest';

export interface OptimizationResult {
  listingId: string;
  containerNumber: string;
  route: string;
  initialAvailableWeight: number;
  initialAvailableVolume: number;
  remainingWeightAfter: number;
  remainingVolumeAfter: number;
  projectedWeightUtilization: number; // 0-100%
  projectedVolumeUtilization: number; // 0-100%
  projectedRevenue: number; // in INR
  recommendedRequests: ITraderRequest[];
  explanationText: string;
}

export const optimizeContainerFill = async (
  listing: ICargoListing
): Promise<OptimizationResult> => {
  // Find pending trader requests on matching route (case-insensitive)
  const traderRequests = await TraderRequest.find({
    origin: { $regex: new RegExp(listing.origin, 'i') },
    destination: { $regex: new RegExp(listing.destination, 'i') },
    status: { $in: ['Pending', 'Matched'] },
    weightKg: { $lte: listing.availableWeight },
    volumeCbm: { $lte: listing.availableVolume },
  }).sort({ createdAt: -1 });

  const maxW = listing.availableWeight;
  const maxV = listing.availableVolume;

  let bestCombination: ITraderRequest[] = [];
  let maxRevenue = 0;
  let bestWeightSum = 0;
  let bestVolumeSum = 0;

  // Power set search over up to 10 candidate trader requests (2^10 = 1024 combinations max, fast & exact)
  const candidates = traderRequests.slice(0, 10);
  const totalSubsets = 1 << candidates.length;

  for (let i = 1; i < totalSubsets; i++) {
    let currentW = 0;
    let currentV = 0;
    let currentRev = 0;
    const subset: ITraderRequest[] = [];

    for (let j = 0; j < candidates.length; j++) {
      if ((i & (1 << j)) !== 0) {
        const item = candidates[j];
        currentW += item.weightKg;
        currentV += item.volumeCbm;
        // Revenue calculation based on freight rate
        const itemRev = Math.round(
          Math.max(item.weightKg * listing.pricePerKg, item.volumeCbm * listing.pricePerCbm)
        );
        currentRev += itemRev;
        subset.push(item);
      }
    }

    if (currentW <= maxW && currentV <= maxV) {
      if (currentRev > maxRevenue || (currentRev === maxRevenue && currentW > bestWeightSum)) {
        maxRevenue = currentRev;
        bestCombination = subset;
        bestWeightSum = currentW;
        bestVolumeSum = currentV;
      }
    }
  }

  const remainingW = maxW - bestWeightSum;
  const remainingV = maxV - bestVolumeSum;
  const totalBookedWeightAfter = listing.totalWeightCapacity - remainingW;
  const weightUtilPct = Math.round((totalBookedWeightAfter / listing.totalWeightCapacity) * 100);
  const totalBookedVolAfter = listing.totalVolumeCapacity - remainingV;
  const volUtilPct = Math.round((totalBookedVolAfter / listing.totalVolumeCapacity) * 100);

  const explanationText =
    bestCombination.length > 0
      ? `Combining ${bestCombination.length} trader shipment(s) fills ${bestWeightSum.toLocaleString()} KG of space, raising container utilization to ${weightUtilPct}% and yielding ₹${maxRevenue.toLocaleString()} in freight revenue.`
      : `No matching pending trader cargo requests found for route ${listing.origin} → ${listing.destination}.`;

  return {
    listingId: listing._id.toString(),
    containerNumber: listing.containerNumber,
    route: `${listing.origin} → ${listing.destination}`,
    initialAvailableWeight: listing.availableWeight,
    initialAvailableVolume: listing.availableVolume,
    remainingWeightAfter: remainingW,
    remainingVolumeAfter: remainingV,
    projectedWeightUtilization: weightUtilPct,
    projectedVolumeUtilization: volUtilPct,
    projectedRevenue: maxRevenue,
    recommendedRequests: bestCombination,
    explanationText,
  };
};
