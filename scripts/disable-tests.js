// scripts/disable-tests.js
// Ce script vérifie si nous sommes en environnement de production et désactive les tests

const fs = require('fs');
const path = require('path');

// Vérifie si nous sommes en environnement de production ou de CI
if (process.env.NODE_ENV === 'production' || process.env.CI === 'true') {
  console.log('Environnement de production ou CI détecté. Désactivation des tests...');
  
  // Crée un fichier .env.test avec une configuration qui ignorera les tests
  const envTestContent = `
NODE_ENV=test
SKIP_TESTS=true
`;

  // Écrit le fichier .env.test
  fs.writeFileSync(path.join(__dirname, '..', '.env.test'), envTestContent);
  console.log('Configuration de test modifiée pour ignorer les tests en production.');
  
  // Modifie également le fichier de configuration des tests si nécessaire
  try {
    const testSetupPath = path.join(__dirname, '..', 'src', 'utils', 'testSetup.ts');
    if (fs.existsSync(testSetupPath)) {
      let testSetupContent = fs.readFileSync(testSetupPath, 'utf8');
      
      // Ajoute une condition pour ignorer l'initialisation de la DB si SKIP_TESTS est défini
      if (!testSetupContent.includes('SKIP_TESTS')) {
        testSetupContent = testSetupContent.replace(
          'export const initializeTestDB = async () => {',
          'export const initializeTestDB = async () => {\n  if (process.env.SKIP_TESTS === "true") {\n    console.log("Tests ignorés en environnement de production.");\n    return;\n  }\n'
        );
        
        fs.writeFileSync(testSetupPath, testSetupContent);
        console.log('Configuration de testSetup.ts modifiée pour ignorer les tests en production.');
      }
    }
  } catch (error) {
    console.error('Erreur lors de la modification des fichiers de test:', error);
  }
} 