import React from "react";
import Sidebar from "../components/Sidebar";
import VyroScore from "../components/VyroScore";
import TradingCalendar from "../components/TradingCalendar";
import { TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Net P&L",
    value: "$12,586",
    change: "+18.7%",
    type: "trend",
  },
  {
    title: "Win Rate",
    value: "66.4%",
    change: "+4.3%",
    type: "ring",
  },
  {
    title: "Total Trades",
    value: "128",
    change: "+15",
    type: "bars",
  },
  {
    title: "Profit Factor",
    value: "2.18",
    change: "+0.35",
    type: "profit",
  },
];

const recentTrades = [
  { pair: "EURUSD", side: "Long", result: "+2.31R" },
  { pair: "NQ", side: "Short", result: "-1.02R" },
  { pair: "XAUUSD", side: "Long", result: "+3.21R" },
  { pair: "GBPUSD", side: "Long", result: "+1.15R" },
  { pair: "USDCAD", side: "Short", result: "-0.45R" },
];

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-[#020408] text-white flex relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-15%] right-[-5%] w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[5%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      <Sidebar user={user} onLogout={onLogout} />

      <main className="flex-1 p-8 overflow-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-black tracking-tight">
              Welcome back,
              <span className="text-emerald-400">
                {" "}
                {user?.displayName?.split(" ")[0] || "Trader"}
              </span>
            </h1>

            <p className="text-slate-400 mt-3 text-lg">
              Your trading performance at a glance.
            </p>
          </div>

          <div className="text-right">
            <p className="text-slate-500 text-sm">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>

            <p className="text-emerald-400 font-semibold">
              Vyro Journal
            </p>
          </div>
        </div>

{/* Stats */}
<div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
  {stats.map((stat) => (
    <div
      key={stat.title}
      className="
      relative
      overflow-hidden
      bg-[#081018]/80
      shadow-[0_8px_32px_rgba(0,0,0,0.45)]
      border
      border-white/[0.08]
      rounded-3xl px-5 py-4
      backdrop-blur-2xl
      hover:border-emerald-500/20
      hover:shadow-[0_0_40px_rgba(0,223,115,0.12)]
      transition-all
      duration-300
      "
    >
      <div className="absolute -top-10 -right-10 h-24 w-24 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-center">
        {stat.type === "trend" && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
  <TrendingUp
    size={28}
    className="text-emerald-400"
  />
</div>
        )}

        {stat.type === "ring" && (
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-white/10" />
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-r-transparent rotate-45" />
          </div>
        )}

        {stat.type === "bars" && (
  <div className="w-30">
    <div className="flex items-center justify-between mb-2">
      <span className="text-emerald-400 text-sm font-semibold">
        82W
      </span>

      <span className="text-red-400 text-sm font-semibold">
        46L
      </span>
    </div>

    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-emerald-400 rounded-full"
        style={{ width: "64%" }}
      />
    </div>
  </div>
)}

       {stat.type === "profit" && (
  <svg
    width="40"
    height="24"
    viewBox="0 0 40 24"
    fill="none"
  >
    <path
      d="M2 20 L10 14 L18 16 L26 8 L38 4"
      stroke="#22d3ee"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)}
      </div>

      <p className="text-slate-500 text-xs uppercase tracking-[0.25em]">
        {stat.title}
      </p>

      <h3 className="text-3xl xl:text-4xl font-black mt-3 tracking-tight">
        {stat.value}
      </h3>

      <p className="text-emerald-400 text-sm mt-2 font-semibold">
        {stat.change}
      </p>
    </div>
  ))}
</div>
{/* Bottom Grid */}
<div className="grid grid-cols-12 gap-6">

  {/* Left Column */}
  <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">

    {/* Vyro Score */}
    <VyroScore />

    {/* Recent Trades */}
    <div
  className="
  relative
  overflow-hidden
  bg-[#081018]/80
  border border-white/[0.08]
  rounded-3xl
  p-6
  backdrop-blur-2xl
  shadow-[0_8px_32px_rgba(0,0,0,0.45)]
  min-h-[420px]
  "
>
  <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-500/10 rounded-full blur-3xl" />
      <h2 className="text-xl font-bold mb-6">
        Recent Trades
      </h2>

      <div className="space-y-4">
        {recentTrades.map((trade) => (
          <div
  key={trade.pair + trade.result}
  className="
  flex justify-between items-center
  py-3 px-3
  rounded-xl
  hover:bg-white/[0.03]
  transition-all duration-300
  "
>
            <div>
              <p className="font-medium">
                {trade.pair}
              </p>

              <p className="text-xs text-slate-500">
                {trade.side}
              </p>
            </div>

            <span
              className={
                trade.result.startsWith("+")
                  ? "text-emerald-400"
                  : "text-red-400"
              }
            >
              {trade.result}
            </span>
          </div>
        ))}
      </div>
    </div>

  </div>
{/* Calendar */}
<div className="col-span-12 xl:col-span-8">
  <div
    className="
    relative
    overflow-hidden
    bg-[#081018]/80
    border border-white/[0.08]
    rounded-3xl
    p-6
    backdrop-blur-2xl
    shadow-[0_8px_32px_rgba(0,0,0,0.45)]
    h-full
    "
  >
    <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-500/10 rounded-full blur-3xl" />

    <TradingCalendar />
  </div>
</div>
</div>
      </main>
    </div>
  );
}