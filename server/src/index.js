const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const DEFAULT_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const ALLOWED_ORIGINS = allowedOrigins.length > 0 ? allowedOrigins : DEFAULT_ORIGINS;
const IS_PROD = process.env.NODE_ENV === 'production';

function isDevLocalOrigin(origin) {
  if (IS_PROD) return false;
  try {
    const u = new URL(origin);
    const hostOk = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
    const protoOk = u.protocol === 'http:' || u.protocol === 'https:';
    return hostOk && protoOk;
  } catch {
    return false;
  }
}

// Файл БД: по умолчанию server/database.db (рядом с package.json сервера).
// Можно переопределить: SQLITE_PATH=./data/app.db в .env
const dbFile = process.env.SQLITE_PATH
  ? path.resolve(process.cwd(), process.env.SQLITE_PATH)
  : path.join(__dirname, '..', 'database.db');

const dbDir = path.dirname(dbFile);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbFile);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    message_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const insertFeedback = db.prepare(`
  INSERT INTO feedbacks (user_name, user_email, message_text)
  VALUES (@user_name, @user_email, @message_text)
`);

app.disable('x-powered-by');
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  }),
);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin) || isDevLocalOrigin(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));

const formLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/contact', formLimiter, (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Заполните имя, email и сообщение' });
  }

  try {
    const result = insertFeedback.run({
      user_name: name,
      user_email: email,
      message_text: message,
    });
    return res.json({
      ok: true,
      id: result.lastInsertRowid,
      message: 'Спасибо, ваше сообщение отправлено!',
    });
  } catch (err) {

    console.error('[contact] DB error', err);
    return res.status(500).json({ message: 'Не удалось сохранить обращение. Попробуйте позже.' });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log('SQLite database file:', dbFile);
});
