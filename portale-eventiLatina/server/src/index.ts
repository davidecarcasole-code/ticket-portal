import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cron from 'node-cron';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

import authRoutes, { authMiddleware } from './routes/auth';
import eventsRoutes from './routes/events';
import usersRoutes from './routes/users';
import scraperRoutes from './routes/scraper';
import searchConfigRoutes from './routes/searchConfig';
import radioRoutes from './routes/radio';
import { runScraper } from './scraper/engine';
import seedDemoEvents from './seed';
import db from './database';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(authMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/scraper', scraperRoutes);
app.use('/api/search-config', searchConfigRoutes);
app.use('/api/radio', radioRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve client build in production
const clientBuildPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  // SPA fallback: serve index.html for all non-API routes
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
  console.log('[Server] Serving client static files');
}

function scheduleScraping() {
  const config = db.prepare('SELECT * FROM search_config ORDER BY id LIMIT 1').get() as any;
  const interval = config?.scrape_interval_hours || 6;
  const autoScrape = config?.auto_scrape !== 0;

  if (autoScrape) {
    const cronExpr = `0 */${interval} * * *`;
    console.log(`[Server] Scheduled scraping every ${interval}h (${cronExpr})`);
    cron.schedule(cronExpr, async () => {
      console.log('[Cron] Starting scheduled scraping...');
      try {
        const count = await runScraper();
        console.log(`[Cron] Scraping complete. ${count} new events.`);
      } catch (err) {
        console.error('[Cron] Scraping error:', err);
      }
    });
  } else {
    console.log('[Server] Automatic scraping disabled.');
  }
}
scheduleScraping();

app.listen(PORT, () => {
  console.log(`[Server] eventiNLatina API running on port ${PORT}`);

  // Seed demo events on first run
  seedDemoEvents();

  // Initial scrape on startup
  runScraper().then(count => {
    console.log(`[Server] Initial scrape: ${count} new events.`);
  }).catch(err => {
    console.error('[Server] Initial scrape error:', err);
  });
});
