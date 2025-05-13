import { Request, Response } from "express";
import { chatWithGPT, getChatHistory } from "../services/chatService";

//const { SpeechClient } = require('@google-cloud/speech');
//import { SpeechClient } from '@google-cloud/speech';

import { SpeechClient, protos } from '@google-cloud/speech';
//import { MulterRequest } from '../types'; // твой кастомный тип

const fs = require('fs');
const path = require('path');

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

 
// Инициализация клиента Google Cloud Speech API
const client = new SpeechClient();



export const sendMessage = async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const reply = await chatWithGPT(message);
    res.json({ reply });
  } catch (err: any)  {
  console.error("OpenAI Error:", err);

  if (err.status === 429) {
    res.status(400).json({ error: "Превышен лимит запросов к OpenAI API. Проверьте оплату и лимиты."  });
   
  } else {

    res.status(400).json({ error: "Ошибка"+err  });
    //res.status(500).json({ error: "Internal server error" });

    }

}
  
  
 
};

export const speechText = async (req: Request, res: Response) => {
  console.log('Попал сюда:');

  const multerReq = req as MulterRequest;

  if (!multerReq.file) {
    return res.status(400).json({ error: 'Файл не найден' });
  }

  console.log('Размер аудио:', multerReq.file);

  const filePath = path.join(__dirname, '../../', multerReq.file.path);

  try {
    const file = fs.readFileSync(filePath);
    const audioBytes = file.toString('base64');

    const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
      audio: { content: audioBytes },
      config: {
        encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
        sampleRateHertz: 16000,
        languageCode: 'ru-RU',
      },
    };

    const response = await client.recognize(request);

    const transcription = response[0].results
      ?.map(result => result.alternatives?.[0].transcript)
      .join('\n');

    res.json({ transcription });
  } catch (err) {
    console.error('Ошибка при распознавании речи:', err);
    res.status(500).send('Ошибка при распознавании речи');
  } finally {
    fs.unlinkSync(filePath);
  }
};

export const getMessages = async (_req: Request, res: Response) => {
  const history = await getChatHistory();
  res.json(history);
};
