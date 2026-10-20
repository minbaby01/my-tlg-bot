import { VercelRequest } from "@vercel/node";
import { MAX_DELAY } from "../constant/constant.js";
import { isPostMethod } from "./isPostMethod.js";
import { getAdmin } from "./getAdmin.js";

export const guard = (req: VercelRequest) => {
  const { success, message } = isPostMethod(req);
  if (!success) {
    return {
      success: false,
      code: 405,
      message: message,
    };
  }

  const adminId = getAdmin();

  const SECRET_TOKEN = process.env.TG_SECRET_TOKEN;
  if (!SECRET_TOKEN) throw new Error("Secret token not found");
  const secretTokenHeader = req.headers["x-telegram-bot-api-secret-token"];

  const body = req.body;

  if (secretTokenHeader !== SECRET_TOKEN || body.message.from.id != adminId) {
    return {
      success: false,
      code: 401,
      message: "Unauthorized",
    };
  }

  if (body.message?.date) {
    const messageTime = body.message.date * 1000;
    if (Date.now() - messageTime > MAX_DELAY) {
      return {
        success: false,
        code: 200,
        message: "Skip message",
      };
    }
  }

  return {
    success: true,
    code: 200,
    message: "OK",
  };
};
