import { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import { generateToken } from "../lib/utils.ts";

const signup = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    try {
        if (!email || !password) return res.status(400).json({ message: "All fields required" });

        const exists = await prisma.user.findUnique(
            { where: { email } }
        );
        if (exists) return res.status(409).json({ message: "Email already in use" });



        // hashing password
        const hashed = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: { email, password: hashed },
            select: { id: true, email: true, isOnboarded: true },
        });

        generateToken(user.id, res);
        res.status(201).json({ user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
    


}




const login = async (req: Request, res: Response) => {
    const { input, password } = req.body;

    try {

        if (!input || !password) return res.status(400).json({ message: "All fields required" });

        const isEmail = input.includes("@");

        const user = await prisma.user.findFirst({
            where: { [isEmail ? "email" : "username"] : input }
        });

        

        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid credentials" });

        generateToken(user.id, res);
        return res.status(200).json({
            id: user.id,
            email: user.email,
            isOnboarded: user.isOnboarded,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
} 




const logout = async (req: Request, res: Response) => { 
    try {
        res.clearCookie("jwt");
        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { signup, login, logout };