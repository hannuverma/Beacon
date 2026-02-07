
import { GoogleGenAI } from "@google/genai";
import { host, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askGemini(prompt: string, user?: UserProfile, hosts?: host[]): Promise<string> {
  const contextText = `
    User Name: ${user?.name || 'Guest'}
    User Home: ${user?.homeLocation?.address || 'Not set'}
    Nearby hosts: ${hosts?.map(v => `${v.name} (${v.category}) at ${v.location.address}`).join(', ')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Supports Google Maps tool
      contents: prompt,
      config: {
        systemInstruction: `You are the NightOwl AI. Use Google Maps grounding to help users find hosts near their home or specific landmarks. Context: ${contextText}`,
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: user?.homeLocation ? { 
              latitude: user.homeLocation.lat, 
              longitude: user.homeLocation.lng 
            } : { 
              latitude: 40.7128, 
              longitude: -74.0060 
            }
          }
        }
      },
    });
    
    // In a real app, we would also render groundingChunks/links here.
    return response.text || "I'm checking the midnight streets...";
  } catch (error) {
    console.error("Gemini Maps Error:", error);
    return "The night is blurry. (Maps API Error)";
  }
}
