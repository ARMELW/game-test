# 📊 FLOW COMPLET DES PHASES DU JEU

Voici le diagramme de flux complet de toutes les phases du jeu éducatif :

## 🎮 Architecture globale
```
DÉMARRAGE DU JEU
         ↓
┌────────────────────────────────────────────────────────────────┐
│                    SECTION 1 : INTRODUCTION                     │
└────────────────────────────────────────────────────────────────┘
         ↓
    [intro-welcome]
    "Bruits de marteau... j'ai terminé ma machine !"
    🎯 Action : L'utilisateur clique sur △ ou ∇
         ↓
    [intro-discover]
    "Oh tu es là ? Cette machine va nous permettre de compter"
    🎯 Action : L'utilisateur clique sur △
         ↓
    Comptage de 0 à 9 dans la colonne Unités
    🎯 Action : L'utilisateur atteint 9
         ↓
    [intro-question-digits]
    "Combien de chiffres différents as-tu vu ?"
    🎯 Action : L'utilisateur saisit sa réponse (attendu: 10)
         ↓
    [intro-add-roll]
    "Comment compter plus haut que 9 ?"
    🎯 Action : L'utilisateur clique sur △ jusqu'à 9
         ↓
    Déblocage de la colonne Dizaines (retenue 9→10)
         ↓
    [intro-question-max]
    "Jusqu'à combien peut-on compter avec 2 rouleaux ?"
    🎯 Action : L'utilisateur saisit sa réponse (attendu: 99)
         ↓
┌────────────────────────────────────────────────────────────────┐
│                    SECTION 2 : TUTORIEL                         │
└────────────────────────────────────────────────────────────────┘
         ↓
    [tutorial]
    "Bienvenue ! Clique sur △"
    🎯 Action : 
    - Clic 1 → "Bravo ! Un rond bleu"
    - Clic 2 → "Super ! Deux ronds"
    - Clic 3 → "Essaie le bouton ROUGE"
         ↓
    L'utilisateur décrémente de 3 à 0 avec ∇
         ↓
    Transition vers apprentissage des nombres
         ↓
┌────────────────────────────────────────────────────────────────┐
│              SECTION 3 : APPRENTISSAGE DES UNITÉS               │
└────────────────────────────────────────────────────────────────┘
         ↓
    [learn-units] (COMPTAGE AUTO)
    La machine compte automatiquement de 1 à 9
    "1 : une bille, UN doigt"
    "2 : deux billes, DEUX doigts"
    ...
    "9 : neuf billes, colonne presque pleine"
    🎯 Pas d'action, juste observation
         ↓
    Réinitialisation à 0
         ↓
    [explore-units]
    "Clique sur △ pour ajouter une bille"
    🎯 Action : L'utilisateur clique 3 fois (1, 2, 3)
         ↓
    [click-add]
    "Continue jusqu'à 9 !"
    🎯 Action : L'utilisateur monte jusqu'à 9
         ↓
    [click-remove]
    "Clique sur ∇ pour descendre à zéro"
    🎯 Action : L'utilisateur descend de 9 à 0
         ↓
┌────────────────────────────────────────────────────────────────┐
│                 SECTION 4 : DÉFIS DES UNITÉS                    │
└────────────────────────────────────────────────────────────────┘
         ↓
    [challenge-unit-1]
    "DÉFI 1 : Affiche le nombre X"
    🎯 Action : Afficher plusieurs nombres (ex: 3, 7, 5)
    ✅ Validation avec bouton VALIDER
         ↓
    [challenge-unit-2]
    "DÉFI 2 : Affiche le nombre Y"
    🎯 Action : Afficher plusieurs nombres (ex: 8, 2, 6)
    ✅ Validation avec bouton VALIDER
         ↓
    [challenge-unit-3]
    "DÉFI 3 : Affiche le nombre Z"
    🎯 Action : Afficher plusieurs nombres (ex: 4, 9, 1)
    ✅ Validation avec bouton VALIDER
         ↓
    🎉 Tous les défis des unités réussis !
         ↓
┌────────────────────────────────────────────────────────────────┐
│           SECTION 5 : APPRENTISSAGE DE LA RETENUE               │
└────────────────────────────────────────────────────────────────┘
         ↓
    [learn-carry]
    "Prêt pour la magie ? Clique sur △ pour l'échange 10 pour 1"
    🎯 Action : L'utilisateur clique sur △ quand Unités = 9
         ↓
    💥 MAGIE : 10 unités → 1 dizaine (9 + 1 = 10)
    "INCROYABLE ! 10 billes deviennent 1 bille dans la colonne suivante"
    "RÈGLE D'OR : 10 billes = 1 bille dans la colonne de gauche"
         ↓
┌────────────────────────────────────────────────────────────────┐
│              SECTION 6 : APPRENTISSAGE DES DIZAINES             │
└────────────────────────────────────────────────────────────────┘
         ↓
    [learn-tens] (COMPTAGE AUTO)
    La machine compte automatiquement par dizaines
    "10 (DIX) ! Une dizaine = 10 unités"
    "20 !"
    "30 !"
    ...
    "90 (QUATRE-VINGT-DIX) ! Presque 100 !"
    🎯 Pas d'action, juste observation
         ↓
    [learn-tens-combination] (COMPTAGE AUTO)
    La machine montre des exemples de combinaisons
    "12 (DOUZE) ! 1 dizaine + 2 unités = 12"
    "25 (VINGT-CINQ) ! 2 dizaines + 5 unités = 25"
    "34 (TRENTE-QUATRE) ! 3 dizaines + 4 unités = 34"
    🎯 Pas d'action, juste observation
         ↓
┌────────────────────────────────────────────────────────────────┐
│                SECTION 7 : DÉFIS DES DIZAINES                   │
└────────────────────────────────────────────────────────────────┘
         ↓
    [challenge-tens-1]
    "DÉFI 1 : Affiche le nombre X" (ex: 23, 45, 67)
    🎯 Action : Combiner dizaines et unités
    ✅ Validation avec bouton VALIDER
         ↓
    [challenge-tens-2]
    "DÉFI 2 : Affiche le nombre Y" (ex: 89, 12, 50)
    🎯 Action : Combiner dizaines et unités
    ✅ Validation avec bouton VALIDER
         ↓
    [challenge-tens-3]
    "DÉFI 3 : Affiche le nombre Z" (ex: 34, 78, 90)
    🎯 Action : Combiner dizaines et unités
    ✅ Validation avec bouton VALIDER
         ↓
    🎉 Tous les défis des dizaines réussis !
    ✅ completedChallenges.tens = true
    🔓 Déblocage de la colonne Centaines
         ↓
┌────────────────────────────────────────────────────────────────┐
│             SECTION 8 : APPRENTISSAGE DES CENTAINES             │
└────────────────────────────────────────────────────────────────┘
         ↓
    [learn-hundreds] (COMPTAGE AUTO)
    La machine compte automatiquement par centaines
    "100 (CENT) ! Une centaine = 100 unités"
    "200 !"
    "300 !"
    ...
    "900 !"
    🎯 Pas d'action, juste observation
         ↓
    [learn-hundreds-combination] (COMPTAGE AUTO)
    La machine montre des exemples
    "123 (CENT-VINGT-TROIS) !"
    "234 (DEUX-CENT-TRENTE-QUATRE) !"
    🎯 Pas d'action, juste observation
         ↓
┌────────────────────────────────────────────────────────────────┐
│               SECTION 9 : DÉFIS DES CENTAINES                   │
└────────────────────────────────────────────────────────────────┘
         ↓
    [challenge-hundreds-1]
    "DÉFI 1 : Affiche le nombre X" (ex: 123, 456, 789)
    🎯 Action : Combiner centaines, dizaines et unités
    ✅ Validation avec bouton VALIDER
         ↓
    [challenge-hundreds-2]
    "DÉFI 2 : Affiche le nombre Y"
    🎯 Action : Combiner centaines, dizaines et unités
    ✅ Validation avec bouton VALIDER
         ↓
    [challenge-hundreds-3]
    "DÉFI 3 : Affiche le nombre Z"
    🎯 Action : Combiner centaines, dizaines et unités
    ✅ Validation avec bouton VALIDER
         ↓
    🎉 Tous les défis des centaines réussis !
    ✅ completedChallenges.hundreds = true
    🔓 Déblocage de la colonne Milliers
         ↓
┌────────────────────────────────────────────────────────────────┐
│              SECTION 10 : APPRENTISSAGE DES MILLIERS            │
└────────────────────────────────────────────────────────────────┘
         ↓
    [learn-thousands] (COMPTAGE AUTO)
    La machine compte automatiquement par milliers
    "1000 !"
    "2000 !"
    ...
    "9000 !"
    🎯 Pas d'action, juste observation
         ↓
    [learn-thousands-combination] (COMPTAGE AUTO)
    La machine montre des exemples
    "1234 (MILLE-DEUX-CENT-TRENTE-QUATRE) !"
    "2345 (DEUX-MILLE-TROIS-CENT-QUARANTE-CINQ) !"
    🎯 Pas d'action, juste observation
         ↓
┌────────────────────────────────────────────────────────────────┐
│                SECTION 11 : DÉFIS DES MILLIERS                  │
└────────────────────────────────────────────────────────────────┘
         ↓
    [challenge-thousands-1]
    "DÉFI 1 : Affiche le nombre X" (ex: 1234, 5678)
    🎯 Action : Combiner toutes les colonnes
    ✅ Validation avec bouton VALIDER
         ↓
    [challenge-thousands-2]
    "DÉFI 2 : Affiche le nombre Y"
    🎯 Action : Combiner toutes les colonnes
    ✅ Validation avec bouton VALIDER
         ↓
    [challenge-thousands-3]
    "DÉFI 3 : Affiche le nombre Z"
    🎯 Action : Combiner toutes les colonnes
    ✅ Validation avec bouton VALIDER
         ↓
    🎉 Tous les défis des milliers réussis !
    ✅ completedChallenges.thousands = true
         ↓
┌────────────────────────────────────────────────────────────────┐
│                   SECTION 12 : MODE NORMAL                      │
└────────────────────────────────────────────────────────────────┘
         ↓
    [normal]
    "Mode exploration ! 🚀 Construis des grands nombres !"
    🎯 L'utilisateur peut :
    - Créer n'importe quel nombre de 0 à 9999
    - Utiliser toutes les colonnes librement
    - Explorer les retenues et emprunts
    
    🏆 FIN DE L'APPRENTISSAGE GUIDÉ
    L'utilisateur maîtrise maintenant le système décimal !
```

