import { Bot } from 'grammy';
import dotenv from 'dotenv';
import {
  handleStart,
  handlePageSwitch,
  handleFontChange,
  handleStats
} from './handlers/start';
import {
  handleTextMessage,
  handleNonTextMessage
} from '../src/handlers/font';

dotenv.config();

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN topilmadi! .env faylini tekshiring.");
}

const bot = new Bot(token);

// Buyruqlar
bot.command('start', handleStart);
bot.command('stats', handleStats);

// Callback (tugmalar) ishlovchilari
bot.callbackQuery(/^page_/, handlePageSwitch);
bot.callbackQuery(/^font_/, handleFontChange);

// Xabarlarni qabul qilish
bot.on('message:text', handleTextMessage);
bot.on('message', handleNonTextMessage);

// Botni ishga tushirish
bot.start({
  onStart: () => console.log('Bot muvaffaqiyatli ishga tushdi!')
});