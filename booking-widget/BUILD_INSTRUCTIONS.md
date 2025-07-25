# Инструкция по сборке и запуску (booking-widget)

**Все команды выполняются из директории `booking-widget`, если не указано иное**

## 1. Описание директорий
- `public/` — собранные JS/CSS файлы виджета, ассеты (картинки, иконки)
- `dist/` — (если используется) временные файлы сборки
- `node_modules/` — зависимости

## 2. Очистка перед билдом
Для чистого билда рекомендуется удалить:
- `public/booking-widget.js`
- `public/booking-widget.css`
- `public/booking-widget.js.LICENSE.txt`
- `dist/` (если есть)
- `node_modules/` (если есть проблемы с зависимостями)

**Команды для удаления:**
```sh
# Windows PowerShell
Remove-Item -Force public/booking-widget.js, public/booking-widget.css, public/booking-widget.js.LICENSE.txt
Remove-Item -Recurse -Force dist
# или bash
rm -f public/booking-widget.js public/booking-widget.css public/booking-widget.js.LICENSE.txt
rm -rf dist
```

---

## 3. Глубокая локальная отладка (без Docker)
**Перейдите в директорию `booking-widget` перед выполнением команд:**
```sh
cd booking-widget
pnpm install                   # Установка зависимостей
pnpm run build:widget          # Сборка JS/CSS виджета (создаст файлы в public/)
NODE_ENV=development node server.js   # Запуск локального сервера (порт 3001)
```
- Для работы backend и базы данных — запустите их аналогично вручную (см. соответствующие инструкции).

---

## 4. Локальное тестирование в Docker Compose
**Выполняется из корня проекта, где лежит `docker-compose.yml`:**
```sh
# Поднять все сервисы (frontend, backend, widget, db)
docker-compose up -d

# Остановить все сервисы
docker-compose down
```
- Все сервисы будут доступны на своих портах, как указано в `docker-compose.yml`.
- Для пересборки контейнеров после изменений:
  ```sh
  docker-compose up -d --build
  ```

---

## 5. Production build и деплой на удалённый сервер

### 5.1. Сборка и публикация образа (локально, на вашей машине)
**Выполняется из корня проекта!**
```sh
# Сборка Docker-образа для виджета
# --no-cache гарантирует, что не будет использовано ничего из старого кэша
# -t задаёт тег образа (замени на свой dockerhub-логин, если нужно)
docker build --no-cache -t vampyreqwe/business-calendar:widget -f booking-widget/Dockerfile ./booking-widget

# Публикация образа в Docker Hub
# (предварительно залогиньтесь: docker login)
docker push vampyreqwe/business-calendar:widget
```

### 5.2. На удалённом сервере
**Выполняется из корня проекта, где лежит `docker-compose.yml`:**
```sh
# Получить последнюю версию образа
docker-compose pull widget

# Перезапустить сервис (widget)
docker-compose up -d widget
```
- Если нужно пересобрать все сервисы: `docker-compose up -d --build`
- Для полной остановки: `docker-compose down`

### 5.3. Примечания
- Все переменные окружения и build-аргументы для production прописаны в `docker-compose.yml` и `Dockerfile`.
- Не забудьте проверить, что порт 3001 открыт на сервере. 