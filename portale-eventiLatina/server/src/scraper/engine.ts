import { chromium, Browser, Page } from 'playwright';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import db from '../database';

interface ScrapedEvent {
  title: string;
  description?: string;
  date: string;
  time?: string;
  time_period?: string;
  location?: string;
  city: string;
  province: string;
  category_id: string;
  image_url?: string;
  source_url: string;
  source_name: string;
  price?: string;
}

const SEARCH_QUERIES = [
  'eventi oggi Latina provincia',
  'cose da fare oggi Latina',
  'concerti Latina Lazio 2026',
  'sagre e feste provincia Latina',
  'escursioni guidate Lazio',
  'trekking organizzato Latina',
  'gite fuori porta Lazio',
  'mostre e musei Latina aperti',
  'spettacoli teatro Latina',
  'mercati contadini Latina',
  'corsi e laboratori Latina',
  'eventi bambini Latina',
  'visite guidate gratuite Lazio',
  'musei gratis domenica Lazio',
  'passeggiate naturalistiche Latina',
  'montagna Lazio escursioni',
  'borghi più belli Lazio visita',
  'sagre enogastronomiche Lazio 2026',
];

const LAZIO_CITIES = ['latina', 'roma', 'frosinone', 'viterbo', 'rieti', 'sabaudia', 'gaeta', 'terracina', 'cisterna', 'aprilia', 'fondi', 'formia', 'anagni', 'cassino', 'tivoli'];

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (browser && browser.isConnected()) return browser;
  browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  return browser;
}

async function dismissConsent(page: Page) {
  try {
    const btn = page.locator('button:has-text("Accetta"), button:has-text("Accept"), button:has-text("Accetta tutto"), #L2AGLb, .tHlp8d');
    if (await btn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await btn.first().click({ timeout: 3000 });
    }
  } catch { }
}

function categoryFromQueries(title: string, desc: string): string {
  const t = `${title} ${desc}`.toLowerCase();
  if (/\b(concerto|musica|concerti|dj|band|orchestra|jazz|rock|live)\b/.test(t)) return 'cat_music';
  if (/\b(teatro|commedia|dramma|palcoscenico|danza|balletto|musical)\b/.test(t)) return 'cat_theater';
  if (/\b(mostra|museo|arte|fotografia|cultura|libro|presentazione|conferenza)\b/.test(t)) return 'cat_culture';
  if (/\b(gara|maratona|podistica|ciclismo|yoga|partita|torneo|sport|atletica|bici)\b/.test(t)) return 'cat_sports';
  if (/\b(birdwatching|lago|parco|natura|picnic|giardino|riserva|fenicotteri)\b/.test(t)) return 'cat_nature';
  if (/\b(trekking|passeggiata|camminata|sentiero|escursione|cammino|nordic walking)\b/.test(t)) return 'cat_trekking';
  if (/\b(montagna|rifugio|neve|sci|vetta|alpina|ciaspolata|simbruini|terminillo)\b/.test(t)) return 'cat_mountain';
  if (/\b(gita|fuori porta|borgo|isole|gita in bici|viaggio|giornata|castello|abbazia)\b/.test(t)) return 'cat_daytrip';
  if (/\b(festa|sagra|fiera|notte|spettacolo|fuochi|collezionismo|mercatino)\b/.test(t)) return 'cat_entertainment';
  if (/\b(degustazione|vino|cibo|enogastronomia|street food|mercato contadino|cucina|birra|olio)\b/.test(t)) return 'cat_food';
  if (/\b(bambini|famiglie|fattoria|burattini|giochi|bambino|ragazzi|didattica)\b/.test(t)) return 'cat_kids';
  return 'cat_culture';
}

