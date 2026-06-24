// file: src/App.jsx
import React, { useEffect, useState } from "react";
import AuthPage from "./components/Auth";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Trades from "./pages/Trades"; // <-- ADDED: Import Trades page
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("Dashboard"); // Default to Dashboard

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
    setUser(null);
    setCurrentPage("Dashboard"); // Reset to dashboard on logout
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // SECURITY GATE
  if (!user || (user && !user.emailVerified)) {
    return <AuthPage user={user} />;
  }

  // PAGE ROUTER
  if (currentPage === "Settings") {
    return <Settings user={user} onLogout={handleLogout} activePage={currentPage} onNavigate={setCurrentPage} />;
  }

  // ADDED: Trades Route
  if (currentPage === "Trades") {
    return <Trades activePage={currentPage} onNavigate={setCurrentPage} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} activePage={currentPage} onNavigate={setCurrentPage} />;
}