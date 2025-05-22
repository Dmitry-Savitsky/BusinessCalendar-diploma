const express = require('express');
const cors = require('cors');
const path = require('path');

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 