
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { StylingResult } from "../types";

// Initialize Gemini Client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    throw new Error("API Key is required");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateFashionAdvice = async (
  history: { role: 'user' | 'model'; text: string }[],
  lastMessage: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are Styllen, an elite fashion styling assistant based in India. 
        Your tone is professional, chic, and encouraging. 
        You provide advice based on color theory, current trends (Indo-Western, Ethnic, Streetwear), and body type suitability.
        Context: The user is in Hyderabad (warm climate).
        Keep responses concise and actionable.`
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }))
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message: lastMessage });
    return response.text || "I'm having trouble analyzing that right now. Try asking again.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Network error. Please check your connection or API key.";
  }
};

export const generateStylingAnalysis = async (
  measurementsJson: string,
  skinTone: string,
  occasion: string,
  garmentImageBase64: string
): Promise<StylingResult> => {
   try {
    const ai = getAiClient();
    const garmentImgData = garmentImageBase64.split(',')[1];

    const prompt = `
      Act as a high-end fashion stylist in India. Analyze this garment image for a user with:
      - Measurements: ${measurementsJson}
      - Skin Tone: ${skinTone}
      - Occasion: ${occasion}
      - Location: Hyderabad (assume warm/tropical weather)

      Provide a response in strictly valid JSON format with the following structure:
      {
        "fitAnalysis": "Detailed description of how this garment fits the described body shape and if it suits the occasion.",
        "colorAnalysis": "Analyze if the garment color suits the ${skinTone} skin tone.",
        "colorSuggestions": ["List 3 specific colors that would suit this skin tone better or complement the outfit"],
        "ornaments": [
          {
            "name": "Specific item name (e.g., Gold Signet Ring, Silk Tie, Silver Bangles, Ankle Chain, Leather Loafers, Pearl Hair Clip)",
            "type": "Category (e.g., Ring, Tie, Footwear, Hair Accessory, Bangle, Chain)",
            "reason": "Why it matches the outfit",
            "searchQuery": "Specific keywords to find this exact style online"
          }
        ] 
      }
      
      IMPORTANT: Suggest 6-8 specific ornaments covering these exact categories if relevant:
      1. Jewellery (Rings, Chains, Bangles, Necklaces, Bracelets)
      2. Accessories (Ties, Pocket Squares, Watches, Bags, Belts)
      3. Footwear (Shoes, Sandals, Loafers, Heels, Footwear Accessories like Anklets)
      4. Hair Accessories (Clips, Bands, Tiaras, Scrunchies)
      
      Do not include markdown formatting like \`\`\`json. Just return the raw JSON string.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/png', data: garmentImgData } }
        ]
      }
    });

    const text = response.text?.trim() || "{}";
    // Remove markdown code blocks if present
    const jsonString = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    
    return JSON.parse(jsonString) as StylingResult;
  } catch (error) {
    console.error("Styling Gen error:", error);
    return {
        fitAnalysis: "Could not generate analysis.",
        colorAnalysis: "Could not analyze colors.",
        colorSuggestions: [],
        ornaments: []
    };
  }
};

export const generateVirtualTryOn = async (
  faceImageBase64: string,
  garmentImageBase64: string
): Promise<string | null> => {
  try {
    const ai = getAiClient();
    // Ensure we strip the data URL prefix if present to get just base64 data
    const faceData = faceImageBase64.includes(',') ? faceImageBase64.split(',')[1] : faceImageBase64;
    const garmentData = garmentImageBase64.includes(',') ? garmentImageBase64.split(',')[1] : garmentImageBase64;

    // We use gemini-2.5-flash-image for image generation/editing tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { 
            text: "Act as a professional AI Image Editor. Perform a Virtual Try-On.\n\nINPUTS:\n1. Image A: A person's photo (Face Reference).\n2. Image B: A garment photo (Clothing Reference).\n\nTASK:\nGenerate a high-quality, photorealistic image of the person from Image A wearing the garment from Image B.\n\nCRITICAL REQUIREMENTS:\n1. IDENTITY PRESERVATION: The face, hair, skin tone, and head shape in the output MUST be identical to Image A. Do not change the person's identity.\n2. OUTFIT TRANSFER: The garment from Image B must be worn naturally by the person, adapting to their pose and body shape.\n3. REALISM: Ensure realistic lighting, shadows, and fabric textures.\n4. OUTPUT: Return only the generated image." 
          },
          { inlineData: { mimeType: 'image/png', data: faceData } },
          { inlineData: { mimeType: 'image/png', data: garmentData } }
        ]
      }
    });

    // Iterate through parts to find the image output
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Virtual Try-On Gen error:", error);
    return null;
  }
};

export const runFashionScript = async (scriptContent: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a fashion styling engine execution environment. 
      Interpret the following script (YAML, JSON, or Python-pseudo code) and generate the output result.
      If it is a configuration, describe what outfit would be generated.
      If it is a command, execute it conceptually and return the result.
      
      Script Content:
      ${scriptContent}
      
      Output:`,
    });
    return response.text || "Script executed successfully with no output.";
  } catch (error) {
    console.error("Script execution error:", error);
    return "Runtime Error: Failed to execute script via Gemini API.";
  }
};