---

## 📊 Diagramme simplifié des transitions
```
PHASES D'INTRO          TUTORIEL           UNITÉS              RETENUE
─────────────────       ─────────          ──────              ───────
intro-welcome      →    tutorial      →    learn-units    →    learn-carry
intro-discover          ↓                   explore-units       ↓
intro-question-digits   (décrémentation)    click-add           (10 pour 1)
intro-add-roll          ↓                   click-remove
intro-question-max      Transition          ↓
                                           challenge-unit-1
                                           challenge-unit-2
                                           challenge-unit-3

DIZAINES                CENTAINES           MILLIERS            FINAL
────────                ─────────           ────────            ─────
learn-tens         →    learn-hundreds  →   learn-thousands →   normal
learn-tens-combo        learn-hund-combo    learn-thou-combo    (libre)
challenge-tens-1        challenge-hund-1    challenge-thou-1
challenge-tens-2        challenge-hund-2    challenge-thou-2
challenge-tens-3        challenge-hund-3    challenge-thou-3
```

---

## 🔑 Phases clés et transitions

### 1️⃣ Phases avec comptage automatique
**`isCountingAutomatically = true`**

- `learn-units` : Compte 1→9
- `learn-tens` : Compte 10→90
- `learn-tens-combination` : Exemples 12, 25, 34
- `learn-hundreds` : Compte 100→900
- `learn-hundreds-combination` : Exemples 123, 234
- `learn-thousands` : Compte 1000→9000
- `learn-thousands-combination` : Exemples 1234, 2345

