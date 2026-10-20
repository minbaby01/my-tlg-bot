import { VercelRequest } from "@vercel/node";
import { isPostMethod } from "./isPostMethod.js";

export const forwardGuard = (req: VercelRequest) => {
  const { success, message } = isPostMethod(req);
  if (!success) {
    return {
      success: false,
      code: 405,
      message: message,
    };
  }

  const FORWARD_SECRET_TOKEN = process.env.FORWARD_SECRET_TOKEN;
  if (!FORWARD_SECRET_TOKEN) throw new Error("Forward secret token not found");
  const secretTokenHeader = req.headers["forward-secret-token"];

  if (secretTokenHeader !== FORWARD_SECRET_TOKEN) {
    return {
      success: false,
      code: 401,
      message: "Unauthorized",
    };
  }

  return {
    success: true,
    code: 200,
    message: "OK",
  };
};