function detectCity(text: string): { city: string; province: string } {
  const l = text.toLowerCase();
  if (l.includes('roma') || l.includes('ostia') || l.includes('fregene') || l.includes('bracciano') || l.includes('anguillara') || l.includes('anzio') || l.includes('nettuno') || l.includes('tivoli') || l.includes('cerveteri')) return { city: extractCity(l, 'Roma'), province: 'RM' };
  if (l.includes('latina') || l.includes('sabaudia') || l.includes('gaeta') || l.includes('terracina') || l.includes('fondi') || l.includes('formia') || l.includes('sperlonga') || l.includes('cisterna') || l.includes('aprilia') || l.includes('pontinia') || l.includes('priverno') || l.includes('cori') || l.includes('sezze') || l.includes('sermoneta') || l.includes('san felice') || l.includes('maenza') || l.includes('minturno')) return { city: extractCity(l, 'Latina'), province: 'LT' };
  if (l.includes('frosinone') || l.includes('cassino') || l.includes('sora') || l.includes('anagni') || l.includes('ferentino') || l.includes('alatri') || l.includes('ceprano') || l.includes('fiuggi') || l.includes('filettino') || l.includes('pastena') || l.includes('campo catino')) return { city: extractCity(l, 'Frosinone'), province: 'FR' };
  if (l.includes('viterbo') || l.includes('tarquinia') || l.includes('bomarzo') || l.includes('bagnoregio') || l.includes('montefiascone') || l.includes('vetralla') || l.includes('nepi') || l.includes('sutri')) return { city: extractCity(l, 'Viterbo'), province: 'VT' };
  if (l.includes('rieti') || l.includes('terminillo') || l.includes('turan') || l.includes('salto')) return { city: extractCity(l, 'Rieti'), province: 'RI' };
  return { city: 'Latina', province: 'LT' };
}

function extractCity(l: string, fallback: string): string {
  for (const c of LAZIO_CITIES) {
    if (l.includes(c)) return c.charAt(0).toUpperCase() + c.slice(1);
  }
  return fallback;
}

function detectTimePeriod(title: string, desc: string, time?: string): string {
  if (time) {
    const h = parseInt(time.split(':')[0]);
    if (h < 12) return 'mattina';
    if (h < 18) return 'pomeriggio';
    return 'sera';
  }
  const t = `${title} ${desc}`.toLowerCase();
  if (/\b(alba|mattina|mattino|ore 0[0-9]|ore 1[0-1]|colazione)\b/.test(t)) return 'mattina';
  if (/\b(pomeriggio|ore 1[2-7]|merenda|dopo pranzo)\b/.test(t)) return 'pomeriggio';
  if (/\b(sera|serale|notte|tramonto|ore 1[89]|ore 2[0-3]|aperitivo|cena)\b/.test(t)) return 'sera';
  if (/\b(giornata|tutto il giorno|intera)\b/.test(t)) return 'intera_giornata';
  return 'intera_giornata';
}

function parseDate(text: string): string | null {
  const months: Record<string, string> = {
    'gennaio': '01', 'febbraio': '02', 'marzo': '03', 'aprile': '04',
    'maggio': '05', 'giugno': '06', 'luglio': '07', 'agosto': '08',
    'settembre': '09', 'ottobre': '10', 'novembre': '11', 'dicembre': '12',
    'gen': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'mag': '05', 'giu': '06',
    'lug': '07', 'ago': '08', 'set': '09', 'ott': '10', 'nov': '11', 'dic': '12',
  };
  const d = text.toLowerCase().trim();
  for (const [m, n] of Object.entries(months)) {
    if (d.includes(m)) {
      const parts = d.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
      const dayIdx = parts.findIndex(p => /\d+/.test(p));
      let day = dayIdx >= 0 ? parts[dayIdx].replace(/\D/g, '') : '01';
      day = day.padStart(2, '0');
      const yearMatch = d.match(/(\d{4})/);
      return `${yearMatch ? yearMatch[1] : new Date().getFullYear()}-${n}-${day}`;
    }
  }
  const m = d.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return null;
}

