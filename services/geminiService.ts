
import { GoogleGenAI, Type } from "@google/genai";
import { Specialty, MatchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartDoctorMatch = async (symptoms: string): Promise<MatchResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these symptoms: "${symptoms}". Suggest the most appropriate medical specialty from this list: ${Object.values(Specialty).join(', ')}. Provide a short reasoning and an urgency level (Low, Medium, High).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendedSpecialty: { 
            type: Type.STRING,
            description: "The medical specialty matched."
          },
          reasoning: { 
            type: Type.STRING,
            description: "Why this specialty was chosen."
          },
          urgency: { 
            type: Type.STRING,
            enum: ["Low", "Medium", "High"],
            description: "Suggested medical urgency."
          }
        },
        required: ["recommendedSpecialty", "reasoning", "urgency"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as MatchResult;
};

export interface NavigationAdvice {
  text: string;
  sources: { title: string; uri: string }[];
}

export const getNavigationInstructions = async (
  destination: string, 
  time: string, 
  location?: { lat: number; lng: number }
): Promise<NavigationAdvice> => {
  const userLocStr = location ? `from coordinates (${location.lat}, ${location.lng})` : 'within the Klang Valley/relevant area';
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user has an appointment at "${destination}" at "${time}" ${userLocStr}. 
    Search for current traffic reports, road closures, or major construction (e.g., MRT/LRT works) in this area of Malaysia today.
    Provide specific transport advice:
    1. Realistic travel time estimate considering the specific time of day (e.g., peak hour bottlenecks like Federal Highway, LDP, or SPRINT).
    2. Any real-time incidents or road closures found.
    3. Optimal transport mode (Grab vs MRT vs Driving) for this specific timing.
    Keep it concise and practical for a Malaysian local.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    .map(chunk => ({
      title: chunk.web?.title || 'Source',
      uri: chunk.web?.uri || ''
    })) || [];

  return {
    text: response.text,
    sources
  };
};
