import React, { useState, useMemo } from "react";
import { SavedAnalysis } from "../types";
import { ComplexityBadge } from "./ComplexityBadge";
import {
  History,
  Search,
  Filter,
  Trash2,
  Calendar,
  ArrowRight,
  Sparkles,
  BookOpen,
  Code2
} from "lucide-react";

interface HistoryViewProps {
  analyses: SavedAnalysis[];
  onSelectAnalysis: (analysis: SavedAnalysis) => void;
  onDeleteAnalysis: (analysisId: string) => Promise<void>;
  onNavigateToAnalyzer: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  analyses,
  onSelectAnalysis,
  onDeleteAnalysis,
  onNavigateToAnalyzer,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Extract unique languages present in history
  const languages = useMemo(() => {
    const list = Array.from(new Set(analyses.map((a) => a.language).filter(Boolean)));
    return ["All", ...list];
  }, [analyses]);

  // Filter analyses
  const filteredAnalyses = useMemo(() => {
    return analyses.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.timeComplexity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.overview && item.overview.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesLanguage =
        selectedLanguage === "All" || item.language === selectedLanguage;

      return matchesSearch && matchesLanguage;
    });
  }, [analyses, searchTerm, selectedLanguage]);

  const handleDelete = async (e: React.MouseEvent, id?: string) => {
    e.stopPropagation();
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this analysis from your history?")) {
      setDeletingId(id);
      try {
        await onDeleteAnalysis(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              My Learning History
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Review past algorithmic breakdowns, time complexity derivations, and optimization tradeoffs.
          </p>
        </div>

        <button
          onClick={onNavigateToAnalyzer}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold shadow-md shadow-cyan-500/20 cursor-pointer w-fit"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="history-search-input"
            type="text"
            placeholder="Search by title, complexity (e.g. O(n²)), or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
        </div>

        {/* Language Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-1 mr-1 shrink-0 hidden sm:block" />
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedLanguage === lang
                  ? "bg-slate-800 text-cyan-400 border border-cyan-500/30 font-semibold"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List */}
      {filteredAnalyses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAnalyses.map((item) => {
            const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric"
            });

            return (
              <div
                key={item.id || item.createdAt}
                onClick={() => onSelectAnalysis(item)}
                className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-md flex flex-col justify-between group relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {item.language}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                      </span>
                      <button
                        id={`delete-analysis-${item.id}`}
                        onClick={(e) => handleDelete(e, item.id)}
                        disabled={deletingId === item.id}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Analysis"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
                    <span>View Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-sm font-semibold text-white">No matching analyses</h3>
            <p className="text-xs text-slate-400">
              {searchTerm || selectedLanguage !== "All"
                ? "Try clearing filters to see all recorded items."
                : "Your analyzed algorithms will appear here automatically."}
            </p>
          </div>
          {(searchTerm || selectedLanguage !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedLanguage("All");
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-300 hover:text-white"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
