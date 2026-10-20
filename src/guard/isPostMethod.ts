import { VercelRequest } from "@vercel/node";

export const isPostMethod = (req: VercelRequest) => {
  if (req.method !== "POST") {
    return {
      success: false,
      message: "POST method only",
    };
  }
  return {
    success: true,
    message: "OK",
  };
};
