import { Router } from "express";
import { Response, Request } from "express"
import { protect } from "../middleware/auth.middleware.ts";
import { updateProfile } from "../controllers/user.controller.ts";


const userRouter = Router();

userRouter.patch("/update-profile", protect, updateProfile);

export default userRouter;
