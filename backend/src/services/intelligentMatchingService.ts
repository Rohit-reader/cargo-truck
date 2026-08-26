import { ICargoListing } from '../models/CargoListing';

export interface MatchResult {
  listing: ICargoListing;
  matchScore: number; // 0 - 100
  explanations: string[];
  recommendationBadge: string;
}

export const calculateIntelligentMatch = (
  listings: ICargoListing[],
  reqWeight: number,
  reqVolume: number,
  targetDepartureDate?: Date
): MatchResult[] => {
  if (!listings || listings.length === 0) return [];

  // Calculate route average price per kg for comparison
  const avgPrice =
    listings.reduce((sum, l) => sum + l.pricePerKg, 0) / listings.length;

  const results: MatchResult[] = listings.map((listing) => {
    const explanations: string[] = [];

    // 1. Capacity Fit Score (40% Weight)
    // Check if container can accommodate requested weight & volume
    const canFitWeight = listing.availableWeight >= reqWeight;
    const canFitVolume = listing.availableVolume >= reqVolume;

    if (!canFitWeight || !canFitVolume) {
      return {
        listing,
        matchScore: 0,
        explanations: ['Insufficient container capacity'],
        recommendationBadge: 'Capacity Exceeded',
      };
    }

    // High utilization of remaining space is good
    const weightUtilAfter = Math.min(
      100,
      Math.round(((listing.totalWeightCapacity - (listing.availableWeight - reqWeight)) / listing.totalWeightCapacity) * 100)
    );
    const capacityScore = Math.min(100, Math.max(50, weightUtilAfter));
    explanations.push(`Fits ${reqWeight.toLocaleString()} KG requirement (${weightUtilAfter}% projected container fill)`);

    // 2. Price Efficiency Score (30% Weight)
    let priceScore = 70;
    if (listing.pricePerKg < avgPrice) {
      const savingsPct = Math.round(((avgPrice - listing.pricePerKg) / avgPrice) * 100);
      priceScore = Math.min(100, 75 + savingsPct * 2);
      explanations.push(`Excellent value: ${savingsPct}% lower freight rate than route average (₹${listing.pricePerKg}/KG)`);
    } else if (listing.pricePerKg === avgPrice) {
      priceScore = 75;
      explanations.push(`Competitive freight rate (₹${listing.pricePerKg}/KG)`);
    } else {
      priceScore = 60;
      explanations.push(`Standard rate (₹${listing.pricePerKg}/KG)`);
    }

    // 3. Provider Trust Score (20% Weight)
    const ratingScore = Math.round((listing.providerRating / 5) * 100);
    if (listing.providerRating >= 4.7) {
      explanations.push(`Top-rated Verified Provider (${listing.providerRating}★)`);
    } else if (listing.isVerifiedProvider) {
      explanations.push(`Verified Logistics Partner (${listing.providerRating}★)`);
    }

    // 4. Schedule Proximity Score (10% Weight)
    let scheduleScore = 80;
    if (targetDepartureDate) {
      const depTime = new Date(listing.departureDate).getTime();
      const targetTime = new Date(targetDepartureDate).getTime();
      const diffDays = Math.abs(depTime - targetTime) / (1000 * 3600 * 24);
      scheduleScore = Math.max(40, 100 - diffDays * 10);
      if (diffDays <= 2) {
        explanations.push(`Perfect schedule match (departs in ${Math.round(diffDays)} days)`);
      }
    }

    // Weighted Overall Score
    const finalScore = Math.round(
      capacityScore * 0.4 + priceScore * 0.3 + ratingScore * 0.2 + scheduleScore * 0.1
    );

    let recommendationBadge = 'Good Match';
    if (finalScore >= 90) recommendationBadge = 'Top Recommended • Best Value';
    else if (finalScore >= 80) recommendationBadge = 'High Match';
    else if (finalScore >= 70) recommendationBadge = 'Recommended Fit';

    return {
      listing,
      matchScore: finalScore,
      explanations,
      recommendationBadge,
    };
  });

  // Filter out 0 score and sort by matchScore descending
  return results.filter((r) => r.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);
};
