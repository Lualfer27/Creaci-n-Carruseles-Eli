import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // Initialize Gemini
  const getAiClient = () => {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    return new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API Route for rewriting text to Instagram copy
  app.post("/api/generate-copy", async (req, res) => {
    try {
      const ai = getAiClient();
      const { text } = req.body;
      
      const prompt = `Actúa como un experto creador de contenido para Instagram. El usuario ha escrito las siguientes líneas que se dividirán y mostrarán en varias imágenes de Instagram en un carrusel.
Tú debes leer todas estas líneas que forman una sola frase o idea principal, interpretarlas, y crear un excelente "Copy" (texto para la descripción) que acompañe este post en Instagram. 
El copy debe incluir emojis acordes al tema, y hashtags relevantes y populares. También invita sutilmente a la interacción o a deslizar las imágenes. 
No repitas lo mismo que dice el texto original literalmente; aporta valor, dale energía y dinamismo. 

Texto original del usuario (carrusel):
"${text}"

Devuelve ÚNICAMENTE el texto listo para ser copiado y pegado en Instagram, sin comillas extra o anotaciones tuyas adicionales.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to generate copy" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
