const express = require('express');
const cors = require('cors');
const path = require('path');
const { config } = require('./lib/config');

const app = express();

// Включаем CORS для всех запросов
app.use(cors());

// Раздаем статические файлы из директории dist
app.use(express.static(path.join(__dirname, 'dist')));

// Раздаем HTML файл для тестирования
app.use(express.static(path.join(__dirname)));

// Обработка всех запросов к /booking-widget.js
app.get('/booking-widget.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'booking-widget.js'));
});

app.listen(config.widgetPort, () => {
  console.log(`Server is running on http://localhost:${config.widgetPort}`);
}); 