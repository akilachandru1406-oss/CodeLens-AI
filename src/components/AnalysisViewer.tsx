import React, { useState } from "react";
import {
  CodeAnalysisResult,
  ExplanationLevel,
  SavedAnalysis
} from "../types";
import { ComplexityBadge } from "./ComplexityBadge";
import { CodeBlock } from "./CodeBlock";
import {
  Sparkles,
  BookOpen,
  Layers,
  Activity,
  Clock,
  HardDrive,
  Zap,
  Lightbulb,
  CheckCircle2,
  Bookmark,
  Share2,
  ArrowRight,
  TrendingDown,
  AlertCircle
} from "lucide-react";

interface AnalysisViewerProps {
  analysis: CodeAnalysisResult | SavedAnalysis;
  originalCode: string;
  onSaveToHistory?: () => Promise<void>;
  isSaved?: boolean;
  isSaving?: boolean;
  explanationLevel?: ExplanationLevel;
  onSelectLevel?: (level: ExplanationLevel) => void;
}

export const AnalysisViewer: React.FC<AnalysisViewerProps> = ({
  analysis,
  originalCode,
  onSaveToHistory,
  isSaved = false,
  isSaving = false,
  explanationLevel = "Student",
  onSelectLevel,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "breakdown" | "complexity" | "optimization">("all");

  // Normalize structure for either live result or saved document
  const timeDetails = (analysis as CodeAnalysisResult).complexity?.time || {
    value: (analysis as SavedAnalysis).timeComplexity || "O(n)",
    derivation: (analysis as SavedAnalysis).timeDerivation || []
  };

  const spaceDetails = (analysis as CodeAnalysisResult).complexity?.space || {
    value: (analysis as SavedAnalysis).spaceComplexity || "O(1)",
    derivation: (analysis as SavedAnalysis).spaceDerivation || []
  };

  const optimization = analysis.optimization || {
    available: false,
    currentApproach: "",
    optimizedApproach: "",
    optimizedCode: "",
    optimizedTime: "",
    optimizedSpace: "",
    explanation: "",
    tradeoff: ""
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {analysis.language}
              </span>
              {explanationLevel && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {explanationLevel} Level
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {analysis.title || "Code Analysis & Derivation"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {onSaveToHistory && (
              <button
                id="save-analysis-btn"
                onClick={onSaveToHistory}
                disabled={isSaved || isSaving}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSaved
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20"
                } disabled:opacity-80`}
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved to History</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>{isSaving ? "Saving..." : "Save Analysis"}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === "all"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Complete Report
          </button>
          <button
            onClick={() => setActiveTab("breakdown")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === "breakdown"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Code Breakdown & Trace
          </button>
          <button
            onClick={() => setActiveTab("complexity")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === "complexity"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Time & Space Derivations
          </button>
          <button
            onClick={() => setActiveTab("optimization")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === "optimization"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Optimization & Tradeoff
          </button>
        </div>
      </div>

      {/* SECTION F: QUICK COMPLEXITY VISUALIZATION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Time Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Time Complexity</span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <ComplexityBadge complexity={timeDetails.value} type="time" size="lg" />
            </div>
            <p className="text-xs text-slate-400 pt-1">
              {timeDetails.worstCase ? `Worst Case: ${timeDetails.worstCase}` : "Primary execution upper bound"}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800/80 text-slate-300 border border-slate-700">
              Derivation Available
            </span>
          </div>
        </div>

        {/* Space Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <HardDrive className="w-4 h-4 text-amber-400" />
              <span>Space Complexity</span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <ComplexityBadge complexity={spaceDetails.value} type="space" size="lg" />
            </div>
            <p className="text-xs text-slate-400 pt-1">
              {spaceDetails.auxiliarySpace || "Auxiliary memory allocated"}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800/80 text-slate-300 border border-slate-700">
              Stack & Heap Profiled
            </span>
          </div>
        </div>
      </div>

      {/* SECTION A — CODE OVERVIEW */}
      {(activeTab === "all" || activeTab === "breakdown") && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Section A — Code Overview</span>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {analysis.overview}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                Expected Input
              </span>
              <p className="text-xs text-slate-300 leading-normal">
                {analysis.input || "Standard input parameters or data streams."}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                Expected Output
              </span>
              <p className="text-xs text-slate-300 leading-normal">
                {analysis.output || "Computed value, printed output, or returned structure."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION B — CODE BREAKDOWN */}
      {(activeTab === "all" || activeTab === "breakdown") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Section B — Code Breakdown</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {analysis.breakdown && analysis.breakdown.length > 0 ? (
              analysis.breakdown.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span>{sec.section}</span>
                    </h4>
                    {sec.concept && (
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        Concept: {sec.concept}
                      </span>
                    )}
                  </div>

                  {sec.code && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-200">
                      <pre className="overflow-x-auto whitespace-pre">{sec.code}</pre>
                    </div>
                  )}

                  <div className="text-xs sm:text-sm text-slate-300 space-y-1 leading-relaxed">
                    <p>{sec.explanation}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No logical sections provided.</p>
            )}
          </div>
        </div>
      )}

      {/* SECTION C — STEP-BY-STEP EXECUTION TRACE */}
      {(activeTab === "all" || activeTab === "breakdown") && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            <Activity className="w-4 h-4 text-purple-400" />
            <span>Section C — Step-by-Step Execution Trace</span>
          </div>

          <p className="text-xs text-slate-400">
            Educational walkthrough showing how the program state, variables, and control flow change over time:
          </p>

          <div className="space-y-3 pt-2">
            {analysis.execution && analysis.execution.length > 0 ? (
              analysis.execution.map((stepItem, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80"
                >
                  <div className="w-6 h-6 rounded-lg bg-slate-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-700">
                    {stepItem.step || idx + 1}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {stepItem.description}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">Execution steps unavailable.</p>
            )}
          </div>
        </div>
      )}

      {/* SECTION D & E — TIME & SPACE COMPLEXITY DERIVATIONS */}
      {(activeTab === "all" || activeTab === "complexity") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SECTION D — TIME COMPLEXITY DERIVATION */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Section D — Time Complexity</span>
              </div>
              <ComplexityBadge complexity={timeDetails.value} type="time" size="lg" />
            </div>

            {/* Case bounds if provided */}
            {(timeDetails.bestCase || timeDetails.worstCase || timeDetails.averageCase) && (
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {timeDetails.bestCase && (
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Best Case</span>
                    <span className="font-mono text-emerald-400 font-semibold">{timeDetails.bestCase}</span>
                  </div>
                )}
                {timeDetails.averageCase && (
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Average</span>
                    <span className="font-mono text-blue-400 font-semibold">{timeDetails.averageCase}</span>
                  </div>
                )}
                {timeDetails.worstCase && (
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Worst Case</span>
                    <span className="font-mono text-amber-400 font-semibold">{timeDetails.worstCase}</span>
                  </div>
                )}
              </div>
            )}

            {/* Detailed Derivation Walkthrough */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Mathematical Derivation Steps:
              </span>
              <div className="space-y-2.5">
                {timeDetails.derivation && timeDetails.derivation.length > 0 ? (
                  timeDetails.derivation.map((dStep, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3 text-xs sm:text-sm text-slate-300"
                    >
                      <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{dStep}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Derivation breakdown unavailable.</p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION E — SPACE COMPLEXITY DERIVATION */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                <HardDrive className="w-4 h-4 text-amber-400" />
                <span>Section E — Space Complexity</span>
              </div>
              <ComplexityBadge complexity={spaceDetails.value} type="space" size="lg" />
            </div>

            {/* Input vs Auxiliary Space breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Input Space
                </span>
                <span className="font-mono text-slate-200 text-xs block">
                  {spaceDetails.inputSpace || "O(n) storage for inputs"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Auxiliary Space
                </span>
                <span className="font-mono text-amber-300 text-xs block font-medium">
                  {spaceDetails.auxiliarySpace || "O(1) extra memory"}
                </span>
              </div>
            </div>

            {/* Space Derivation Steps */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Memory Allocation Derivation:
              </span>
              <div className="space-y-2.5">
                {spaceDetails.derivation && spaceDetails.derivation.length > 0 ? (
                  spaceDetails.derivation.map((sStep, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3 text-xs sm:text-sm text-slate-300"
                    >
                      <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{sStep}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Space derivation unavailable.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION G & H — OPTIMIZATION & TIME-SPACE TRADEOFF */}
      {(activeTab === "all" || activeTab === "optimization") && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Section G — Algorithm Optimization</span>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                optimization.available
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {optimization.available ? "Optimization Found" : "Currently Optimal"}
            </span>
          </div>

          {/* Comparison Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Solution */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Current Approach
              </span>
              <p className="text-xs text-slate-300">
                {optimization.currentApproach || "Current baseline implementation"}
              </p>
              <div className="flex items-center gap-4 pt-2 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Time:</span>
                  <ComplexityBadge complexity={timeDetails.value} type="time" size="sm" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Space:</span>
                  <ComplexityBadge complexity={spaceDetails.value} type="space" size="sm" />
                </div>
              </div>
            </div>

            {/* Optimized Approach */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/20 to-slate-950 border border-emerald-500/30 space-y-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                Optimized Approach
              </span>
              <p className="text-xs text-slate-200">
                {optimization.optimizedApproach || (optimization.available ? "Improved algorithmic structure" : "Solution is already asymptotically optimal for this pattern.")}
              </p>
              {optimization.available && (
                <div className="flex items-center gap-4 pt-2 border-t border-emerald-500/20 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Optimized Time:</span>
                    <ComplexityBadge complexity={optimization.optimizedTime || "O(n)"} type="time" size="sm" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Optimized Space:</span>
                    <ComplexityBadge complexity={optimization.optimizedSpace || "O(n)"} type="space" size="sm" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Why is this better? */}
          {optimization.explanation && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
                <span>Why is this better?</span>
              </h5>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {optimization.explanation}
              </p>
            </div>
          )}

          {/* SECTION H — TIME-SPACE TRADEOFF */}
          {optimization.tradeoff && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Section H — Time-Space Tradeoff</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {optimization.tradeoff}
              </p>
            </div>
          )}

          {/* Optimized Code Block */}
          {optimization.optimizedCode && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Optimized Source Code:
              </span>
              <CodeBlock
                code={optimization.optimizedCode}
                language={analysis.language}
                title={`Optimized ${analysis.language} Solution`}
              />
            </div>
          )}
        </div>
      )}

      {/* SECTION I — LEARNING INSIGHTS & INTERVIEW TIP */}
      {(activeTab === "all" || activeTab === "complexity" || activeTab === "optimization") && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Learning Takeaways */}
          <div className="md:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>🧠 What should you learn from this code?</span>
            </div>

            <ul className="space-y-2.5 pt-1">
              {analysis.learningInsights && analysis.learningInsights.length > 0 ? (
                analysis.learningInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
                    <span className="leading-relaxed">{insight}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-slate-400">Analysis insights recorded.</li>
              )}
            </ul>
          </div>

          {/* Interview Tip */}
          <div className="md:col-span-4 p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-300 uppercase tracking-wider border-b border-amber-500/20 pb-3">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>💡 Interview Tip</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
              {analysis.interviewTip || "Always articulate your time and space complexity tradeoffs before writing code in an interview."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
