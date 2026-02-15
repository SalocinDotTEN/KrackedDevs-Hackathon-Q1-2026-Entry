
import { GoogleGenAI, Type } from "@google/genai";
import { Specialty, MatchResult } from "../types";

// Always use process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartDoctorMatch = async (symptoms: string): Promise<MatchResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these symptoms: "${symptoms}". 
    1. Suggest the most appropriate medical specialty from this list: ${Object.values(Specialty).join(', ')}. 
    2. Search for the top-rated hospitals or specialized clinics in Malaysia (e.g., Kuala Lumpur, Selangor, Penang) that are specifically known for treating these issues. 
    3. Return a short reasoning and an urgency level (Low, Medium, High).
    
    In the JSON, include a 'suggestedFacilities' array with the top 3 real-world Malaysian facilities found. 
    Crucially: For each facility, try to find their approximate latitude and longitude coordinates.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendedSpecialty: { type: Type.STRING },
          reasoning: { type: Type.STRING },
          urgency: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          suggestedFacilities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING },
                highlight: { type: Type.STRING },
                coords: {
                  type: Type.OBJECT,
                  properties: {
                    lat: { type: Type.NUMBER },
                    lng: { type: Type.NUMBER }
                  },
                  required: ["lat", "lng"]
                }
              },
              required: ["name", "type", "highlight"]
            }
          }
        },
        required: ["recommendedSpecialty", "reasoning", "urgency", "suggestedFacilities"]
      }
    }
  });

  const parsed = JSON.parse(response.text || '{}');
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    .map(chunk => ({
      title: chunk.web?.title || 'Medical Reference',
      uri: chunk.web?.uri || ''
    })) || [];

  return {
    ...parsed,
    searchSources: sources
  } as MatchResult;
};

export interface NavigationAdvice {
  text: string;
  sources: { title: string; uri: string }[];
}

export const getNavigationInstructions = async (
  destination: string, 
  date: string,
  time: string, 
  location?: { lat: number; lng: number }
): Promise<NavigationAdvice> => {
  const userLocStr = location ? `from coordinates (${location.lat}, ${location.lng})` : 'within the Klang Valley/relevant area';
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user has an appointment at "${destination}" on the date "${date}" at "${time}" ${userLocStr}. 
    Search for planned road closures, major construction, or anticipated traffic conditions (like public holidays or festive seasons) specifically for ${date} in this area of Malaysia. 
    Provide specific transport advice for that specific day:
    1. Realistic travel time estimate for ${date} at ${time}.
    2. Any specific road alerts found for that date.
    3. Parking tips or alternative transport (LRT/MRT) recommendations for this location.`,
    config: { tools: [{ googleSearch: {} }] },
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    .map(chunk => ({
      title: chunk.web?.title || 'Source',
      uri: chunk.web!?.uri || ''
    })) || [];

  return { text: response.text, sources };
};
