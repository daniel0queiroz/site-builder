import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.AI_API_KEY,
});

// Set AI_MODEL in .env to switch models without touching code.
// Examples:
//   AI_MODEL=poolside/laguna-m.1:free       (current default — free, slower)
//   AI_MODEL=openai/gpt-4o-mini             (best cost/quality, ~R$0.01/site)
//   AI_MODEL=openai/gpt-4o                  (highest quality, ~R$0.15/site)
//   AI_MODEL=anthropic/claude-haiku-4-5     (fast + good quality, ~R$0.07/site)
//   AI_MODEL=google/gemini-flash-1.5        (very fast + cheap)
export const AI_MODEL = process.env.AI_MODEL || "poolside/laguna-m.1:free";

export default openai;
