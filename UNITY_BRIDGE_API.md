# Unity Bridge API Documentation

## Vue d'ensemble

Ce document décrit l'API Unity Bridge qui permet l'interaction entre JavaScript et le jeu Unity WebGL de la Machine à Compter.

## Fonctions Disponibles

Toutes les fonctions sont disponibles globalement via l'objet `window` une fois que l'application React est chargée.

### ChangeCurrentValue()

Change le nombre affiché sur la machine Unity.

**Syntaxe :**
```javascript
window.ChangeCurrentValue()
```

**Prérequis :**
- Un élément HTML avec l'id `currentValue` contenant la valeur à définir
- La valeur doit être un nombre entre 0 et 9999

**Exemple :**
```html
<input type="text" id="currentValue" value="322">
<button onclick="window.ChangeCurrentValue()">Changer la valeur</button>
```

**Comportement :**
- Si la valeur est "322", la machine affichera "0322"
- La fonction envoie le message `SetValue322` à Unity

---

### ChangeCurrentGoalList()

Envoie la liste des objectifs vers Unity.

**Syntaxe :**
```javascript
window.ChangeCurrentGoalList()
```

**Prérequis :**
- Un élément HTML avec l'id `currentGoalList` contenant la liste des objectifs
- Les objectifs doivent être séparés par des slashes `/`

**Exemple :**
```html
<input type="text" id="currentGoalList" value="544/1352/9871">
<button onclick="window.ChangeCurrentGoalList()">Changer les objectifs</button>
```

**Comportement :**
- Les objectifs seront présentés séquentiellement : 544, puis 1352, puis 9871
- La fonction envoie le message `ChangeList544/1352/9871` à Unity

---

### LockThousandRoll(locked)

Bloque ou débloque le rouleau des milliers.

**Syntaxe :**
```javascript
window.LockThousandRoll(locked: boolean)
```

**Paramètres :**
- `locked` (boolean) : `true` pour bloquer, `false` pour débloquer

**Exemple :**
```javascript
// Bloquer le rouleau des milliers
window.LockThousandRoll(true);

// Débloquer le rouleau des milliers
window.LockThousandRoll(false);
```

**Comportement :**
- Quand bloqué, empêche les modifications qui changeraient le chiffre des milliers
- Affiche une animation de blocage dans Unity

---

### LockHundredRoll(locked)

Bloque ou débloque le rouleau des centaines.

**Syntaxe :**
```javascript
window.LockHundredRoll(locked: boolean)
```

**Paramètres :**
- `locked` (boolean) : `true` pour bloquer, `false` pour débloquer

**Exemple :**
```javascript
// Bloquer le rouleau des centaines
window.LockHundredRoll(true);

// Débloquer le rouleau des centaines
window.LockHundredRoll(false);
```

**Comportement :**
- Quand bloqué, empêche les modifications qui changeraient le chiffre des centaines
- Affiche une animation de blocage dans Unity

---

### LockTenRoll(locked)

Bloque ou débloque le rouleau des dizaines.

**Syntaxe :**
```javascript
window.LockTenRoll(locked: boolean)
```

**Paramètres :**
- `locked` (boolean) : `true` pour bloquer, `false` pour débloquer

**Exemple :**
```javascript
// Bloquer le rouleau des dizaines
window.LockTenRoll(true);

// Débloquer le rouleau des dizaines
window.LockTenRoll(false);
```

**Comportement :**
- Quand bloqué, empêche les modifications qui changeraient le chiffre des dizaines
- Affiche une animation de blocage dans Unity

---

### LockUnitRoll(locked)

Bloque ou débloque le rouleau des unités.

**Syntaxe :**
```javascript
window.LockUnitRoll(locked: boolean)
```

**Paramètres :**
- `locked` (boolean) : `true` pour bloquer, `false` pour débloquer

**Exemple :**
```javascript
// Bloquer le rouleau des unités
window.LockUnitRoll(true);

// Débloquer le rouleau des unités
window.LockUnitRoll(false);
```

**Comportement :**
- Quand bloqué, empêche toute modification de +1 ou -1
- Affiche une animation de blocage dans Unity

---

