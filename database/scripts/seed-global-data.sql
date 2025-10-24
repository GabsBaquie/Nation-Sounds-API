-- Script de seed pour les données globales
-- Ce script insère des données d'exemple dans toutes les tables principales
-- Les champs image sont laissés vides (NULL) pour éviter les erreurs 404

-- 1. Partenaires d'exemple
INSERT INTO partenaire (name, type, link, logo_alt, actif, image) VALUES 
('Spotify', 'media', 'https://spotify.com', 'Logo Spotify', true, NULL),
('France Inter', 'media', 'https://franceinter.fr', 'Logo France Inter', true, NULL),
('Deezer', 'media', 'https://deezer.com', 'Logo Deezer', true, NULL),
('Radio France', 'media', 'https://radiofrance.fr', 'Logo Radio France', true, NULL),
('Ville de Paris', 'institution', 'https://paris.fr', 'Logo Ville de Paris', true, NULL),
('Région Île-de-France', 'institution', 'https://iledefrance.fr', 'Logo Région Île-de-France', true, NULL);

-- 2. Actualités d'exemple
INSERT INTO actualite (title, description, importance, actif, image) VALUES 
('Festival de musique 2024', 'Le festival de musique aura lieu du 15 au 20 juillet 2024 dans le parc de la Villette.', 'Très important', true, NULL),
('Nouvelle programmation', 'Découvrez notre nouvelle programmation pour la saison 2024-2025.', 'Important', true, NULL),
('Partenariat avec Spotify', 'Nous sommes fiers d''annoncer notre nouveau partenariat avec Spotify.', 'Modéré', true, NULL),
('Maintenance système', 'Le système sera en maintenance le dimanche 15 octobre de 2h à 6h.', 'Peu important', false, NULL);

-- 3. Jours d'exemple
INSERT INTO day (title, date, image) VALUES 
('Jour 1 - Ouverture', '2024-07-15', NULL),
('Jour 2 - Rock', '2024-07-16', NULL),
('Jour 3 - Électro', '2024-07-17', NULL),
('Jour 4 - Jazz', '2024-07-18', NULL),
('Jour 5 - Clôture', '2024-07-19', NULL);

-- 4. Concerts d'exemple
INSERT INTO concert (title, description, performer, time, location, image) VALUES 
('Concert d''ouverture', 'Le concert d''ouverture du festival avec des artistes locaux.', 'Artistes locaux', '20:00', 'Grande scène', NULL),
('Rock Session', 'Une soirée dédiée au rock avec les meilleurs groupes de la scène française.', 'Groupes rock', '21:00', 'Scène Rock', NULL),
('Électro Night', 'Une nuit entière dédiée à l''électro avec les DJs les plus en vogue.', 'DJs électro', '22:00', 'Tente électro', NULL),
('Jazz Lounge', 'Un moment de détente avec des musiciens de jazz talentueux.', 'Musiciens jazz', '19:30', 'Espace jazz', NULL),
('Concert de clôture', 'Le grand final du festival avec un artiste de renommée internationale.', 'Artiste international', '21:30', 'Grande scène', NULL);

-- 5. POI (Points d'intérêt) d'exemple
INSERT INTO poi (title, description, latitude, longitude, type) VALUES 
('Entree principale', 'L''entree principale du festival', 48.8566, 2.3522, 'entrance'),
('Parking', 'Parking principal du festival', 48.8570, 2.3530, 'parking'),
('Restauration', 'Zone de restauration avec food trucks', 48.8560, 2.3510, 'food'),
('Toilettes', 'Toilettes publiques', 48.8565, 2.3525, 'service'),
('Premiers secours', 'Poste de premiers secours', 48.8568, 2.3528, 'medical');

-- 6. Infos de sécurité d'exemple
INSERT INTO security_info (title, description, urgence, actif) VALUES 
('Regles de securite', 'Respectez les consignes de securite et les gestes barrieres.', false, true),
('Evacuation', 'En cas d''evacuation, suivez les fleches de sortie et les instructions du personnel.', true, true),
('Objets interdits', 'Les objets dangereux sont interdits sur le site du festival.', false, true),
('Contact urgence', 'En cas d''urgence, appelez le 112 ou contactez le personnel de securite.', true, true);

-- 7. Relations concert-jour (exemple)
-- Assumons que les concerts sont liés aux jours correspondants
INSERT INTO concert_days_day ("concertId", "dayId") VALUES 
(1, 1), -- Concert d''ouverture -> Jour 1
(2, 2), -- Rock Session -> Jour 2
(3, 3), -- Electro Night -> Jour 3
(4, 4), -- Jazz Lounge -> Jour 4
(5, 5); -- Concert de cloture -> Jour 5

-- Vérification des données insérées
SELECT 'Partenaires' as table_name, COUNT(*) as count FROM partenaire
UNION ALL
SELECT 'Actualites', COUNT(*) FROM actualite
UNION ALL
SELECT 'Jours', COUNT(*) FROM day
UNION ALL
SELECT 'Concerts', COUNT(*) FROM concert
UNION ALL
SELECT 'POI', COUNT(*) FROM poi
UNION ALL
SELECT 'Infos securite', COUNT(*) FROM security_info
UNION ALL
SELECT 'Relations concert-jour', COUNT(*) FROM concert_days_day;
