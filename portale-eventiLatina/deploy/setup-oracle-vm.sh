#!/bin/bash
# Setup script for Oracle Cloud Ubuntu VM
# Run as root: sudo bash setup-oracle-vm.sh
# Or as a regular user with sudo: bash setup-oracle-vm.sh

set -euo pipefail

SCRIPT_USER="${SUDO_USER:-$USER}"
HOME_DIR=$(eval echo ~$SCRIPT_USER)
APP_DIR="$HOME_DIR/portale-eventiLatina"
DOMAIN="${1:-}"  # optional: pass domain as first arg

echo "=== Installazione dipendenze di sistema ==="
apt-get update
apt-get install -y curl git nginx certbot python3-certbot-nginx build-essential

echo "=== Installazione Node.js 22 ==="
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

echo "=== Installazione Playwright Chromium ==="
npx playwright install chromium 2>/dev/null || true

echo "=== Clonazione/aggiornamento repository ==="
if [ -d "$APP_DIR" ]; then
  echo "Repo già presente, aggiorno..."
  cd "$APP_DIR"
  git pull
else
  echo "Clono il repository..."
  git clone https://github.com/TUO-UTENTE/portale-eventiLatina.git "$APP_DIR"
  cd "$APP_DIR"
fi

echo "=== Installazione dipendenze ==="
cd "$APP_DIR"
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

echo "=== Configurazione ambiente ==="
if [ ! -f "$APP_DIR/.env" ]; then
  cat > "$APP_DIR/.env" << 'ENVEOF'
PORT=3001
JWT_SECRET=CHANGE_ME_$(openssl rand -hex 32)
ADMIN_EMAIL=admin@eventinlatina.it
DATABASE_PATH=./data/events.db
CORS_ORIGIN=http://localhost:5173
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_API_KEY=
GOOGLE_CX=
ENVEOF
  chown "$SCRIPT_USER:$SCRIPT_USER" "$APP_DIR/.env"
  echo "✓ File .env creato — MODIFICA JWT_SECRET e GOOGLE_CLIENT_ID prima di avviare!"
else
  echo "✓ File .env già presente"
fi

echo "=== Build applicazione ==="
cd "$APP_DIR"
npm run build
echo "✓ Build completata"

echo "=== Configurazione systemd ==="
cat > /etc/systemd/system/eventinlatina.service << 'SERVICEEOF'
[Unit]
Description=eventiNLatina API Server
After=network.target

[Service]
Type=simple
User=ubuntu
Group=ubuntu
WorkingDirectory=/home/ubuntu/portale-eventiLatina/server
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Fix user if running as different user
sed -i "s/User=ubuntu/User=$SCRIPT_USER/" /etc/systemd/system/eventinlatina.service
sed -i "s|WorkingDirectory=/home/ubuntu|WorkingDirectory=$HOME_DIR|" /etc/systemd/system/eventinlatina.service

systemctl daemon-reload
systemctl enable eventinlatina.service
systemctl start eventinlatina.service
echo "✓ Systemd service avviato"

echo "=== Configurazione nginx ==="
if [ -n "$DOMAIN" ]; then
  cat > /etc/nginx/sites-available/eventinlatina << NGINXEOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Upload più grandi per podcast
        client_max_body_size 100M;
    }
}
NGINXEOF
else
  # Config for IP-only access
  cat > /etc/nginx/sites-available/eventinlatina << 'NGINXEOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 100M;
    }
}
NGINXEOF
fi

ln -sf /etc/nginx/sites-available/eventinlatina /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
echo "✓ Nginx configurato"

if [ -n "$DOMAIN" ]; then
  echo "=== Certificato SSL (Let's Encrypt) ==="
  certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "$SCRIPT_USER@$DOMAIN" || true
  echo "✓ SSL configurato"
fi

echo ""
echo "========================================="
echo "  ✅  DEPLOY COMPLETATO!"
if [ -n "$DOMAIN" ]; then
  echo "  https://$DOMAIN"
else
  IP=$(curl -4 -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
  echo "  http://$IP"
fi
echo "========================================="
echo ""
echo "Comandi utili:"
echo "  systemctl status eventinlatina    # Stato server"
echo "  journalctl -u eventinlatina -f    # Log in tempo reale"
echo "  cd $APP_DIR && git pull && npm run build && systemctl restart eventinlatina  # Aggiornamento"
echo ""
echo "⚠️  Ricorda di modificare il file .env:"
echo "  nano $APP_DIR/.env"
echo "  Imposta GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e JWT_SECRET"
echo "  Poi: systemctl restart eventinlatina"
