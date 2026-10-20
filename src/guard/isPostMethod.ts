import { VercelRequest } from "@vercel/node";

export const isPostMethod = (req: VercelRequest) => {
  let message = "OK";

  if (req.method !== "POST") {
    message = "POST method only";
    return {
      success: false,
      message: message,
    };
  }
  return {
    success: true,
    message,
  };
};
