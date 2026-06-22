// file: src/components/VyroScore.jsx
import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

export default function VyroScore({ trades }) {
  // CALCULATIONS
  const wins = trades.filter((t) => t.win).length;
  const losses = trades.length - wins;
  const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 0;

  const grossProfit = trades.filter((t) => t.pnl > 0).reduce((acc, t) => acc + t.pnl, 0);
  const grossLoss = Math.abs(trades.filter((t) => t.pnl < 0).reduce((acc, t) => acc + t.pnl, 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 5 : 0;

  const avgRR = trades.length > 0 ? trades.reduce((acc, t) => acc + Math.abs(t.rrr), 0) / trades.length : 0;

  // Scale metrics to 0-100 for the Radar Chart
  const data = [
    { metric: "Win Rate", value: Math.min(winRate * 1.5, 100) }, // Scaled so 66% win rate looks like 100
    { metric: "Profit Factor", value: Math.min(profitFactor * 20, 100) }, // 5.0 PF = 100
    { metric: "Avg RR", value: Math.min(avgRR * 25, 100) }, // 4.0 RR = 100
    { metric: "Recovery", value: 85 }, // Mock
    { metric: "Drawdown", value: 78 }, // Mock
    { metric: "Consistency", value: 88 }, // Mock
  ];

  // Calculate Overall Score (Average of all metrics)
  const score = (data.reduce((acc, curr) => acc + curr.value, 0) / data.length).toFixed(1);

  return (
    <div className="relative overflow-hidden bg-[#081018]/80 border border-white/[0.08] rounded-3xl p-6 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.45)] h-[420px] flex flex-col">
      <div className="absolute bottom-0 left-0 h-40 w-40 bg-emerald-500/5 rounded-full blur-[80px]" />
      
      <div className="mb-2">
        <h2 className="text-xl font-bold text-white">Vyro Score</h2>
      </div>

      {/* Radar Chart Container */}
      <div className="flex-grow h-[220px] overflow-hidden relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl"></div>
        </div>
        <ResponsiveContainer width="100%" height="100%" className="relative z-10">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Radar dataKey="value" stroke="#00df73" fill="#00df73" fillOpacity={0.25} strokeWidth={2} isAnimationActive={false} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Score Section */}
      <div className="mt-2 border-t border-white/[0.05] pt-3 relative z-10">
        <div className="flex items-end gap-4 mb-3">
          <div>
            <p className="text-emerald-400/70 text-[10px] uppercase tracking-[0.3em]">VYRO SCORE</p>
            <h3 className="text-3xl font-black text-white tracking-tight">{score}</h3>
          </div>
        </div>

        <div className="relative">
          <div className="h-2 rounded-full overflow-hidden bg-white/[0.05] border border-white/[0.05]">
            <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500" style={{ width: `${score}%` }} />
          </div>
          <div className="absolute top-[-6px] h-5 w-5 rounded-full bg-emerald-400 border border-white/20 shadow-[0_0_25px_rgba(0,223,115,0.9)]" style={{ left: `calc(${score}% - 8px)` }} />
          <div className="flex justify-between mt-2 text-[11px] text-slate-500">
            <span>0</span><span>20</span><span>40</span><span>60</span><span>80</span><span>100</span>
          </div>
        </div>
      </div>
    </div>
  );
}