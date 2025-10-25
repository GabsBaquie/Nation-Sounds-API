# 📋 DTOs (Data Transfer Objects) - Nation Sounds API

## 📁 Structure organisée

```
src/dto/
├── 📁 requests/              # DTOs pour les requêtes entrantes
│   ├── concert.dto.ts
│   ├── create-day.dto.ts
│   ├── create-poi.dto.ts
│   ├── create-security-info.dto.ts
│   ├── create-user.dto.ts
│   ├── login.dto.ts
│   ├── change-password.dto.ts
│   ├── reset-password.dto.ts
│   └── index.ts
├── 📁 responses/             # DTOs pour les réponses sortantes
│   ├── user-response.dto.ts
│   ├── concert-response.dto.ts
│   ├── poi-response.dto.ts
│   ├── security-info-response.dto.ts
│   └── index.ts
├── 📁 common/                # DTOs communs
│   ├── api-response.dto.ts
│   └── index.ts
├── index.ts                  # Export principal
└── README.md                 # Cette documentation
```

## 🎯 **Pourquoi cette organisation ?**

### ✅ **Avant (confus) :**

- DTOs dans `src/dto/` (classes avec validation)
- DTOs dans `src/types/database.ts` (interfaces)
- **Duplication et confusion !**

### ✅ **Maintenant (clair) :**

- `src/dto/requests/` - **Validation des données entrantes**
- `src/dto/responses/` - **Formatage des données sortantes**
- `src/dto/common/` - **Types partagés**
- `src/types/database.ts` - **Interfaces de base de données uniquement**

## 🚀 **Utilisation**

### Import des DTOs

```typescript
// Import spécifique
import { CreateConcertDto } from "../dto/requests/concert.dto";

// Import groupé
import { CreateConcertDto, CreateDayDto } from "../dto/requests";

// Import complet
import { CreateConcertDto, ConcertResponseDto, ApiResponseDto } from "../dto";
```

### Validation dans les routes

```typescript
import { validateDto } from "../middleware/validateDto";
import { CreateConcertDto } from "../dto/requests/concert.dto";

router.post("/", validateDto(CreateConcertDto), ConcertController.create);
```

### Utilisation dans les contrôleurs

```typescript
import { CreateConcertDto } from "../dto/requests/concert.dto";

export class ConcertController {
  static async create(req: Request, res: Response) {
    const dto = req.dto as CreateConcertDto;
    // dto est maintenant typé et validé
  }
}
```

## 📋 **DTOs disponibles**

### Requests (Validation entrante)

- `CreateConcertDto` - Création de concert
- `CreateDayDto` - Création de jour
- `CreatePoiDto` - Création de POI
- `CreateSecurityInfoDto` - Création d'info sécurité
- `CreateUserDto` - Création d'utilisateur
- `LoginDto` - Connexion
- `ChangePasswordDto` - Changement de mot de passe
- `RequestPasswordResetDto` - Demande de reset
- `ResetPasswordDto` - Reset de mot de passe

### Responses (Formatage sortant)

- `UserResponseDto` - Utilisateur (sans mot de passe)
- `LoginResponseDto` - Réponse de connexion
- `ConcertResponseDto` - Concert avec relations
- `DayResponseDto` - Jour avec relations
- `PoiResponseDto` - POI
- `SecurityInfoResponseDto` - Info sécurité

### Common (Types partagés)

- `ApiResponseDto<T>` - Réponse API standard
- `PaginationDto` - Informations de pagination
- `PaginatedResponseDto<T>` - Réponse paginée

## 🔧 **Validation**

Tous les DTOs de requête utilisent `class-validator` :

```typescript
export class CreateConcertDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  image?: string | null;
}
```

## 🎉 **Avantages de cette organisation**

1. **Séparation claire** : Requests vs Responses vs Common
2. **Plus de duplication** : Un seul endroit par type
3. **Validation automatique** : class-validator intégré
4. **Type safety** : TypeScript complet
5. **Maintenance facile** : Structure logique et prévisible
6. **Évolutif** : Facile d'ajouter de nouveaux DTOs

## 📝 **Conventions de nommage**

- **Requests** : `CreateXxxDto`, `UpdateXxxDto`, `LoginDto`
- **Responses** : `XxxResponseDto`, `LoginResponseDto`
- **Common** : `ApiResponseDto`, `PaginationDto`

## 🔄 **Migration depuis l'ancienne structure**

Les anciens imports ont été mis à jour automatiquement :

```typescript
// Ancien
import { CreateConcertDto } from "../types/database";

// Nouveau
import { CreateConcertDto } from "../dto/requests/concert.dto";
```
