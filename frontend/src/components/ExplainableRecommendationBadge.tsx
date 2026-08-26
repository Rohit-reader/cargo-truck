import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface ExplainableRecommendationBadgeProps {
  matchScore: number;
  recommendationBadge: string;
  explanations: string[];
}

export const ExplainableRecommendationBadge: React.FC<ExplainableRecommendationBadgeProps> = ({
  matchScore,
  recommendationBadge,
  explanations,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50/90 via-emerald-50/50 to-white border border-blue-200/80 rounded-2xl p-4 space-y-2.5 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-blue-600 text-white rounded-lg shadow-2xs">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-blue-900 block">
              AI Intelligent Recommendation
            </span>
            <span className="text-xs text-slate-500 font-semibold">{recommendationBadge}</span>
          </div>
        </div>

        <div className="bg-emerald-800 text-white px-3 py-1.5 rounded-xl text-xs font-black tracking-wide shadow-2xs">
          {matchScore}% MATCH
        </div>
      </div>

      {/* Bulleted Explainable Explanations */}
      <div className="space-y-1.5 pt-1">
        {explanations.map((exp, idx) => (
          <div key={idx} className="flex items-start space-x-2 text-xs font-medium text-slate-700">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{exp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
