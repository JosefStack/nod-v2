import { Router } from "express";
import { Response } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { getAllChats, getAllRooms } from "../controllers/chat.controller.js"
import { getOrCreateDirectChat } from "../controllers/chat/direct.controller.js";
import { createGroup } from "../controllers/chat/group.controller.js";


const chatRouter = Router();

chatRouter.use(protect);

chatRouter.get("/", getAllChats);
chatRouter.get("/room", getAllRooms);

chatRouter.post("/direct", getOrCreateDirectChat);
chatRouter.post("/group", createGroup);

export default chatRouter;  