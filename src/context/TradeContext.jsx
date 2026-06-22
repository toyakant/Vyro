// file: src/context/TradeContext.jsx
import { createContext, useContext, useState } from "react";

const TradeContext = createContext();

// Generate some mock trades for the CURRENT month so the calendar has data
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth(); // 0-11

const mockTrades = [
  { id: "1", date: new Date(currentYear, currentMonth, 2), pair: "EURUSD", side: "Long", pnl: 7060, rrr: 2.1, win: true },
  { id: "2", date: new Date(currentYear, currentMonth, 3), pair: "NQ", side: "Short", pnl: -6400, rrr: -1, win: false },
  { id: "3", date: new Date(currentYear, currentMonth, 4), pair: "XAUUSD", side: "Long", pnl: -1810, rrr: -1, win: false },
  { id: "4", date: new Date(currentYear, currentMonth, 5), pair: "GBPUSD", side: "Long", pnl: -7990, rrr: -1.5, win: false },
  { id: "5", date: new Date(currentYear, currentMonth, 6), pair: "USDCAD", side: "Short", pnl: 9700, rrr: 3.2, win: true },
  { id: "6", date: new Date(currentYear, currentMonth, 9), pair: "EURUSD", side: "Short", pnl: 1750, rrr: 1.5, win: true },
  { id: "7", date: new Date(currentYear, currentMonth, 10), pair: "ES", side: "Long", pnl: 12300, rrr: 4.1, win: true },
  { id: "8", date: new Date(currentYear, currentMonth, 11), pair: "BTCUSD", side: "Long", pnl: 9890, rrr: 2.8, win: true },
  { id: "9", date: new Date(currentYear, currentMonth, 12), pair: "XAUUSD", side: "Short", pnl: -7910, rrr: -1, win: false },
  { id: "10", date: new Date(currentYear, currentMonth, 13), pair: "NQ", side: "Short", pnl: -6910, rrr: -1, win: false },
  { id: "11", date: new Date(currentYear, currentMonth, 16), pair: "EURUSD", side: "Long", pnl: 3470, rrr: 1.8, win: true },
  { id: "12", date: new Date(currentYear, currentMonth, 17), pair: "GBPUSD", side: "Short", pnl: 906, rrr: 1.2, win: true },
  { id: "13", date: new Date(currentYear, currentMonth, 18), pair: "ES", side: "Long", pnl: 12900, rrr: 3.5, win: true },
  { id: "14", date: new Date(currentYear, currentMonth, 19), pair: "USDCAD", side: "Long", pnl: -213, rrr: -0.5, win: false },
  { id: "15", date: new Date(currentYear, currentMonth, 20), pair: "XAUUSD", side: "Short", pnl: 4250, rrr: 2.0, win: true },
  { id: "16", date: new Date(currentYear, currentMonth, 23), pair: "BTCUSD", side: "Short", pnl: 1430, rrr: 1.4, win: true },
  { id: "17", date: new Date(currentYear, currentMonth, 24), pair: "NQ", side: "Long", pnl: -9260, rrr: -1.5, win: false },
  { id: "18", date: new Date(currentYear, currentMonth, 25), pair: "EURUSD", side: "Short", pnl: -9650, rrr: -1, win: false },
  { id: "19", date: new Date(currentYear, currentMonth, 26), pair: "ES", side: "Short", pnl: 4970, rrr: 2.2, win: true },
  { id: "20", date: new Date(currentYear, currentMonth, 27), pair: "XAUUSD", side: "Long", pnl: 2580, rrr: 1.9, win: true },
  { id: "21", date: new Date(currentYear, currentMonth, 30), pair: "GBPUSD", side: "Long", pnl: 2680, rrr: 2.5, win: true },
];

export function TradeProvider({ children }) {
  const [trades, setTrades] = useState(mockTrades);

  const addTrade = (trade) => {
    const newTrade = { ...trade, id: crypto.randomUUID() };
    setTrades((prev) => [newTrade, ...prev]);
  };

  return (
    <TradeContext.Provider value={{ trades, addTrade }}>
      {children}
    </TradeContext.Provider>
  );
}

export const useTrades = () => useContext(TradeContext);