import OpenAI from "openai";
import { SYSTEM_INSTRUCTION } from "../constant/constant.js";
import { ChatCompletionMessageParam } from "openai/resources";

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const gemini = GEMINI_API_KEY
//   ? new GoogleGenAI({ apiKey: GEMINI_API_KEY })
//   : null;

// export const geminiService = async (content: string): Promise<string> => {
//   if (!gemini) {
//     console.error("GEMINI_API_KEY missing");
//     return "GEMINI_API_KEY missing";
//   }

//   const response = await gemini.models.generateContent({
//     model: "gemini-2.5-flash-lite",
//     config: {
//       systemInstruction: SYSTEM_INSTRUCTION,
//     },
//     contents: content,
//   });

//   return String(response.text) || "error";
// };

const openai = process.env.OPEN_ROUTER_API_KEY
  ? new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPEN_ROUTER_API_KEY,
    })
  : null;

const OPEN_ROUTER_MODEL = process.env.OPEN_ROUTER_MODEL;

export const openRouterService = async (
  input: ChatCompletionMessageParam[],
): Promise<string> => {
  if (!openai) {
    return "OPEN_ROUTER_API_KEY missing";
  }

  const result = await openai.chat.completions.create({
    model: OPEN_ROUTER_MODEL || "openrouter/free",
    messages: [
      {
        role: "system",
        content: SYSTEM_INSTRUCTION,
      },
      ...input,
    ],
  });
  const text = result.choices[0].message.content;

  return String(text);
};
