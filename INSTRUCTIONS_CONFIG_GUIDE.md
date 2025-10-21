# Guide d'utilisation du fichier de configuration des instructions

## Vue d'ensemble

Le fichier `src/instructions.ts` centralise toutes les chaînes de texte, instructions et messages utilisés dans l'application. Cela permet de modifier facilement le contenu textuel sans avoir à chercher dans l'ensemble du code source.

## Organisation du fichier

Le fichier est organisé en plusieurs sections principales :

### 1. PHASE_INSTRUCTIONS
Instructions affichées dans l'assistant pédagogique en fonction de la phase actuelle.

**Exemple d'utilisation :**
```typescript
// Dans store.ts
case 'intro-welcome-personalized':
    newInstruction = PHASE_INSTRUCTIONS['intro-welcome-personalized'];
    break;
```

**Pour les instructions dynamiques (avec paramètres) :**
```typescript
case 'intro-discover-machine':
    newInstruction = typeof PHASE_INSTRUCTIONS['intro-discover-machine'] === 'function' 
        ? PHASE_INSTRUCTIONS['intro-discover-machine'](get().userName) 
        : PHASE_INSTRUCTIONS['intro-discover-machine'];
    break;
```

### 2. CHALLENGE_INSTRUCTIONS
Instructions dynamiques pour les défis basées sur la phase, la cible et la progression.

**Exemple d'utilisation :**
```typescript
newInstruction = CHALLENGE_INSTRUCTIONS.units(
    challengeIndex, 
    targetNumber, 
    successCount, 
    totalTargets
);
```

### 3. UI_MESSAGES
Textes pour les boutons, labels et éléments d'interface générale.

**Structure :**
- `buttons` : Textes des boutons (démarrer, débloquer, continuer, valider)
- `responses` : Réponses pour les feedbacks de la machine
- `placeholders` : Textes d'espace réservé pour les champs de saisie
- `attemptIndicators` : Indicateurs de tentative
- `modeIndicators` : Indicateurs de mode (guidé, solution)
- `progress` : Messages de progression
- `helpQuestion` : Question d'aide
- `helpOptions` : Options d'aide
- `assistantTitle` : Titre de l'assistant

**Exemple d'utilisation :**
```typescript
// Dans MachineANombres.tsx
{UI_MESSAGES.buttons.startLearning.thousands}
{UI_MESSAGES.buttons.unlock}
```

### 4. FEEDBACK_MESSAGES
Messages de feedback pour différents niveaux de tentative et types d'erreur.

**Structure :**
- `attempt1` : Messages d'encouragement basés sur la proximité
- `attempt2` : Indices spécifiques au type d'erreur
- `attempt3` : Guidance de décomposition
- `attempt4` : Offre d'aide

**Exemple d'utilisation :**
```typescript
// Dans feedbackSystem.ts
const msgArray = FEEDBACK_MESSAGES.attempt1[proximity];
return msgArray[Math.floor(Math.random() * msgArray.length)];
```

### 5. SUCCESS_MESSAGES
Messages de célébration en fonction du nombre de tentatives et de l'aide reçue.

**Exemple d'utilisation :**
```typescript
if (wasGuided) {
    return SUCCESS_MESSAGES.guided[Math.floor(Math.random() * SUCCESS_MESSAGES.guided.length)];
}
```

### 6. GUIDED_MESSAGES
Messages pour le mode pas à pas guidé.

**Structure :**
- `start` : Message de démarrage
- `step` : Messages pour chaque étape (milliers, centaines, dizaines, unités)
- `clickFeedback` : Feedback pendant les clics
- `completion` : Message de complétion

### 7. SOLUTION_MESSAGES
Messages affichés pendant l'animation de la solution.

### 8. HELP_CHOICE_MESSAGES
Messages pour les différentes options d'aide.

### 9. FRUSTRATION_MESSAGES
Messages pour différents niveaux de frustration (faible, moyen, élevé).

### 10. SEQUENCE_FEEDBACK
Messages de feedback en deux parties utilisés dans `sequenceFeedback`.

**Exemple d'utilisation :**
```typescript
sequenceFeedback(
    SEQUENCE_FEEDBACK.learnUnits.part1, 
    SEQUENCE_FEEDBACK.learnUnits.part2
);
```

### 11. ERROR_MESSAGES
Messages d'erreur et d'avertissement.

### 12. COLUMN_NAMES et COLUMN_EMOJIS
Noms et emojis pour les différentes colonnes.

## Comment modifier les textes

### 1. Modifier un message simple
```typescript
// Avant
'intro-welcome': "Paf, Crac… Bim… Tchac ! Quel vacarme !",

// Après
'intro-welcome': "Bonjour ! Bienvenue dans ma nouvelle machine !",
```

### 2. Modifier un message avec fonction
```typescript
// Modifier la fonction pour changer le format
'intro-discover-machine': (userName: string) => 
    `Salut ${userName} ! Tu es là ?`,
```

### 3. Ajouter une nouvelle phase
```typescript
export const PHASE_INSTRUCTIONS = {
    // ... phases existantes
    'nouvelle-phase': "Nouveau message pour cette phase !",
} as const;
```

## Avantages de cette approche

1. **Centralisation** : Tous les textes en un seul endroit
2. **Maintenabilité** : Facile de trouver et modifier les messages
3. **Traduction** : Prêt pour l'internationalisation (i18n)
4. **Cohérence** : Les messages suivent une structure uniforme
5. **Type-safe** : TypeScript vérifie l'utilisation correcte des messages

## Traduction future

Pour ajouter le support multilingue :

1. Créer `instructions.en.ts` (anglais), `instructions.es.ts` (espagnol), etc.
2. Créer un système de sélection de langue
3. Importer le fichier approprié basé sur la langue sélectionnée

```typescript
// Exemple
import { PHASE_INSTRUCTIONS } from './instructions.fr.ts'; // français
// ou
import { PHASE_INSTRUCTIONS } from './instructions.en.ts'; // anglais
```

## Conseils

1. **Utilisez des fonctions** pour les messages qui nécessitent des paramètres dynamiques
2. **Gardez la structure** pour maintenir la cohérence
3. **Testez après modification** pour vous assurer que tout fonctionne
4. **Commentez les changements importants** pour faciliter la compréhension

## Support

Pour toute question ou problème, référez-vous aux fichiers suivants :
- `src/instructions.ts` : Configuration des instructions
- `src/store.ts` : Logique d'utilisation des instructions
- `src/feedbackSystem.ts` : Système de feedback
- `src/MachineANombres.tsx` : Interface utilisateur
