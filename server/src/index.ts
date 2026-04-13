import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { app, server } from "./lib/socket.js";



const PORT = process.env.PORT || 3000;

app.use(helmet());

const allowedOrigins = [
    "http://localhost:5173",
    "https://nod-seven.vercel.app",
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));


app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

app.all('/api/auth/{*any}', toNodeHandler(auth));



server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})