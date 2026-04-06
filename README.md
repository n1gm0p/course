# Kalmbuddha - гид по Элисте и Калмыкии

Учебный веб-проект с подборкой интересных мест, фильтрами и формой обратной связи.

Текущий стек:
- **Frontend:** React + TypeScript + Vite + React Router + Axios
- **Backend:** Node.js + Express
- **База данных:** SQLite (`better-sqlite3`)

## Что умеет текущая версия

- Главная страница с информацией о регионе и превью популярных мест.
- Каталог мест с вкладками:
  - Все
  - Достопримечательности
  - Кафе и рестораны
  - Активный отдых
  - Избранное
- Избранное сохраняется в `localStorage`.
- Переключение светлой/темной темы (также хранится в `localStorage`).
- Модальное окно с подробностями по месту.
- Форма обратной связи в футере, отправка на API (`POST /api/contact`) и сохранение в SQLite.

## Быстрый старт (локально)

### 1) Требования
- Node.js 18+ (рекомендуется 20+)

### 2) Установка зависимостей
Из корня проекта:

```bash
npm --prefix server install
npm --prefix client install
```

### 3) Настройка переменных окружения сервера
Скопируйте `server/env.example` в `server/.env`:

```bash
copy server\env.example server\.env
```

Минимально проверьте значения:
- `PORT=4000`
- `CORS_ORIGIN=http://localhost:5173`

### 4) Запуск в режиме разработки
Запустите сервер и клиент в двух терминалах:

```bash
npm --prefix server run dev
```

```bash
npm --prefix client run dev
```

После запуска:
- frontend: `http://127.0.0.1:5173`
- API: `http://localhost:4000/api`

Проверка API:
- `GET /api/health` -> `{ "status": "ok" }`

## Переменные окружения сервера

Файл: `server/.env`

- `NODE_ENV` - режим работы (`development`/`production`)
- `PORT` - порт API
- `CORS_ORIGIN` - разрешенный origin фронтенда (можно перечислить через запятую)
- `SQLITE_PATH` - опционально, путь к файлу SQLite (по умолчанию `server/database.db`)

## Структура проекта

- `client/` - React-приложение
- `server/` - Express API и SQLite
- `server/src/index.js` - основной файл сервера

## Примечания

- Аутентификация и регистрация в текущей версии **не используются**.
- Данные каталога мест сейчас заданы в коде фронтенда (`client/src/App.tsx`).
