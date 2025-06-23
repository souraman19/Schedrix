import path from "path";
import "../../env";
import fs from "fs";

export const generateImageFromQuote = async (quote: string, mindStatus: string) => {

    const today = new Date().toISOString().split("T")[0];
    console.log(mindStatus);
    const fileName = `quote-${today}-${mindStatus}.png`;
    const filePath = path.join(__dirname, "../../../public/QOTD_images", fileName);
    console.log("Dir name:", __dirname); 
    console.log("Saving image to:", filePath);
  
    if(fs.existsSync(filePath)) {
        console.log("Image already exists, skipping generation:", filePath);
        return `/QOTD_images/${fileName}`; // Return the PUBLIC URL
    }

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
        prompt: quote,
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


  fs.writeFileSync(filePath, Buffer.from(base64, "base64"));
  return `/QOTD_images/${fileName}`; // Return the PUBLIC URL
};
