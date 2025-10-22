# Phase Completion Tracking System

## Vue d'ensemble

Le système de suivi de la complétion des phases permet de savoir quand une phase est terminée avec son nom et son statut, et de passer automatiquement d'une phase à l'autre.

## Types

### PhaseCompletionStatus

```typescript
type PhaseCompletionStatus = 'not-started' | 'in-progress' | 'completed';
```

Indique l'état actuel d'une phase :
- `not-started` : La phase n'a pas encore été visitée
- `in-progress` : La phase est actuellement active
- `completed` : La phase a été terminée

### PhaseStatus

```typescript
interface PhaseStatus {
  phase: Phase;
  status: PhaseCompletionStatus;
  completedAt?: number; // timestamp quand completé
}
```

Information de statut d'une phase spécifique.

### PhaseStatusMap

```typescript
type PhaseStatusMap = Record<Phase, PhaseCompletionStatus>;
```

Enregistre le statut de toutes les phases du jeu.

## État du Store

### phaseStatusMap
- **Type**: `PhaseStatusMap`
- **Description**: Carte de toutes les phases et leur statut de complétion
- **Valeur initiale**: Toutes les phases à `'not-started'`

### autoTransitionEnabled
- **Type**: `boolean`
- **Description**: Active/désactive les transitions automatiques entre phases
- **Valeur initiale**: `true`

## Fonctions

### getPhaseStatus(phase: Phase): PhaseStatus

Retourne l'information de statut pour une phase spécifique.

**Exemple:**
```typescript
const status = getPhaseStatus('tutorial');
console.log(status);
// { phase: 'tutorial', status: 'completed' }
```

### markPhaseComplete(phase: Phase): void

Marque une phase comme complétée. Si `autoTransitionEnabled` est vrai, déclenche automatiquement la transition vers la phase suivante.

**Exemple:**
```typescript
markPhaseComplete('tutorial');
// La phase 'tutorial' est marquée comme complétée
// Si auto-transition est activé, passe automatiquement à la phase suivante
```

### isPhaseComplete(phase: Phase): boolean

Vérifie si une phase spécifique est complétée.

**Exemple:**
```typescript
if (isPhaseComplete('tutorial')) {
  console.log('Tutorial terminé!');
}
```

### setAutoTransitionEnabled(enabled: boolean): void

Active ou désactive les transitions automatiques entre phases.

**Exemple:**
```typescript
// Activer les transitions automatiques
setAutoTransitionEnabled(true);

// Désactiver les transitions automatiques
setAutoTransitionEnabled(false);
```

### checkAndTransitionToNextPhase(): void

Vérifie si la phase actuelle est complétée et déclenche une transition vers la phase suivante si approprié. Cette fonction respecte les phases qui nécessitent une transition manuelle.

**Phases avec transition manuelle:**
- `normal` - Mode libre
- `done` - Fin du jeu
- `celebration-before-thousands` - Célébration
- `celebration-thousands-complete` - Célébration finale
- `intro-discover-machine` - Nécessite un choix de l'utilisateur
- `intro-count-digits` - Nécessite une saisie utilisateur
- `intro-max-value-question` - Nécessite une saisie utilisateur

## Comportement Automatique

### Transition entre phases

Quand `setPhase()` est appelé:
1. La phase actuelle est marquée comme `'completed'`
2. La nouvelle phase est marquée comme `'in-progress'`
3. Si `autoTransitionEnabled` est vrai et que la phase actuelle n'est pas dans la liste des phases manuelles, une transition automatique est déclenchée après 1 seconde

### Logging

Toutes les actions de phase sont loggées dans la console pour faciliter le débogage:
```
[setPhase] Transitioning from "tutorial" to "explore-units"
[markPhaseComplete] Marking phase "tutorial" as completed
[markPhaseComplete] Auto-transition enabled, checking for next phase
[checkAndTransitionToNextPhase] Auto-transitioning from "tutorial" to "explore-units"
```

## Utilisation dans les Composants React

### Hook de base

```typescript
import { useStore } from './store';

function MyComponent() {
  const phase = useStore((state) => state.phase);
  const getPhaseStatus = useStore((state) => state.getPhaseStatus);
  const markPhaseComplete = useStore((state) => state.markPhaseComplete);
  const isPhaseComplete = useStore((state) => state.isPhaseComplete);
  
  const currentStatus = getPhaseStatus(phase);
  
  return (
    <div>
      <p>Phase actuelle: {phase}</p>
      <p>Statut: {currentStatus.status}</p>
      <button onClick={() => markPhaseComplete(phase)}>
        Compléter la phase
      </button>
    </div>
  );
}
```

### Affichage de toutes les phases complétées

```typescript
function CompletedPhasesList() {
  const phaseStatusMap = useStore((state) => state.phaseStatusMap);
  
  const completedPhases = Object.entries(phaseStatusMap)
    .filter(([_, status]) => status === 'completed')
    .map(([phase]) => phase);
  
  return (
    <ul>
      {completedPhases.map(phase => (
        <li key={phase}>✓ {phase}</li>
      ))}
    </ul>
  );
}
```

