import "./../../env";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function elaborateQuoteWithGemini(quote: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

 const prompt = `
      Elaborate this motivational quote in 3–4 sentences. 
      The elaboration should help generate an inspiring image prompt 
      for a text-to-image generative model. Quote: "${quote}"`;

      
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

