# Utilitaires Docker & PostgreSQL pour Nation Sounds API

## 1. Accéder à la base de données PostgreSQL dans Docker

```sh
# Ouvre un shell psql dans le conteneur Docker de la base de données
# Remplacez 'nation-sounds-api-db-1' par le nom réel de votre conteneur si besoin

docker exec -it nation-sounds-api-db-1 psql -U nation_sound_api -d nationdb
```

## 2. Commandes SQL utiles dans psql

### Lister toutes les tables

```sql
\dt
```

### Voir la structure d'une table

```sql
\d nom_de_la_table
# Exemple :
\d poi
```

### Voir les colonnes d'une table avec détails

```sql
\d+ nom_de_la_table
```

### Lister les migrations appliquées

```sql
SELECT * FROM "migrations";
```

### Supprimer une migration spécifique (avancé)

```sql
DELETE FROM "migrations" WHERE "name" = 'NomDeLaMigration';
```

## 3. Commandes TypeORM (depuis le projet Node.js)

### Générer une migration après modification des entités

```sh
npm run typeorm -- migration:generate src/migration/NomMigration -d src/data-source.ts
```

### Appliquer toutes les migrations en attente

```sh
npm run typeorm -- migration:run -d src/data-source.ts
```

### Revenir en arrière d'une migration

```sh
npm run typeorm -- migration:revert -d src/data-source.ts
```

### Voir la liste des migrations dans le code

```sh
ls src/migration/
```

## 4. Conseils

- Ne jamais modifier la base à la main sans migration, sauf pour du debug ponctuel.
- Toujours générer une migration après modification d'une entité.
- Garder la base et les migrations synchronisées pour éviter les conflits.

---

**Résumé rapide**

- Accès DB Docker : `docker exec -it ... psql ...`
- Lister tables : `\dt`
- Voir structure : `\d nom_table`
- Lister migrations SQL : `SELECT * FROM "migrations";`
- Générer migration : `npm run typeorm -- migration:generate ...`
- Appliquer migration : `npm run typeorm -- migration:run ...`
