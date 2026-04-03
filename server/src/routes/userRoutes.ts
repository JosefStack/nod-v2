import { Router } from "express";
import { Response, Request } from "express"
import { protect } from "../middleware/auth.middleware.ts";
import { updateProfile } from "../controllers/user.controller.ts";
import { checkUsername, searchUsers } from "../controllers/user.controller.ts";

const userRouter = Router();

userRouter.use(protect);

userRouter.patch("/update-profile", updateProfile);
userRouter.post("/check-username", checkUsername);

userRouter.get("/search", searchUsers);

export default userRouter;
