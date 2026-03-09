#!/bin/bash
# ==============================================================
# MEOXA Marketplace - Script d'installation automatise pour Ubuntu
# ==============================================================
# Usage: sudo bash install.sh
# Compatible: Ubuntu 22.04 / 24.04
# ==============================================================

set -euo pipefail

# --- Couleurs ---
RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn()  { echo -e "${ORANGE}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# --- Verification root ---
if [ "$EUID" -ne 0 ]; then
    log_error "Ce script doit etre execute en tant que root (sudo bash install.sh)"
    exit 1
fi

INSTALL_DIR=$(pwd)
APP_USER="${SUDO_USER:-meoxa}"

echo ""
echo -e "${ORANGE}╔══════════════════════════════════════════╗${NC}"
echo -e "${ORANGE}║      MEOXA Marketplace - Installation    ║${NC}"
echo -e "${ORANGE}╚══════════════════════════════════════════╝${NC}"
echo ""

# ==============================================================
# 1. Mise a jour du systeme
# ==============================================================
log_info "Mise a jour du systeme..."
apt-get update -qq
apt-get upgrade -y -qq
log_ok "Systeme mis a jour"

# ==============================================================
# 2. Installation des dependances systeme
# ==============================================================
log_info "Installation des dependances systeme..."
apt-get install -y -qq \
    curl \
    wget \
    git \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw \
    fail2ban \
    unzip \
    software-properties-common
log_ok "Dependances systeme installees"

# ==============================================================
# 3. Installation de Docker
# ==============================================================
if command -v docker &> /dev/null; then
    log_ok "Docker est deja installe ($(docker --version))"
else
    log_info "Installation de Docker..."

    # Cle GPG Docker
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc

    # Repository Docker
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Ajouter l'utilisateur au groupe docker
    usermod -aG docker "$APP_USER"

    systemctl enable docker
    systemctl start docker

    log_ok "Docker installe ($(docker --version))"
fi

# ==============================================================
# 4. Configuration du pare-feu (UFW)
# ==============================================================
log_info "Configuration du pare-feu..."
ufw --force reset > /dev/null 2>&1
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
log_ok "Pare-feu configure (SSH, HTTP, HTTPS)"

# ==============================================================
# 5. Configuration de Fail2Ban
# ==============================================================
log_info "Configuration de Fail2Ban..."
systemctl enable fail2ban
systemctl start fail2ban
log_ok "Fail2Ban active"

# ==============================================================
# 6. Fichier .env
# ==============================================================
if [ ! -f "$INSTALL_DIR/.env" ]; then
    log_info "Creation du fichier .env..."

    # Generer un secret NextAuth aleatoire
    NEXTAUTH_SECRET_GEN=$(openssl rand -base64 32)
    POSTGRES_PASSWORD_GEN=$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)

    cp "$INSTALL_DIR/.env.example" "$INSTALL_DIR/.env"

    # Remplacer les valeurs par defaut
    sed -i "s|CHANGEZ_MOI_MOT_DE_PASSE_SECURISE|${POSTGRES_PASSWORD_GEN}|g" "$INSTALL_DIR/.env"
    sed -i "s|GENEREZ_UNE_CLE_SECRETE_ICI|${NEXTAUTH_SECRET_GEN}|g" "$INSTALL_DIR/.env"

    # Mettre a jour DATABASE_URL avec le bon mot de passe
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=postgresql://meoxa:${POSTGRES_PASSWORD_GEN}@db:5432/meoxa_marketplace|g" "$INSTALL_DIR/.env"

    chmod 600 "$INSTALL_DIR/.env"
    chown "$APP_USER":"$APP_USER" "$INSTALL_DIR/.env"

    log_ok "Fichier .env cree avec des secrets generes automatiquement"
    log_warn "Pensez a configurer vos cles Stripe et SMTP dans .env"
else
    log_ok "Fichier .env existant conserve"
fi

# ==============================================================
# 7. Build et demarrage des conteneurs
# ==============================================================
log_info "Construction des images Docker..."
cd "$INSTALL_DIR"
docker compose build --no-cache
log_ok "Images Docker construites"

log_info "Demarrage de la base de donnees..."
docker compose up -d db
log_info "Attente que PostgreSQL soit pret..."
sleep 5

log_info "Execution des migrations et du seed..."
docker compose --profile setup run --rm migrate
log_ok "Base de donnees initialisee"

log_info "Demarrage de l'application..."
docker compose up -d app
log_ok "Application demarree"

# ==============================================================
# 8. Installation de Nginx (reverse proxy)
# ==============================================================
log_info "Installation de Nginx..."
apt-get install -y -qq nginx

