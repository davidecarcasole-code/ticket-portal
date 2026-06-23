# Studio Legale Mandroneniglio - Tema WordPress

Tema WordPress professionale per **Studio Legale Mandroneniglio** con sistema utenti e forum integrato.

## Struttura del tema

```
wp-content/themes/studio-legale-mandroneniglio/
├── style.css                  # Info tema
├── screenshot.svg             # Screenshot per backoffice
├── index.php                  # Template principale
├── functions.php              # Core del tema
├── header.php                 # Header
├── footer.php                 # Footer
├── sidebar.php                # Sidebar
├── front-page.php             # Homepage
├── page.php                   # Pagine
├── single.php                 # Articoli singoli
├── archive.php                # Archivi
├── search.php                 # Ricerca
├── 404.php                    # Pagina 404
├── comments.php               # Commenti
├── single-slm_forum_topic.php # Discussione forum
├── archive-slm_forum_topic.php # Archivio forum
├── assets/
│   ├── css/style.css          # CSS completo
│   ├── js/main.js             # JavaScript
│   └── images/                # Immagini SVG placeholder
├── inc/
│   ├── theme-setup.php        # Setup tema
│   ├── enqueue.php            # Scripts & styles
│   ├── custom-post-types.php  # CPT (Team, Servizi, FAQ)
│   ├── forum.php              # Sistema forum
│   ├── users.php              # Gestione utenti
│   ├── widgets.php            # Widget personalizzati
│   └── helpers.php            # Funzioni helper
├── template-parts/            # Parti di template
├── page-templates/            # Template pagina
│   ├── full-width.php
│   ├── forum.php
│   ├── user-profile.php
│   ├── contatti.php
│   └── single-forum-topic.php
└── languages/                 # Traduzioni
```

## Installazione su Aruba

### 1. Caricare i file su Aruba

Via FTP:
- Host: il tuo server FTP Aruba (es. ftp.tuodominio.it)
- Username/password: le credenziali Aruba
- Percorso: `www/studiolegalemandroneniglio.it/htdocs/wp-content/themes/`
- Caricare l'intera cartella `studio-legale-mandroneniglio`

### 2. Attivare il tema

1. Accedi alla dashboard WordPress: `https://studiolegalemandroneniglio.it/wp-admin`
2. Vai a **Aspetto > Temi**
3. Trova **Studio Legale Mandroneniglio** e clicca **Attiva**

### 3. Configurare il tema

1. **Menu**: Aspetto > Menu
   - Crea un menu "Principale" con pagine: Home, Lo Studio, Aree di Diritto, FAQ, Forum, Contatti
   - Assegnalo a posizione "Menu Principale"

2. **Pagina Homepage**: Impostazioni > Lettura
   - "La tua homepage mostra": Una pagina statica
   - Homepage: seleziona la pagina "Home" (o creala con template front-page.php)

3. **Permalink**: Impostazioni > Permalink
   - Seleziona "Titolo articolo" (/%postname%/)
   - Salva per aggiornare i rewrite rules

4. **Forum e Profilo Utente**: Crea pagine con template:
   - Pagina "Forum" → Template "Forum"
   - Pagina "Profilo Utente" → Template "Profilo Utente"
   - Pagina "Contatti" → Template "Contatti"

### 4. Plugin consigliati

- **Contact Form 7** - Per form di contatto avanzati
- **Yoast SEO** - Per ottimizzazione SEO
- **Wordfence Security** - Per sicurezza

### 5. Immagini

Le immagini placeholder sono in formato SVG. Sostituiscile con foto reali:
- `assets/images/hero-law-1.svg` → Foto studio/stanza tribunale (1920x800px)
- `assets/images/about-studio.svg` → Foto team/ufficio (600x700px)
- `assets/images/testimonial-*.svg` → Foto profilo clienti (80x80px)

## Funzionalità

### Sistema Forum
- Discussioni con categorie
- Risposte come custom post type
- Stato: aperto/chiuso, in evidenza, risolto
- Solo utenti registrati possono postare
- Moderazione dal backend WordPress

### Gestione Utenti
- Campi extra nel profilo (telefono, professione, area legale)
- Registrazione con selezione professione
- Pagina profilo personale
- Shortcode `[slm_user_profile]`

### Aree Admin Personalizzate
- **Team** - Membri dello studio
- **Servizi** - Servizi legali (con tassonomia Aree di Diritto)
- **FAQ** - Domande frequenti
- **Forum** - Discussioni e Risposte
- **Widget** - SLM Post Recenti e SLM Categorie Forum

## Personalizzazione

Per modificare colori e stili, aggiorna le variabili CSS in `assets/css/style.css` (sezione `:root`).

Colori principali:
- `--slm-primary: #1B1B2F` (blu notte)
- `--slm-accent: #C5A55A` (oro)
- `--font-heading: Cinzel` (titoli)
- `--font-body: Lato` (corpo)

## Note

- Le immagini SVG sono placeholder. Sostituiscile con foto reali per un aspetto professionale.
- Prima di andare in produzione, verifica la configurazione SSL (HTTPS) su Aruba.
- Aggiorna il file `header.php` con numero di telefono e indirizzo reali.
