import { VercelRequest, VercelResponse } from "@vercel/node";
import { guard } from "../src/guard/guard.js";
import { qstash } from "../src/lib/qstash.js";
import { QSTASH_TIME_OUT } from "../src/constant/constant.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { success, message } = guard(req);
    if (!success) {
      return res.status(200).json({
        message: message,
      });
    }

    const host = req.headers.host;
    const workerUrl = `https://${host}/api/worker`;

    const secretTokenHeader = req.headers[
      "x-telegram-bot-api-secret-token"
    ] as string;

    await qstash.publishJSON({
      url: workerUrl,
      body: req.body,
      timeout: QSTASH_TIME_OUT,
      headers: {
        "x-telegram-bot-api-secret-token": secretTokenHeader,
      },
    });

    return res.status(200).json({
      message: "Received",
    });
  } catch (err) {
    console.error(err);
    return res.status(200).json({
      message: err,
    });
  }
}
