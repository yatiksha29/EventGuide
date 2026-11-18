
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_PERSONA = `
You are an expert OCR AI specializing in Indian Aadhaar cards.

Rules:
1. Extract only text visible in the provided images. Never guess.
2. Return null for unreadable or missing fields.
3. Use the front image for name, DOB, gender and Aadhaar number.
4. Use the back image for address.
5. Extract English text where available.
6. Return the Aadhaar number as 12 digits without spaces.
7. Return valid JSON only.
`;


const EXTRACTION_PROMPT = `
Extract the information from the Aadhaar images.
Return valid JSON only. Use null for missing values.

{
  "name": null,
  "dob": null,
  "gender": null,
  "acardno": null,
  "address": null,
  "city": null,
  "state": null,
  "pincode": null,
  "confidenceScore": null
}

Use DOB as YYYY-MM-DD when it can be read reliably.
Gender must be Male, Female, Other, or null.
confidenceScore must be a number from 0 to 1, or null.
`;


async function CallAi(imageParts, userPrompt = EXTRACTION_PROMPT) {
  try {
    if (!Array.isArray(imageParts) || imageParts.length === 0) {
      throw new Error("No Aadhaar images available for OCR.");
    }

    const contents = [
      userPrompt,
      ...imageParts.map((image) => {
        if (!image?.data) {
          throw new Error("Invalid image data received.");
        }

        return {
          inlineData: {
            data: Buffer.from(image.data).toString("base64"),
            mimeType: image.mimeType || "image/jpeg",
          },
        };
      }),
    ];

    const result = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_PERSONA,
        responseMimeType: "application/json",
      },
    });

    if (!result.text) {
      throw new Error("AI returned an empty response.");
    }

  console.log("Gemini raw OCR output:", result.text);

const extractedData = JSON.parse(result.text);

console.log("Parsed OCR data:", extractedData);

return extractedData;
  } catch (err) {
    console.error("AI Extraction Error:", err);
    throw err;
  }
}

module.exports = { CallAi };
