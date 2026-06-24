// file: src/components/AddTradeModal.jsx
import React, { useState, useEffect } from "react";
import { X, Upload, Flame, Plus, Calendar, Tag, Trash2, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useTrades } from "../context/TradeContext";

// --- PREMIUM CUSTOM DROPDOWN COMPONENT ---
const ModalSelect = ({ label, options, value, onChange, openId, setOpenId, id }) => {
  const isOpen = openId === id;
  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative">
      <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">{label}</label>
      <button 
        type="button"
        onClick={() => setOpenId(isOpen ? null : id)}
        className="w-full mt-2 bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-[#00df73] transition-all flex items-center justify-between gap-2"
      >
        <span className="truncate">{selectedOption?.label || "Select..."}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpenId(null)}></div>
          <div className="absolute top-full mt-2 left-0 w-full min-w-[180px] bg-[#040812]/95 border border-white/[0.08] backdrop-blur-2xl rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden z-30 max-h-60 overflow-y-auto premium-scroll animate-fade-in-up">
            {options.map(opt => (
              <button 
                type="button" 
                key={opt.value} 
                onClick={() => { onChange(opt.value); setOpenId(null); }}
                className={`w-full text-left px-4 py-3 text-sm font-semibold hover:bg-emerald-500/10 transition-colors border-b border-white/[0.03] last:border-b-0 flex items-center justify-between ${opt.value === value ? 'text-emerald-400 bg-white/[0.02]' : 'text-slate-300'}`}
              >
                {opt.label}
                {opt.value === value && <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#00df73]"></div>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- PREMIUM CUSTOM DATE PICKER COMPONENT ---
const CustomDatePicker = ({ date, setDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = new Date(date);
  const [viewDate, setViewDate] = useState(selectedDate);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysArr = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleSelect = (day) => {
    const newDate = new Date(year, month, day);
    const offset = newDate.getTimezoneOffset();
    const localDate = new Date(newDate.getTime() - offset * 60000);
    setDate(localDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  let blanks = Array.from({ length: firstDayOfMonth }).map(() => null);
  let days = Array.from({ length: daysInMonth }).map((_, i) => i + 1);
  let allDays = [...blanks, ...days];

  return (
    <div className="relative">
      <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">Date *</label>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full mt-2 bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-[#00df73] transition-all flex items-center relative z-10"
      >
        <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        {selectedDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full mt-2 left-0 w-72 bg-[#040812]/95 border border-white/[0.08] backdrop-blur-2xl rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] p-4 z-30 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <button type="button" onClick={prevMonth} className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"><ChevronLeft size={16} /></button>
              <p className="text-sm font-bold text-white">{monthsArr[month]} {year}</p>
              <button type="button" onClick={nextMonth} className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"><ChevronRight size={16} /></button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysArr.map(d => (
                <div key={d} className="text-center text-[9px] text-slate-500 font-bold uppercase">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {allDays.map((day, index) => {
                if (!day) return <div key={`blank-${index}`} className="h-8"></div>;
                const isSelected = day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
                return (
                  <button 
                    type="button" 
                    key={day} 
                    onClick={() => handleSelect(day)}
                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${isSelected ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(0,223,115,0.5)]' : 'text-slate-300 hover:bg-white/5'}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- MAIN ADD TRADE MODAL ---
export default function AddTradeModal({ isOpen, onClose, onSave, editingTrade = null, onUpdate }) {
  const { accounts, activeAccountId, setActiveAccountId } = useTrades();

  const [pair, setPair] = useState("");
  const [side, setSide] = useState("Long");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [pnl, setPnl] = useState("");
  const [risk, setRisk] = useState("");
  const [rrr, setRrr] = useState("");
  const [notes, setNotes] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const [timeframe, setTimeframe] = useState("1H");
  const [session, setSession] = useState("London");

  const [strategies, setStrategies] = useState([
    { id: 1, name: "Breakout", tags: ["Sweep", "High Volume"] },
    { id: 2, name: "Reversal", tags: ["Divergence", "Support"] }
  ]);
  const [selectedStrategyId, setSelectedStrategyId] = useState(1);
  const [activeTags, setActiveTags] = useState(strategies[0].tags);
  const [customTagInput, setCustomTagInput] = useState("");
  
  const [isAddingStrategy, setIsAddingStrategy] = useState(false);
  const [newStratName, setNewStratName] = useState("");
  const [newStratTags, setNewStratTags] = useState([]);
  const [newStratTagInput, setNewStratTagInput] = useState("");

  const [emotions, setEmotions] = useState(["Calm"]);
  const [execution, setExecution] = useState("A+");
  const [setupRating, setSetupRating] = useState(5);
  const [images, setImages] = useState([]);

  // Pre-fill form if editing
  useEffect(() => {
    if (editingTrade) {
      setPair(editingTrade.pair || "");
      setSide(editingTrade.side || "Long");
      setDate(editingTrade.date ? new Date(editingTrade.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
      setPnl(editingTrade.pnl?.toString() || "");
      setRrr(editingTrade.rrr?.toString() || "");
      setNotes(editingTrade.notes || "");
      setTimeframe(editingTrade.timeframe || "1H");
      setSession(editingTrade.session || "London");
      setEmotions(editingTrade.emotions || ["Calm"]);
      setExecution(editingTrade.execution || "A+");
      setSetupRating(editingTrade.setupRating || 5);
      setImages(editingTrade.screenshots || []);
      setActiveAccountId(editingTrade.account_id);
      
      const matchedStrat = strategies.find(s => s.name === editingTrade.strategy);
      if (matchedStrat) {
        setSelectedStrategyId(matchedStrat.id);
        setActiveTags(editingTrade.tags || matchedStrat.tags);
      } else {
        const tempStrat = { id: Date.now(), name: editingTrade.strategy || "Unknown", tags: editingTrade.tags || [] };
        setStrategies(prev => [...prev, tempStrat]);
        setSelectedStrategyId(tempStrat.id);
        setActiveTags(tempStrat.tags);
      }
    } else {
      // Reset to defaults when adding new
      setPair(""); setSide("Long"); setPnl(""); setRisk(""); setRrr("");
      setDate(new Date().toISOString().split('T')[0]); setNotes("");
      setTimeframe("1H"); setSession("London");
      setEmotions(["Calm"]); setExecution("A+"); setSetupRating(5);
      setImages([]); setOpenDropdown(null);
      if (strategies.length > 0) {
        setSelectedStrategyId(strategies[0].id);
        setActiveTags(strategies[0].tags);
      }
    }
  }, [editingTrade, isOpen]);

  if (!isOpen) return null;

  const handleStrategyChange = (val) => {
    const strat = strategies.find(s => s.id === Number(val));
    setSelectedStrategyId(Number(val));
    setActiveTags(strat.tags);
  };

  const deleteStrategy = (id) => {
    setStrategies(prev => prev.filter(s => s.id !== id));
    if (selectedStrategyId === id && strategies.length > 1) {
      const fallback = strategies.find(s => s.id !== id);
      setSelectedStrategyId(fallback.id);
      setActiveTags(fallback.tags);
    }
  };

  const toggleActiveTag = (tag) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const addCustomTag = (e) => {
    if (e.key === 'Enter' && customTagInput.trim()) {
      e.preventDefault();
      if (!activeTags.includes(customTagInput.trim())) {
        setActiveTags(prev => [...prev, customTagInput.trim()]);
      }
      setCustomTagInput("");
    }
  };

  const toggleEmotion = (emo) => {
    setEmotions(prev => prev.includes(emo) ? prev.filter(e => e !== emo) : [...prev, emo]);
  };

  const handleOpenNewStrat = () => {
    setIsAddingStrategy(true);
    setNewStratName("");
    setNewStratTags([]);
    setNewStratTagInput("");
  };

  const addNewStratTag = (e) => {
    if (e.key === 'Enter' && newStratTagInput.trim()) {
      e.preventDefault();
      if (!newStratTags.includes(newStratTagInput.trim())) {
        setNewStratTags(prev => [...prev, newStratTagInput.trim()]);
      }
      setNewStratTagInput("");
    }
  };

  const saveNewStrategy = () => {
    if (!newStratName.trim()) return;
    const newStrat = { id: Date.now(), name: newStratName.trim(), tags: newStratTags };
    setStrategies(prev => [...prev, newStrat]);
    setSelectedStrategyId(newStrat.id);
    setActiveTags(newStrat.tags);
    setIsAddingStrategy(false);
  };

  const handleScreenshots = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImages(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!pair.trim()) { alert("Pair is required."); return; }
    if (!date) { alert("Date is required."); return; }
    if (!activeAccountId) { alert("Please create an account in Settings first."); return; }
    if (!selectedStrategyId) { alert("Strategy is required."); return; }
    if (!pnl || isNaN(parseFloat(pnl))) { alert("Valid P&L is required."); return; }
    if (!rrr || isNaN(parseFloat(rrr))) { alert("Valid RR is required."); return; }
    if (emotions.length === 0) { alert("Please select at least one emotion."); return; }
    if (!execution) { alert("Execution quality is required."); return; }

    const numPnl = parseFloat(pnl);
    const strat = strategies.find(s => s.id === selectedStrategyId);

    const tradeData = {
      date: new Date(date),
      pair: pair.toUpperCase(),
      side,
      pnl: numPnl,
      rrr: parseFloat(rrr) || 0,
      win: numPnl >= 0,
      strategy: strat.name,
      tags: activeTags, 
      emotions, 
      execution,
      setupRating: parseFloat(setupRating),
      notes,
      screenshots: images,
      timeframe,
      session,
    };

    if (editingTrade && onUpdate) {
      onUpdate(editingTrade.id, tradeData);
    } else {
      onSave(tradeData);
    }
    
    setPair(""); setSide("Long"); setPnl(""); setRisk(""); setRrr("");
    setDate(new Date().toISOString().split('T')[0]); setNotes("");
    setEmotions(["Calm"]); setExecution("A+"); setSetupRating(5);
    setImages([]); setOpenDropdown(null);
    if (strategies.length > 0) {
      setSelectedStrategyId(strategies[0].id);
      setActiveTags(strategies[0].tags);
    }
  };

  const numberInputClass = "w-full mt-2 bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#00df73] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl bg-[#040812]/90 border border-white/[0.08] rounded-3xl backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] max-h-[95vh] flex flex-col">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-3xl"></div>
        <div className="absolute -top-20 -right-20 h-48 w-48 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex justify-between items-start p-10 pb-5 border-b border-white/[0.06] relative z-10 flex-shrink-0">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">{editingTrade ? "Edit Trade" : "Log New Trade"}</h2>
            <p className="text-slate-500 text-sm font-bold mt-1">Record your execution, psychology, and results.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto premium-scroll p-10 space-y-10 relative z-10">
          
          {/* Section 1: Setup */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.25em]">1. Trade Setup</h3>
            
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">Pair *</label>
                <input type="text" required placeholder="" value={pair} onChange={(e) => setPair(e.target.value)} className="w-full mt-2 bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#00df73] transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">Direction *</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button type="button" onClick={() => setSide("Long")} className={`py-3 rounded-xl text-sm font-bold border transition-all ${side === "Long" ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" : "bg-[#0a0e17]/80 border-slate-700/50 text-slate-400 hover:border-slate-600"}`}>Long</button>
                  <button type="button" onClick={() => setSide("Short")} className={`py-3 rounded-xl text-sm font-bold border transition-all ${side === "Short" ? "bg-red-500/20 border-red-500/40 text-red-300" : "bg-[#0a0e17]/80 border-slate-700/50 text-slate-400 hover:border-slate-600"}`}>Short</button>
                </div>
              </div>
              
              <CustomDatePicker date={date} setDate={setDate} />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <ModalSelect 
                id="timeframe"
                label="Timeframe *"
                options={["1m", "5m", "15m", "1H", "4H", "1D", "1W"].map(tf => ({ value: tf, label: tf }))}
                value={timeframe}
                onChange={setTimeframe}
                openId={openDropdown}
                setOpenId={setOpenDropdown}
              />
              <ModalSelect 
                id="session"
                label="Session *"
                options={["Sydney", "Tokyo", "London", "New York"].map(s => ({ value: s, label: s }))}
                value={session}
                onChange={setSession}
                openId={openDropdown}
                setOpenId={setOpenDropdown}
              />
              <ModalSelect 
                id="account"
                label="Account *"
                options={accounts.map(acc => ({ value: acc.id, label: `${acc.name} (${acc.type})` }))}
                value={activeAccountId || ""}
                onChange={setActiveAccountId}
                openId={openDropdown}
                setOpenId={setOpenDropdown}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="relative col-span-1">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <ModalSelect 
                      id="strategy"
                      label="Strategy *"
                      options={strategies.map(s => ({ value: s.id, label: s.name }))}
                      value={selectedStrategyId}
                      onChange={handleStrategyChange}
                      openId={openDropdown}
                      setOpenId={setOpenDropdown}
                    />
                  </div>
                  <button type="button" onClick={handleOpenNewStrat} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl px-4 h-[50px] hover:bg-emerald-500/20 transition-all flex items-center justify-center flex-shrink-0">
                    <Plus size={18} />
                  </button>
                </div>

                {isAddingStrategy && (
                  <div className="absolute top-full mt-2 right-0 w-80 bg-[#040812] border border-white/10 rounded-2xl p-5 shadow-2xl z-40 space-y-4">
                    <h4 className="text-sm font-bold text-white">Create / Manage Strategy</h4>
                    <div className="max-h-32 overflow-y-auto premium-scroll space-y-2">
                      {strategies.map(s => (
                        <div key={s.id} className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-2">
                          <span className="text-xs text-white font-medium">{s.name}</span>
                          <button type="button" onClick={() => deleteStrategy(s.id)} className="text-red-400/70 hover:text-red-400 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/10 pt-4 space-y-3">
                      <input type="text" placeholder="New Strategy Name (e.g., CRT)" value={newStratName} onChange={(e) => setNewStratName(e.target.value)} className="w-full bg-[#0a0e17]/80 border border-slate-700/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00df73]" />
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-bold">Tags / Conditions</label>
                        <input type="text" placeholder="Type tag & press Enter" value={newStratTagInput} onChange={(e) => setNewStratTagInput(e.target.value)} onKeyDown={addNewStratTag} className="w-full bg-[#0a0e17]/80 border border-slate-700/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00df73] mt-1" />
                        <div className="flex flex-wrap gap-1 mt-2">
                          {newStratTags.map(tag => (
                            <span key={tag} className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-md">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button type="button" onClick={() => setIsAddingStrategy(false)} className="flex-1 text-xs text-slate-400 hover:text-white py-2 rounded-lg border border-slate-700/50">Cancel</button>
                        <button type="button" onClick={saveNewStrategy} className="flex-1 text-xs bg-[#00df73] text-black font-bold py-2 rounded-lg hover:bg-[#00ff85]">Save Strategy</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2"><Tag size={12} /> Trade Tags & Conditions</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {activeTags.map(tag => (
                  <button key={tag} type="button" onClick={() => toggleActiveTag(tag)} className="py-1.5 px-3 rounded-full text-[10px] font-bold border bg-emerald-500/20 border-emerald-500/40 text-emerald-300 transition-all hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300">
                    {tag} ✕
                  </button>
                ))}
              </div>
              <input type="text" placeholder="Add custom tag for this trade & press Enter" value={customTagInput} onChange={(e) => setCustomTagInput(e.target.value)} onKeyDown={addCustomTag} className="w-full mt-3 bg-transparent border-dashed border-2 border-slate-700/50 rounded-xl px-4 py-2 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-[#00df73]" />
            </div>
          </div>

          {/* Section 2: Risk & Result */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.25em]">2. Risk & Result</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">P&L ($) *</label>
                <input type="number" required placeholder="" step="any" value={pnl} onChange={(e) => setPnl(e.target.value)} className={numberInputClass} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">Risk ($)</label>
                <input type="number" placeholder="" step="any" value={risk} onChange={(e) => setRisk(e.target.value)} className={numberInputClass} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">RR *</label>
                <input type="number" required placeholder="" step="any" value={rrr} onChange={(e) => setRrr(e.target.value)} className={numberInputClass} />
              </div>
            </div>
          </div>

          {/* Section 3: Execution & Psychology */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.25em]">3. Execution & Psychology</h3>
            
            <div>
              <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">Emotions *</label>
              <div className="grid grid-cols-6 gap-3 mt-2">
                {["Calm", "Confident", "FOMO", "Anxious", "Revenge", "Greedy"].map((emo) => (
                  <button key={emo} type="button" onClick={() => toggleEmotion(emo)} className={`py-2.5 rounded-lg text-[11px] font-bold border transition-all ${emotions.includes(emo) ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" : "bg-[#0a0e17]/80 border-slate-700/50 text-slate-400 hover:border-slate-600"}`}>{emo}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">Execution Quality *</label>
              <div className="grid grid-cols-6 gap-3 mt-2">
                {["A+", "A", "B+", "B", "C", "D"].map((exe) => (
                  <button key={exe} type="button" onClick={() => setExecution(exe)} className={`py-2.5 rounded-lg text-sm font-bold border transition-all ${execution === exe ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" : "bg-[#0a0e17]/80 border-slate-700/50 text-slate-400 hover:border-slate-600"}`}>{exe}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 tracking-wider uppercase flex justify-between">
                <span>Setup Rating</span> 
                <span className="text-emerald-400 font-black">{setupRating} / 10</span>
              </label>
              <input type="range" min="0" max="10" step="0.5" value={setupRating} onChange={(e) => setSetupRating(e.target.value)} className="w-full h-2 mt-4 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#00df73]" />
            </div>
          </div>

          {/* Section 4: Media & Notes */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.25em]">4. Media & Review</h3>
            
            <div>
              <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">Notes & Execution Review</label>
              <textarea rows="4" placeholder="What was your thought process? Did you follow your rules?" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full mt-2 bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#00df73] transition-all resize-none"></textarea>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">Screenshots</label>
              <label className="mt-2 flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-700/50 rounded-xl cursor-pointer bg-[#0a0e17]/80 hover:border-[#00df73] transition-all overflow-hidden relative">
                <div className="flex flex-col items-center justify-center pt-5">
                  <Upload size={22} className="text-slate-500 mb-2" />
                  <p className="text-sm text-slate-500 font-bold">Click to upload multiple chart images</p>
                </div>
                <input type="file" accept="image/*" multiple onChange={handleScreenshots} className="hidden" />
              </label>
              
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-5">
                  {images.map((img, index) => (
                    <div key={index} className="relative group h-32 w-full rounded-xl overflow-hidden border border-white/10">
                      <img src={img} alt={`Screenshot ${index}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-black/80 text-red-400 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="p-10 pt-5 border-t border-white/[0.06] relative z-10 flex-shrink-0 bg-[#040812]/90 backdrop-blur-xl">
          <button type="submit" onClick={handleSubmit} className="w-full bg-[#00df73] text-[#020408] font-black uppercase tracking-wider py-4 rounded-xl transition-all duration-300 hover:bg-[#00ff85] hover:shadow-[0_0_30px_rgba(0,223,115,0.5)] active:scale-[0.98] text-base flex items-center justify-center gap-2">
            <Flame size={18} /> {editingTrade ? "Update Trade" : "Save Trade"}
          </button>
        </div>
      </div>
    </div>
  );
}