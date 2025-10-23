-- =====================================================
-- CORRECTIONS DE SÉCURITÉ POUR SUPABASE
-- =====================================================

-- 1. RECRÉER LES VUES SANS SECURITY DEFINER
-- =====================================================

-- Supprimer les vues existantes
DROP VIEW IF EXISTS public_data CASCADE;
DROP VIEW IF EXISTS full_db CASCADE;
DROP VIEW IF EXISTS db_stats CASCADE;
DROP VIEW IF EXISTS poi_stats_by_type CASCADE;
DROP VIEW IF EXISTS concerts_by_month CASCADE;
DROP VIEW IF EXISTS security_info_stats CASCADE;
DROP VIEW IF EXISTS user_stats_by_role CASCADE;
DROP VIEW IF EXISTS recent_activity CASCADE;
DROP VIEW IF EXISTS concerts_with_days CASCADE;
DROP VIEW IF EXISTS days_with_concerts CASCADE;

-- Recréer les vues sans SECURITY DEFINER
-- Vue des données publiques (sans les utilisateurs)
CREATE VIEW public_data AS
SELECT 'concert' AS source, row_to_json(c.*) AS data FROM concert c
UNION ALL
SELECT 'day', row_to_json(d.*) FROM day d
UNION ALL
SELECT 'poi', row_to_json(p.*) FROM poi p
UNION ALL
SELECT 'security_info', row_to_json(s.*) FROM security_info s;

-- Vue complète de toutes les données (avec utilisateurs) - ADMIN SEULEMENT
CREATE VIEW full_db AS
SELECT 'concert' AS source, row_to_json(c.*) AS data FROM concert c
UNION ALL
SELECT 'day', row_to_json(d.*) FROM day d
UNION ALL
SELECT 'poi', row_to_json(p.*) FROM poi p
UNION ALL
SELECT 'security_info', row_to_json(s.*) FROM security_info s
UNION ALL
SELECT 'user', row_to_json(u.*) FROM "user" u;

-- Vue des statistiques par table
CREATE VIEW db_stats AS
SELECT 
  'concerts' AS table_name,
  COUNT(*) AS count,
  MAX(created_at) AS last_created,
  MIN(created_at) AS first_created
FROM concert
UNION ALL
SELECT 
  'days',
  COUNT(*),
  MAX(created_at),
  MIN(created_at)
FROM day
UNION ALL
SELECT 
  'pois',
  COUNT(*),
  MAX(created_at),
  MIN(created_at)
FROM poi
UNION ALL
SELECT 
  'security_infos',
  COUNT(*),
  MAX(created_at),
  MIN(created_at)
FROM security_info
UNION ALL
SELECT 
  'users',
  COUNT(*),
  MAX(created_at),
  MIN(created_at)
FROM "user";

-- Vue des statistiques détaillées par type de POI
CREATE VIEW poi_stats_by_type AS
SELECT 
  type,
  COUNT(*) as count,
  CAST(AVG(latitude) AS DECIMAL(10,6)) as avg_latitude,
  CAST(AVG(longitude) AS DECIMAL(10,6)) as avg_longitude,
  MIN(created_at) as first_created,
  MAX(created_at) as last_created
FROM poi
GROUP BY type
ORDER BY count DESC;

-- Vue des concerts par mois
CREATE VIEW concerts_by_month AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as concert_count,
  COUNT(DISTINCT performer) as unique_performers,
  COUNT(DISTINCT location) as unique_locations
FROM concert
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Vue des informations de sécurité par statut
CREATE VIEW security_info_stats AS
SELECT 
  CASE 
    WHEN urgence = true AND actif = true THEN 'urgent_active'
    WHEN urgence = true AND actif = false THEN 'urgent_inactive'
    WHEN urgence = false AND actif = true THEN 'normal_active'
    ELSE 'normal_inactive'
  END as status,
  COUNT(*) as count,
  MIN(created_at) as first_created,
  MAX(created_at) as last_created
FROM security_info
GROUP BY 
  CASE 
    WHEN urgence = true AND actif = true THEN 'urgent_active'
    WHEN urgence = true AND actif = false THEN 'urgent_inactive'
    WHEN urgence = false AND actif = true THEN 'normal_active'
    ELSE 'normal_inactive'
  END
ORDER BY count DESC;

-- Vue des utilisateurs par rôle - ADMIN SEULEMENT
CREATE VIEW user_stats_by_role AS
SELECT 
  role,
  COUNT(*) as count,
  MIN(created_at) as first_created,
  MAX(created_at) as last_created
FROM "user"
GROUP BY role
ORDER BY count DESC;

-- Vue des données récentes (dernières 30 jours)
CREATE VIEW recent_activity AS
SELECT 
  'concert' as type,
  id,
  title,
  created_at
FROM concert
WHERE created_at >= NOW() - INTERVAL '30 days'
UNION ALL
SELECT 
  'day',
  id,
  title,
  created_at
FROM day
WHERE created_at >= NOW() - INTERVAL '30 days'
UNION ALL
SELECT 
  'poi',
  id,
  title,
  created_at
FROM poi
WHERE created_at >= NOW() - INTERVAL '30 days'
UNION ALL
SELECT 
  'security_info',
  id,
  title,
  created_at
