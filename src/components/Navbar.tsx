import React from "react";
import { Code2, LogOut, Sparkles, User as UserIcon, Shield } from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  user: UserProfile | null;
  onLogout: () => void;
  onNavigate: (view: "dashboard" | "analyzer" | "history") => void;
  currentView: "dashboard" | "analyzer" | "history";
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onNavigate,
  currentView,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            id="brand-home-btn"
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white">
                  CODELENS
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Understand • Analyze • Optimize
              </p>
            </div>
          </button>
        </div>

        {/* Center / Navigation Pills on tablet/desktop */}
        <div className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-sm">
          <button
            id="nav-dashboard-btn"
            onClick={() => onNavigate("dashboard")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              currentView === "dashboard"
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Dashboard
          </button>
          <button
            id="nav-analyzer-btn"
            onClick={() => onNavigate("analyzer")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              currentView === "analyzer"
                ? "bg-cyan-500 text-slate-950 font-semibold shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Analyze Code
            </span>
          </button>
          <button
            id="nav-history-btn"
            onClick={() => onNavigate("history")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              currentView === "history"
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            My History
          </button>
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl px-2.5 py-1.5">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-7 h-7 rounded-full border border-slate-600 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center text-xs font-bold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                    {user.displayName || "Student Developer"}
                    {user.isAnonymous && (
                      <span className="text-[10px] text-amber-400 font-normal">(Guest)</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 max-w-[140px] truncate">
                    {user.email || "Active Session"}
                  </div>
                </div>
              </div>

              <button
                id="logout-btn"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Student Learning Mode</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
