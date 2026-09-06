import React from "react";
import { LayoutDashboard, Sparkles, History, Cpu, Database, Cloud, ShieldCheck } from "lucide-react";

interface SidebarProps {
  currentView: "dashboard" | "analyzer" | "history";
  onNavigate: (view: "dashboard" | "analyzer" | "history") => void;
  analysesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  analysesCount = 0,
}) => {
  const navItems = [
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
      desc: "Overview & metrics",
    },
    {
      id: "analyzer" as const,
      label: "Analyze Code",
      icon: Sparkles,
      badge: "AI",
      desc: "Step-by-step & Big-O",
    },
    {
      id: "history" as const,
      label: "My History",
      icon: History,
      badge: analysesCount > 0 ? analysesCount.toString() : null,
      desc: "Saved derivations",
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-slate-800 bg-slate-900/50 p-4 justify-between h-[calc(100vh-4rem)] sticky top-16">
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3">
            Main Navigation
          </span>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-${item.id}-btn`}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-xs"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-cyan-500/20 text-cyan-300"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Workflow reminder card */}
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
            <Cpu className="w-3.5 h-3.5" />
            <span>Learning Pipeline</span>
          </div>
          <div className="text-[11px] text-slate-400 space-y-1 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Paste / Upload Code</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>Break Down Logic</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>Trace Execution</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Derive Time & Space</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Learn Optimizations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Architecture Footer */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
        <div className="font-semibold text-slate-300 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Production Tech Stack</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/60 border border-slate-800">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>Gemini API</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/60 border border-slate-800">
            <Database className="w-3 h-3 text-amber-400" />
            <span>Firestore</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/60 border border-slate-800">
            <Cloud className="w-3 h-3 text-blue-400" />
            <span>Cloud Run</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/60 border border-slate-800">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Firebase Auth</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
