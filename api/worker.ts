import { cb } from "../src/bot.js";
import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function worker(req: VercelRequest, res: VercelResponse) {
  try {
    return await cb(req, res);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export const config = {
  maxDuration: 60,
  api: {
    bodyParser: false,
  },
};
