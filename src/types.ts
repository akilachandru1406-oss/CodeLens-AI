export type ExplanationLevel = "Beginner" | "Student" | "Interview";

export type SupportedLanguage = "Python" | "C" | "C++" | "Java" | "JavaScript" | "TypeScript";

export interface CodeBreakdownSection {
  section: string;
  code: string;
  explanation: string;
  concept: string;
}

export interface ExecutionStep {
  step: number;
  description: string;
}

export interface TimeComplexityDetails {
  value: string;
  bestCase?: string;
  averageCase?: string;
  worstCase?: string;
  derivation: string[];
}

export interface SpaceComplexityDetails {
  value: string;
  inputSpace?: string;
  auxiliarySpace?: string;
  derivation: string[];
}

export interface OptimizationDetails {
  available: boolean;
  currentApproach: string;
  optimizedApproach: string;
  optimizedCode: string;
  optimizedTime: string;
  optimizedSpace: string;
  explanation: string;
  tradeoff: string;
}

export interface CodeAnalysisResult {
  title: string;
  language: string;
  overview: string;
  input: string;
  output: string;
  breakdown: CodeBreakdownSection[];
  execution: ExecutionStep[];
  complexity: {
    time: TimeComplexityDetails;
    space: SpaceComplexityDetails;
  };
  optimization: OptimizationDetails;
  learningInsights: string[];
  interviewTip: string;
}

export interface SavedAnalysis {
  id?: string;
  userId: string;
  title: string;
  language: string;
  code: string;
  overview: string;
  breakdown: CodeBreakdownSection[];
  execution: ExecutionStep[];
  timeComplexity: string;
  spaceComplexity: string;
  timeDerivation: string[];
  spaceDerivation: string[];
  optimization: OptimizationDetails;
  learningInsights: string[];
  interviewTip?: string;
  explanationLevel?: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAnonymous?: boolean;
  isLocalGuest?: boolean;
}
