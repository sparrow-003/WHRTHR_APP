import React from 'react';
import { GeminiInsight } from '../types';
import { Sparkles } from 'lucide-react';

interface Props {
  insight: GeminiInsight | null;
  loading: boolean;
}

export const NatureInsightCard: React.FC<Props> = ({ insight, loading }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-blue-500" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-tight">
          Insights
        </h3>
        {loading && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          ))}
        </div>
      ) : insight ? (
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-800 dark:text-gray-300">
            {insight.natureDescription}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insight.tips.map((tip, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No insights available.
        </p>
      )}
    </div>
  );
};
