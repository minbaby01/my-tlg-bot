import { Context } from "grammy";
import { PROVIDER_CHATBOT } from "../constant/providerChatbot.js";
import { openRouterService } from "../services/gptSerivice.js";
import { textSchema } from "../schemas/textSchema.js";
import { getErrorMessage } from "../utils/utils.js";
import removeMd from "remove-markdown";
import { getChatHistory, saveChatHistory } from "../utils/firebase.js";

export const chatbotController = async (ctx: Context) => {
  const provider = PROVIDER_CHATBOT.OPEN_ROUTER;
  let response: string;

  const msg = ctx.message?.text;

  const { data, success, error } = textSchema.safeParse({
    msg: msg,
  });

  if (!success) {
    return await ctx.reply(error.message);
  }

  try {
    const chatId = ctx.chatId;
    if (!chatId) return;

    const oldMsg = await getChatHistory(ctx.chatId);
    const newMsg = { role: "user", content: data.msg };
    const input = [...oldMsg, newMsg];

    switch (provider) {
      // case PROVIDER_CHATBOT.GEMINI:
      //   response = await geminiService(data.msg);
      //   break;
      case PROVIDER_CHATBOT.OPEN_ROUTER:
        response = await openRouterService(input);
        const responseMsg = { role: "assistant", content: response };
        const updateMsg = [...input, responseMsg];
        await saveChatHistory(chatId, updateMsg);
        break;
      default:
        response = "Hello";
        break;
    }
  } catch (error) {
    response = getErrorMessage(error);
  }

  const removeMarkdown = removeMd(response);

  return await ctx.reply(removeMarkdown);
};
