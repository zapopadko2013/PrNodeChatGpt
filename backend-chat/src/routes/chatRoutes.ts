import express from "express";
import { sendMessage, getMessages,speechText } from "../controllers/chatController";


const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); // указываем папку для временных файлов

export const chatRouter = express.Router();

chatRouter.post("/", sendMessage);
chatRouter.get("/", getMessages);


chatRouter.post('/speechtext', upload.single('audio'), speechText);
