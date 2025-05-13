import express from "express";
import { sendMessage, getMessages } from "../controllers/chatController";

export const chatRouter = express.Router();

chatRouter.post("/", sendMessage);
chatRouter.get("/", getMessages);
