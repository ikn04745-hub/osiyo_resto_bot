require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const LANGUAGES = {
  ru: {
    start: "Добро пожаловать в ресторан 🍽",
    menu: "📖 Меню",
    delivery: "🚚 Доставка",
    about: "ℹ️ О ресторане",
    booking: "📅 Бронирование"
  },
  en: {
    start: "Welcome to the restaurant 🍽",
    menu: "📖 Menu",
    delivery: "🚚 Delivery",
    about: "ℹ️ About restaurant",
    booking: "📅 Booking"
  },
  uz: {
    start: "Restoranga xush kelibsiz 🍽",
    menu: "📖 Menyu",
    delivery: "🚚 Yetkazib berish",
    about: "ℹ️ Restoran haqida",
    booking: "📅 Band qilish"
  }
};

const userLang = {};

function mainMenu(lang) {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: LANGUAGES[lang].menu, callback_data: 'menu' }],
        [{ text: LANGUAGES[lang].delivery, web_app: { url: process.env.MINIAPP_URL } }],
        [{ text: LANGUAGES[lang].about, callback_data: 'about' }],
        [{ text: LANGUAGES[lang].booking, callback_data: 'booking' }]
      ]
    }
  };
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  userLang[chatId] = 'ru';

  bot.sendMessage(
    chatId,
    LANGUAGES.ru.start,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🇷🇺 Русский", callback_data: 'lang_ru' }],
          [{ text: "🇬🇧 English", callback_data: 'lang_en' }],
          [{ text: "🇺🇿 O‘zbek", callback_data: 'lang_uz' }]
        ]
      }
    }
  );
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  if (query.data.startsWith('lang_')) {
    const lang = query.data.split('_')[1];
    userLang[chatId] = lang;
    bot.sendMessage(chatId, LANGUAGES[lang].start, mainMenu(lang));
  }

  if (query.data === 'about') {
    bot.sendMessage(chatId,
      "📍 Адрес: г. Ташкент\n🕘 Время работы: 10:00 - 23:00\n📞 Телефон: +998 xx xxx xx xx",
      mainMenu(userLang[chatId])
    );
  }

  if (query.data === 'booking') {
    bot.sendMessage(chatId,
      "📅 Для бронирования столика напишите администратору.",
      mainMenu(userLang[chatId])
    );
  }

  if (query.data === 'menu') {
    bot.sendMessage(chatId,
      "🍽 Наше меню доступно в категориях.\n(без цен, только просмотр)",
      mainMenu(userLang[chatId])
    );
  }

  bot.answerCallbackQuery(query.id);
});

console.log("🤖 Бот запущен");