### 2️⃣ Phases avec validation
**Boutons VALIDER**

- `challenge-unit-1/2/3` → `handleValidateLearning()`
- `challenge-tens-1/2/3` → `handleValidateTens()`
- `challenge-hundreds-1/2/3` → `handleValidateHundreds()`
- `challenge-thousands-1/2/3` → `handleValidateThousands()`

### 3️⃣ Phases avec saisie utilisateur
**`showInputField = true`**

- `intro-question-digits` : Combien de chiffres ? (attendu: 10)
- `intro-question-max` : Jusqu'à combien ? (attendu: 99)

### 4️⃣ Phases interactives libres

- `tutorial` : Apprendre △ et ∇
- `explore-units` : Pratiquer 1, 2, 3
- `click-add` : Monter jusqu'à 9
- `click-remove` : Descendre à 0
- `learn-carry` : Clic pour voir 9→10
- `normal` : Exploration libre

---

## 🎯 Conditions de progression

### ✅ Déblocages

| Phase source | Condition | Phase destination | Effet |
|-------------|-----------|-------------------|-------|
| `intro-question-max` | Réponse 99 | `tutorial` | - |
| `tutorial` | Descente à 0 | `learn-units` | - |
| `challenge-unit-3` | Tous les défis | `learn-carry` | - |
| `learn-carry` | Clic sur △ à 9 | `learn-tens` | - |
| `challenge-tens-3` | Tous les défis | `learn-hundreds` | `completedChallenges.tens = true` |
| `challenge-hundreds-3` | Tous les défis | `learn-thousands` | `completedChallenges.hundreds = true` |
| `challenge-thousands-3` | Tous les défis | `normal` | `completedChallenges.thousands = true` |

