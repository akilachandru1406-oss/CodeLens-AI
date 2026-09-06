import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "2mb" }));

// Initialize Gemini SDK lazily to avoid startup crashes if key is initially absent
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured on the server");
    }
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "CodeLens AI Server",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Main Code Analysis endpoint
app.post("/api/analyze", async (req: Request, res: Response) => {
  try {
    const { code, language, level = "Student" } = req.body;

    if (!code || typeof code !== "string" || !code.trim()) {
      res.status(400).json({ error: "Please provide valid source code to analyze." });
      return;
    }

    if (!language || typeof language !== "string") {
      res.status(400).json({ error: "Please specify a programming language." });
      return;
    }

    const ai = getGenAI();

    // Educational prompt tailored by audience level
    const prompt = `
You are CodeLens AI — a world-class programming teacher, algorithm mentor, and computer science educator.
Analyze the following source code for a student seeking deep algorithmic understanding.

Programming Language: ${language}
Explanation Level: ${level} (Beginner: simple analogies and clarity; Student: conceptual rigor and clear CS terms; Interview: algorithmic precision, edge cases, and trade-offs)

Source Code:
\`\`\`${language}
${code}
\`\`\`

Analyze the code rigorously and return a valid JSON object matching the exact specification below.

Requirements:
1. "title": Short descriptive title of the algorithm or code (e.g. "Two Sum (Brute Force)", "Nested Matrix Iteration", "Binary Search")
2. "language": "${language}"
3. "overview": Beginner-friendly explanation of what the program does, its core purpose, and algorithm concept.
4. "input": Description of expected inputs and data types.
5. "output": Description of expected outputs and return values.
6. "breakdown": Array of logical sections with:
   - "section": e.g. "Section 1 — Input & Initialization"
   - "code": the relevant snippet
   - "explanation": what this part does and why it is needed
   - "concept": the CS/programming concept (e.g. "Loop Invariant", "Hash Table Lookup", "Array Indexing")
7. "execution": Array of chronological step-by-step trace items using a concrete sample input:
   - "step": integer starting at 1
   - "description": clear explanation of variable state changes, conditions, and flow
8. "complexity":
   - "time":
     - "value": Standard Big-O (e.g. "O(n²)", "O(n log n)", "O(n)", "O(1)")
     - "bestCase": Big-O for best case scenario
     - "averageCase": Big-O for average case scenario
     - "worstCase": Big-O for worst case scenario
     - "derivation": Array of sequential steps explicitly explaining HOW the time complexity was derived (e.g. "Step 1: Outer loop executes n times", "Step 2: Inner loop executes n times per outer iteration", "Step 3: Total operations = n × n = n²", "Step 4: Drop constants and lower-order terms -> O(n²)")
   - "space":
     - "value": Standard Big-O (e.g. "O(1)", "O(n)")
     - "inputSpace": description and complexity of input storage
     - "auxiliarySpace": description and complexity of extra memory allocated during execution
     - "derivation": Array of sequential steps explaining HOW space complexity was calculated (variables, dynamic memory, recursion stack, auxiliary structures)
9. "optimization":
   - "available": boolean (true if an asymptotically or practically superior algorithm/data structure exists; false if already optimal)
   - "currentApproach": brief summary of current complexity and approach
   - "optimizedApproach": explanation of the optimized technique or data structure (e.g. "Single-pass Hash Map lookup")
   - "optimizedCode": complete, clean, optimized source code in ${language} if available is true, or empty string if not
   - "optimizedTime": Big-O time of optimized version (e.g. "O(n)")
   - "optimizedSpace": Big-O space of optimized version (e.g. "O(n)")
   - "explanation": Why the optimized approach is better
   - "tradeoff": Very clear explanation of any Time-Space tradeoff (e.g. "We use O(n) auxiliary memory to store seen values, trading space to reduce time from O(n²) to O(n)")
10. "learningInsights": Array of 2 to 5 educational takeaways (e.g. "Nested loops multiply iteration counts", "Hash maps provide O(1) average lookup", etc.)
11. "interviewTip": 1 high-value advice snippet an interviewer would look for regarding this pattern.

Respond ONLY with valid JSON. Do not include markdown code block formatting or explanations outside the JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let rawText = response.text || "{}";
    // Sanitize any accidental markdown code fences
    rawText = rawText.trim();
    if (rawText.startsWith("```json")) {
      rawText = rawText.slice(7);
    } else if (rawText.startsWith("```")) {
      rawText = rawText.slice(3);
    }
    if (rawText.endsWith("```")) {
      rawText = rawText.slice(0, -3);
    }
    rawText = rawText.trim();

    const analysis = JSON.parse(rawText);
    res.json(analysis);
  } catch (error: any) {
    console.error("Analysis error:", error);
    res.status(500).json({
      error: error?.message || "Failed to analyze code. Please check your input and try again."
    });
  }
});

// Vite Middleware & Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CodeLens AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
