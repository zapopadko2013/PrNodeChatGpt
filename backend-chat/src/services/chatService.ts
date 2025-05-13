import { prisma } from "../database/prisma";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const chatWithGPT = async (message: string): Promise<string> => {

  console.log('Сообщение:\n', message);

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
  });

 
  console.log('Ответ:\n', completion);

  const reply = completion.choices[0].message.content ?? "";   

  //const reply ="Ответ"; 


  await prisma.message.create({
    data: { question: message, answer: reply },
  });

  return reply;

 
};

export const getChatHistory = async () => {
  /* return prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  }); */

  return prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    
  });
};
