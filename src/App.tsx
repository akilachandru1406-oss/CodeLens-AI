import React, { useState, useEffect, useCallback } from "react";
import {
  auth,
  onAuthStateChanged,
  logoutUser,
  saveAnalysisToFirestore,
  fetchUserAnalyses,
  deleteAnalysis,
  User
} from "./firebase";
import {
  UserProfile,
  SavedAnalysis,
  CodeAnalysisResult,
  ExplanationLevel,
  SupportedLanguage
} from "./types";
import { CODE_EXAMPLES } from "./data/examples";
import { LandingPage } from "./components/LandingPage";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { DashboardView } from "./components/DashboardView";
import { AnalyzerView } from "./components/AnalyzerView";
import { HistoryView } from "./components/HistoryView";
import { LayoutDashboard, Sparkles, History } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentView, setCurrentView] = useState<"dashboard" | "analyzer" | "history">("dashboard");

  // User's private analyses loaded from Firestore
  const [userAnalyses, setUserAnalyses] = useState<SavedAnalysis[]>([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(false);

  // Active analysis selected to inspect
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);

  // Preload code when navigating from dashboard
  const [presetCode, setPresetCode] = useState<string>("");
  const [presetLanguage, setPresetLanguage] = useState<SupportedLanguage>("C++");

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        localStorage.removeItem("codelens_guest_user");
        setCurrentUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || (firebaseUser.isAnonymous ? "Guest Student" : "Student"),
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          isAnonymous: firebaseUser.isAnonymous,
          isLocalGuest: false,
        });
      } else {
        const storedGuest = localStorage.getItem("codelens_guest_user");
        if (storedGuest) {
          try {
            setCurrentUser(JSON.parse(storedGuest));
          } catch {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch Firestore analyses whenever user changes or updates
  const loadAnalyses = useCallback(async (uid: string) => {
    setLoadingAnalyses(true);
    try {
      const records = await fetchUserAnalyses(uid);
      setUserAnalyses(records);
    } catch (err) {
      console.error("Failed to load user analyses:", err);
    } finally {
      setLoadingAnalyses(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.uid) {
      loadAnalyses(currentUser.uid);
    }
  }, [currentUser?.uid, loadAnalyses]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      setUserAnalyses([]);
      setCurrentView("dashboard");
      setSelectedAnalysis(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleSaveAnalysis = async (
    analysis: CodeAnalysisResult,
    code: string,
    level: ExplanationLevel
  ): Promise<string> => {
    if (!currentUser?.uid) {
      throw new Error("User must be logged in to save analyses.");
    }
    const docId = await saveAnalysisToFirestore(currentUser.uid, analysis, code, level);
    // Reload user's history from Firestore
    await loadAnalyses(currentUser.uid);
    return docId;
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    try {
      await deleteAnalysis(analysisId);
      setUserAnalyses((prev) => prev.filter((a) => a.id !== analysisId));
      if (selectedAnalysis?.id === analysisId) {
        setSelectedAnalysis(null);
      }
    } catch (err) {
      console.error("Failed to delete analysis:", err);
      alert("Could not delete analysis. Please try again.");
    }
  };

  const handleSelectAnalysis = (analysis: SavedAnalysis) => {
    setSelectedAnalysis(analysis);
    setPresetCode(analysis.code);
    setPresetLanguage(analysis.language as SupportedLanguage);
    setCurrentView("analyzer");
  };

  const handleLoadExampleDemo = (exampleId: string) => {
    const example = CODE_EXAMPLES.find((e) => e.id === exampleId);
    if (example) {
      setSelectedAnalysis(null);
      setPresetCode(example.code);
      setPresetLanguage(example.language);
      setCurrentView("analyzer");
    }
  };

  const handleAnalyzeNew = () => {
    setSelectedAnalysis(null);
    setPresetCode(CODE_EXAMPLES[0].code);
    setPresetLanguage("C++");
    setCurrentView("analyzer");
  };

  // Auth Loading Splash
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span className="font-bold tracking-tight text-white">CODELENS AI</span>
        </div>
        <p className="text-xs text-slate-500">Initializing algorithm workspace...</p>
      </div>
    );
  }

  // If user is not authenticated, show professional Landing & Login page
  if (!currentUser) {
    return (
      <LandingPage
        onLoginSuccess={(user) => {
          if (user) {
            setCurrentUser(user);
          }
          setCurrentView("dashboard");
        }}
      />
    );
  }

  // Authenticated Application
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        onNavigate={(v) => {
          setCurrentView(v);
          if (v !== "analyzer") setSelectedAnalysis(null);
        }}
        currentView={currentView}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        {/* Desktop Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={(v) => {
            setCurrentView(v);
            if (v !== "analyzer") setSelectedAnalysis(null);
          }}
          analysesCount={userAnalyses.length}
        />

        {/* Dynamic View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-8">
          {currentView === "dashboard" && (
            <DashboardView
              user={currentUser}
              analyses={userAnalyses}
              onAnalyzeNewCode={handleAnalyzeNew}
              onSelectAnalysis={handleSelectAnalysis}
              onLoadExampleDemo={handleLoadExampleDemo}
            />
          )}

          {currentView === "analyzer" && (
            <AnalyzerView
              userId={currentUser.uid}
              onSaveAnalysis={handleSaveAnalysis}
              initialCode={presetCode}
              initialLanguage={presetLanguage}
              viewingSavedAnalysis={selectedAnalysis}
              onClearSavedView={() => setSelectedAnalysis(null)}
            />
          )}

          {currentView === "history" && (
            <HistoryView
              analyses={userAnalyses}
              onSelectAnalysis={handleSelectAnalysis}
              onDeleteAnalysis={handleDeleteAnalysis}
              onNavigateToAnalyzer={handleAnalyzeNew}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-2 flex items-center justify-around text-xs">
        <button
          onClick={() => {
            setCurrentView("dashboard");
            setSelectedAnalysis(null);
          }}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg cursor-pointer ${
            currentView === "dashboard" ? "text-cyan-400 font-semibold" : "text-slate-400"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => {
            setCurrentView("analyzer");
          }}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg cursor-pointer ${
            currentView === "analyzer" ? "text-cyan-400 font-semibold" : "text-slate-400"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Analyze</span>
        </button>

        <button
          onClick={() => {
            setCurrentView("history");
            setSelectedAnalysis(null);
          }}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg cursor-pointer relative ${
            currentView === "history" ? "text-cyan-400 font-semibold" : "text-slate-400"
          }`}
        >
          <History className="w-4 h-4" />
          <span>History</span>
          {userAnalyses.length > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-cyan-400" />
          )}
        </button>
      </nav>
    </div>
  );
}
