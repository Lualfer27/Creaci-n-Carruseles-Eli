import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // CORS y preflight para Vercel
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Falta la variable de entorno GEMINI_API_KEY en Vercel.");
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

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

    res.status(200).json({ result: response.text });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error al generar el copy" });
  }
}
