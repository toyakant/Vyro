// file: src/components/Sidebar.jsx
import React, { useState } from "react";
import {
  LayoutDashboard,
  CandlestickChart,
  BarChart3,
  Calendar,
  Image as ImageIcon,
  Settings,
  Plus,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

// Navigation items array for cleaner code
const navItems = [
  { id: "Dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "Trades", icon: CandlestickChart, label: "Trades" },
  { id: "Analytics", icon: BarChart3, label: "Analytics" },
  { id: "Calendar", icon: Calendar, label: "Calendar" },
  { id: "Gallery", icon: ImageIcon, label: "Gallery" },
  { id: "Settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard"); // Mock active state

  return (
    <aside
      className={`h-screen sticky top-0 bg-[#040812]/80 border-r border-white/[0.08] backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.4)] flex flex-col transition-all duration-300 ease-in-out z-20 ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      {/* Toggle */}
      <div className={`flex ${collapsed ? "justify-center" : "justify-end"} p-4`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Logo */}
      <div className="px-4 pb-4 border-b border-white/[0.08]">
        <div className={`flex flex-col items-center justify-center ${collapsed ? "gap-0" : "gap-2"}`}>
          <img
            src="/logo2.png"
            alt="Vyro"
            className={`object-contain transition-all duration-300 ${
              collapsed ? "h-10 w-10" : "h-12 w-12"
            }`}
          />
          {!collapsed && (
            <h2 className="text-xl font-black tracking-[0.25em] bg-gradient-to-r from-white via-emerald-300 to-emerald-500 bg-clip-text text-transparent whitespace-nowrap">
              VYRO
            </h2>
          )}
        </div>
      </div>

      {/* Add Trade */}
      <div className="p-4">
        <button
          className={`w-full bg-[#00df73] hover:bg-[#00ff85] text-black font-black py-3 rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,223,115,0.5)] flex items-center justify-center gap-2 group ${
            collapsed ? "px-0" : "px-4"
          }`}
        >
          <Plus size={18} className="transition-transform group-hover:rotate-90 duration-300" />
          {!collapsed && <span className="whitespace-nowrap">Add Trade</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`relative w-full flex items-center ${
                collapsed ? "justify-center" : "gap-3 px-4"
              } py-3 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? "bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_25px_rgba(0,223,115,0.15)]"
                  : "border border-transparent hover:bg-white/[0.05]"
              }`}
            >
              {/* Active Glowing Left Bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-[#00df73] rounded-r-full shadow-[0_0_10px_#00df73]"></span>
              )}
              
              <Icon 
                size={18} 
                className={`transition-colors duration-200 ${
                  isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-white group-hover:scale-110"
                }`} 
              />
              {!collapsed && (
                <span className={`text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  isActive ? "text-emerald-400" : "text-slate-300"
                }`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/[0.08]">
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-3 backdrop-blur-xl mb-3">
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
            <div className="h-9 w-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center overflow-hidden flex-shrink-0">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-emerald-400 font-bold text-sm">
                  {user?.displayName?.charAt(0) || "V"}
                </span>
              )}
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white text-sm truncate">
                  {user?.displayName || "Trader"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onLogout?.()}
          className={`w-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 py-3 rounded-2xl font-medium transition-all flex items-center justify-center gap-2 group ${
            collapsed ? "px-0" : "px-4"
          }`}
        >
          <LogOut size={18} className="group-hover:scale-110 transition-transform" />
          {!collapsed && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </aside>
  );
}