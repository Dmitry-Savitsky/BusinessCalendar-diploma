# Инструкция по сборке и запуску (b-calendar-frontend)

**Все команды выполняются из директории `b-calendar-frontend`, если не указано иное**

## 1. Описание директорий
- `.next/` — папка сборки Next.js (кэш, статика, серверные файлы)
- `public/` — публичные ассеты (картинки, иконки и т.д.)

## 2. Очистка перед билдом
Для чистого билда рекомендуется удалить:
- `.next/` — всегда можно удалять, Next.js пересоберёт всё заново
- `node_modules/` — если есть проблемы с зависимостями (опционально)

**Команды для удаления:**
```sh
# Windows PowerShell
Remove-Item -Recurse -Force .next
# или bash
rm -rf .next
```

---

## 3. Глубокая локальная отладка (без Docker)
**Перейдите в директорию `b-calendar-frontend` перед выполнением команд:**

```sh
cd b-calendar-frontend
pnpm install           # Установка зависимостей
# Запуск с указанием локального backend (Bash):
NEXT_PUBLIC_API_URL=http://localhost:5221 pnpm dev
# или для PowerShell (Windows):
# $env:NEXT_PUBLIC_API_URL = "http://localhost:5221"; pnpm dev
```
- Приложение будет доступно на http://localhost:3000
- Все API-запросы будут идти на http://localhost:5221
- Для production-режима:
```sh
pnpm build             # Сборка production-версии (создаст .next/)
pnpm start             # Запуск production-сервера (http://localhost:3000)
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
# Сборка Docker-образа для фронтенда
# --no-cache гарантирует, что не будет использовано ничего из старого кэша
# -t задаёт тег образа (замени на свой dockerhub-логин, если нужно)
docker build --no-cache -t vampyreqwe/business-calendar:frontend -f b-calendar-frontend/Dockerfile ./b-calendar-frontend

# Публикация образа в Docker Hub
# (предварительно залогиньтесь: docker login)
docker push vampyreqwe/business-calendar:frontend
```

### 5.2. На удалённом сервере
**Выполняется из корня проекта, где лежит `docker-compose.yml`:**
```sh
# Получить последнюю версию образа
docker-compose pull frontend

# Перезапустить сервис (frontend)
docker-compose up -d frontend
```
- Если нужно пересобрать все сервисы: `docker-compose up -d --build`
- Для полной остановки: `docker-compose down`

### 5.3. Примечания
- Все переменные окружения и build-аргументы для production прописаны в `docker-compose.yml` и `Dockerfile`.
- Для смены API-URL меняйте переменную `NEXT_PUBLIC_API_URL` в `docker-compose.yml` и/или `Dockerfile`.
- Не забудьте проверить, что порт 3000 открыт на сервере. 