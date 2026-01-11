
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData, GeminiInsight } from "../types";

export const getNatureInsight = async (weather: WeatherData): Promise<GeminiInsight> => {
  // Support both standard Vite env vars and the defining polyfill in vite.config
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || (process.env.API_KEY as string);

  if (!apiKey) {
    console.warn("No API key found, using fallback nature lore.");
    return getFallbackInsight();
  }
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze the current weather in ${weather.city}:
    Temperature: ${weather.temp}°C
    Condition: ${weather.condition}
    Humidity: ${weather.humidity}%
    UV Index: ${weather.uvIndex}
    
    Provide a poetic, nature-inspired description (max 3 sentences) of how this atmosphere feels.
    Also provide 3 practical but nature-focused tips for a human to synchronize with this weather today.
    Return ONLY JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Updated to a stable model name if possible, or keep preview
      contents: {
        role: "user",
        parts: [{ text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            natureDescription: { type: Type.STRING },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["natureDescription", "tips"]
        }
      }
    });

    // Robust extraction of text
    let textOutput = "";
    if (response) {
      // @ts-ignore - Handle potential SDK variations safely
      if (typeof response.text === 'function') {
        // @ts-ignore
        textOutput = response.text();
      } else if (typeof response.text === 'string') {
        textOutput = response.text;
      } else if (response.candidates && response.candidates[0]?.content?.parts?.[0]?.text) {
        textOutput = response.candidates[0].content.parts[0].text;
      }
    }

    if (!textOutput) throw new Error("Empty AI response");

    // Clean potential markdown formatting
    let cleanText = textOutput.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    }

    return JSON.parse(cleanText);
  } catch (error) {
    console.warn("AI Insight generation failed, using fallback.", error);
    return getFallbackInsight();
  }
};

const getFallbackInsight = (): GeminiInsight => ({
  natureDescription: "The atmosphere is currently whispering ancient patterns, inviting a moment of silent observation as the day unfolds.",
  tips: [
    "Find a moment to stand still and feel the air's temperature on your skin.",
    "Observe the local flora; notice how the leaves react to the current humidity.",
    "Take three deep breaths, synchronizing your rhythm with the ambient wind speed."
  ]
});
