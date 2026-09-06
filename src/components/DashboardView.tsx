import React from "react";
import { UserProfile, SavedAnalysis } from "../types";
import { ComplexityBadge } from "./ComplexityBadge";
import {
  Sparkles,
  Layers,
  Zap,
  Code2,
  Clock,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Calendar,
  Cpu
} from "lucide-react";

interface DashboardViewProps {
  user: UserProfile | null;
  analyses: SavedAnalysis[];
  onAnalyzeNewCode: () => void;
  onSelectAnalysis: (analysis: SavedAnalysis) => void;
  onLoadExampleDemo: (exampleId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  analyses,
  onAnalyzeNewCode,
  onSelectAnalysis,
  onLoadExampleDemo,
}) => {
  // Compute metrics from Firestore analyses
  const totalAnalyses = analyses.length;

  const optimizationsFound = analyses.filter(
    (a) => a.optimization && a.optimization.available
  ).length;

  const uniqueLanguages = Array.from(
    new Set(analyses.map((a) => a.language).filter(Boolean))
  );

  const displayName = user?.displayName || (user?.isAnonymous ? "Student" : "Developer");

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Algorithm Mentor Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {displayName} 👋
          </h1>
          <p className="text-base text-slate-300 font-medium">
            "Ready to understand your code?"
          </p>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Break down code step-by-step, mathematically derive Big-O Time & Space complexities, and explore algorithmic optimizations with trade-offs.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="dashboard-analyze-new-btn"
              onClick={onAnalyzeNewCode}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze New Code</span>
            </button>

            <button
              id="dashboard-demo-two-sum-btn"
              onClick={() => onLoadExampleDemo("two-sum-brute")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Try Two Sum Optimization Demo</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none hidden md:block" />
      </div>

      {/* Firestore Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Total Analyses */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Total Analyses
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
              {totalAnalyses}
            </span>
            <p className="text-[11px] text-slate-400">Personal Firestore records</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Optimizations Found */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Optimizations Found
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">
              {optimizationsFound}
            </span>
            <p className="text-[11px] text-slate-400">Algorithmic improvements</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Languages Used */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Languages Used
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono">
              {uniqueLanguages.length}
            </span>
            <p className="text-[11px] text-slate-400">
              {uniqueLanguages.length > 0 ? uniqueLanguages.join(", ") : "C++, Python, Java, etc."}
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Code2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Analyses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Recent Analyses
            </h2>
          </div>
          {analyses.length > 0 && (
            <span className="text-xs text-slate-400">
              Showing last {Math.min(analyses.length, 6)} records
            </span>
          )}
        </div>

        {analyses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.slice(0, 6).map((item) => {
              const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric"
              });

              return (
                <div
                  key={item.id || item.createdAt}
                  onClick={() => onSelectAnalysis(item)}
                  className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-md flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {item.language}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {item.title || "Code Analysis"}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {item.overview}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ComplexityBadge complexity={item.timeComplexity} type="time" size="sm" />
                      <ComplexityBadge complexity={item.spaceComplexity} type="space" size="sm" />
                    </div>
                    <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-sm font-semibold text-white">No analyses recorded yet</h3>
              <p className="text-xs text-slate-400">
                Analyze your first algorithm to generate step-by-step logic breakdowns and Big-O derivations.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onLoadExampleDemo("nested-loops")}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-200 border border-slate-700 cursor-pointer"
              >
                Load C++ Nested Loops (O(n²))
              </button>
              <button
                onClick={() => onLoadExampleDemo("two-sum-brute")}
                className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-medium text-cyan-400 border border-cyan-500/30 cursor-pointer"
              >
                Load Two Sum Tradeoff Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
