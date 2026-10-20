import { VercelRequest, VercelResponse } from "@vercel/node";
import { guard } from "../src/guard/guard.js";
import { forwardApi } from "../src/utils/telegram.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { success, message, code } = guard(req);
    if (!success) {
      return res.status(code).json({
        message: message,
      });
    }

    const host = req.headers.host;
    const workerUrl = `https://${host}/api/worker`;

    const secretToken = req.headers[
      "x-telegram-bot-api-secret-token"
    ] as string;

    await forwardApi(workerUrl, secretToken, req);

    return res.status(code).json({
      message: "Received",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err,
    });
  }
}
