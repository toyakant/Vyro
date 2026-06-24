// file: src/pages/Dashboard.jsx
import React, { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import AddTradeModal from "../components/AddTradeModal";
import { TrendingUp, Flame, ChevronDown } from "lucide-react"; // Added ChevronDown
import { useTrades } from "../context/TradeContext";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

// --- CONSTANTS & HELPERS ---
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const formatPnl = (val) => {
  const absVal = Math.abs(val);
  if (absVal >= 1000) return `$${(val / 1000).toFixed(2)}K`;
  return `$${val.toLocaleString()}`;
};


// --- INTERNAL COMPONENT: VYRO SCORE ---
const VyroScore = ({ trades }) => {
  if (!trades || trades.length === 0) {
    return (
      <div className="relative overflow-hidden bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.45)] h-full flex flex-col items-center justify-center text-center">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <h2 className="text-xl font-bold text-white mb-4 absolute top-6 left-6">Vyro Score</h2>
        <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
          <TrendingUp size={32} className="text-slate-600" />
        </div>
        <p className="text-slate-500 font-bold text-sm">No trade data yet</p>
        <p className="text-slate-600 text-xs mt-1">Log a trade to calculate your score</p>
      </div>
    );
  }

  const wins = trades.filter((t) => t.win).length;
  const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 0;
  const grossProfit = trades.filter((t) => t.pnl > 0).reduce((acc, t) => acc + t.pnl, 0);
  const grossLoss = Math.abs(trades.filter((t) => t.pnl < 0).reduce((acc, t) => acc + t.pnl, 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 5 : 0;
  const avgRR = trades.length > 0 ? trades.reduce((acc, t) => acc + Math.abs(t.rrr), 0) / trades.length : 0;

  const data = [
    { metric: "Win Rate", value: Math.min(winRate * 1.5, 100) },
    { metric: "Profit", value: Math.min(profitFactor * 20, 100) },
    { metric: "Avg RR", value: Math.min(avgRR * 25, 100) },
    { metric: "Recovery", value: 85 }, 
    { metric: "Drawdown", value: 78 }, 
    { metric: "Consistency", value: 88 },
  ];

  const score = (data.reduce((acc, curr) => acc + curr.value, 0) / data.length).toFixed(1);

  return (
    <div className="relative overflow-hidden bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.45)] h-full flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 h-40 w-40 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="mb-2 flex-shrink-0 relative z-10 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Vyro Score</h2>
      </div>

      <div className="flex-grow flex items-center justify-center relative overflow-hidden min-h-0 py-4">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl"></div>
        </div>
        <ResponsiveContainer width="100%" height="100%" className="relative z-10">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }} />
            <Radar dataKey="value" stroke="#00df73" fill="#00df73" fillOpacity={0.3} strokeWidth={2} isAnimationActive={false} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 border-t border-white/[0.05] pt-4 relative z-10 flex-shrink-0">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-emerald-400/70 text-[10px] uppercase tracking-[0.3em] font-bold">VYRO SCORE</p>
            <h3 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">{score}</h3>
          </div>
        </div>

        <div className="relative">
          <div className="h-2.5 rounded-full overflow-hidden bg-white/[0.05] border border-white/[0.05]">
            <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500" style={{ width: `${score}%` }} />
          </div>
          <div className="absolute top-[-4px] h-4 w-4 rounded-full bg-emerald-400 border-2 border-[#081018] shadow-[0_0_25px_rgba(0,223,115,0.9)]" style={{ left: `calc(${score}% - 8px)` }} />
          <div className="flex justify-between mt-3 text-[10px] text-slate-500 font-bold">
            <span>0</span><span>20</span><span>40</span><span>60</span><span>80</span><span>100</span>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- INTERNAL COMPONENT: TRADING CALENDAR ---
const TradingCalendar = ({ trades }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const { calendarDays, weeklyData } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let blanks = Array.from({ length: firstDayOfMonth }).map(() => null);
    let daysArr = Array.from({ length: daysInMonth }).map((_, i) => {
      const dayDate = new Date(year, month, i + 1);
      const dayTrades = trades.filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === i + 1;
      });
      const pnl = dayTrades.reduce((acc, t) => acc + t.pnl, 0);
      return { day: i + 1, pnl, trades: dayTrades.length, date: dayDate };
    });

    let allDays = [...blanks, ...daysArr];
    while (allDays.length < 42) allDays.push(null);

    let weeklyData = [];
    for (let i = 0; i < 6; i++) {
      let weekSlice = allDays.slice(i * 7, (i + 1) * 7);
      let weekPnl = weekSlice.reduce((acc, day) => acc + (day?.pnl || 0), 0);
      let weekDays = weekSlice.filter(day => day && day.trades > 0).length;
      weeklyData.push({ pnl: weekPnl, days: weekDays });
    }

    return { calendarDays: allDays, weeklyData };
  }, [currentDate, trades]);

  const monthTrades = trades.filter((t) => {
    const d = new Date(t.date);
    return d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth();
  });
  
  const netPnl = monthTrades.reduce((acc, t) => acc + t.pnl, 0);

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="absolute -top-20 -right-20 h-64 w-64 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex items-center justify-between mb-6 pb-5 border-b border-white/[0.08] relative z-10">
        <div className="flex items-center gap-4">
          <button onClick={previousMonth} className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl text-slate-300 hover:text-white hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all flex items-center justify-center font-bold flex-shrink-0">←</button>
          <h2 className="text-xl font-black tracking-tight text-white min-w-[160px] text-center drop-shadow-lg">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button onClick={nextMonth} className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl text-slate-300 hover:text-white hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all flex items-center justify-center font-bold flex-shrink-0">→</button>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-2xl px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.25em] font-bold">Net P&L</p>
          <p className={`font-black text-xl tracking-tight ${netPnl >= 0 ? "text-emerald-400 drop-shadow-[0_0_10px_rgba(0,223,115,0.4)]" : "text-red-400 drop-shadow-[0_0_10px_rgba(212,0,66,0.4)]"}`}>{netPnl >= 0 ? "+" : "-"}{formatPnl(Math.abs(netPnl))}</p>
        </div>
      </div>

      <div className="flex gap-5 flex-grow min-h-0 relative z-10">
        <div className="flex-1 flex flex-col">
          <div className="grid grid-cols-7 gap-2 mb-3">
            {days.map((day) => (
              <div key={day} className="flex justify-center">
                <span className="h-8 w-14 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex items-center justify-center text-[9px] text-slate-300 font-black uppercase tracking-widest shadow-sm">{day}</span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 grid-rows-6 gap-2 flex-grow">
            {calendarDays.map((item, index) => {
              if (!item) return <div key={`blank-${index}`} className="bg-transparent"></div>;
              const isPositive = item.pnl > 0;
              const isNegative = item.pnl < 0;
              const hasTrades = item.trades > 0;

              return (
                <div key={item.day} className={`flex flex-col rounded-2xl border p-2.5 transition-all duration-300 cursor-pointer backdrop-blur-md ${isPositive ? `bg-emerald-500/10 border-emerald-500/30 shadow-[0_4px_20px_rgba(0,223,115,0.1)] hover:shadow-[0_0_25px_rgba(0,223,115,0.3)] hover:scale-[1.04] hover:border-emerald-500/60` : isNegative ? `bg-red-500/10 border-red-500/30 shadow-[0_4px_20px_rgba(212,0,66,0.1)] hover:shadow-[0_0_25px_rgba(212,0,66,0.3)] hover:scale-[1.04] hover:border-red-500/60` : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1]"}`}>
                  <p className={`text-xs font-bold ${hasTrades ? "text-white" : "text-slate-500"}`}>{item.day}</p>
                  {hasTrades && (
                    <div className="mt-auto pt-2">
                      <p className={`text-sm font-black ${isPositive ? "text-emerald-400" : "text-red-400"}`}>{isPositive ? "+" : "-"}{formatPnl(Math.abs(item.pnl))}</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-1">{item.trades} {item.trades === 1 ? "trade" : "trades"}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-[150px] flex flex-col">
          <div className="h-8 mb-3"></div>
          <div className="grid grid-rows-6 gap-2 flex-grow">
            {weeklyData.map((week, index) => {
              const hasData = week.pnl !== 0 || week.days > 0;
              return (
                <div key={index} className={`rounded-2xl p-3 flex flex-col justify-center border transition-all duration-300 backdrop-blur-md shadow-sm ${week.pnl > 0 ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgba(0,223,115,0.2)]' : week.pnl < 0 ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(212,0,66,0.2)]' : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'}`}>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Week {index + 1}</p>
                  <p className={`text-base font-black mt-1 tracking-tight ${week.pnl > 0 ? "text-emerald-400" : week.pnl < 0 ? "text-red-400" : "text-slate-600"}`}>{hasData && week.pnl !== 0 ? `${week.pnl > 0 ? "+" : "-"}${formatPnl(Math.abs(week.pnl))}` : "—"}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-1">{week.days > 0 ? `${week.days} days` : ""}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT: DASHBOARD ---
export default function Dashboard({ user, onLogout, activePage, onNavigate }) {
  const { trades, addTrade, accounts, activeAccountId, setActiveAccountId } = useTrades();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false); // Custom dropdown state

  const handleSaveTrade = async (tradeData) => {
    await addTrade(tradeData);
    setIsModalOpen(false);
  };

  // FILTER TRADES BY ACTIVE ACCOUNT
  const accountTrades = trades.filter(t => t.account_id === activeAccountId);
  const activeAccount = accounts.find(a => a.id === activeAccountId);

  // CALCULATIONS
  const netPnl = accountTrades.reduce((acc, t) => acc + t.pnl, 0);
  const wins = accountTrades.filter((t) => t.win).length;
  const losses = accountTrades.length - wins;
  const winRate = accountTrades.length > 0 ? (wins / accountTrades.length) * 100 : 0;
  
  // Current Winning Streak Logic
  const sortedTrades = [...accountTrades].sort((a, b) => new Date(a.date) - new Date(b.date));
  let currentStreak = 0;
  if (sortedTrades.length > 0) {
    for (let i = sortedTrades.length - 1; i >= 0; i--) {
      if (sortedTrades[i].win) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  const recentTrades = [...accountTrades].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  const stats = [
    { title: "Net P&L", value: `$${netPnl.toLocaleString()}`, type: "trend", isPositive: netPnl >= 0 },
    { title: "Win Rate", value: `${winRate.toFixed(1)}%`, type: "ring", winRate: winRate },
    { title: "Total Trades", value: accountTrades.length, type: "bars", wins, losses },
    { title: "Current Streak", value: currentStreak, type: "streak" },
  ];

  return (
    <div className="min-h-screen bg-[#020408] text-white flex relative overflow-hidden">
      <div className="absolute top-[-15%] right-[-5%] w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[5%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      <Sidebar activePage={activePage} onNavigate={onNavigate} onAddTradeClick={() => setIsModalOpen(true)} />

      <main className="flex-1 p-8 overflow-y-auto relative z-10 premium-scroll">
        {/* Premium Header with Custom Account Switcher */}
        <div className="flex items-center justify-between mb-12 animate-fade-in-up">
          <div>
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-lg">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00df73] to-[#00ff85] drop-shadow-[0_0_15px_rgba(0,223,115,0.4)]">{user?.displayName?.split(" ")[0] || "Trader"}</span>
            </h1>
            <p className="text-slate-400 mt-3 text-lg font-medium">Your trading performance at a glance.</p>
          </div>
          
          {/* Custom Premium Account Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
              className="relative bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl rounded-2xl px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.45)] min-w-[220px] flex items-center justify-between gap-4 hover:border-emerald-500/20 transition-all z-10"
            >
              <div className="text-left">
                <label className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold block mb-1">Active Account</label>
                <p className="text-white font-bold text-sm truncate">
                  {activeAccount?.name || "Select"} <span className="text-slate-500 font-medium">({activeAccount?.type})</span>
                </p>
              </div>
              <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isAccountDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} />
            </button>

            {isAccountDropdownOpen && (
              <>
                {/* Invisible Backdrop to close dropdown on outside click */}
                <div className="fixed inset-0 z-10" onClick={() => setIsAccountDropdownOpen(false)}></div>
                
                {/* Custom Dropdown Menu */}
                <div className="absolute top-full mt-2 right-0 w-full min-w-[220px] bg-[#040812]/95 border border-white/[0.08] backdrop-blur-2xl rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden z-20 animate-fade-in-up">
                  {accounts.map(acc => (
                    <button
                      key={acc.id}
                      onClick={() => { 
                        setActiveAccountId(acc.id); 
                        setIsAccountDropdownOpen(false); 
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-emerald-500/10 transition-colors group border-b border-white/[0.03] last:border-b-0 ${acc.id === activeAccountId ? 'bg-white/[0.02]' : ''}`}
                    >
                      <div>
                        <p className={`font-bold text-sm ${acc.id === activeAccountId ? 'text-emerald-400' : 'text-white group-hover:text-emerald-400'}`}>{acc.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{acc.type} • ${acc.size.toLocaleString()}</p>
                      </div>
                      {acc.id === activeAccountId && (
                        <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#00df73]"></div>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.title} 
              className="relative overflow-hidden bg-white/[0.03] border border-white/[0.06] backdrop-blur-2xl rounded-3xl px-6 py-5 flex flex-col justify-between h-[140px] hover:border-emerald-500/20 hover:shadow-[0_0_30px_rgba(0,223,115,0.1)] transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="absolute -top-10 -right-10 h-24 w-24 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />
              
              <div className="flex justify-between items-start relative z-10">
                <p className="text-slate-500 text-xs uppercase tracking-[0.25em] font-bold">{stat.title}</p>
                <div className="mt-0">
                  {stat.type === "trend" && <TrendingUp size={22} className={stat.isPositive ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(0,223,115,0.5)]" : "text-red-400 drop-shadow-[0_0_8px_rgba(212,0,66,0.5)]"} />}
                  
                  {stat.type === "ring" && (
                    <div className="relative h-8 w-8">
                      <svg className="h-8 w-8 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#00df73" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(stat.winRate / 100) * 97.4} 97.4`} className="drop-shadow-[0_0_4px_rgba(0,223,115,0.5)]" />
                      </svg>
                    </div>
                  )}
                  
                  {stat.type === "bars" && (
                    <div className="w-14 text-center">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-emerald-400 text-[10px] font-bold">{stat.wins}W</span>
                        <span className="text-red-400 text-[10px] font-bold">{stat.losses}L</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden flex">
                        <div className="h-full bg-emerald-400" style={{ width: `${stat.wins + stat.losses > 0 ? (stat.wins / (stat.wins + stat.losses)) * 100 : 0}%` }} />
                        <div className="h-full bg-red-400" style={{ width: `${stat.wins + stat.losses > 0 ? (stat.losses / (stat.wins + stat.losses)) * 100 : 0}%` }} />
                      </div>
                    </div>
                  )}

                  {stat.type === "streak" && (
                    <Flame size={24} className={`drop-shadow-[0_0_8px_rgba(251,146,60,0.6)] ${currentStreak > 0 ? "text-orange-400 animate-pulse" : "text-slate-600"}`} />
                  )}
                </div>
              </div>

              <h3 className={`text-4xl font-black tracking-tight drop-shadow-lg relative z-10 ${stat.title === "Net P&L" && netPnl < 0 ? "text-red-400" : "text-white"}`}>
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          <div className="col-span-12 xl:col-span-4 flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="h-[550px]">
              <VyroScore trades={accountTrades} />
            </div>

            <div className="h-[350px] relative overflow-hidden bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.45)] flex flex-col">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-center mb-4 flex-shrink-0 relative z-10">
                <h2 className="text-xl font-bold text-white">Recent Trades</h2>
                <button className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider">View All</button>
              </div>

              <div className="space-y-3 relative z-10 overflow-y-auto premium-scroll pr-2 h-full">
                {accountTrades.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <p className="text-slate-600 text-sm">No trades logged yet.</p>
                  </div>
                ) : (
                  recentTrades.map((trade) => (
                    <div key={trade.id} className="flex justify-between items-center p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/20 hover:bg-white/[0.04] transition-all duration-300 group">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs ${trade.pnl > 0 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                          {trade.pair.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">{trade.pair}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{trade.strategy} • {new Date(trade.date).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`font-black text-sm ${trade.pnl > 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {trade.pnl > 0 ? "+" : "-"}${Math.abs(trade.pnl).toLocaleString()}
                        </p>
                        <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wider font-bold">
                          {trade.rrr > 0 ? `+${trade.rrr}R` : `${trade.rrr}R`}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="col-span-12 xl:col-span-8 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <div className="relative overflow-hidden bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.45)] h-[924px]">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-500/10 rounded-full blur-3xl" />
              <TradingCalendar trades={accountTrades} />
            </div>
          </div>
        </div>
      </main>

      {/* Add Trade Modal */}
      <AddTradeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTrade} 
      />
    </div>
  );
}