### Activer auto-transition conditionnellement

```typescript
function SettingsPanel() {
  const autoTransitionEnabled = useStore((state) => state.autoTransitionEnabled);
  const setAutoTransitionEnabled = useStore((state) => state.setAutoTransitionEnabled);
  
  return (
    <label>
      <input
        type="checkbox"
        checked={autoTransitionEnabled}
        onChange={(e) => setAutoTransitionEnabled(e.target.checked)}
      />
      Transitions automatiques
    </label>
  );
}
```

## Composant de Débogage

Un composant `PhaseStatusDebug` est disponible pour tester le système en développement.

### Activation

Le panneau de débogage s'affiche automatiquement en:
- Mode développement (`DEV`)
- Production avec paramètre `?debug` dans l'URL

### Fonctionnalités

- Affiche la phase actuelle et son statut
- Toggle pour activer/désactiver l'auto-transition
- Boutons pour naviguer entre les phases
- Bouton pour marquer manuellement une phase comme complétée
- Statistiques (nombre de phases complétées/en cours)
- Listes déroulantes des phases complétées et en cours

### Utilisation

```typescript
// Dans App.tsx
import { PhaseStatusDebug } from './components/PhaseStatusDebug';

function App() {
  const showDebug = import.meta.env.DEV || 
    new URLSearchParams(window.location.search).has('debug');

  return (
    <>
      <YourMainComponent />
      {showDebug && <PhaseStatusDebug />}
    </>
  );
}
```

## Cas d'Usage

### 1. Validation de complétion de phase dans un défi

```typescript
function ChallengeComponent() {
  const { 
    phase, 
    markPhaseComplete,
    handleValidateLearning 
  } = useStore();
  
  const onChallengeSuccess = () => {
    handleValidateLearning();
    // Marquer la phase comme complétée
    markPhaseComplete(phase);
  };
  
  return (
    <button onClick={onChallengeSuccess}>
      Valider
    </button>
  );
}
```

### 2. Déblocage de fonctionnalités selon phases complétées

```typescript
function UnlockableFeature() {
  const isPhaseComplete = useStore((state) => state.isPhaseComplete);
  
  const isUnlocked = isPhaseComplete('challenge-unit-3') && 
                     isPhaseComplete('learn-carry');
  
  return (
    <div>
      {isUnlocked ? (
        <AdvancedFeature />
      ) : (
        <p>Complétez les défis pour débloquer</p>
      )}
    </div>
  );
}
```

### 3. Progression globale

```typescript
function ProgressBar() {
  const phaseStatusMap = useStore((state) => state.phaseStatusMap);
  
  const totalPhases = Object.keys(phaseStatusMap).length;
  const completedCount = Object.values(phaseStatusMap)
    .filter(status => status === 'completed').length;
  
  const percentage = (completedCount / totalPhases) * 100;
  
  return (
    <div className="progress-bar">
      <div style={{ width: `${percentage}%` }}>
        {Math.round(percentage)}%
      </div>
    </div>
  );
}
```

## Meilleures Pratiques

1. **Marquer les phases complétées explicitement** : Appelez `markPhaseComplete()` quand une phase atteint ses objectifs.

2. **Utiliser auto-transition pour les séquences linéaires** : Activez `autoTransitionEnabled` pour les sections où l'utilisateur suit un parcours linéaire.

3. **Désactiver auto-transition pour l'exploration libre** : Désactivez pour les phases comme `normal` où l'utilisateur contrôle la navigation.

4. **Logger les transitions** : Le système log déjà les transitions, vérifiez la console en cas de problème.

5. **Tester avec le panneau de débogage** : Utilisez `PhaseStatusDebug` pour valider la logique de complétion.

## Migration depuis l'ancien système

Si vous aviez un système de gestion de phases existant:

```typescript
// Ancien code
setPhase('explore-units');

// Nouveau code - le statut est géré automatiquement
setPhase('explore-units');
// La phase précédente est automatiquement marquée comme complétée
// La nouvelle phase est marquée comme 'in-progress'
```

Pour marquer explicitement une phase comme complétée avant de changer:

```typescript
// Marquer la phase actuelle comme complétée
markPhaseComplete(currentPhase);

// Passer à la phase suivante
setPhase('next-phase');
```

## Dépannage

### Les transitions automatiques ne fonctionnent pas

Vérifiez que:
1. `autoTransitionEnabled` est `true`
2. La phase actuelle n'est pas dans la liste des phases manuelles
3. `markPhaseComplete()` est appelé pour la phase actuelle
4. Consultez les logs console pour voir les messages de débogage

### Une phase n'est pas marquée comme complétée

Assurez-vous d'appeler `markPhaseComplete(phase)` ou que `setPhase()` est appelé pour changer de phase (ce qui marque l'ancienne comme complétée automatiquement).

### Le panneau de débogage ne s'affiche pas

Vérifiez que:
1. Vous êtes en mode développement, ou
2. L'URL contient `?debug`, ou
3. Le composant `PhaseStatusDebug` est bien importé et rendu dans l'App
