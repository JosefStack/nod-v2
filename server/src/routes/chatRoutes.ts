import { Router } from "express";
import { Response } from "express";
import { protect } from "../middleware/auth.middleware.ts";
import { AuthRequest } from "../middleware/auth.middleware.ts";
import { getAllChats, getAllRooms, deleteDirectChat, deleteGroupChat, deleteRoomChat } from "../controllers/chat.controller.ts"


const chatRouter = Router();

chatRouter.use(protect);

chatRouter.get("/", getAllChats);
chatRouter.get("/room", getAllRooms);


export default chatRouter;  