import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (userId: string, res: Response): string => {

    const { JWT_SECRET, NODE_ENV } = process.env;
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not configured");

    const token = jwt.sign(
        { userId },
        JWT_SECRET,
        { expiresIn: "2d" }
    );

    res.cookie(
        "jwt", 
        token,
        {
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
            httpOnly: true,
            sameSite: NODE_ENV === "development" ? "lax" : "none",
            secure: NODE_ENV === "production",
        }
    )

    return token;

}