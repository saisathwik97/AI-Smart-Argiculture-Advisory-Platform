const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function translateText(text, targetLang) {
  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content:
            "You are a precise multilingual translation assistant. Translate only the provided text. Preserve the original meaning exactly. Return only the translated text. Do not add explanations, comments, markdown, or conversational text.",
        },
        {
          role: "user",
          content: `Translate the following text into ${targetLang}.

Text:
${text}`,
        },
      ],
    });

    const translated =
      completion.choices?.[0]?.message?.content?.trim();

    if (!translated) {
      throw new Error("Groq returned an empty translation");
    }

    return translated;
  } catch (error) {
    console.error("Translation error:", error);

    // Keep the existing return behavior so the frontend does not break.
    return text + " [Translation Error: " + error.message + "]";
  }
}

module.exports = translateText;