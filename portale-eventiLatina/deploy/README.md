# PORTE APERTE (Oracle Cloud Console)
Devi aprire queste porte nel **Security List** della tua VM:

| Porta | Protocollo | Uso |
|-------|-----------|-----|
| 80    | TCP       | HTTP (nginx → redirect a HTTPS se usi SSL) |
| 443   | TCP       | HTTPS (se configuri SSL) |
| 3001   | TCP       | Express API (solo interno, protetto da nginx) |

# PORTE CHIUSE
Non esporre mai la porta 3001 pubblicamente. nginx funge da reverse proxy.

# PASSAGGI DOPO LO SCRIPT

## 1. Modifica il file .env
```bash
nano ~/portale-eventiLatina/.env
```
Imposta almeno:
- `JWT_SECRET` → genera con `openssl rand -hex 32`
- `GOOGLE_CLIENT_ID` → dal tuo progetto Google Cloud
- `GOOGLE_CLIENT_SECRET` → dal tuo progetto Google Cloud
- `ADMIN_EMAIL` → la tua email per admin

## 2. Riavvia
```bash
systemctl restart eventinlatina
```

## 3. Verifica
```bash
curl http://localhost:3001/api/health
# → {"status":"ok",...}

curl http://IP_PUBBLICA/api/health
# → stessa risposta via nginx
```

## 4. Per aggiornare il codice
```bash
cd ~/portale-eventiLatina
git pull
npm run build
systemctl restart eventinlatina
```
