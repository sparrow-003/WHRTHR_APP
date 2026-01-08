
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData, GeminiInsight } from "../types";

export const getNatureInsight = async (weather: WeatherData): Promise<GeminiInsight> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
      model: "gemini-3-flash-preview",
      contents: prompt,
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

    // Access .text property directly, do not call as a method
    let textOutput = response.text;
    if (!textOutput) throw new Error("Empty AI response");

    // Clean potential markdown formatting
    let cleanText = textOutput.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    }

    return JSON.parse(cleanText);
  } catch (error) {
    console.warn("AI Insight generation failed, using fallback nature lore.", error);
    return {
      natureDescription: "The atmosphere is currently whispering ancient patterns, inviting a moment of silent observation as the day unfolds.",
      tips: [
        "Find a moment to stand still and feel the air's temperature on your skin.",
        "Observe the local flora; notice how the leaves react to the current humidity.",
        "Take three deep breaths, synchronizing your rhythm with the ambient wind speed."
      ]
    };
  }
};
