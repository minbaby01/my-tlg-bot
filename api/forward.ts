import { VercelRequest, VercelResponse } from "@vercel/node";
import { bot } from "../src/bot.js";
import { forwardGuard } from "../src/guard/forwardGuard.js";
import { getAdmin } from "../src/guard/getAdmin.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { success, message, code } = forwardGuard(req);
    if (!success) {
      return res.status(code).json({
        message: message,
      });
    }
    const adminId = getAdmin();

    const body = req.body;
    const text = body.message;

    if (text) {
      await bot.api.sendMessage(adminId, text);
    }

    return res.status(code).json({
      message: message,
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}
