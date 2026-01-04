require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Главная страница Mini App
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API: получить категории и блюда
app.get('/api/menu', (req, res) => {
  const menu = [
    { category: "Супы", items: ["Борщ", "Лагман", "Солянка"] },
    { category: "Основное", items: ["Шашлык", "Плов", "Котлеты"] },
    { category: "Десерты", items: ["Чизкейк", "Мороженое", "Пахлава"] }
  ];
  res.json(menu);
});

// API: Корзина (для теста можно временно)
let cart = [];
app.post('/api/cart', (req, res) => {
  cart = req.body;
  res.json({ status: "ok", cart });
});

app.get('/api/cart', (req, res) => {
  res.json(cart);
});

app.listen(PORT, () => {
  console.log(`🛒 Mini App запущен на http://localhost:${PORT}`);
});
