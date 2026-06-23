import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || './data/events.db';

const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db: DatabaseType = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user','admin','super_admin')),
    theme TEXT DEFAULT 'default',
    accent_color TEXT DEFAULT '#6366f1',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    parent_id TEXT
  );

  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category_id TEXT NOT NULL,
    date TEXT NOT NULL,
    end_date TEXT,
    time TEXT,
    time_period TEXT CHECK(time_period IN ('mattina','pomeriggio','sera','intera_giornata')),
    location TEXT,
    address TEXT,
    city TEXT DEFAULT 'Latina',
    province TEXT DEFAULT 'LT',
    region TEXT DEFAULT 'Lazio',
    price TEXT,
    suitable_for TEXT,
    image_url TEXT,
    source_url TEXT,
    source_name TEXT,
    is_auto_generated INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_by TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS saved_events (
    user_id TEXT NOT NULL,
    event_id TEXT NOT NULL,
    saved_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
  );

  CREATE TABLE IF NOT EXISTS search_config (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Configurazione Principale',
    cities TEXT NOT NULL DEFAULT '[]',
    provinces TEXT NOT NULL DEFAULT '[]',
    categories TEXT NOT NULL DEFAULT '[]',
    keywords TEXT NOT NULL DEFAULT '[]',
    radius_km INTEGER DEFAULT 50,
    auto_scrape INTEGER DEFAULT 1,
    scrape_interval_hours INTEGER DEFAULT 6,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
  CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);
  CREATE INDEX IF NOT EXISTS idx_events_city ON events(city);
  CREATE INDEX IF NOT EXISTS idx_events_province ON events(province);
  CREATE INDEX IF NOT EXISTS idx_events_time_period ON events(time_period);

  CREATE TABLE IF NOT EXISTS radio_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    station_name TEXT NOT NULL DEFAULT 'Radio Eventi Latina',
    station_description TEXT DEFAULT 'La web radio del portale eventiNLatina',
    stream_url TEXT,
    is_live INTEGER DEFAULT 0,
    current_track TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS radio_podcasts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    duration INTEGER DEFAULT 0,
    file_size INTEGER DEFAULT 0,
    file_type TEXT DEFAULT 'audio/webm',
    is_published INTEGER DEFAULT 1,
    created_by TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS radio_live_chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chunk_data BLOB NOT NULL,
    chunk_index INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Migrations for older databases
try { db.exec("ALTER TABLE events ADD COLUMN time_period TEXT"); } catch { }
try { db.exec("ALTER TABLE radio_settings ADD COLUMN stream_url TEXT"); } catch { }
try { db.exec("ALTER TABLE radio_podcasts ADD COLUMN file_type TEXT DEFAULT 'audio/webm'"); } catch { }
try { db.exec("ALTER TABLE radio_podcasts ADD COLUMN is_published INTEGER DEFAULT 1"); } catch { }

const now = new Date();
const today = now.toISOString().split('T')[0];

const categories = [
  { id: 'cat_music', name: 'Musica e Concerti', slug: 'musica', icon: 'music', color: '#ef4444' },
  { id: 'cat_theater', name: 'Teatro e Danza', slug: 'teatro', icon: 'drama', color: '#f59e0b' },
  { id: 'cat_culture', name: 'Cultura e Mostre', slug: 'cultura', icon: 'book-open', color: '#3b82f6' },
  { id: 'cat_sports', name: 'Sport', slug: 'sport', icon: 'trophy', color: '#10b981' },
  { id: 'cat_nature', name: 'Natura e Parchi', slug: 'natura', icon: 'leaf', color: '#22c55e' },
  { id: 'cat_trekking', name: 'Trekking e Passeggiate', slug: 'trekking', icon: 'footprints', color: '#65a30d' },
  { id: 'cat_mountain', name: 'Montagna e Gite', slug: 'montagna', icon: 'mountain', color: '#0284c7' },
  { id: 'cat_daytrip', name: 'Gite Fuori Porta', slug: 'gite', icon: 'car', color: '#0d9488' },
  { id: 'cat_entertainment', name: 'Spettacolo e Feste', slug: 'spettacolo', icon: 'sparkles', color: '#ec4899' },
  { id: 'cat_food', name: 'Enogastronomia', slug: 'enogastronomia', icon: 'utensils', color: '#a855f7' },
  { id: 'cat_kids', name: 'Bambini e Famiglie', slug: 'bambini', icon: 'baby', color: '#f472b6' },
];

const insertCat = db.prepare('INSERT OR IGNORE INTO categories (id, name, slug, icon, color) VALUES (?, ?, ?, ?, ?)');
for (const c of categories) {
  insertCat.run(c.id, c.name, c.slug, c.icon, c.color);
}

export default db;
