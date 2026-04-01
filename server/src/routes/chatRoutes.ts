import { Router } from "express";
import { Response } from "express";
import { protect } from "../middleware/auth.middleware.ts";
import { AuthRequest } from "../middleware/auth.middleware.ts";
import { getAllChats, deleteChat } from "../controllers/chat.controller.ts"

const chatRouter = Router();

chatRouter.use(protect);

chatRouter.get("/", getAllChats);
chatRouter.delete("/:id", deleteChat)



export default chatRouter;