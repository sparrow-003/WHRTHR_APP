import React from 'react';
import { GeminiInsight } from '../types';
import { Waves, Sparkles } from 'lucide-react';

interface Props {
  insight: GeminiInsight | null;
  loading: boolean;
}

export const NatureInsightCard: React.FC<Props> = ({ insight, loading }) => {
  return (
    <div className="glass-dark p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden group hover:bg-white/5 transition-all">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Sparkles className="text-blue-400" size={20} />
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Atmospheric Intelligence</h3>
        </div>
        {loading && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />}
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-white/10 rounded-full w-full"></div>
          <div className="h-4 bg-white/10 rounded-full w-5/6"></div>
          <div className="h-4 bg-white/10 rounded-full w-4/6"></div>
        </div>
      ) : insight ? (
        <div className="space-y-10">
          <p className="text-2xl font-light leading-relaxed text-white/90 italic">
            "{insight.natureDescription}"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insight.tips.map((tip, idx) => (
              <div key={idx} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex gap-4 items-start hover:bg-white/10 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                <p className="text-sm font-medium text-white/70 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center">
          <p className="text-white/20 text-sm font-medium">Syncing with atmospheric patterns...</p>
        </div>
      )}
    </div>
  );
};
