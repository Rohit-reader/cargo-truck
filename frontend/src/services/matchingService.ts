import api from './api';

export interface IntelligentMatchPayload {
  origin: string;
  destination: string;
  transportMode?: string;
  departureDate?: string;
  reqWeight: number;
  reqVolume: number;
  cargoType?: string;
}

export interface MatchResultItem {
  listing: any;
  matchScore: number;
  explanations: string[];
  recommendationBadge: string;
}

export interface OptimizationResultData {
  listingId: string;
  containerNumber: string;
  route: string;
  initialAvailableWeight: number;
  initialAvailableVolume: number;
  remainingWeightAfter: number;
  remainingVolumeAfter: number;
  projectedWeightUtilization: number;
  projectedVolumeUtilization: number;
  projectedRevenue: number;
  recommendedRequests: any[];
  explanationText: string;
}

export const runIntelligentMatch = async (payload: IntelligentMatchPayload) => {
  const res = await api.post('/cargo/intelligent-match', payload);
  return res.data;
};

export const fetchContainerOptimization = async (listingId: string) => {
  const res = await api.get(`/providers/fill-my-container/${listingId}`);
  return res.data;
};

export const sendDirectOffer = async (requestId: string, listingId: string, offeredPrice: number) => {
  const res = await api.post('/providers/send-offer', { requestId, listingId, offeredPrice });
  return res.data;
};
