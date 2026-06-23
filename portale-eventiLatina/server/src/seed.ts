import { v4 as uuidv4 } from 'uuid';
import db from './database';

function future(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
}

const events = [
  // ===== MUSICA E CONCERTI =====
  { title: 'Concerto Jazz al Tramonto - Giardini di Villa Fogliano', desc: 'Jazz dal vivo con vista sul lago. Artisti internazionali e degustazione vini locali. Porta il tuo cuscino e una coperta.', cat: 'cat_music', day: 0, time: '18:30', period: 'sera', loc: 'Villa Fogliano', city: 'Latina', prov: 'LT' },
  { title: 'Notte di Samba - Piazza del Popolo', desc: 'Musica brasiliana dal vivo con balli di gruppo. Lezioni gratuite di samba per principianti dalle 20:00.', cat: 'cat_music', day: 1, time: '21:00', period: 'sera', loc: 'Piazza del Popolo', city: 'Latina', prov: 'LT' },
  { title: 'Concerto dell\'Alba sul Monte Semprevisa', desc: 'Salita notturna con guida alpina per assistere al concerto all\'alba dalla vetta. Difficoltà media, portare torcia e scarponi.', cat: 'cat_music', day: 5, time: '04:00', period: 'mattina', loc: 'Monte Semprevisa', city: 'Cori', prov: 'LT' },
  { title: 'Piano Solo - Teatro Romano di Minturno', desc: 'Recital pianistico sotto le stelle nell\'antico teatro romano. Musiche di Chopin, Debussy e Satie.', cat: 'cat_music', day: 8, time: '21:00', period: 'sera', loc: 'Teatro Romano', city: 'Minturno', prov: 'LT' },
  { title: 'Festival del Cantautorato Italiano - Latina', desc: 'Tre giorni dedicati alla canzone d\'autore italiana. Ospiti speciali, jam session e incontri con gli artisti.', cat: 'cat_music', day: 14, time: '17:00', period: 'sera', loc: 'Palazzo della Cultura', city: 'Latina', prov: 'LT' },
  { title: 'DJ Set al Tramonto - Stabilimento La Lanterna', desc: 'Musica elettronica dal tramonto alla mezzanotte sulla spiaggia. Aperitivo incluso nel biglietto.', cat: 'cat_music', day: 3, time: '18:00', period: 'sera', loc: 'Stabilimento La Lanterna', city: 'Sabaudia', prov: 'LT' },

  // ===== TEATRO E DANZA =====
  { title: 'Commedia dell\'Arte - "Arlecchino Servitore di Due Padroni"', desc: 'Spettacolo di teatro popolare con maschere tradizionali. Adatto a tutta la famiglia.', cat: 'cat_theater', day: 2, time: '20:45', period: 'sera', loc: 'Teatro D\'Annunzio', city: 'Latina', prov: 'LT' },
  { title: 'Spettacolo di Danza Contemporanea - "Acqua"', desc: 'Coreografie ispirate all\'elemento acqua con proiezioni e musica dal vivo.', cat: 'cat_theater', day: 6, time: '21:00', period: 'sera', loc: 'Teatro Comunale', city: 'Latina', prov: 'LT' },
  { title: 'Laboratorio Teatrale per Ragazzi - Fiabe in Gioco', desc: 'Laboratorio gratuito per bambini dai 6 ai 12 anni. Giochi di ruolo, improvvisazione e costruzione di burattini.', cat: 'cat_theater', day: 4, time: '10:00', period: 'mattina', loc: 'Biblioteca Comunale', city: 'Latina', prov: 'LT' },

  // ===== CULTURA E MOSTRE =====
  { title: 'Mostra "I Macchiaioli e l\'Agro Pontino"', desc: 'Esposizione di opere dei Macchiaioli che hanno dipinto i paesaggi dell\'Agro Pontino tra Ottocento e Novecento.', cat: 'cat_culture', day: 1, time: '10:00', period: 'intera_giornata', loc: 'Museo Cambellotti', city: 'Latina', prov: 'LT' },
  { title: 'Presentazione Libro - "Storie di Latina" di Marco Rossi', desc: 'L\'autore racconta aneddoti e curiosità sulla storia della città dalla fondazione ai giorni nostri. Ingresso libero.', cat: 'cat_culture', day: 2, time: '17:30', period: 'pomeriggio', loc: 'Libreria Ubik', city: 'Latina', prov: 'LT' },
  { title: 'Visita Guidata Gratuita al Centro Storico di Latina', desc: 'Passeggiata tra architettura razionalista e piazze. Racconti sulla fondazione della città e i suoi segreti. Durata 2h.', cat: 'cat_culture', day: 0, time: '10:30', period: 'mattina', loc: 'Piazza del Popolo', city: 'Latina', prov: 'LT' },
  { title: 'Mostra Fotografica "Lazio Nascosto"', desc: 'Scatti d\'autore che raccontano i luoghi meno conosciuti della regione: borghi abbandonati, cascate segrete, sentieri dimenticati.', cat: 'cat_culture', day: 7, time: '16:00', period: 'pomeriggio', loc: 'Palazzo della Cultura', city: 'Latina', prov: 'LT' },

  // ===== SPORT =====
  { title: 'Gara di Podistica "Corri per Latina" - 10km', desc: 'Percorso pianeggiante tra le vie della città. Iscrizioni aperte fino al giorno prima. Medaglia per tutti i partecipanti.', cat: 'cat_sports', day: 10, time: '08:30', period: 'mattina', loc: 'Stadio Francioni', city: 'Latina', prov: 'LT' },
  { title: 'Lezione Gratuita di Yoga al Parco', desc: 'Lezione di yoga all\'aperto per tutti i livelli. Porta il tuo tappetino. In caso di pioggia verrà rimandata.', cat: 'cat_sports', day: 0, time: '09:00', period: 'mattina', loc: 'Parco Falcone e Borsellino', city: 'Latina', prov: 'LT' },
  { title: 'Ciclismo Amatoriale - Da Latina a Sabaudia in Bici', desc: 'Percorso di 25km sulla pista ciclabile del lungomare. Punti di ristoro lungo il percorso. Adatto a tutti.', cat: 'cat_sports', day: 6, time: '07:30', period: 'mattina', loc: 'Lungomare di Latina', city: 'Latina', prov: 'LT' },
  { title: 'Torneo di Beach Volley - Spiaggia di Sabaudia', desc: 'Torneo a squadre miste. Iscrizione gratuita. In palio cene e aperitivi per i vincitori.', cat: 'cat_sports', day: 9, time: '10:00', period: 'mattina', loc: 'Spiaggia di Sabaudia', city: 'Sabaudia', prov: 'LT' },

  // ===== NATURA E PARCHI =====
  { title: 'Birdwatching al Lago di Fogliano - Visita Guidata', desc: 'Osservazione dei fenicotteri rosa e degli aironi con guida naturalistica. Binocoli in dotazione. Appuntamento al centro visite.', cat: 'cat_nature', day: 1, time: '07:00', period: 'mattina', loc: 'Lago di Fogliano', city: 'Latina', prov: 'LT' },
  { title: 'Picnic nel Parco del Circeo - Area Attrezzata', desc: 'Giornata dedicata al relax nel parco. Aree picnic con griglie, giochi per bambini e percorsi natura. Ingresso gratuito.', cat: 'cat_nature', day: 3, time: '10:00', period: 'intera_giornata', loc: 'Parco Nazionale del Circeo', city: 'Sabaudia', prov: 'LT' },
  { title: 'Passeggiata tra i Giardini di Ninfa', desc: 'Visita al giardino romantico più bello d\'Italia. Percorso tra rose antiche, ruscelli e rovine medievali. Prenotazione obbligatoria.', cat: 'cat_nature', day: 12, time: '09:00', period: 'mattina', loc: 'Giardini di Ninfa', city: 'Sermoneta', prov: 'LT' },
  { title: 'Ciaspolata sul Terminillo', desc: 'Escursione con racchette da neve sul Monte Terminillo. Guida alpina, pranzo al rifugio. Noleggio ciaspole incluso.', cat: 'cat_nature', day: 20, time: '08:00', period: 'intera_giornata', loc: 'Monte Terminillo', city: 'Rieti', prov: 'RI' },

  // ===== TREKKING E PASSEGGIATE =====
  { title: 'Sentiero del Monte Circeo - Escursione Panoramica', desc: 'Percorso ad anello di 8km con vista mozzafiato sul mare e le isole Pontine. Difficoltà media. Portare acqua e scarponi.', cat: 'cat_trekking', day: 2, time: '07:00', period: 'mattina', loc: 'Monte Circeo', city: 'San Felice Circeo', prov: 'LT' },
  { title: 'Passeggiata sul Lungomare di Latina - Gruppo Cammino', desc: 'Camminata di gruppo aperta a tutti. Percorso di 5km andata e ritorno sul nuovo lungomare. Ritrovo alle 9 alla rotonda.', cat: 'cat_trekking', day: 0, time: '09:00', period: 'mattina', loc: 'Lungomare di Latina', city: 'Latina', prov: 'LT' },
  { title: 'Trekking alle Grotte di Pastena', desc: 'Escursione sotterranea tra stalattiti e stalagmiti. Percorso attrezzato con guide speleologiche. Casco e torcia forniti.', cat: 'cat_trekking', day: 11, time: '10:00', period: 'mattina', loc: 'Grotte di Pastena', city: 'Pastena', prov: 'FR' },
  { title: 'Camminata tra gli Ulivi - Fonte di Lucullo', desc: 'Passeggiata tra oliveti secolari e sorgenti romane. Degustazione di olio EVO locale inclusa. Adatto a tutti.', cat: 'cat_trekking', day: 4, time: '09:30', period: 'mattina', loc: 'Fonte di Lucullo', city: 'Priverno', prov: 'LT' },
  { title: 'Il Sentiero dei Briganti - Escursione Guidata', desc: 'Percorso storico-naturalistico di 12km tra i boschi dei Monti Lepini. Storie di briganti e leggende locali. Pranzo al sacco.', cat: 'cat_trekking', day: 15, time: '07:30', period: 'intera_giornata', loc: 'Monti Lepini', city: 'Maenza', prov: 'LT' },
  { title: 'Nordic Walking al Parco del Fiume Cavata', desc: 'Lezione di nordic walking con istruttore certificato. Bastoncini forniti gratuitamente. Adatto a principianti.', cat: 'cat_trekking', day: 5, time: '08:00', period: 'mattina', loc: 'Parco del Cavata', city: 'Latina', prov: 'LT' },
  { title: 'Passeggiata al Tramonto tra le Dune di Sabaudia', desc: 'Camminata al tramonto sulle dune sabbiose con vista sul mare. Guida naturalistica. Fotografie mozzafiato.', cat: 'cat_trekking', day: 1, time: '17:30', period: 'pomeriggio', loc: 'Dune di Sabaudia', city: 'Sabaudia', prov: 'LT' },

  // ===== MONTAGNA E GITE =====
  { title: 'Gita al Rifugio F lame - Pranzo in Montagna', desc: 'Salita al rifugio con pranzo a base di prodotti tipici. Percorso adatto a famiglie. Si consigliano scarponi.', cat: 'cat_mountain', day: 8, time: '09:00', period: 'intera_giornata', loc: 'Monti Simbruini', city: 'Filettino', prov: 'FR' },
  { title: 'Giornata sulla Neve - Campo Staffi', desc: 'Pista da sci e giochi sulla neve per tutta la famiglia. Noleggio sci e snowboard disponibile. Campetto per bambini.', cat: 'cat_mountain', day: 25, time: '08:00', period: 'intera_giornata', loc: 'Campo Staffi', city: 'Filettino', prov: 'FR' },
  { title: 'Escursione al Lago del Turano', desc: 'Gita in montagna con arrivo al lago. Possibilità di canoa, pesca e pranzo nei caratteristici borghi. Panorami spettacolari.', cat: 'cat_mountain', day: 13, time: '08:30', period: 'intera_giornata', loc: 'Lago del Turano', city: 'Rieti', prov: 'RI' },
  { title: 'Monte Viglio - Vetta dei Simbruini', desc: 'Escursione impegnativa alla vetta più alta dei Monti Simbruini (2156m). Guida alpina. Pranzo al rifugio.', cat: 'cat_mountain', day: 22, time: '06:00', period: 'intera_giornata', loc: 'Monte Viglio', city: 'Camerata Nuova', prov: 'RM' },

  // ===== GITE FUORI PORTA =====
  { title: 'Gita a Bomarzo - Parco dei Mostri', desc: 'Visita al famoso parco monumentale con sculture mostruose del Cinquecento. Un\'esperienza unica tra arte e natura.', cat: 'cat_daytrip', day: 9, time: '09:00', period: 'intera_giornata', loc: 'Parco dei Mostri', city: 'Bomarzo', prov: 'VT' },
  { title: 'Giornata a Civita di Bagnoregio - La Città che Muore', desc: 'Visita al borgo sospeso nel tempo. Pranzo nei ristoranti tipici. Percorso a piedi con vista spettacolare sulla valle.', cat: 'cat_daytrip', day: 6, time: '10:00', period: 'intera_giornata', loc: 'Civita di Bagnoregio', city: 'Bagnoregio', prov: 'VT' },
  { title: 'Gita in Bici sulla Via Appia Antica', desc: 'Percorso ciclabile guidato sull\'antica strada romana. Dalle Catacombe al Parco della Caffarella. Bici a noleggio.', cat: 'cat_daytrip', day: 11, time: '09:00', period: 'mattina', loc: 'Via Appia Antica', city: 'Roma', prov: 'RM' },
  { title: 'Gita al Lago di Bracciano e Castello Orsini-Odescalchi', desc: 'Giornata sul lago con visita al castello. Possibilità di bagno e pranzo nei caratteristici borghi di Bracciano e Anguillara.', cat: 'cat_daytrip', day: 16, time: '09:30', period: 'intera_giornata', loc: 'Lago di Bracciano', city: 'Bracciano', prov: 'RM' },
  { title: 'Abbazia di Fossanova e Borgo di Priverno', desc: 'Visita guidata all\'abbazia cistercense e al centro storico medievale. Degustazione di prodotti tipici.', cat: 'cat_daytrip', day: 4, time: '10:00', period: 'intera_giornata', loc: 'Abbazia di Fossanova', city: 'Priverno', prov: 'LT' },
  { title: 'Gita alle Isole Pontine - Aliscafo per Ponza', desc: 'Partenza da Anzio o Formia. Giornata in barca con bagno, pranzo a bordo e visita all\'isola. Ritorno al tramonto.', cat: 'cat_daytrip', day: 18, time: '08:00', period: 'intera_giornata', loc: 'Porto di Anzio', city: 'Anzio', prov: 'RM' },

  // ===== SPETTACOLO E FESTE =====
  { title: 'Festa della Birra Artigianale - Latina Beer Fest', desc: 'Oltre 50 birre artigianali italiane. Stand gastronomici, musica dal vivo e giochi popolari. Ingresso gratuito.', cat: 'cat_entertainment', day: 7, time: '18:00', period: 'sera', loc: 'Piazza della Libertà', city: 'Latina', prov: 'LT' },
  { title: 'Sagra della Tellina - Spiaggia di Capoportiere', desc: 'La tradizionale sagra estiva con telline fritte, pasta con le telline e vino dei Castelli Romani. Musica folk.', cat: 'cat_entertainment', day: 14, time: '19:00', period: 'sera', loc: 'Capoportiere', city: 'Latina', prov: 'LT' },
  { title: 'Notte delle Stelle - Osservatorio Astronomico', desc: 'Serata di osservazione delle stelle con telescopi professionali. Astronomi a disposizione per spiegazioni. Porta un plaid.', cat: 'cat_entertainment', day: 10, time: '21:00', period: 'sera', loc: 'Osservatorio Astronomico', city: 'Campo Catino', prov: 'FR' },
  { title: 'Fiera del Disco e del Collezionismo', desc: 'Banchi di vinili, cd, fumetti e oggetti da collezione. Ingresso gratuito. Porta i tuoi dischi per una valutazione gratuita.', cat: 'cat_entertainment', day: 12, time: '09:00', period: 'intera_giornata', loc: 'Fiera di Latina', city: 'Latina', prov: 'LT' },

  // ===== ENOGASTRONOMIA =====
  { title: 'Mercato Contadino di Campagna Amica', desc: 'Produttori locali con frutta, verdura, formaggi, salumi, olio e vino. Ogni sabato mattina in Piazza della Libertà.', cat: 'cat_food', day: 1, time: '08:00', period: 'mattina', loc: 'Piazza della Libertà', city: 'Latina', prov: 'LT' },
  { title: 'Corso di Cucina Tipica Pontina', desc: 'Impara a preparare le ricette tradizionali: spaghetti alla chitarra, coda alla vaccinara, carciofi alla romana.', cat: 'cat_food', day: 14, time: '10:00', period: 'mattina', loc: 'Cucina Popolare', city: 'Latina', prov: 'LT' },
  { title: 'Degustazione Vini dei Castelli Romani - Cantina Sociale', desc: 'Percorso di degustazione di 8 vini accompagnati da prodotti locali. Cantina storica con visita alle botti.', cat: 'cat_food', day: 8, time: '17:00', period: 'pomeriggio', loc: 'Cantina Sociale', city: 'Cori', prov: 'LT' },
  { title: 'Festa dell\'Olio Nuovo - Borgo di Maenza', desc: 'Prima spremitura delle olive. Degustazione di olio nuovo su bruschette, visite ai frantoi e mercatini.', cat: 'cat_food', day: 30, time: '10:00', period: 'intera_giornata', loc: 'Centro Storico', city: 'Maenza', prov: 'LT' },
  { title: 'Street Food Festival - Sapori del Lazio', desc: 'Food truck con specialità regionali: trapizzino, supplì, porchetta, fritti e dolci. Musica e intrattenimento.', cat: 'cat_food', day: 5, time: '18:00', period: 'sera', loc: 'Lungomare', city: 'Terracina', prov: 'LT' },

  // ===== BAMBINI E FAMIGLIE =====
  { title: 'Laboratorio di Pittura per Bambini - "Colori in Libertà"', desc: 'Laboratorio artistico per bambini dai 3 ai 10 anni. Materiali inclusi. I bambini portano a casa le loro opere.', cat: 'cat_kids', day: 2, time: '10:00', period: 'mattina', loc: 'Spazio Arte', city: 'Latina', prov: 'LT' },
  { title: 'Fattoria Didattica - Una Giornata in Fattoria', desc: 'I bambini possono accarezzare animali, mungere le capre, fare il formaggio e raccogliere la frutta. Pranzo incluso.', cat: 'cat_kids', day: 6, time: '09:30', period: 'intera_giornata', loc: 'Fattoria didattica "Il Casale"', city: 'Latina', prov: 'LT' },
  { title: 'Caccia al Tesoro nel Parco - Avventura per Famiglie', desc: 'Gara a squadre con indizi e prove da superare nel parco. Premi per tutti i partecipanti. Età consigliata 4-12 anni.', cat: 'cat_kids', day: 3, time: '15:00', period: 'pomeriggio', loc: 'Parco San Marco', city: 'Latina', prov: 'LT' },
  { title: 'Spettacolo di Burattini - "Pinocchio"', desc: 'Il classico di Collodi rivisitato dai burattinai tradizionali. Adatto ai più piccoli. Ingresso 5€, bambini gratis.', cat: 'cat_kids', day: 0, time: '16:30', period: 'pomeriggio', loc: 'Teatro D\'Annunzio', city: 'Latina', prov: 'LT' },
  { title: 'Pomeriggio di Giochi da Tavolo in Biblioteca', desc: 'Giochi di società per ragazzi dagli 8 ai 16 anni. Giochi da tavolo moderni, carte e giochi di ruolo. Gratuito.', cat: 'cat_kids', day: 4, time: '15:00', period: 'pomeriggio', loc: 'Biblioteca Ragazzi', city: 'Latina', prov: 'LT' },

  // ===== ALTRI EVENTI MATTUTINI =====
  { title: 'Colazione in Piazza con Prodotti Tipici', desc: 'Prima colazione all\'aperto con cornetti artigianali, caffè specialità e succhi freschi. Ogni domenica mattina.', cat: 'cat_food', day: 0, time: '08:00', period: 'mattina', loc: 'Piazza del Popolo', city: 'Latina', prov: 'LT' },
  { title: 'Corso di Fotografia Naturalistica - Uscita al Parco', desc: 'Lezione pratica di fotografia nella riserva naturale. Impara a fotografare uccelli, paesaggi e dettagli. Porta la tua reflex.', cat: 'cat_culture', day: 10, time: '06:30', period: 'mattina', loc: 'Riserva del Lago di Fogliano', city: 'Latina', prov: 'LT' },
  { title: 'Mercatino dell\'Antiquariato e Vintage', desc: 'Banchi di antiquariato, modernariato e vintage. Oggetti unici da collezione, mobili restaurati e abbigliamento retrò.', cat: 'cat_entertainment', day: 0, time: '08:00', period: 'mattina', loc: 'Corso della Repubblica', city: 'Latina', prov: 'LT' },
  { title: 'Ginnastica Dolce al Parco per Over 60', desc: 'Esercizi di stretching e mobilità articolare all\'aperto. Istruttore qualificato. Partecipazione gratuita.', cat: 'cat_sports', day: 1, time: '09:30', period: 'mattina', loc: 'Villa Comunale', city: 'Latina', prov: 'LT' },
  { title: 'Mercato dei Fiori e delle Piante', desc: 'Vendita di fiori, piante da giardino e da balcone, semi e attrezzature per il giardinaggio. Consulenza gratuita.', cat: 'cat_nature', day: 3, time: '09:00', period: 'mattina', loc: 'Mercato Ortofrutticolo', city: 'Latina', prov: 'LT' },

  // ===== EVENTI A ROMA RAGGIUNGIBILI IN GIORNATA =====
  { title: 'Visita ai Musei Vaticani - Ultima Domenica del Mese', desc: 'Ingresso gratuito ai Musei Vaticani l\'ultima domenica del mese. Percorso con guida. Prenotazione consigliata.', cat: 'cat_culture', day: 20, time: '08:00', period: 'intera_giornata', loc: 'Musei Vaticani', city: 'Roma', prov: 'RM' },
  { title: 'Gita a Ostia Antica - Alla Scoperta dell\'Antica Roma', desc: 'Visita guidata agli scavi archeologici di Ostia Antica. Pranzo libero nell\'area picnic del parco archeologico.', cat: 'cat_daytrip', day: 5, time: '09:00', period: 'intera_giornata', loc: 'Scavi di Ostia Antica', city: 'Ostia', prov: 'RM' },
  { title: 'Parco Avventura - Sughereta di Fregene', desc: 'Percorsi acrobatici tra gli alberi per tutta la famiglia. 5 percorsi di difficoltà crescente. Adatto dai 3 anni.', cat: 'cat_kids', day: 10, time: '10:00', period: 'intera_giornata', loc: 'Sughereta di Fregene', city: 'Fregene', prov: 'RM' },
];

export default function seedDemoEvents() {
  const count = db.prepare('SELECT COUNT(*) as total FROM events').get() as any;
  if (count.total > 3) {
    console.log(`[Seed] ${count.total} events already present, skipping.`);
    return;
  }

  console.log('[Seed] Seeding rich event database...');
  const insert = db.prepare(
    "INSERT OR IGNORE INTO events (id, title, description, category_id, date, time, time_period, location, city, province, region, source_name, is_auto_generated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Lazio', 'eventiNLatina', 0)"
  );

  const txn = db.transaction(() => {
    let n = 0;
    for (const e of events) {
      insert.run(uuidv4(), e.title, e.desc, e.cat, future(e.day), e.time, e.period, e.loc, e.city, e.prov);
      n++;
    }
    console.log(`[Seed] Seeded ${n} events.`);
  });
  txn();
}