FROM security_info
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- Vue des concerts avec leurs jours associés
CREATE VIEW concerts_with_days AS
SELECT 
  c.*,
  COALESCE(
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'id', d.id,
        'title', d.title,
        'date', d.date,
        'created_at', d.created_at,
        'updated_at', d.updated_at
      )
    ) FILTER (WHERE d.id IS NOT NULL),
    '[]'::json
  ) as days
FROM concert c
LEFT JOIN concert_days_day cd ON c.id = cd."concertId"
LEFT JOIN day d ON cd."dayId" = d.id
GROUP BY c.id, c.created_at
ORDER BY c.created_at DESC;

-- Vue des jours avec leurs concerts associés
CREATE VIEW days_with_concerts AS
SELECT 
  d.*,
  COALESCE(
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'id', c.id,
        'title', c.title,
        'description', c.description,
        'performer', c.performer,
        'time', c.time,
        'location', c.location,
        'image', c.image,
        'created_at', c.created_at,
        'updated_at', c.updated_at
      )
    ) FILTER (WHERE c.id IS NOT NULL),
    '[]'::json
  ) as concerts
FROM day d
LEFT JOIN concert_days_day cd ON d.id = cd."dayId"
LEFT JOIN concert c ON cd."concertId" = c.id
GROUP BY d.id, d.created_at
ORDER BY d.created_at DESC;

-- 2. ACTIVER RLS (ROW LEVEL SECURITY) SUR LES TABLES
-- =====================================================

-- Activer RLS sur toutes les tables publiques
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE concert ENABLE ROW LEVEL SECURITY;
ALTER TABLE day ENABLE ROW LEVEL SECURITY;
ALTER TABLE poi ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE concert_days_day ENABLE ROW LEVEL SECURITY;

-- 3. CRÉER LES POLITIQUES RLS
-- =====================================================

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Users can view own profile" ON "user";
DROP POLICY IF EXISTS "Admins can manage all users" ON "user";
DROP POLICY IF EXISTS "Anyone can view concerts" ON concert;
DROP POLICY IF EXISTS "Admins can manage concerts" ON concert;
DROP POLICY IF EXISTS "Anyone can view days" ON day;
DROP POLICY IF EXISTS "Admins can manage days" ON day;
DROP POLICY IF EXISTS "Anyone can view pois" ON poi;
DROP POLICY IF EXISTS "Admins can manage pois" ON poi;
DROP POLICY IF EXISTS "Anyone can view security_infos" ON security_info;
DROP POLICY IF EXISTS "Admins can manage security_infos" ON security_info;
DROP POLICY IF EXISTS "Anyone can view concert_days_day" ON concert_days_day;
DROP POLICY IF EXISTS "Admins can manage concert_days_day" ON concert_days_day;

-- Politiques pour la table user (admin seulement)
CREATE POLICY "Users can view own profile" ON "user"
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can manage all users" ON "user"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "user" 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Politiques pour la table concert (lecture publique, écriture admin)
CREATE POLICY "Anyone can view concerts" ON concert
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage concerts" ON concert
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "user" 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Politiques pour la table day (lecture publique, écriture admin)
CREATE POLICY "Anyone can view days" ON day
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage days" ON day
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "user" 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Politiques pour la table poi (lecture publique, écriture admin)
CREATE POLICY "Anyone can view pois" ON poi
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage pois" ON poi
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "user" 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Politiques pour la table security_info (lecture publique, écriture admin)
CREATE POLICY "Anyone can view security_infos" ON security_info
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage security_infos" ON security_info
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "user" 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Politiques pour la table concert_days_day (lecture publique, écriture admin)
CREATE POLICY "Anyone can view concert_days_day" ON concert_days_day
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage concert_days_day" ON concert_days_day
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "user" 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- 4. PERMISSIONS SUR LES VUES
-- =====================================================

-- Donner accès en lecture aux vues publiques
GRANT SELECT ON public_data TO anon, authenticated;
GRANT SELECT ON db_stats TO anon, authenticated;
GRANT SELECT ON poi_stats_by_type TO anon, authenticated;
GRANT SELECT ON concerts_by_month TO anon, authenticated;
GRANT SELECT ON security_info_stats TO anon, authenticated;
GRANT SELECT ON recent_activity TO anon, authenticated;
GRANT SELECT ON concerts_with_days TO anon, authenticated;
GRANT SELECT ON days_with_concerts TO anon, authenticated;

-- Donner accès en lecture aux vues admin seulement
GRANT SELECT ON full_db TO authenticated;
GRANT SELECT ON user_stats_by_role TO authenticated;

-- 5. COMMENTAIRES POUR DOCUMENTATION
-- =====================================================

COMMENT ON VIEW public_data IS 'Vue publique des données (sans utilisateurs)';
COMMENT ON VIEW full_db IS 'Vue complète des données (avec utilisateurs) - Admin seulement';
COMMENT ON VIEW db_stats IS 'Statistiques générales de la base de données';
COMMENT ON VIEW poi_stats_by_type IS 'Statistiques des POIs par type';
COMMENT ON VIEW concerts_by_month IS 'Statistiques des concerts par mois';
COMMENT ON VIEW security_info_stats IS 'Statistiques des informations de sécurité';
COMMENT ON VIEW user_stats_by_role IS 'Statistiques des utilisateurs par rôle - Admin seulement';
COMMENT ON VIEW recent_activity IS 'Activité récente (30 derniers jours)';
COMMENT ON VIEW concerts_with_days IS 'Concerts avec leurs jours associés';
COMMENT ON VIEW days_with_concerts IS 'Jours avec leurs concerts associés';
