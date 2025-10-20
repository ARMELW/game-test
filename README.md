# Machine à Nombres 🧠

Une application éducative interactive pour apprendre les nombres et le système décimal aux enfants.

## 🎯 Objectif Pédagogique

Cette application enseigne progressivement :
- Le concept de **ZÉRO** (l'absence de quantité)
- Les nombres de **1 à 9** avec une association visuelle (jetons et doigts)
- Le système décimal et la règle d'échange **10 pour 1**
- La manipulation de nombres jusqu'à 9999

> 📖 Pour une description détaillée du concept pédagogique et des activités d'apprentissage, consultez le document [CONCEPT.md](CONCEPT.md)

## 🚀 Déploiement

L'application est automatiquement déployée sur GitHub Pages à chaque push sur la branche `master`.

**URL de l'application :** `https://armelgeek.github.io/game/`

### Configuration du Déploiement

Le déploiement est géré par GitHub Actions (voir `.github/workflows/deploy.yml`). Pour activer le déploiement :

1. Aller dans les paramètres du repository GitHub
2. Naviguer vers **Pages** dans le menu latéral
3. Dans **Source**, sélectionner **GitHub Actions**
4. Le workflow se déclenchera automatiquement à chaque push

## 💻 Développement Local

### Prérequis
- Node.js 20 ou supérieur
- npm

### Installation

```bash
npm install
```

### Lancer en mode développement

```bash
npm run dev
```

### Build de production

```bash
npm run build
```

### Prévisualiser le build

```bash
npm run preview
```

### Linter

```bash
npm run lint
```

## 📚 Structure Pédagogique

L'application suit un parcours d'apprentissage progressif :

0. **Phase Introduction** (intro-welcome, intro-discover, intro-question-digits, intro-add-roll, intro-question-max) : Découverte interactive de la machine avec questions/réponses sur les concepts de base (10 chiffres, comptage jusqu'à 99)
1. **Phase Tutoriel** (tutorial) : Prise en main de l'interface (boutons VERT et ROUGE) sans concept de nombre
2. **Phase Exploration** (explore-units) : Découverte de ZÉRO, UN, DEUX, TROIS
3. **Phase Pratique** (click-add) : Entraînement jusqu'à SIX
4. **Phase Soustraction** (click-remove) : Retour à ZÉRO
5. **Phase Apprentissage** (learn-units) : Comptage automatique de 1 à 9
6. **Phase Défi** (challenge-learn-unit) : Validation des acquis
7. **Phase Échange** (learn-carry) : Découverte de l'échange 10 pour 1
8. **Mode Libre** (normal) : Manipulation libre des nombres

## 🛠️ Technologies Utilisées

- React 19
- TypeScript
- Vite
- Unity WebGL (Counting Machine)
- react-unity-webgl
- GitHub Actions pour le déploiement

## 🎮 Integration Unity

L'application intègre un jeu Unity WebGL qui permet d'interagir avec une machine à compter virtuelle.

### Fonctions Globales JavaScript

Les fonctions suivantes sont disponibles globalement via l'objet `window` et peuvent être appelées depuis n'importe quel code JavaScript :

```javascript
// Changer le nombre affiché sur la machine
// SetValue322 -> la machine affichera 0322
window.ChangeCurrentValue()

// Envoyer la liste des objectifs vers Unity
// ChangeList544/1352/9871 -> les objectifs seront 544 puis 1352 puis 9871
window.ChangeCurrentGoalList()

// Bloquer/débloquer le rouleau des milliers
window.LockThousandRoll(true)  // bloquer
window.LockThousandRoll(false) // débloquer

// Bloquer/débloquer le rouleau des centaines
window.LockHundredRoll(true)   // bloquer
window.LockHundredRoll(false)  // débloquer

// Bloquer/débloquer le rouleau des dizaines
window.LockTenRoll(true)       // bloquer
window.LockTenRoll(false)      // débloquer

// Bloquer/débloquer le rouleau des unités
window.LockUnitRoll(true)      // bloquer
window.LockUnitRoll(false)     // débloquer

// Gestionnaire de messages provenant d'Unity
window.onUnityMessage = function(message) {
  console.log("Message from Unity:", message);
}
```

### Règles de Blocage des Rouleaux

Lorsqu'un rouleau est bloqué :

- **Rouleau des 1 bloqué** : on ne peut pas augmenter/réduire de 1
- **Rouleau des 10 bloqué** : 
  - on ne peut pas augmenter/réduire de 1 si la prochaine valeur n'est pas dans la plage disponible
  - on ne peut pas augmenter/réduire de 10
  - Exemple : valeur = 5895, bloqué sur 9 → plage autorisée : 5890-5899
- **Rouleau des 100 bloqué** :
  - on ne peut pas augmenter/réduire de 1 ou 10 si la prochaine valeur n'est pas dans la plage disponible
  - on ne peut pas augmenter/réduire de 100
  - Exemple : valeur = 3259, bloqué sur 2 → plage autorisée : 3200-3299
- **Rouleau des 1000 bloqué** :
  - on ne peut pas augmenter/réduire de 1, 10 ou 100 si la prochaine valeur n'est pas dans la plage disponible
  - on ne peut pas augmenter/réduire de 1000
  - Exemple : valeur = 7381, bloqué sur 7 → plage autorisée : 7000-7999

**Note :** Plusieurs rouleaux peuvent être bloqués simultanément, et les rouleaux bloqués affichent une animation dans Unity.

### Page de Test

Une page de test est disponible pour tester les fonctions globales Unity :
```
/test-global-bridge.html
```

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
