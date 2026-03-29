import "dotenv/config";
import express from "express";  
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.ts";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.ts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : process.env.CLIENT_URL,
    credentials: true,
}));



app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);

app.all('/api/auth/{*any}', toNodeHandler(auth));



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})