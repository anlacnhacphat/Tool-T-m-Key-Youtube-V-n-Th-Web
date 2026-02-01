import { GoogleGenAI, Type } from "@google/genai";
import type { SearchOptions, KeywordResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      keyword: {
        type: Type.STRING,
        description: 'The generated YouTube keyword, 2-3 words long, in the specified target language.',
      },
       vietnameseTranslation: {
        type: Type.STRING,
        description: "Vietnamese translation of the keyword. ONLY provide this field if the target language is NOT Vietnamese.",
      },
    },
    required: ["keyword"],
  },
};

export const findKeywords = async (options: SearchOptions): Promise<KeywordResult[]> => {
  const { language, topic, mainKeyword, audience, competitorUrl, keywordCount } = options;

  const audiencePrompt = audience === 'viet' 
    ? "focus on the Vietnamese audience and market."
    : "focus on the international (primarily English-speaking) audience.";

  const mainKeywordPrompt = mainKeyword 
    ? `- Main Keyword (to focus the search): "${mainKeyword}"`
    : '';
  
  const analysisInstructions = `
    1.  Your primary goal is to find keywords within the broad **Topic**: "${topic}".
    2.  ${mainKeyword ? `Use the **Main Keyword** "${mainKeyword}" to narrow your focus and find highly relevant sub-topics.` : ''}
    3.  ${competitorUrl ? `Analyze the content, title, description, and tags from the **Competitor Video URL** (${competitorUrl}) to understand what makes it successful and to extract keyword ideas.` : ''}
    4.  Combine these inputs to generate a list of keywords. The keywords should be highly relevant for the specified target audience.
  `;

  const prompt = `
    As a YouTube SEO expert, your task is to generate a list of high-potential YouTube keywords based on the provided criteria. The final keywords should be suitable for creating AI-generated video content.

    **User Criteria:**
    - Topic: "${topic}"
    ${mainKeywordPrompt}
    - Target Language: ${language}
    - Target Audience: ${audiencePrompt}
    - Competitor Video URL (for analysis): ${competitorUrl || 'N/A'}
    - Number of keywords to generate: ${keywordCount}

    **Analysis & Generation Instructions:**
    ${analysisInstructions}
    5.  Generate exactly ${keywordCount} keywords in the **${language}** language.
    6.  Each keyword MUST be 2-3 words long.
    7.  CRITICAL: Each keyword must have high search volume potential on YouTube and a strong, rising search trend on Google Trends over the last 30-90 days.
    8.  **Translation Rule:** If the **Target Language** is NOT 'Vietnamese', you MUST also provide a Vietnamese translation for each keyword in the \`vietnameseTranslation\` field. If the Target Language is 'Vietnamese', this field must be omitted.

    Provide the output in the specified JSON format. Do not include justification or trend scores.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
            temperature: 0.7,
        }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (!Array.isArray(result)) {
        throw new Error("Invalid response format from Gemini API. Expected an array.");
    }

    return result as KeywordResult[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate keywords from Gemini API.");
  }
};
