#!/bin/bash

# Couleurs pour une meilleure lisibilité
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Configuration de l'environnement de test pour Nation Sounds API${NC}"
echo -e "${YELLOW}=============================================================${NC}"

# Vérifier si le fichier .env.test existe
if [ -f .env.test ]; then
    echo -e "${GREEN}Le fichier .env.test existe déjà.${NC}"
else
    echo -e "${YELLOW}Création du fichier .env.test...${NC}"
    echo "NODE_ENV=test" > .env.test
    echo "# Remplacez cette URL par l'URL réelle de votre base de données de test" >> .env.test
    echo "TEST_JAWSDB_MARIA_URL=mysql://username:password@your-test-database-url:3306/database_name" >> .env.test
    echo -e "${GREEN}Fichier .env.test créé avec succès.${NC}"
fi

echo -e "${YELLOW}Configuration à faire :${NC}"
echo -e "1. Ouvrez le fichier .env.test et modifiez la variable TEST_JAWSDB_MARIA_URL"
echo -e "   avec les informations de connexion à votre base de données MySQL de test."
echo -e ""
echo -e "2. Pour exécuter les tests, utilisez la commande :"
echo -e "   ${GREEN}npm test${NC}"
echo -e ""
echo -e "3. Si vous utilisez un service externe comme JawsDB sur Heroku :"
echo -e "   - Assurez-vous d'avoir configuré la variable d'environnement TEST_JAWSDB_MARIA_URL sur Heroku"
echo -e "   - Vous pouvez exécuter : ${GREEN}heroku config:get JAWSDB_MARIA_URL -a your-app-name${NC}"
echo -e "     pour voir l'URL de la base de données existante"
echo -e ""
echo -e "${YELLOW}Conseil :${NC} Pour les tests en local, vous pouvez installer Docker et utiliser :"
echo -e "docker run --name test-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=test -p 3306:3306 -d mysql:8.0"
echo -e "Dans ce cas, votre URL serait : ${GREEN}mysql://root:password@localhost:3306/test${NC}"
echo -e ""

echo -e "${GREEN}Configuration terminée.${NC}" 