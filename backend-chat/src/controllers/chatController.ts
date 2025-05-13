import { Request, Response } from "express";
import { chatWithGPT, getChatHistory } from "../services/chatService";

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

export const getMessages = async (_req: Request, res: Response) => {
  const history = await getChatHistory();
  res.json(history);
};
