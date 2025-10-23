# 🔒 Corrections de Sécurité Supabase

## 🚨 Problèmes identifiés

Votre base de données Supabase présente des erreurs de sécurité qui doivent être corrigées :

### 1. Vues avec SECURITY DEFINER (10 erreurs)

- `public_data`
- `full_db`
- `db_stats`
- `poi_stats_by_type`
- `concerts_by_month`
- `security_info_stats`
- `user_stats_by_role`
- `recent_activity`
- `concerts_with_days`
- `days_with_concerts`

### 2. RLS (Row Level Security) désactivé (6 erreurs)

- `user`
- `concert`
- `day`
- `poi`
- `security_info`
- `concert_days_day`

## 🛠️ Solutions

### Solution 1 : Application automatique (Recommandé)

```bash
# Appliquer toutes les corrections de sécurité
node db.js security

# Vérifier que tout fonctionne
node db.js verify-security
```

### Solution 2 : Application manuelle

```bash
# 1. Appliquer les corrections
node scripts/apply-security-fixes.js

# 2. Vérifier la sécurité
node scripts/verify-security.js
```

### Solution 3 : Configuration complète

```bash
# Reconfigurer complètement la base de données
node db.js all
```

## 📋 Ce que font les corrections

### 1. Recréation des vues sans SECURITY DEFINER

- Suppression des vues existantes
- Recréation avec des permissions appropriées
- Séparation des vues publiques et admin

### 2. Activation de RLS

- Activation sur toutes les tables publiques
- Création de politiques de sécurité appropriées

### 3. Politiques de sécurité créées

#### Tables publiques (lecture pour tous, écriture admin)

- `concert` - Lecture publique, écriture admin
- `day` - Lecture publique, écriture admin
- `poi` - Lecture publique, écriture admin
- `security_info` - Lecture publique, écriture admin
- `concert_days_day` - Lecture publique, écriture admin

#### Table utilisateurs (admin seulement)

- `user` - Accès restreint aux admins

### 4. Permissions configurées

- Vues publiques : accès `anon` et `authenticated`
- Vues admin : accès `authenticated` seulement

## 🧪 Vérification

Après application des corrections, vérifiez que :

1. **Les vues fonctionnent** :

   ```bash
   node db.js test
   ```

2. **La sécurité est correcte** :

   ```bash
   node db.js verify-security
   ```

3. **L'API fonctionne** :
   ```bash
   curl http://localhost:8081/api/
   ```

## 🔍 Détails techniques

### Vues publiques (accès anon + authenticated)

- `public_data` - Données publiques (sans utilisateurs)
- `db_stats` - Statistiques générales
- `poi_stats_by_type` - Statistiques POIs
- `concerts_by_month` - Statistiques concerts
- `security_info_stats` - Statistiques sécurité
- `recent_activity` - Activité récente
- `concerts_with_days` - Concerts avec jours
- `days_with_concerts` - Jours avec concerts

### Vues admin (accès authenticated seulement)

- `full_db` - Toutes les données (avec utilisateurs)
- `user_stats_by_role` - Statistiques utilisateurs

### Politiques RLS

```sql
-- Exemple pour la table concert
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
```

## 🚀 Après les corrections

1. **Vos erreurs de sécurité disparaîtront** dans Supabase
2. **L'API continuera de fonctionner** normalement
3. **La sécurité sera renforcée** avec RLS
4. **Les permissions seront correctement configurées**

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs : `node db.js verify-security`
2. Consultez la documentation Supabase
3. Testez l'API après chaque correction

---

**🎉 Une fois les corrections appliquées, votre base de données sera sécurisée et conforme aux bonnes pratiques Supabase !**
