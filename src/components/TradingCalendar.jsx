// file: src/components/TradingCalendar.jsx
import React, { useState, useMemo } from "react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function TradingCalendar({ trades }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Calendar Grid Logic
  const { calendarDays, weeklyPnl } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let blanks = Array.from({ length: firstDayOfMonth }).map(() => null);
    let days = Array.from({ length: daysInMonth }).map((_, i) => {
      const dayDate = new Date(year, month, i + 1);
      const dayTrades = trades.filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === i + 1;
      });
      
      const pnl = dayTrades.reduce((acc, t) => acc + t.pnl, 0);
      return { day: i + 1, pnl, trades: dayTrades.length, date: dayDate };
    });

    let allDays = [...blanks, ...days];
    
    // Pad end of array to be a multiple of 7 (42 total cells usually)
    while (allDays.length % 7 !== 0) {
      allDays.push(null);
    }

    // Calculate Weekly P&L
    let weeklyData = [];
    for (let i = 0; i < allDays.length; i += 7) {
      let weekPnl = allDays.slice(i, i + 7).reduce((acc, day) => acc + (day?.pnl || 0), 0);
      weeklyData.push(weekPnl);
    }

    return { calendarDays: allDays, weeklyPnl: weeklyData };
  }, [currentDate, trades]);

  // Overall Monthly Stats
  const monthTrades = trades.filter((t) => {
    const d = new Date(t.date);
    return d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth();
  });
  
  const netPnl = monthTrades.reduce((acc, t) => acc + t.pnl, 0);
  const totalTrades = monthTrades.length;
  const wins = monthTrades.filter((t) => t.pnl > 0).length;
  const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : 0;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={previousMonth} className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">←</button>
          <h2 className="text-xl font-bold text-white">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button onClick={nextMonth} className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">→</button>
        </div>

        <div className="flex items-center gap-5">
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider">Net P&L</p>
            <p className={`font-semibold ${netPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>{netPnl >= 0 ? "+" : "-"}${Math.abs(netPnl).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider">Trades</p>
            <p className="text-white font-semibold">{totalTrades}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider">Win Rate</p>
            <p className="text-white font-semibold">{winRate}%</p>
          </div>
        </div>
      </div>

      {/* Calendar + Weekly Summary */}
      <div className="grid grid-cols-[1fr_140px] gap-4 flex-grow min-h-0">
        
        {/* Calendar Grid */}
        <div className="flex flex-col">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {days.map((day) => (
              <div key={day} className="text-center text-xs text-slate-500 font-medium">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 grid-rows-6 gap-2 flex-grow">
            {calendarDays.map((item, index) => {
              if (!item) return <div key={`blank-${index}`} className="opacity-0"></div>;
              
              const isPositive = item.pnl > 0;
              const isNegative = item.pnl < 0;
              const hasTrades = item.trades > 0;
              const intensity = hasTrades ? Math.min(Math.abs(item.pnl) / 5000, 1) : 0; // Scale for opacity

              return (
                <div 
                  key={item.day} 
                  className={`flex flex-col rounded-xl border p-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer
                  ${isPositive ? `bg-emerald-500/20 border-emerald-500/30` : isNegative ? `bg-red-500/20 border-red-500/30` : "bg-white/[0.02] border-white/[0.05]"}`}
                  style={hasTrades ? { backgroundColor: isPositive ? `rgba(0, 223, 115, ${0.1 + intensity * 0.3})` : `rgba(212, 0, 66, ${0.1 + intensity * 0.3})` } : {}}
                >
                  <p className="text-xs text-slate-400">{item.day}</p>
                  {hasTrades && (
                    <div className="mt-auto">
                      <p className={`text-xs font-bold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                        {isPositive ? "+" : "-"}${Math.abs(item.pnl).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-500">{item.trades}T</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Totals Sidebar */}
        <div className="flex flex-col gap-3">
          {weeklyPnl.map((pnl, index) => (
            <div key={index} className="bg-[#081018]/80 border border-white/[0.08] rounded-2xl p-4 flex-grow flex flex-col justify-center">
              <p className="text-xs text-slate-500">Week {index + 1}</p>
              <p className={`font-bold text-lg mt-1 ${pnl > 0 ? "text-emerald-400" : pnl < 0 ? "text-red-400" : "text-slate-400"}`}>
                {pnl > 0 ? "+" : pnl < 0 ? "-" : ""}${Math.abs(pnl).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}