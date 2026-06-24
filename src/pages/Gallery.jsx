// file: src/pages/Gallery.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import { useTrades } from "../context/TradeContext";
import { Image as ImageIcon } from "lucide-react";

export default function Gallery({ activePage, onNavigate }) {
  const { trades, activeAccountId } = useTrades();
  
  // Get all trades for this account that HAVE screenshots
  const accountTrades = trades.filter(t => t.account_id === activeAccountId && t.screenshots && t.screenshots.length > 0);

  // Flatten into a single array of image objects with their trade data
  const galleryImages = accountTrades.flatMap(trade => 
    trade.screenshots.map(img => ({ img, pair: trade.pair, date: trade.date, pnl: trade.pnl }))
  );

  return (
    <div className="min-h-screen bg-[#020408] text-white flex relative overflow-hidden">
      <div className="absolute top-[-15%] right-[-5%] w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[5%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      <main className="flex-1 p-8 overflow-y-auto relative z-10 premium-scroll">
        <div className="flex justify-between items-center mb-12 animate-fade-in-up">
          <div>
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-lg">Trade Gallery</h1>
            <p className="text-slate-400 mt-3 text-lg font-medium">{galleryImages.length} screenshots uploaded.</p>
          </div>
        </div>

        {galleryImages.length === 0 ? (
          <div className="relative overflow-hidden bg-white/[0.03] border border-white/[0.06] rounded-3xl p-12 text-center backdrop-blur-2xl animate-fade-in-up">
            <div className="flex flex-col items-center justify-center">
              <ImageIcon size={48} className="text-slate-700 mb-4" />
              <p className="text-slate-500 font-bold text-lg">No screenshots found.</p>
              <p className="text-slate-600 text-sm mt-2">Upload chart images when logging a trade to see them here!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up">
            {galleryImages.map((item, index) => (
              <div key={index} className="relative group rounded-2xl overflow-hidden border border-white/[0.08] h-64 shadow-lg hover:shadow-[0_0_30px_rgba(0,223,115,0.15)] transition-all">
                <img src={item.img} alt={`Trade ${item.pair}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-bold text-lg">{item.pair}</p>
                  <p className="text-slate-400 text-xs">{new Date(item.date).toLocaleDateString()}</p>
                  <p className={`mt-1 font-black ${item.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {item.pnl >= 0 ? "+" : "-"}${Math.abs(item.pnl).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}