-- Mise à jour des chemins d'images des partenaires pour correspondre au nouveau serveur
UPDATE partenaire SET image = '/upload/image/1752165000000-123456789-spotify.webp' WHERE name = 'Spotify';
UPDATE partenaire SET image = '/upload/image/1752165000001-123456790-france-inter.webp' WHERE name = 'France Inter';
UPDATE partenaire SET image = '/upload/image/1752165000002-123456791-ile-de-france.webp' WHERE name = 'Région Île-de-France';
UPDATE partenaire SET image = '/upload/image/1752165000003-123456792-deezer.webp' WHERE name = 'Deezer';
UPDATE partenaire SET image = '/upload/image/1752165000004-123456793-radiofrance.webp' WHERE name = 'Radio France';
UPDATE partenaire SET image = '/upload/image/1752165000005-123456794-paris.webp' WHERE name = 'Ville de Paris';

-- Vérification des mises à jour
SELECT id, name, image FROM partenaire WHERE name IN ('Spotify', 'France Inter', 'Région Île-de-France', 'Deezer', 'Radio France', 'Ville de Paris');
