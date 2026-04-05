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


// debugging
import { readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? process.env.CLIENT_URL 
        : "http://localhost:5173",
    credentials: true,
}));

const __dirname = dirname(fileURLToPath(import.meta.url));



app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

app.all('/api/auth/{*any}', toNodeHandler(auth));

// debugging
app.get("/", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
});


app.get("/debug", (req, res) => {
    const routes = readdirSync(join(__dirname, "routes"));
    const controllers = readdirSync(join(__dirname, "controllers"));
    res.json({ routes, controllers });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})