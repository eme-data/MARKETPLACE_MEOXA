#!/bin/bash
# ==============================================================
# MEOXA Marketplace - Script de gestion
# ==============================================================
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
        mkdir -p backups
        BACKUP_FILE="backups/db-$(date +%Y%m%d-%H%M%S).sql.gz"
        docker exec meoxa-db pg_dump -U "${POSTGRES_USER:-meoxa}" "${POSTGRES_DB:-meoxa_marketplace}" | gzip > "$BACKUP_FILE"
        echo "Sauvegarde creee: $BACKUP_FILE"
        ;;
    restore)
        if [ -z "${2:-}" ]; then
            echo "Usage: ./meoxa.sh restore <fichier.sql.gz>"
            exit 1
        fi
        echo "Restauration de la base de donnees depuis $2..."
        gunzip -c "$2" | docker exec -i meoxa-db psql -U "${POSTGRES_USER:-meoxa}" "${POSTGRES_DB:-meoxa_marketplace}"
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
        echo "  ./meoxa.sh start       Demarrer l'application"
        echo "  ./meoxa.sh stop        Arreter l'application"
        echo "  ./meoxa.sh restart     Redemarrer l'application"
        echo "  ./meoxa.sh logs [svc]  Voir les logs (app, db)"
        echo "  ./meoxa.sh status      Etat des conteneurs"
        echo "  ./meoxa.sh update      Mettre a jour depuis git"
        echo "  ./meoxa.sh backup      Sauvegarder la base de donnees"
        echo "  ./meoxa.sh restore <f> Restaurer un backup"
        echo "  ./meoxa.sh seed        Executer le seed"
        echo "  ./meoxa.sh ssl <dom>   Installer SSL (Let's Encrypt)"
        echo ""
        ;;
esac
