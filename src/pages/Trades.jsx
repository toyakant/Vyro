// file: src/pages/Trades.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import AddTradeModal from "../components/AddTradeModal";
import { useTrades } from "../context/TradeContext";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";

export default function Trades({ activePage, onNavigate }) {
  const { trades, accounts, activeAccountId, deleteTrade, updateTrade } = useTrades();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);
  const [tradeToDelete, setTradeToDelete] = useState(null); // NEW: Holds the ID of the trade to delete

  const accountTrades = trades.filter(t => t.account_id === activeAccountId).sort((a,b) => new Date(b.date) - new Date(a.date));
  const activeAccount = accounts.find(a => a.id === activeAccountId);

  const handleEdit = (trade) => {
    setEditingTrade(trade);
    setIsModalOpen(true);
  };

  // Changed: Now just sets the ID to trigger the custom modal
  const handleDeleteClick = (id) => {
    setTradeToDelete(id);
  };

  // NEW: Actually delete the trade
  const confirmDelete = () => {
    deleteTrade(tradeToDelete);
    setTradeToDelete(null); // Close the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrade(null);
  };

  const handleUpdateTrade = (id, updatedData) => {
    updateTrade(id, updatedData);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white flex relative overflow-hidden">
      <div className="absolute top-[-15%] right-[-5%] w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[5%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      <main className="flex-1 p-8 overflow-y-auto relative z-10 premium-scroll">
        <div className="flex justify-between items-center mb-12 animate-fade-in-up">
          <div>
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-lg">Trade History</h1>
            <p className="text-slate-400 mt-3 text-lg font-medium">
              Viewing {accountTrades.length} trades on <span className="text-emerald-400 font-bold">{activeAccount?.name || "Account"}</span>
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white/[0.03] border border-white/[0.06] rounded-3xl backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.45)] animate-fade-in-up">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          {accountTrades.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 font-bold text-lg">No trades logged for this account yet.</p>
              <p className="text-slate-600 text-sm mt-2">Click "Add Trade" in the sidebar to log your first trade!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-white/[0.06]">
                  <tr className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    <th className="p-6">Date</th>
                    <th className="p-6">Pair</th>
                    <th className="p-6">Side</th>
                    <th className="p-6">Timeframe</th>
                    <th className="p-6">Session</th>
                    <th className="p-6">Strategy</th>
                    <th className="p-6 text-right">P&L</th>
                    <th className="p-6 text-right">RR</th>
                    <th className="p-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accountTrades.map((trade) => (
                    <tr key={trade.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                      <td className="p-6 text-sm text-slate-400 font-medium">{new Date(trade.date).toLocaleDateString()}</td>
                      <td className="p-6 text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{trade.pair}</td>
                      <td className="p-6">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${trade.side === "Long" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>{trade.side}</span>
                      </td>
                      <td className="p-6 text-sm text-slate-400 font-medium">{trade.timeframe || "N/A"}</td>
                      <td className="p-6 text-sm text-slate-400 font-medium">{trade.session || "N/A"}</td>
                      <td className="p-6 text-sm text-slate-400 font-medium">{trade.strategy || "N/A"}</td>
                      <td className={`p-6 text-sm font-black text-right ${trade.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {trade.pnl >= 0 ? "+" : "-"}${Math.abs(trade.pnl).toLocaleString()}
                      </td>
                      <td className={`p-6 text-sm font-bold text-right ${trade.rrr > 0 ? "text-emerald-400" : "text-red-400"}`}>{trade.rrr > 0 ? `+${trade.rrr}R` : `${trade.rrr}R`}</td>
                      
                      <td className="p-6">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => handleEdit(trade)} className="text-slate-500 hover:text-emerald-400 transition-colors">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDeleteClick(trade.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Trade Modal */}
      <AddTradeModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={() => {}} 
        editingTrade={editingTrade}
        onUpdate={handleUpdateTrade}
      />

      {/* PREMIUM CUSTOM DELETE CONFIRMATION MODAL */}
      {tradeToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in-up">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setTradeToDelete(null)}></div>
          
          <div className="relative w-full max-w-md bg-[#040812]/90 border border-white/[0.08] rounded-3xl backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] p-8 flex flex-col items-center text-center">
            {/* Red glowing top line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent rounded-t-3xl"></div>
            <div className="absolute -top-20 -right-20 h-48 w-48 bg-red-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            {/* Warning Icon */}
            <div className="relative h-16 w-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,0,66,0.2)]">
              <AlertTriangle size={28} className="text-red-400" />
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white mb-2">Delete Trade?</h2>
            <p className="text-slate-400 text-sm font-medium mb-8 max-w-xs">
              Are you sure you want to permanently delete this trade? This action cannot be undone.
            </p>

            {/* Action Buttons */}
            <div className="w-full flex gap-3">
              <button 
                onClick={() => setTradeToDelete(null)} 
                className="flex-1 bg-white/[0.03] border border-white/[0.06] text-slate-300 hover:bg-white/[0.05] py-3 rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 hover:shadow-[0_0_20px_rgba(212,0,66,0.3)] py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}