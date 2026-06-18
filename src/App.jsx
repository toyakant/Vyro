import React, { useState } from 'react';
import AuthPage from './components/Auth';

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userName) => {
    setUser({ name: userName });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <AuthPage onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-sans p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-6 backdrop-blur-sm">
        <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold border border-emerald-500/20 animate-pulse">
          ✓
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Authentication Successful!</h1>
          <p className="text-slate-400 text-sm">
            Welcome back to the trading terminal, <span className="text-emerald-400 font-semibold">{user.name}</span>.
          </p>
        </div>

        <div className="p-4 bg-slate-950/50 border border-slate-800/60 rounded-xl text-left text-xs space-y-1 font-mono text-slate-500">
          <div>[status] Token verified client-side</div>
          <div>[session] Active UI state frame</div>
          <div>[module] Ready to mount dashboard views</div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-slate-800 hover:bg-slate-700 font-medium py-3 rounded-xl transition-all duration-200 text-sm border border-slate-700/60"
        >
          Secure Log Out
        </button>
      </div>
    </div>
  );
}