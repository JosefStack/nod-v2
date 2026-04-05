import { Router } from "express";
import { Response } from "express";
import { protect } from "../middleware/auth.middleware.js";
// import { AuthRequest } from "../middleware/auth.middleware.js";
import { getAllMessages, sendMessage, deleteMessage } from "../controllers/message.controller.js";


const messageRouter = Router();

messageRouter.use(protect);

messageRouter.get("/:chatId", getAllMessages);
messageRouter.post("/send", sendMessage);
messageRouter.delete("/:messageId", deleteMessage);




export default messageRouter;