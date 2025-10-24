-- =====================================================
-- VUES D'ANALYSE ET DE RAPPORT
-- =====================================================

-- Vue des statistiques détaillées par type de POI
CREATE OR REPLACE VIEW poi_stats_by_type AS
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
CREATE OR REPLACE VIEW concerts_by_month AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as concert_count,
  COUNT(DISTINCT performer) as unique_performers,
  COUNT(DISTINCT location) as unique_locations
FROM concert
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Vue des informations de sécurité par statut
CREATE OR REPLACE VIEW security_info_stats AS
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

-- Vue des utilisateurs par rôle
CREATE OR REPLACE VIEW user_stats_by_role AS
SELECT 
  role,
  COUNT(*) as count,
  MIN(created_at) as first_created,
  MAX(created_at) as last_created
FROM "user"
GROUP BY role
ORDER BY count DESC;

-- Vue des données récentes (dernières 30 jours)
CREATE OR REPLACE VIEW recent_activity AS
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
