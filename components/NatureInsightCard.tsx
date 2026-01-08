
import React from 'react';
import { GeminiInsight } from '../types';
import { Leaf, Sparkles } from 'lucide-react';

interface Props {
  insight: GeminiInsight | null;
  loading: boolean;
}

export const NatureInsightCard: React.FC<Props> = ({ insight, loading }) => {
  return (
    <div className="bg-emerald-950/40 backdrop-blur-3xl border border-emerald-500/20 p-8 rounded-[2.5rem] h-full relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-1000" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-400 p-2.5 rounded-xl shadow-lg shadow-emerald-400/20">
            <Leaf className="text-emerald-950" size={20} />
          </div>
          <h3 className="text-2xl font-serif italic text-emerald-100">The Earth Speaks</h3>
        </div>
        {!loading && <Sparkles className="text-emerald-400/40 animate-pulse" size={18} />}
      </div>

      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="space-y-3">
            <div className="h-4 bg-emerald-500/10 rounded w-full"></div>
            <div className="h-4 bg-emerald-500/10 rounded w-5/6"></div>
            <div className="h-4 bg-emerald-500/10 rounded w-4/6"></div>
          </div>
          <div className="pt-8 space-y-4">
             <div className="h-10 bg-emerald-500/10 rounded-2xl w-full"></div>
             <div className="h-10 bg-emerald-500/10 rounded-2xl w-full"></div>
          </div>
        </div>
      ) : insight ? (
        <div className="space-y-10">
          <p className="text-emerald-50/90 leading-relaxed font-light text-xl italic font-serif">
            "{insight.natureDescription}"
          </p>
          
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400/60 font-bold ml-1">Ecosystem Harmony</p>
            {insight.tips.map((tip, idx) => (
              <div key={idx} className="flex gap-4 items-start bg-emerald-900/30 p-5 rounded-[1.5rem] border border-emerald-500/10 hover:border-emerald-500/30 transition-all transform hover:-translate-y-1">
                <div className="h-2 w-2 rounded-full bg-emerald-400 mt-2.5 shrink-0 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                <p className="text-sm text-emerald-50/80 font-medium">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-emerald-50/20 italic font-serif text-center">Listening to the roots... <br/>Please wait.</p>
        </div>
      )}
    </div>
  );
};