### 🔓 Colonnes débloquées par phase

| Phase(s) | Colonnes actives |
|---------|------------------|
| `intro-welcome` | Unités |
| `intro-add-roll` et après | Unités, Dizaines |
| `challenge-unit-*` | Unités, Dizaines |
| `challenge-tens-*` | Unités, Dizaines |
| `challenge-hundreds-*` | Unités, Dizaines, Centaines |
| `challenge-thousands-*` | Unités, Dizaines, Centaines, Milliers |
| `normal` | Toutes |

---

## ⏱️ Durée approximative

| Section | Durée estimée |
|---------|---------------|
| Introduction | 2-3 minutes |
| Tutoriel | 1-2 minutes |
| Unités (apprentissage + défis) | 5-7 minutes |
| Dizaines (apprentissage + défis) | 5-7 minutes |
| Centaines (apprentissage + défis) | 5-7 minutes |
| Milliers (apprentissage + défis) | 5-7 minutes |

**TOTAL : 25-35 minutes** pour compléter tout l'apprentissage guidé 🎓

---

## 📋 Liste complète des phases

### Introduction (5 phases)
1. `intro-welcome` - Message de bienvenue
2. `intro-discover` - Découverte de la machine
3. `intro-question-digits` - Question sur les chiffres
4. `intro-add-roll` - Besoin d'une colonne supplémentaire
5. `intro-question-max` - Question sur le maximum

### Tutoriel (4 phases)
6. `tutorial` - Apprentissage des boutons △ et ∇
7. `explore-units` - Exploration guidée 1-3
8. `click-add` - Montée jusqu'à 9
9. `click-remove` - Descente jusqu'à 0

### Unités (5 phases)
10. `learn-units` - Comptage auto 1-9
11. `challenge-unit-1` - Premier défi
12. `challenge-unit-2` - Deuxième défi
13. `challenge-unit-3` - Troisième défi
14. `learn-carry` - Apprentissage de la retenue

### Dizaines (5 phases)
15. `learn-tens` - Comptage auto par dizaines
16. `learn-tens-combination` - Exemples de combinaisons
17. `challenge-tens-1` - Premier défi
18. `challenge-tens-2` - Deuxième défi
19. `challenge-tens-3` - Troisième défi

### Centaines (5 phases)
20. `learn-hundreds` - Comptage auto par centaines
21. `learn-hundreds-combination` - Exemples de combinaisons
22. `challenge-hundreds-1` - Premier défi
23. `challenge-hundreds-2` - Deuxième défi
24. `challenge-hundreds-3` - Troisième défi

### Milliers (5 phases)
25. `learn-thousands` - Comptage auto par milliers
26. `learn-thousands-combination` - Exemples de combinaisons
27. `challenge-thousands-1` - Premier défi
28. `challenge-thousands-2` - Deuxième défi
29. `challenge-thousands-3` - Troisième défi

### Mode libre (1 phase)
30. `normal` - Exploration libre jusqu'à 9999

**TOTAL : 30 phases distinctes** 🎮

---

## 🎓 Progression pédagogique

Le jeu suit une approche pédagogique en spirale :

1. **Introduction** : Découverte du concept
2. **Démonstration** : La machine montre (comptage auto)
3. **Pratique guidée** : L'utilisateur essaie avec feedback
4. **Évaluation** : Défis à relever
5. **Transition** : Apprentissage du concept suivant

Chaque niveau (unités, dizaines, centaines, milliers) suit ce même schéma, permettant une consolidation progressive des acquis. 📚✨

---