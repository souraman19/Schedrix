import "../../env";
import { elaborateQuoteWithGemini } from "../gemini/elaborateQuote";
import cloudinary from "./../../lib/cloudinary/cloudinary";


export const generateImageFromQuote = async (
  quote: string,
  mindStatus: string
) => {
  const today = new Date().toISOString().split("T")[0];
  const fileName = `quote-${today}-${mindStatus}.png`;
 

  let elaboratedText = await elaborateQuoteWithGemini((quote as any).content);
  // console.log("Elaborated text for quote:", elaboratedText);

  const response = await fetch(
    "https://router.huggingface.co/nebius/v1/images/generations",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response_format: "b64_json",
        prompt: elaboratedText,
        model: "stability-ai/sdxl",
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to generate image:", errorText); // Log the real error body
    throw new Error("Failed to generate image");
  }
  const result = await response.json();
  // console.log("Raw image generation result:", result); // 🔍 ADD THIS

  const base64 = result.data?.[0]?.b64_json;
  if (!base64) throw new Error("No base64 image returned");

  const imageBuffer = Buffer.from(base64, "base64");
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'schedrix_qotd',
        public_id: fileName,
        resource_type: 'image',
      },
      (error, result) => {
        if(error) return reject(error);
        resolve(result?.secure_url || "");
        console.log("Uploaded image URL:", result?.secure_url);
      }
    );
    stream.end(imageBuffer);
  })
};
