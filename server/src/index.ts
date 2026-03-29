import express from "express";  
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.ts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : process.env.CLIENT_URL,
    credentials: true,
}))

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})