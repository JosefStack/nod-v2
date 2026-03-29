import { Router } from "express";
import { signup, login, logout, checkAuth } from "../controllers/auth.controller.ts";
import { Response } from "express";
import { protect } from "../middleware/auth.middleware.ts";
// import { AuthRequest } from "../middleware/auth.middleware.ts";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.get("/check", protect, checkAuth); 
export default authRouter;