
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

export const getNavigationInstructions = async (destination: string, time: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user has an appointment at "${destination}" at "${time}". Provide specific Malaysian transport advice including: 
    1. Typical traffic conditions (mention highways like LDP, Federal, or MEX if relevant to KL/Selangor).
    2. Public transport options (LRT, MRT, KTM).
    3. Grab estimate tips. 
    Keep it concise and helpful for a Malaysian local.`,
  });

  return response.text;
};
