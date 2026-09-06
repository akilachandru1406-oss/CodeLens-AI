import React, { useState, useRef } from "react";
import {
  SupportedLanguage,
  ExplanationLevel,
  CodeAnalysisResult,
  SavedAnalysis
} from "../types";
import { CODE_EXAMPLES } from "../data/examples";
import { AnalysisViewer } from "./AnalysisViewer";
import {
  Sparkles,
  Upload,
  Trash2,
  Play,
  RotateCcw,
  FileCode,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Layers,
  Cpu,
  BookOpen
} from "lucide-react";

interface AnalyzerViewProps {
  userId?: string;
  onSaveAnalysis: (analysis: CodeAnalysisResult, code: string, level: ExplanationLevel) => Promise<string>;
  initialCode?: string;
  initialLanguage?: SupportedLanguage;
  viewingSavedAnalysis?: SavedAnalysis | null;
  onClearSavedView?: () => void;
}

const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  "C++",
  "Python",
  "Java",
  "C",
  "JavaScript",
  "TypeScript",
];

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({
  userId,
  onSaveAnalysis,
  initialCode = "",
  initialLanguage = "C++",
  viewingSavedAnalysis = null,
  onClearSavedView,
}) => {
  const [code, setCode] = useState<string>(
    initialCode || viewingSavedAnalysis?.code || CODE_EXAMPLES[0].code
  );
  const [language, setLanguage] = useState<SupportedLanguage>(
    initialLanguage || (viewingSavedAnalysis?.language as SupportedLanguage) || "C++"
  );
  const [level, setLevel] = useState<ExplanationLevel>(
    (viewingSavedAnalysis?.explanationLevel as ExplanationLevel) || "Student"
  );

  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CodeAnalysisResult | null>(null);
  const [savedDocId, setSavedDocId] = useState<string | null>(
    viewingSavedAnalysis?.id || null
  );
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // If viewing a saved analysis from history
  const activeAnalysis = viewingSavedAnalysis || analysisResult;
  const isCurrentlySaved = Boolean(savedDocId || viewingSavedAnalysis?.id);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError("Please paste or upload source code before analyzing.");
      return;
    }

    setError(null);
    setAnalyzing(true);
    setSavedDocId(null);
    if (onClearSavedView) {
      onClearSavedView();
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          level,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Analysis request failed with status ${response.status}`);
      }

      const data: CodeAnalysisResult = await response.json();
      setAnalysisResult(data);

      // Auto-save to Firestore if user is authenticated
      if (userId) {
        try {
          setIsSaving(true);
          const docId = await onSaveAnalysis(data, code, level);
          setSavedDocId(docId);
        } catch (saveErr) {
          console.warn("Auto-save to Firestore notice:", saveErr);
        } finally {
          setIsSaving(false);
        }
      }
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err?.message || "Failed to complete AI code analysis. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveManually = async () => {
    if (!activeAnalysis || isCurrentlySaved || isSaving) return;
    setIsSaving(true);
    try {
      const docId = await onSaveAnalysis(activeAnalysis as CodeAnalysisResult, code, level);
      setSavedDocId(docId);
    } catch (err: any) {
      console.error("Save failed:", err);
      alert("Failed to save analysis: " + (err.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadExample = (exampleId: string) => {
    const selected = CODE_EXAMPLES.find((e) => e.id === exampleId);
    if (selected) {
      setCode(selected.code);
      setLanguage(selected.language);
      setError(null);
      setAnalysisResult(null);
      setSavedDocId(null);
      if (onClearSavedView) onClearSavedView();
    }
  };

  const handleClear = () => {
    setCode("");
    setError(null);
    setAnalysisResult(null);
    setSavedDocId(null);
    if (onClearSavedView) onClearSavedView();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Detect language from extension
    const name = file.name.toLowerCase();
    if (name.endsWith(".py")) setLanguage("Python");
    else if (name.endsWith(".cpp") || name.endsWith(".cc") || name.endsWith(".hpp")) setLanguage("C++");
    else if (name.endsWith(".c") || name.endsWith(".h")) setLanguage("C");
    else if (name.endsWith(".java")) setLanguage("Java");
    else if (name.endsWith(".js")) setLanguage("JavaScript");
    else if (name.endsWith(".ts")) setLanguage("TypeScript");

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCode(content);
        setError(null);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the uploaded code file.");
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const name = file.name.toLowerCase();
      if (name.endsWith(".py")) setLanguage("Python");
      else if (name.endsWith(".cpp") || name.endsWith(".cc")) setLanguage("C++");
      else if (name.endsWith(".c")) setLanguage("C");
      else if (name.endsWith(".java")) setLanguage("Java");
      else if (name.endsWith(".js")) setLanguage("JavaScript");
      else if (name.endsWith(".ts")) setLanguage("TypeScript");

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setCode(content);
          setError(null);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Editor & Controls Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileCode className="w-5 h-5 text-cyan-400" />
              <span>Analyze Your Code</span>
            </h2>
            <p className="text-xs text-slate-400">
              Paste source code or drop a file to generate detailed step-by-step logic and complexity derivations.
            </p>
          </div>

          {/* Quick Demo Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden md:inline">
              Preset Demos:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                id="load-example-nested-btn"
                onClick={() => handleLoadExample("nested-loops")}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-[11px] font-medium text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                title="C++ Nested Loops Demo O(n²)"
              >
                C++ Nested Loops
              </button>
              <button
                id="load-example-twosum-btn"
                onClick={() => handleLoadExample("two-sum-brute")}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-[11px] font-semibold text-cyan-400 border border-cyan-500/30 transition-colors cursor-pointer"
                title="Two Sum Optimization & Tradeoff Demo"
              >
                Two Sum (Optimization)
              </button>
              <button
                id="load-example-binary-btn"
                onClick={() => handleLoadExample("binary-search")}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-[11px] font-medium text-slate-200 border border-slate-700 transition-colors cursor-pointer hidden sm:inline"
                title="Binary Search (O(log n))"
              >
                Binary Search
              </button>
            </div>
          </div>
        </div>

        {/* Configuration Bar: Language & Explanation Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
          {/* Programming Language selector */}
          <div className="lg:col-span-4 space-y-1.5">
            <label
              htmlFor="language-select"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Programming Language:
            </label>
            <div className="relative">
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Explanation Level: Beginner / Student / Interview */}
          <div className="lg:col-span-8 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Explanation Level:
            </label>
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(["Beginner", "Student", "Interview"] as ExplanationLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  id={`level-${lvl.toLowerCase()}-btn`}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    level === lvl
                      ? "bg-cyan-500 text-slate-950 shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Code Input Area with Line Count and Drag & Drop */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative rounded-xl border border-slate-800 bg-slate-950 focus-within:border-cyan-500/60 transition-colors"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-850 bg-slate-900/60 text-xs text-slate-400">
            <span className="font-mono text-[11px] text-slate-300">
              {language} Source Editor
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-500">
                {code ? `${code.split("\n").length} lines` : "Empty"}
              </span>

              {/* Upload file button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".py,.java,.cpp,.cc,.c,.h,.hpp,.js,.ts"
                className="hidden"
                id="code-file-upload-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                title="Upload code file (.py, .java, .cpp, .c, .js, .ts)"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
            </div>
          </div>

          <textarea
            id="code-input-textarea"
            rows={12}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`// Paste or upload your ${language} code here...\n\nint main() {\n    // your algorithm logic\n}`}
            className="w-full bg-transparent p-4 font-mono text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none resize-y leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Error message if validation or API fails */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              id="clear-code-btn"
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              type="button"
              onClick={() => handleLoadExample("nested-loops")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load Example</span>
            </button>
          </div>

          <button
            id="analyze-code-submit-btn"
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
          >
            {analyzing ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                <span>Mentor Analyzing Complexity...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Result Output Section */}
      {analyzing && (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center animate-spin">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base font-bold text-white">
              Consulting Gemini Algorithm Mentor...
            </h3>
            <p className="text-xs text-slate-400">
              Breaking down logical sections, deriving Time & Space bounds, and computing optimal trade-offs.
            </p>
          </div>
        </div>
      )}

      {activeAnalysis && !analyzing && (
        <div className="pt-2">
          <AnalysisViewer
            analysis={activeAnalysis}
            originalCode={code}
            onSaveToHistory={userId ? handleSaveManually : undefined}
            isSaved={isCurrentlySaved}
            isSaving={isSaving}
            explanationLevel={level}
            onSelectLevel={(lvl) => setLevel(lvl)}
          />
        </div>
      )}
    </div>
  );
};
