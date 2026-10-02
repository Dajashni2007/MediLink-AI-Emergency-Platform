import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI client server-side
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set in environment variables");
      return null;
    }
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Route: AI Health Assistant Chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, locationContext, language } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: "Gemini API service unavailable. Please configure GEMINI_API_KEY.",
          fallbackReply: "I am MediLink AI Health Assistant. Currently my server AI key is being configured. In an immediate emergency, please call 108 or 112 or click the SOS button immediately."
        });
      }

      const langInstruction = language === 'ta' 
        ? 'Respond primarily in Tamil with English medical terms where appropriate.'
        : language === 'hi' 
        ? 'Respond primarily in Hindi with English medical terms where appropriate.'
        : 'Respond in clear, compassionate English.';

      const systemInstruction = `You are MediLink AI Medical & Emergency Assistant, a smart AI healthcare companion.
Your goals:
1. Provide quick, accurate, compassionate preliminary health guidance and triage recommendations.
2. Direct users to the appropriate medical department or nearby facility (e.g., Cardiology, Orthopedics, Pediatrics, ICU/Trauma).
3. Recognize CRITICAL emergency symptoms (e.g. chest pain, severe bleeding, breathing difficulty, stroke symptoms, loss of consciousness) and IMMEDIATELY advise pressing the MediLink 🚨 SOS button or calling local emergency numbers (108 / 112).
4. ${langInstruction}
5. Always include a short, non-intrusive standard medical disclaimer: "Disclaimer: MediLink AI provides informational guidance only and is not a substitute for professional medical diagnosis or treatment."
6. User's current detected location context: ${JSON.stringify(locationContext || { city: "Unknown" })}.
7. Keep responses scannable using bold key points and bullet points.`;

      // Build contents array from history if available or single prompt
      const prompt = `User prompt: ${message}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.4,
        },
      });

      const replyText = response.text || "I recommend seeking immediate professional medical evaluation.";
      return res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      return res.status(500).json({
        error: "Failed to process AI health query",
        details: error?.message || "Internal server error"
      });
    }
  });

  // API Route: Emergency SOS Signal Receiver
  app.post("/api/emergency/sos", (req, res) => {
    const { userId, location, emergencyContacts, note } = req.body;
    console.log(`[EMERGENCY SOS TRIGGERED] User: ${userId || 'Guest'}, Location:`, location);
    
    // Simulate server dispatch to emergency dispatch center & SMS gateway
    return res.json({
      success: true,
      sosId: `SOS-${Date.now()}`,
      dispatchStatus: "DISPATCHED",
      assignedAmbulance: "AMB-108-TN01",
      etaMinutes: 4,
      hospitalNotified: "Apollo Emergency Trauma Center",
      message: "Emergency response activated. Ambulance is en route and nearest trauma team notified."
    });
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "MediLink API Engine" });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MediLink Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
