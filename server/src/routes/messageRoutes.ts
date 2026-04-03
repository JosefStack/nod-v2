import { Router } from "express";
import { Response } from "express";
import { protect } from "../middleware/auth.middleware.ts";
import { AuthRequest } from "../middleware/auth.middleware.ts";
import { getAllMessages, sendMessage, deleteMessage } from "../controllers/message.controller.ts";


const messageRouter = Router();

messageRouter.use(protect);

messageRouter.get("/:chatId", getAllMessages);
messageRouter.post("/send", sendMessage);
messageRouter.delete("/:messageId", deleteMessage);




export default messageRouter;