### window.onUnityMessage

Gestionnaire d'événements pour les messages provenant d'Unity.

**Syntaxe :**
```javascript
window.onUnityMessage = function(message: string) {
  // Votre code ici
}
```

**Paramètres :**
- `message` (string) : Le message envoyé par Unity

**Exemple :**
```javascript
window.onUnityMessage = function(message) {
  console.log("Message reçu d'Unity:", message);
  
  // Exemple de traitement de message
  if (message.startsWith("ValueChanged:")) {
    const newValue = message.split(":")[1];
    console.log("Nouvelle valeur:", newValue);
  }
}
```

---

## Règles de Blocage des Rouleaux

### Rouleau des Unités (1) Bloqué
- ❌ Ne peut pas augmenter/réduire de 1

### Rouleau des Dizaines (10) Bloqué
- ❌ Ne peut pas augmenter/réduire de 1 si la prochaine valeur n'est pas dans la plage disponible
  - **Exemple :** valeur = 5895, bloqué sur 9
  - **Plage autorisée :** 5890-5899
- ❌ Ne peut pas augmenter/réduire de 10

### Rouleau des Centaines (100) Bloqué
- ❌ Ne peut pas augmenter/réduire de 1 ou 10 si la prochaine valeur n'est pas dans la plage disponible
  - **Exemple :** valeur = 3259, bloqué sur 2
  - **Plage autorisée :** 3200-3299
- ❌ Ne peut pas augmenter/réduire de 100

### Rouleau des Milliers (1000) Bloqué
- ❌ Ne peut pas augmenter/réduire de 1, 10 ou 100 si la prochaine valeur n'est pas dans la plage disponible
  - **Exemple :** valeur = 7381, bloqué sur 7
  - **Plage autorisée :** 7000-7999
- ❌ Ne peut pas augmenter/réduire de 1000

### Blocages Multiples
**Note :** Plusieurs rouleaux peuvent être bloqués simultanément. Chaque rouleau bloqué affiche une animation de blocage.

---

## Intégration React

Dans les composants React, vous pouvez utiliser le hook `useUnity` pour accéder aux mêmes fonctionnalités :

```typescript
import { useUnity } from './hooks/useUnity';

function MyComponent() {
  const {
    changeCurrentValue,
    changeCurrentGoalList,
    lockThousandRoll,
    lockHundredRoll,
    lockTenRoll,
    lockUnitRoll,
    isLoaded,
  } = useUnity();

  const handleSetValue = () => {
    changeCurrentValue('322');
  };

  const handleLockUnits = () => {
    lockUnitRoll(true);
  };

  return (
    <div>
      <button onClick={handleSetValue} disabled={!isLoaded}>
        Set Value
      </button>
      <button onClick={handleLockUnits} disabled={!isLoaded}>
        Lock Units
      </button>
    </div>
  );
}
```

---

## Page de Test

Une page de test interactive est disponible à l'adresse :
```
/test-global-bridge.html
```

Cette page permet de tester toutes les fonctions du Unity Bridge avec une interface utilisateur simple.

---

## Notes Techniques

### Vérification de Disponibilité

Avant d'appeler les fonctions, vérifiez qu'Unity est chargé :

```javascript
if (typeof window.unityInstance !== 'undefined') {
  window.ChangeCurrentValue();
} else {
  console.warn('Unity n\'est pas encore chargé');
}
```

### Messages Unity

Les messages sont envoyés à l'objet Unity `WebBridge` via la méthode `ReceiveStringMessageFromJs`.

Format des messages :
- **SetValue** : `SetValue{number}` (ex: `SetValue322`)
- **ChangeList** : `ChangeList{goals}` (ex: `ChangeList544/1352/9871`)
- **Lock** : `Lock{Roll}:{state}` (ex: `LockThousand:1`)

### État de Blocage
- `1` = bloqué
- `0` = débloqué

---

## Support

Pour toute question ou problème concernant l'API Unity Bridge, veuillez consulter :
- Le code source dans `/src/unityBridge.ts`
- Le hook React dans `/src/hooks/useUnity.ts`
- La page de démo dans `/src/components/UnityDemo.tsx`
