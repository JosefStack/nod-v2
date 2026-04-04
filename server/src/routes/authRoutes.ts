import { Router } from "express";
import { signup, login, logout, checkAuth } from "../controllers/auth.controller.js";
import { Response, Request } from "express";
import { protect } from "../middleware/auth.middleware.js";
// import { AuthRequest } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.get("/check", protect, checkAuth); 

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);




export default authRouter;