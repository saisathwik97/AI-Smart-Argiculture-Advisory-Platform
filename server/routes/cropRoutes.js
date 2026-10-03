const express = require("express");
const router = express.Router();
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

router.post("/predict", async (req, res) => {
    try {
        const requiredFields = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"];
        const invalidFields = requiredFields.filter((field) => !Number.isFinite(Number(req.body[field])));
        if (invalidFields.length) {
            return res.status(400).json({ error: `Valid numeric values are required for: ${invalidFields.join(", ")}` });
        }

        const response = await axios.post(
            "http://127.0.0.1:5001/predict",
            Object.fromEntries(requiredFields.map((field) => [field, Number(req.body[field])]))
        );

        const recommended_crop = response.data.recommended_crop;
        if (!recommended_crop) {
            return res.status(500).json({ error: "ML model prediction failed" });
        }

        // Call Gemini to get yield, fertilizer, and water recommendations
        const prompt = `You are an expert Indian agricultural scientist. A farmer is recommended to grow "${recommended_crop}" based on these farm parameters:
- Nitrogen (N): ${req.body.N}
- Phosphorus (P): ${req.body.P}
- Potassium (K): ${req.body.K}
- pH: ${req.body.ph}
- Temperature: ${req.body.temperature}°C
- Humidity: ${req.body.humidity}%
- Rainfall: ${req.body.rainfall}mm

Provide the following recommendations:
1. Expected Yield (in Quintals per Acre, a brief range like "15-20 Q/Acre" with standard rationale).
2. Fertilizer Recommendation (specific type and quantity to balance the current NPK).
3. Water Requirement & Irrigation Schedule (estimated Liters/Day/Acre and frequency).

Respond ONLY with a valid JSON block containing the keys "yield", "fertilizer", and "water". Do not include markdown code block formatting (such as \`\`\`json) or any conversational text. Example:
{
  "yield": "...",
  "fertilizer": "...",
  "water": "..."
}`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        let aiDetails = {
            yield: "Atypical parameters. Expected average yield: 15-25 Quintals/Acre.",
            fertilizer: "Apply NPK balanced fertilizers based on local soil diagnostics.",
            water: "Maintain soil moisture with moderate irrigation (approx. 2000 L/Acre/Day)."
        };

        try {
            const aiResult = await model.generateContent(prompt);
            let rawText = aiResult.response.text().trim();
            // Strip out markdown code blocks if Gemini returns them
            rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(rawText);
            if (parsed.yield && parsed.fertilizer && parsed.water) {
                aiDetails = parsed;
            }
        } catch (aiErr) {
            console.error("AI enrichment error for crop recommendation:", aiErr.message);
        }

        res.json({
            recommended_crop,
            yield: aiDetails.yield,
            fertilizer: aiDetails.fertilizer,
            water: aiDetails.water
        });

    } catch (error) {
        console.error("Predict error:", error);
        res.status(500).json({
            error: "ML Service or AI enrichment failed"
        });
    }
});

router.post("/friendly", async (req, res) => {
  try {
    const { location, season, soilType, waterDistance, cropHistory } = req.body;
    
    const prompt = `You are an expert Indian agriculturist and data scientist.
A farmer has provided the following simple details about their land instead of precise NPK and pH values.
- Location: ${location}
- Upcoming Season: ${season}
- Soil Type Observed: ${soilType}
- Water Source Distance: ${waterDistance}
- Crop History (Last year): ${cropHistory}

Based on typical weather for that location, standard NPK properties of that soil type, the water availability, and crop rotation best practices (considering what they grew last year), tell me the SINGLE BEST crop to grow next.

Respond ONLY with the name of the crop (e.g., "Cotton" or "Rice" or "Chickpea"). No extra text, no markdown.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const MAX_RETRIES = 3;
    let recommended_crop = "Unknown";

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        recommended_crop = result.response.text().trim();
        // Clean up punctuation if any
        recommended_crop = recommended_crop.replace(/[^a-zA-Z\s]/g, "");
        break;
      } catch (error) {
        const is503 = error.message && (error.message.includes("503") || error.message.includes("overloaded") || error.message.includes("high demand"));
        if (is503 && attempt < MAX_RETRIES) {
          const delay = attempt * 2000;
          await sleep(delay);
          continue;
        }
        res.status(500).json({ error: "Failed to generate crop recommendation" });
        return;
      }
    }

    res.json({ recommended_crop });
  } catch (error) {
    console.error("Friendly Crop AI Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
