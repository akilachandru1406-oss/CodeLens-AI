import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";
import { CodeAnalysisResult, SavedAnalysis, ExplanationLevel, UserProfile } from "./types";

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Initialize Firestore with the provisioned database ID
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Authentication Helpers
export async function loginWithGoogle() {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error: any) {
    console.error("Firebase Google Auth popup error:", error);
    // If popup blocked or domain restrictions inside iframe, rethrow so UI can handle with fallback
    throw error;
  }
}

export async function loginAsGuestStudent(): Promise<UserProfile> {
  try {
    const cred = await signInAnonymously(auth);
    return {
      uid: cred.user.uid,
      displayName: "Guest Student",
      email: null,
      photoURL: null,
      isAnonymous: true,
      isLocalGuest: false
    };
  } catch (error: any) {
    // If Anonymous sign-in is disabled in Firebase console (auth/admin-restricted-operation),
    // gracefully fall back to a local guest student session so users can use all features seamlessly.
    console.info("Anonymous auth not enabled in Firebase console, starting local guest student session.");
    let guestUid = localStorage.getItem("codelens_guest_uid");
    if (!guestUid) {
      guestUid = "guest_" + Math.random().toString(36).substring(2, 11);
      localStorage.setItem("codelens_guest_uid", guestUid);
    }
    const guestUser: UserProfile = {
      uid: guestUid,
      displayName: "Guest Student",
      email: null,
      photoURL: null,
      isAnonymous: true,
      isLocalGuest: true
    };
    localStorage.setItem("codelens_guest_user", JSON.stringify(guestUser));
    return guestUser;
  }
}

export async function logoutUser() {
  localStorage.removeItem("codelens_guest_user");
  try {
    await signOut(auth);
  } catch (err) {
    console.warn("SignOut notice:", err);
  }
}

export { onAuthStateChanged };
export type { User };

// Firestore Database Operations
const ANALYSES_COLLECTION = "analyses";

export async function saveAnalysisToFirestore(
  userId: string,
  analysis: CodeAnalysisResult,
  originalCode: string,
  level: ExplanationLevel = "Student"
): Promise<string> {
  if (!userId) {
    throw new Error("You must be signed in to save analyses.");
  }

  const analysisDoc: Omit<SavedAnalysis, "id"> = {
    userId,
    title: analysis.title || "Code Analysis",
    language: analysis.language,
    code: originalCode,
    overview: analysis.overview,
    breakdown: analysis.breakdown || [],
    execution: analysis.execution || [],
    timeComplexity: analysis.complexity?.time?.value || "O(1)",
    spaceComplexity: analysis.complexity?.space?.value || "O(1)",
    timeDerivation: analysis.complexity?.time?.derivation || [],
    spaceDerivation: analysis.complexity?.space?.derivation || [],
    optimization: analysis.optimization || {
      available: false,
      currentApproach: "",
      optimizedApproach: "",
      optimizedCode: "",
      optimizedTime: "",
      optimizedSpace: "",
      explanation: "",
      tradeoff: ""
    },
    learningInsights: analysis.learningInsights || [],
    interviewTip: analysis.interviewTip || "",
    explanationLevel: level,
    createdAt: new Date().toISOString()
  };

  // If running in local guest mode
  if (userId.startsWith("guest_") || !auth.currentUser) {
    const key = `codelens_analyses_${userId}`;
    const localItems: SavedAnalysis[] = JSON.parse(localStorage.getItem(key) || "[]");
    const localId = "local_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    const newRecord: SavedAnalysis = {
      ...analysisDoc,
      id: localId
    };
    localItems.unshift(newRecord);
    localStorage.setItem(key, JSON.stringify(localItems));
    return localId;
  }

  try {
    const docRef = await addDoc(collection(db, ANALYSES_COLLECTION), analysisDoc);
    return docRef.id;
  } catch (err) {
    console.warn("Firestore save fallback to local storage:", err);
    const key = `codelens_analyses_${userId}`;
    const localItems: SavedAnalysis[] = JSON.parse(localStorage.getItem(key) || "[]");
    const localId = "local_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    const newRecord: SavedAnalysis = {
      ...analysisDoc,
      id: localId
    };
    localItems.unshift(newRecord);
    localStorage.setItem(key, JSON.stringify(localItems));
    return localId;
  }
}

export async function fetchUserAnalyses(userId: string): Promise<SavedAnalysis[]> {
  if (!userId) return [];

  if (userId.startsWith("guest_") || !auth.currentUser) {
    const key = `codelens_analyses_${userId}`;
    const localItems: SavedAnalysis[] = JSON.parse(localStorage.getItem(key) || "[]");
    return localItems;
  }

  try {
    const q = query(
      collection(db, ANALYSES_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const results: SavedAnalysis[] = [];
    snapshot.forEach((d) => {
      results.push({
        id: d.id,
        ...(d.data() as Omit<SavedAnalysis, "id">)
      });
    });
    return results;
  } catch (err) {
    // If compound index is building or not yet available, fallback to simple query and client sort
    console.warn("Falling back to client-side sorting for user analyses:", err);
    try {
      const simpleQuery = query(
        collection(db, ANALYSES_COLLECTION),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(simpleQuery);
      const results: SavedAnalysis[] = [];
      snapshot.forEach((d) => {
        results.push({
          id: d.id,
          ...(d.data() as Omit<SavedAnalysis, "id">)
        });
      });
      return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
      const key = `codelens_analyses_${userId}`;
      return JSON.parse(localStorage.getItem(key) || "[]");
    }
  }
}

export async function fetchAnalysisById(id: string): Promise<SavedAnalysis | null> {
  if (id.startsWith("local_")) {
    const guestUid = localStorage.getItem("codelens_guest_uid") || "";
    if (guestUid) {
      const key = `codelens_analyses_${guestUid}`;
      const localItems: SavedAnalysis[] = JSON.parse(localStorage.getItem(key) || "[]");
      return localItems.find((item) => item.id === id) || null;
    }
    return null;
  }

  const docRef = doc(db, ANALYSES_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...(docSnap.data() as Omit<SavedAnalysis, "id">)
    };
  }
  return null;
}

export async function deleteAnalysis(analysisId: string): Promise<void> {
  if (analysisId.startsWith("local_")) {
    const guestUid = localStorage.getItem("codelens_guest_uid") || "";
    if (guestUid) {
      const key = `codelens_analyses_${guestUid}`;
      const localItems: SavedAnalysis[] = JSON.parse(localStorage.getItem(key) || "[]");
      const filtered = localItems.filter((item) => item.id !== analysisId);
      localStorage.setItem(key, JSON.stringify(filtered));
    }
    return;
  }

  try {
    const docRef = doc(db, ANALYSES_COLLECTION, analysisId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Delete analysis error:", err);
  }
}
