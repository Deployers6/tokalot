import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const getUserFromToken = (req: NextRequest) => {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];

    // JWT_SECRET байгаа эсэхийг шалгах
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in .env");
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string;
      role: string;
    };

    return decoded;
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return null;
  }
};