cat > /etc/nginx/sites-available/meoxa-marketplace << 'NGINX_CONF'
server {
    listen 80;
    server_name _;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
NGINX_CONF

# Activer le site
ln -sf /etc/nginx/sites-available/meoxa-marketplace /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl restart nginx
systemctl enable nginx
log_ok "Nginx configure comme reverse proxy"

# ==============================================================
# 9. Cron de maintenance
# ==============================================================
log_info "Configuration du cron de maintenance..."
cat > /etc/cron.d/meoxa-maintenance << CRON_CONF
# Nettoyage des logs Docker chaque semaine
0 3 * * 0 root docker system prune -f > /dev/null 2>&1

# Sauvegarde PostgreSQL chaque jour a 2h du matin
0 2 * * * root docker exec meoxa-db pg_dump -U meoxa meoxa_marketplace | gzip > ${INSTALL_DIR}/backups/db-\$(date +\%Y\%m\%d).sql.gz 2>/dev/null
CRON_CONF

mkdir -p "$INSTALL_DIR/backups"
chown "$APP_USER":"$APP_USER" "$INSTALL_DIR/backups"
log_ok "Cron de maintenance configure (backup quotidien + nettoyage)"

# ==============================================================
# 10. Script de gestion
# ==============================================================
cat > "$INSTALL_DIR/meoxa.sh" << 'MANAGE_SCRIPT'
#!/bin/bash
# MEOXA Marketplace - Script de gestion
set -euo pipefail

case "${1:-help}" in
    start)
        echo "Demarrage de MEOXA Marketplace..."
        docker compose up -d
        echo "Application demarree sur le port 3000"
        ;;
    stop)
        echo "Arret de MEOXA Marketplace..."
        docker compose down
        echo "Application arretee"
        ;;
    restart)
        echo "Redemarrage de MEOXA Marketplace..."
        docker compose restart
        echo "Application redemarree"
        ;;
    logs)
        docker compose logs -f "${2:-app}"
        ;;
    status)
        docker compose ps
        ;;
    update)
        echo "Mise a jour de MEOXA Marketplace..."
        git pull
        docker compose build --no-cache app
        docker compose --profile setup run --rm migrate
        docker compose up -d app
        echo "Mise a jour terminee"
        ;;
    backup)
        echo "Sauvegarde de la base de donnees..."
        BACKUP_FILE="backups/db-$(date +%Y%m%d-%H%M%S).sql.gz"
        docker exec meoxa-db pg_dump -U meoxa meoxa_marketplace | gzip > "$BACKUP_FILE"
        echo "Sauvegarde creee: $BACKUP_FILE"
        ;;
    restore)
        if [ -z "${2:-}" ]; then
            echo "Usage: ./meoxa.sh restore <fichier.sql.gz>"
            exit 1
        fi
        echo "Restauration de la base de donnees depuis $2..."
        gunzip -c "$2" | docker exec -i meoxa-db psql -U meoxa meoxa_marketplace
        echo "Restauration terminee"
        ;;
    seed)
        echo "Execution du seed..."
        docker compose --profile setup run --rm migrate
        echo "Seed termine"
        ;;
    ssl)
        if [ -z "${2:-}" ]; then
            echo "Usage: ./meoxa.sh ssl <votre-domaine.com>"
            exit 1
        fi
        echo "Installation du certificat SSL pour $2..."
        sudo apt-get install -y certbot python3-certbot-nginx
        sudo sed -i "s/server_name _;/server_name $2;/" /etc/nginx/sites-available/meoxa-marketplace
        sudo certbot --nginx -d "$2" --non-interactive --agree-tos --email "admin@$2"
        echo "SSL installe pour $2"
        ;;
    help|*)
        echo "MEOXA Marketplace - Commandes disponibles:"
        echo ""
        echo "  ./meoxa.sh start      Demarrer l'application"
        echo "  ./meoxa.sh stop       Arreter l'application"
        echo "  ./meoxa.sh restart    Redemarrer l'application"
        echo "  ./meoxa.sh logs [svc] Voir les logs (app, db)"
        echo "  ./meoxa.sh status     Etat des conteneurs"
        echo "  ./meoxa.sh update     Mettre a jour depuis git"
        echo "  ./meoxa.sh backup     Sauvegarder la base de donnees"
        echo "  ./meoxa.sh restore <f> Restaurer un backup"
        echo "  ./meoxa.sh seed       Executer le seed"
        echo "  ./meoxa.sh ssl <dom>  Installer SSL (Let's Encrypt)"
        echo ""
        ;;
esac
MANAGE_SCRIPT

chmod +x "$INSTALL_DIR/meoxa.sh"
chown "$APP_USER":"$APP_USER" "$INSTALL_DIR/meoxa.sh"
log_ok "Script de gestion cree (./meoxa.sh)"

# ==============================================================
# Resume de l'installation
# ==============================================================
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║       MEOXA Marketplace - Installation terminee!    ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BLUE}Application:${NC}  http://$(hostname -I | awk '{print $1}'):80"
echo -e "  ${BLUE}Comptes test:${NC} admin@meoxa.fr / admin123456"
echo -e "  ${BLUE}Gestion:${NC}      ./meoxa.sh help"
echo ""
echo -e "  ${ORANGE}Actions recommandees:${NC}"
echo -e "  1. Editez .env pour configurer Stripe et SMTP"
echo -e "  2. Configurez votre domaine DNS"
echo -e "  3. Installez SSL: ./meoxa.sh ssl votre-domaine.com"
echo -e "  4. Redemarrez: ./meoxa.sh restart"
echo ""
