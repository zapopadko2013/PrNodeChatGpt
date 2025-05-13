import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { config } from 'dotenv';
import { chatRouter } from './routes/chatRoutes';
import { PrismaClient } from '@prisma/client';

config(); // Загружаем переменные из .env
const app = express();
const PORT = process.env.PORT || 3001;

// Подключаем Prisma клиент
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Роуты
app.use('/api/chat', chatRouter);

// Инициализация базы через prisma db push
function initDatabaseAndStartServer() {
  console.log('Инициализация базы данных...');

  exec('npx prisma db push', (err, stdout, stderr) => {
    if (err) {
      console.error('Ошибка при синхронизации схемы БД:', stderr);
      process.exit(1);
    }

    console.log('База данных синхронизирована:\n', stdout);

    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  });
}

// Запуск
initDatabaseAndStartServer();