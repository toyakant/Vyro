// file: src/context/TradeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase";

const TradeContext = createContext();

export function TradeProvider({ children }) {
  const [trades, setTrades] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [activeAccountId, setActiveAccountId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: accData } = await supabase.from("accounts").select("*");
      if (accData && accData.length > 0) {
        setAccounts(accData);
        setActiveAccountId(accData[0].id);
      }

      const { data: tradeData } = await supabase.from("trades").select("*");
      if (tradeData) {
        const formattedTrades = tradeData.map(t => ({ 
          ...t, 
          date: new Date(t.date),
          setupRating: t.setup_rating
        }));
        setTrades(formattedTrades);
      }

      setLoading(false);
    };

    fetchData();

    const tradeChannel = supabase
      .channel("public:trades")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "trades" }, (payload) => {
        setTrades((prev) => [{ ...payload.new, date: new Date(payload.new.date), setupRating: payload.new.setup_rating }, ...prev]);
      })
      .subscribe();

    const accountChannel = supabase
      .channel("public:accounts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "accounts" }, (payload) => {
        setAccounts((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(tradeChannel);
      supabase.removeChannel(accountChannel);
    };
  }, []);

  const addTrade = async (trade) => {
    const { data, error } = await supabase.from("trades").insert([{
      account_id: activeAccountId,
      pair: trade.pair,
      side: trade.side,
      pnl: trade.pnl,
      rrr: trade.rrr,
      win: trade.win,
      date: trade.date,
      strategy: trade.strategy,
      tags: trade.tags,
      emotions: trade.emotions,
      execution: trade.execution,
      setup_rating: trade.setupRating,
      notes: trade.notes,
      screenshots: trade.screenshots,
      timeframe: trade.timeframe,
      session: trade.session,
    }]).select();

    if (error) {
      console.error("Supabase Insert Error:", error);
      alert("Error saving trade: " + error.message);
    } else if (data) {
      setTrades((prev) => [{ ...data[0], date: new Date(data[0].date), setupRating: data[0].setup_rating }, ...prev]);
    }
  };

  // NEW: Update Trade
  const updateTrade = async (id, updatedData) => {
    const { data, error } = await supabase.from("trades").update({
      pair: updatedData.pair,
      side: updatedData.side,
      pnl: updatedData.pnl,
      rrr: updatedData.rrr,
      win: updatedData.win,
      date: updatedData.date,
      strategy: updatedData.strategy,
      tags: updatedData.tags,
      emotions: updatedData.emotions,
      execution: updatedData.execution,
      setup_rating: updatedData.setupRating,
      notes: updatedData.notes,
      screenshots: updatedData.screenshots,
      timeframe: updatedData.timeframe,
      session: updatedData.session,
      account_id: activeAccountId
    }).eq("id", id).select();

    if (error) {
      console.error("Supabase Update Error:", error);
      alert("Error updating trade: " + error.message);
    } else if (data) {
      setTrades(prev => prev.map(t => t.id === id ? { ...data[0], date: new Date(data[0].date), setupRating: data[0].setup_rating } : t));
    }
  };

  // NEW: Delete Trade
  const deleteTrade = async (id) => {
    const { error } = await supabase.from("trades").delete().eq("id", id);
    if (error) {
      console.error("Supabase Delete Error:", error);
      alert("Error deleting trade: " + error.message);
    } else {
      setTrades(prev => prev.filter(t => t.id !== id));
    }
  };

  const addAccount = async (account) => {
    const { data, error } = await supabase.from("accounts").insert([
      { name: account.name, size: account.size, type: account.type }
    ]).select();

    if (error) {
      console.error("Error saving account:", error);
      alert("Error saving account: " + error.message);
    } else if (data) {
      setAccounts((prev) => [...prev, data[0]]);
      setActiveAccountId(data[0].id);
    }
  };

  return (
    <TradeContext.Provider 
      value={{ trades, addTrade, updateTrade, deleteTrade, accounts, activeAccountId, setActiveAccountId, addAccount, loading }}
    >
      {children}
    </TradeContext.Provider>
  );
}

export const useTrades = () => useContext(TradeContext);