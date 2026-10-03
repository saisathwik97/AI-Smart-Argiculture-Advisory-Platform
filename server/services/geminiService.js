const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getHFAnswer(prompt) {
  const MAX_RETRIES = 3;

  const finalPrompt =
    prompt +
    "\n\nPlease ensure your answer is complete, concise, and does not cut off in the middle of a sentence.";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You are an agricultural advisory assistant. Answer the farmer's actual question directly and accurately. Use the provided context, weather information, and farmer memory when relevant. Do not give generic agricultural advice when the farmer asks a specific question."
          },
          {
            role: "user",
            content: finalPrompt
          }
        ]
      });

      const answer =
        result.choices?.[0]?.message?.content?.trim();

      if (!answer) {
        throw new Error("Groq returned an empty response");
      }

      return answer;

    } catch (error) {
      const isRateLimited =
        error.message &&
        (
          error.message.includes("429") ||
          error.message.includes("503") ||
          error.message.includes("500") ||
          error.message.includes("overloaded") ||
          error.message.includes("high demand") ||
          error.message.includes("rate")
        );

      if (isRateLimited && attempt < MAX_RETRIES) {
        const delay = attempt * 2000;

        console.warn(
          `Groq API Busy (attempt ${attempt}/${MAX_RETRIES}). Retrying in ${delay / 1000}s...`
        );

        await sleep(delay);
        continue;
      }

      console.error("Groq ERROR:", error);

      return "Sorry, I couldn't generate a response right now. Please try again.";
    }
  }
}

module.exports = getHFAnswer;