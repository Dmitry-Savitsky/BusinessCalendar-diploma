const express = require('express');
const cors = require('cors');
const path = require('path');
const { config } = require('./lib/config');

const app = express();

// Базовая настройка CORS - одной этой настройки должно быть достаточно
//app.use(cors());

// Раздаем статические файлы из директории public
app.use(express.static(path.join(__dirname, 'public')));

// Добавляем обработку ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(config.widgetPort, () => {
  console.log(`Server is running on http://localhost:${config.widgetPort}`);
}); 