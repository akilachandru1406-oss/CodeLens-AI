import React, { useState } from "react";
import {
  Code2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Zap,
  CheckCircle2,
  Lock,
  ExternalLink,
  ShieldCheck,
  BookOpen
} from "lucide-react";
import { UserProfile } from "../types";
import { loginWithGoogle, loginAsGuestStudent } from "../firebase";
import { ComplexityBadge } from "./ComplexityBadge";

interface LandingPageProps {
  onLoginSuccess: (user?: UserProfile) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      onLoginSuccess();
    } catch (err: any) {
      console.error("Login failed:", err);
      // Helpful error message if preview iframe blocks Google popup
      if (err?.code === "auth/popup-blocked" || err?.code === "auth/cancelled-popup-request") {
        setError("Browser popup was blocked. You can continue using the Guest Student mode or open this app in a new tab.");
      } else if (err?.code === "auth/unauthorized-domain") {
        setError("This domain is pending authorization in Firebase Console. Please use Guest Student mode below to test all features!");
      } else {
        setError(err?.message || "Failed to sign in with Google. Please try Guest Student mode.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const guestUser = await loginAsGuestStudent();
      onLoginSuccess(guestUser);
    } catch (err: any) {
      console.error("Guest login failed:", err);
      setError("Unable to start guest session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Simple Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Code2 className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight text-white">
                CODELENS
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                AI
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="hidden sm:inline">Built for Gen AI Academy APAC</span>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cloud Run & Firestore</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission, Tagline, & Action */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Programming Learning Assistant for Students</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                CODELENS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI</span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-slate-200">
                "Understand Code. Analyze Complexity. Learn to Optimize."
              </p>
              <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
                Turn confusing code into clear explanations, complexity insights, and optimized solutions. Master Big-O derivations step-by-step instead of memorizing them.
              </p>
            </div>

            {/* Core Workflow Pipeline */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                The CodeLens Learning Experience:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono font-medium text-slate-300">
                <span className="px-2 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700">CODE</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">UNDERSTAND</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">BREAK DOWN</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">TRACE</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
                <span className="px-2 py-1 rounded bg-slate-800 text-amber-400 border border-slate-700">ANALYZE COMPLEXITY</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
                <span className="px-2 py-1 rounded bg-slate-800 text-blue-400 border border-slate-700">EXPLAIN WHY</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
                <span className="px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700">OPTIMIZE</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
                <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">LEARN</span>
              </div>
            </div>

            {/* Authentication Action Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 max-w-md">
              <div className="space-y-1">
                <h3 className="font-semibold text-white text-base">Get Started</h3>
                <p className="text-xs text-slate-400">
                  Sign in to analyze code and persist your personal learning history in Cloud Firestore.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-2.5">
                <button
                  id="google-login-btn"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{loading ? "Signing in..." : "Continue with Google"}</span>
                </button>

                <button
                  id="guest-login-btn"
                  onClick={handleGuestLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-medium text-xs transition-colors border border-slate-700 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Continue as Guest Student</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Private Firestore history</span>
                </span>
                <span>Firebase Authentication</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Education Showcase */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Interactive Preview
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                  C++ • Nested Loop
                </span>
              </div>

              {/* Sample Code Card */}
              <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800">
                <div className="text-slate-500 text-[10px] mb-1">// Outer & Inner loop iteration</div>
                <div><span className="text-purple-400">for</span>(int i = 0; i &lt; n; i++) &#123;</div>
                <div className="pl-4"><span className="text-purple-400">for</span>(int j = 0; j &lt; n; j++) &#123;</div>
                <div className="pl-8 text-emerald-400">cout &lt;&lt; i &lt;&lt; " " &lt;&lt; j;</div>
                <div className="pl-4">&#125;</div>
                <div>&#125;</div>
              </div>

              {/* Big-O Calculation Derivation Box */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Time Complexity
                  </div>
                  <div className="flex items-center gap-2">
                    <ComplexityBadge complexity="O(n²)" type="time" size="lg" />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight pt-1">
                    Outer loop runs n times × inner loop n times = n²
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Space Complexity
                  </div>
                  <div className="flex items-center gap-2">
                    <ComplexityBadge complexity="O(1)" type="space" size="lg" />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight pt-1">
                    Uses fixed iteration counters with zero dynamic memory
                  </p>
                </div>
              </div>

              {/* Optimization & Tradeoff Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-500/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Time-Space Tradeoff Insight</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Learn when sacrificing <span className="font-mono text-cyan-300">O(n)</span> space allows an algorithm to drop execution time from <span className="font-mono text-amber-300">O(n²)</span> to <span className="font-mono text-emerald-300">O(n)</span>.
                </p>
              </div>
            </div>

            {/* Feature Checkpoints */}
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Step-by-step trace</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Beginner to Interview level</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Optimized alternatives</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Save to Cloud Firestore</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} CodeLens AI — Programming Learning Assistant for Students.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 2.5 Flash</span>
            <span>•</span>
            <span>Firestore Security Rules Enforced</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
