import { VercelRequest } from "@vercel/node";
import axios from "axios";

export const forwardApi = async (
  host: string,
  secretToken: string,
  req: VercelRequest,
) => {
  const forward = axios.post(host, req.body, {
    headers: { "x-telegram-bot-api-secret-token": secretToken },
  });
  return forward;
};
