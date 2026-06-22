// file: src/pages/Dashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import VyroScore from "../components/VyroScore";
import TradingCalendar from "../components/TradingCalendar";
import { TrendingUp } from "lucide-react";
import { useTrades } from "../context/TradeContext";

export default function Dashboard({ user, onLogout }) {
  const { trades } = useTrades();

  // CALCULATIONS
  const netPnl = trades.reduce((acc, t) => acc + t.pnl, 0);
  const wins = trades.filter((t) => t.win).length;
  const losses = trades.length - wins;
  const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 0;
  
  const grossProfit = trades.filter(t => t.pnl > 0).reduce((acc, t) => acc + t.pnl, 0);
  const grossLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((acc, t) => acc + t.pnl, 0));
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : grossProfit > 0 ? "∞" : "0.00";

  // Sort by date descending for recent trades
  const recentTrades = [...trades].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const stats = [
    { title: "Net P&L", value: `$${netPnl.toLocaleString()}`, change: `${winRate.toFixed(1)}% WR`, type: "trend" },
    { title: "Win Rate", value: `${winRate.toFixed(1)}%`, change: `${wins}W / ${losses}L`, type: "ring", winRate: winRate },
    { title: "Total Trades", value: trades.length, change: "This Month", type: "bars", wins, losses },
    { title: "Profit Factor", value: profitFactor, change: grossLoss > 0 ? "Healthy" : "No Losses", type: "profit" },
  ];

  return (
    <div className="min-h-screen bg-[#020408] text-white flex relative overflow-hidden">
      <div className="absolute top-[-15%] right-[-5%] w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[5%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      <Sidebar user={user} onLogout={onLogout} />

      <main className="flex-1 p-8 overflow-auto relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-black tracking-tight">
              Welcome back, <span className="text-emerald-400">{user?.displayName?.split(" ")[0] || "Trader"}</span>
            </h1>
            <p className="text-slate-400 mt-3 text-lg">Your trading performance at a glance.</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-sm">{new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
            <p className="text-emerald-400 font-semibold">Vyro Journal</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="relative overflow-hidden bg-[#081018]/80 shadow-[0_8px_32px_rgba(0,0,0,0.45)] border border-white/[0.08] rounded-3xl px-5 py-4 backdrop-blur-2xl hover:border-emerald-500/20 transition-all duration-300">
              <div className="absolute -top-10 -right-10 h-24 w-24 bg-emerald-500/10 rounded-full blur-3xl" />
              
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-[0.25em]">{stat.title}</p>
                  <h3 className={`text-3xl xl:text-4xl font-black mt-3 tracking-tight ${stat.title === "Net P&L" && netPnl < 0 ? "text-red-400" : "text-white"}`}>{stat.value}</h3>
                  <p className="text-slate-400 text-sm mt-2 font-semibold">{stat.change}</p>
                </div>

                {/* Dynamic Mini Visuals */}
                <div className="mt-1">
                  {stat.type === "trend" && <TrendingUp size={28} className={netPnl >= 0 ? "text-emerald-400" : "text-red-400"} />}
                  
                  {stat.type === "ring" && (
                    <div className="relative h-12 w-12">
                      <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                      <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-r-transparent border-b-transparent" style={{ transform: `rotate(${(stat.winRate / 100) * 360}deg)` }} />
                    </div>
                  )}
                  
                  {stat.type === "bars" && (
                    <div className="w-16 text-center">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-emerald-400 text-xs font-bold">{stat.wins}W</span>
                        <span className="text-red-400 text-xs font-bold">{stat.losses}L</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden flex">
                        <div className="h-full bg-emerald-400" style={{ width: `${(stat.wins / (stat.wins + stat.losses)) * 100}%` }} />
                        <div className="h-full bg-red-400" style={{ width: `${(stat.losses / (stat.wins + stat.losses)) * 100}%` }} />
                      </div>
                    </div>
                  )}

                  {stat.type === "profit" && (
                    <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                      <path d="M2 20 L10 14 L18 16 L26 8 L38 4" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
            <VyroScore trades={trades} />
            
            <div className="relative overflow-hidden bg-[#081018]/80 border border-white/[0.08] rounded-3xl p-6 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.45)] min-h-[420px]">
              <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-500/10 rounded-full blur-3xl" />
              <h2 className="text-xl font-bold mb-6">Recent Trades</h2>
              <div className="space-y-4">
                {recentTrades.map((trade) => (
                  <div key={trade.id} className="flex justify-between items-center py-3 px-3 rounded-xl hover:bg-white/[0.03] transition-all duration-300">
                    <div>
                      <p className="font-medium">{trade.pair}</p>
                      <p className="text-xs text-slate-500">{trade.side} • {new Date(trade.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`font-bold ${trade.pnl > 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {trade.pnl > 0 ? "+" : ""}${Math.abs(trade.pnl).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 xl:col-span-8">
            <div className="relative overflow-hidden bg-[#081018]/80 border border-white/[0.08] rounded-3xl p-6 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.45)] h-full">
              <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-500/10 rounded-full blur-3xl" />
              <TradingCalendar trades={trades} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}