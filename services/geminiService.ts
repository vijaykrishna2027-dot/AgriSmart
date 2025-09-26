import { GoogleGenAI, Type, Chat } from "@google/genai";
import { WeatherDay, IdentificationResult, Job } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
};

export const getWeatherAndAdvice = async (location: string, language: string): Promise<WeatherDay[]> => {
    const prompt = `Generate a plausible 7-day weather forecast for ${location}. Based on this forecast, provide specific, actionable farming advice for each day. The advice should be relevant to common agricultural practices in that region. Respond entirely in the ${language} language. Return a JSON array of 7 objects. Each object must have keys: "day", "highTemp" (in Celsius), "lowTemp" (in Celsius), "conditions", and "advice".`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        day: { type: Type.STRING },
                        highTemp: { type: Type.NUMBER },
                        lowTemp: { type: Type.NUMBER },
                        conditions: { type: Type.STRING },
                        advice: { type: Type.STRING }
                    },
                    required: ['day', 'highTemp', 'lowTemp', 'conditions', 'advice']
                }
            }
        }
    });
    
    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as WeatherDay[];
    } catch (e) {
        console.error("Failed to parse Gemini JSON for weather:", e);
        throw new Error("Could not get weather and advice. Please try again.");
    }
};

let chat: Chat | null = null;
export const getChatbotResponse = async (message: string, language: string): Promise<string> => {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash'
        });
    }

    const prompt = `You are a helpful farming assistant. The user is asking a question. Respond to the following user message in ${language}. User message: "${message}"`;

    const response = await chat.sendMessage({ message: prompt });
    return response.text;
};

export const identifyCropOrSoil = async (base64Image: string, mimeType: string, language: string): Promise<IdentificationResult> => {
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    const prompt = `Analyze the image. Identify if it's a plant/seed or a soil sample.
- If it's a plant/seed, provide its common name, scientific name, a brief description, ideal growing conditions, and common pests and diseases associated with it. The result 'type' should be 'plant'.
- If it's a soil sample, identify the soil type (e.g., Loam, Clay, Sand), its likely composition, an estimated pH level if possible, potential nutrient levels (e.g., Nitrogen, Phosphorus, Potassium) if possible, crops suitable for it, and management tips. The result 'type' should be 'soil'.
If you cannot identify it, state that clearly in the description or soil type.
Respond entirely in the ${language} language.
Return a single JSON object.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, enum: ['plant', 'soil'] },
                    plant: {
                        type: Type.OBJECT,
                        properties: {
                            commonName: { type: Type.STRING },
                            scientificName: { type: Type.STRING },
                            description: { type: Type.STRING },
                            growingConditions: { type: Type.STRING },
                            commonPestsAndDiseases: { type: Type.STRING },
                        },
                    },
                    soil: {
                        type: Type.OBJECT,
                        properties: {
                            soilType: { type: Type.STRING },
                            composition: { type: Type.STRING },
                            suitableCrops: { type: Type.STRING },
                            managementTips: { type: Type.STRING },
                            phLevel: { type: Type.STRING },
                            nutrientLevels: { type: Type.STRING },
                        },
                    }
                },
                required: ['type']
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as IdentificationResult;
    } catch (e) {
        console.error("Failed to parse Gemini JSON for identification:", e);
        throw new Error("Could not identify the content of the image. Please try a clearer image.");
    }
};

export const translateJob = async (job: Job, targetLanguage: string): Promise<{ title: string; location: string; description: string; }> => {
    const prompt = `Translate the following job details from ${job.originalLanguage} to ${targetLanguage}.
    Title: "${job.title}"
    Location: "${job.location}"
    Description: "${job.description}"
    Return a single JSON object with keys "title", "location", and "description" containing the translated text. Do not add any extra commentary or explanations.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    location: { type: Type.STRING },
                    description: { type: Type.STRING },
                },
                required: ['title', 'location', 'description']
            }
        }
    });
    
    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse Gemini JSON for translation:", e);
        // Fallback to original if translation fails
        return { title: job.title, location: job.location, description: job.description };
    }
};