async function searchGooglePlaywright(query: string): Promise<ScrapedEvent[]> {
  const b = await getBrowser();
  const page = await b.newPage();
  const events: ScrapedEvent[] = [];

  try {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}&hl=it&num=15`, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });

    await dismissConsent(page);

    await page.waitForSelector('#search', { timeout: 15000 }).catch(() => { });

    // Extract search results via cheerio (parse rendered HTML)
    const html = await page.content();
    const $ = cheerio.load(html);
    const results: Array<{ title: string; url: string; snippet: string }> = [];

    $('.MjjYud').each((_: any, el: any) => {
      const $el = $(el);
      const title = $el.find('h3.LC20lb').first().text().trim();
      const url = $el.find('.yuRUbf a').first().attr('href') || '';
      const snippet = $el.find('.VwiC3b').first().text().trim();
      if (title && url && !url.includes('google.')) {
        results.push({ title, url, snippet });
      }
    });

    for (const r of results) {
      if (!r.url || r.title.length < 10) continue;
      const { city, province } = detectCity(`${r.title} ${r.snippet}`);
      let dateStr = new Date().toISOString().split('T')[0];
      const combined = `${r.title} ${r.snippet}`;
      const dateMatch = combined.match(/(\d{1,2})\s*(gen|feb|mar|apr|mag|giu|lug|ago|set|ott|nov|dic)\w*\s*(\d{4})?/i);
      if (dateMatch) {
        const parsed = parseDate(dateMatch[0]);
        if (parsed) dateStr = parsed;
      }
      const hourMatch = combined.match(/(\d{1,2})[:\.](\d{2})\b/);
      const time = hourMatch ? `${hourMatch[1].padStart(2, '0')}:${hourMatch[2]}` : undefined;

      events.push({
        title: r.title.slice(0, 200),
        description: r.snippet?.slice(0, 500) || undefined,
        date: dateStr,
        time,
        time_period: detectTimePeriod(r.title, r.snippet, time),
        city,
        province,
        category_id: categoryFromQueries(r.title, r.snippet),
        source_url: r.url,
        source_name: new URL(r.url).hostname.replace('www.', '').split('.')[0],
      });
    }
    console.log(`[Playwright] "${query.slice(0, 30)}": ${events.length} results`);
  } catch (err: any) {
    console.error(`[Playwright] "${query.slice(0, 30)}" error: ${err.message?.slice(0, 80)}`);
  } finally {
    await page.close().catch(() => { });
  }
  return events;
}

export async function scrapeLatinaEvents(): Promise<ScrapedEvent[]> {
  const results = await Promise.allSettled(SEARCH_QUERIES.map(q => searchGooglePlaywright(q)));
  const all: ScrapedEvent[] = [];
  for (const r of results) { if (r.status === 'fulfilled') all.push(...r.value); }

  const seen = new Set<string>();
  const unique = all.filter(e => {
    const key = e.title.toLowerCase().slice(0, 60) + e.date;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`[Scraper] ${unique.length} unique events from ${SEARCH_QUERIES.length} searches`);
  return unique;
}

export async function runScraper(): Promise<number> {
  console.log('[Scraper] Starting Playwright-based Google search...');
  const allEvents = await scrapeLatinaEvents();

  let inserted = 0;
  const existingUrls = new Set(
    (db.prepare('SELECT source_url FROM events WHERE is_auto_generated = 1 AND source_url IS NOT NULL').all() as any[]).map((r: any) => r.source_url)
  );

  const insertStmt = db.prepare(
    "INSERT OR IGNORE INTO events (id, title, description, category_id, date, time, time_period, location, city, province, region, image_url, source_url, source_name, is_auto_generated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Lazio', ?, ?, ?, 1)"
  );

  const txn = db.transaction(() => {
    for (const e of allEvents) {
      if (existingUrls.has(e.source_url)) continue;
      try {
        insertStmt.run(uuidv4(), e.title.slice(0, 200), e.description || null, e.category_id, e.date, e.time || null, e.time_period || null, e.location || null, e.city, e.province, e.image_url || null, e.source_url, e.source_name);
        inserted++;
      } catch { }
    }
  });
  txn();
  console.log(`[Scraper] Inserted ${inserted} new events from Google search.`);
  return inserted;
}

export async function searchEventsOnline(query: string): Promise<ScrapedEvent[]> {
  return searchGooglePlaywright(query);
}
