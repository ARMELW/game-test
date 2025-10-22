/**
 * Centralized Instruction Configuration
 * 
 * This file contains all text strings, instructions, and messages used throughout the application.
 * Similar to an i18n configuration file, this centralizes all textual content in one place,
 * making it easier to modify, translate, or maintain the application's text.
 * 
 * Organization:
 * - PHASE_INSTRUCTIONS: Instructions shown based on the current phase
 * - UI_MESSAGES: UI buttons, labels, and general interface text
 * - FEEDBACK_MESSAGES: Feedback messages for challenges and attempts
 * - ERROR_MESSAGES: Error-specific feedback messages
 * - SUCCESS_MESSAGES: Success celebration messages
 * - GUIDED_MESSAGES: Messages for guided mode
 */

// ============================================================================
// PHASE INSTRUCTIONS
// Instructions shown in the pedagogical assistant based on the current phase
// ============================================================================

export const PHASE_INSTRUCTIONS = {
  // Loading phase - preparing voice system
  'loading': "Préparation de l'assistant vocal... Un instant s'il vous plaît ! 🎙️",
  'intro-welcome': "Paf, Crac… Bim… Tchac ! Quel vacarme ! Voilà, j'ai terminé ma nouvelle machine !",
  'intro-discover': "Oh, tu es là ? Je ne t'avais pas entendu arriver avec tout ce bruit ! J'étais justement en train de terminer la nouvelle invention qui va nous permettre de compter toutes sortes de choses.Tu es prêt à la découvrir ?",
  // Introduction phases
  'intro-welcome-personalized': "Bonjour ! Bienvenue dans mon atelier ! 👋 Comment tu t'appelles ? (Tu peux aussi sauter cette étape)",
  
  'intro-discover-machine': (_userName: string) => 
    `Tadaaaaa ! Comment tu la trouves ? `,
  
  'intro-first-interaction': {
    initial: " Bon, elle peut paraître un peu compliquée comme ça... mais elle n'aura bientôt plus de secrets pour toi ! Grâce à cette machine bizarre, nous allons comprendre comment fonctionnent les nombres ! Et hop, je vais la mettre en route ! Maintenant tu peux appuyer sur ses boutons ! Clique sur le bouton △ VERT pour voir ce qu'il se passe !",
    continuing: "Continue à cliquer sur △ pour remplir la machine !",
    full: "La machine est pleine ! Essaie maintenant le bouton ROUGE ∇ pour voir ce qu'il fait !",
  },
  
  'intro-count-digits': "Maintenant, une petite question pour voir si tu as bien regardé ! 🤔 Te rappelles-tu combien de chiffres DIFFÉRENTS tu as vu ? Prends ton temps pour réfléchir... 🤔",
  
  'intro-second-column': "Bon, tout ça c'est très bien... Mais j'ai un PROBLÈME ! 🤔 Comment va-t-on faire pour compter plus haut que 9 ? Pour l'instant, la machine BLOQUE à 9 ! Tu vois ? Ça ne bouge plus ! 😅 À ton avis, que peut-on faire ?",
  
  'intro-discover-carry': {
    fillToNine: "Maintenant, on va voir quelque chose de MAGIQUE ! ✨ Amène le premier rouleau à 9 !",
    atNine: "Parfait ! Tout est PLEIN ! 9 lumières allumées ! Maintenant... que va-t-il se passer si tu cliques encore une fois sur △ ? Réfléchis bien... 🤔 Tu ne sais pas ? C'est normal ! Clique et tu verras ! 😊",
    afterCarry: "WAOUH ! Tu as vu ça ??? 🤩 C'était MAGIQUE non ? Les 10 lumières ont VOYAGÉ ! Elles se sont regroupées pour devenir UNE seule lumière sur le deuxième rouleau ! Maintenant, refais l'inverse ! Clique sur ∇ pour voir ce qu'il se passe !",
  },
  
  'intro-max-value-question': {
    guided: {
      firstRoll: "Clique sur △ pour remplir le PREMIER rouleau au maximum !",
      secondRoll: "Parfait ! Maintenant clique sur △ du DEUXIÈME rouleau pour le remplir aussi !",
      maximum: "C'est le MAXIMUM ! 99 !",
    },
    question: "Maintenant que tu as vu comment ça marche... J'ai une question pour toi ! 🎯 Avec DEUX rouleaux, jusqu'à combien peut-on compter ? Réfléchis bien ! 🤔",
  },
  
  'intro-question-digits': "Te rappelles-tu combien de chiffres différents tu as vu ? (Saisis ta réponse)",
  'intro-add-roll': "Bon, tout ça c'est très bien, mais comment va-t-on faire pour utiliser cette machine lorsque je veux compter plus haut que 9 ? Pour l'instant elle bloque !",
  'intro-question-max': "Jusqu'à combien peut-on compter maintenant ? (Saisis ta réponse)",
  
  // Tutorial phases
  'tutorial': "Bienvenue ! Clique sur △ pour découvrir la machine !",
  'tutorial-challenge': "Maintenant, un petit défi pour apprendre ! 🎯",
  'explore-units': "Clique sur △ pour ajouter une bille. Lève UN doigt à chaque clic!",
  'click-add': "Continue jusqu'à 9 ! Chaque clic ajoute UNE bille !",
  'click-remove': "Clique sur ∇ pour enlever les billes jusqu'à ZÉRO !",
  'done': "Génial ! Clique sur 'Commencer l'apprentissage' pour découvrir l'échange 10 pour 1 ! 🎩",
  
  // Learning phases
  'learn-units': "Regarde ! 👀 La machine compte de 1 à 9. Compte avec tes doigts !",
  'learn-carry': "Compte jusqu'à 9 en cliquant sur △ ! Quand tu arrives à 9, un clic de plus et... MAGIE ! 🎆",
  'practice-ten': "Pratique le concept de paquet ! Clique sur ∇ pour revenir à 9, puis △ pour refaire l'échange magique !",
  'learn-ten-to-twenty': "Tu as 1 paquet de 10 ! Maintenant ajoute des billes pour comprendre la COMBINAISON : 10 + 1 = 11, 10 + 2 = 12... Clique sur △ jusqu'à 20 !",
  'learn-twenty-to-thirty': "Parfait ! Tu comprends la combinaison : 1 dizaine + unités ! Maintenant un peu de pratique : remplis jusqu'à 30 pour voir l'échange magique !",
  'learn-tens': "Regarde ! 👀 La machine compte par dizaines : 40, 50, 60...",
  'learn-tens-combination': "Regarde maintenant la MAGIE des paquets ! 🎯 La machine va montrer comment assembler 1 paquet + 2 billes = DOUZE, puis 2 paquets + 5 billes = VINGT-CINQ ! C'est comme des LEGO ! 🧱",
  
  // Hundreds phases
  'practice-hundred': "Pratique le concept de GRAND paquet ! Clique sur ∇ pour revenir à 99, puis △ pour refaire l'échange magique vers 100 !",
  'learn-hundred-to-hundred-ten': "Tu as 1 GRAND paquet de 100 ! Maintenant ajoute des billes pour comprendre la COMBINAISON : 100 + 1 = 101, 100 + 2 = 102... Clique sur △ jusqu'à 120 !",
  'learn-hundred-ten-to-two-hundred': "Bravo ! Tu comprends : 1 centaine + dizaines + unités ! Pratique un peu : monte jusqu'à 200 pour voir l'échange magique !",
  'learn-two-hundred-to-three-hundred': "Remplis tout jusqu'à 299 ! Clique sur △ pour ajouter des billes !",
  'learn-hundreds': "Regarde ! 👀 La machine compte par centaines : 300, 400, 500...",
  'learn-hundreds-simple-combination': "Maintenant les GRANDS paquets de 100 ! 📦 La machine va montrer : 1 GRAND paquet = CENT, puis 1 GRAND + 1 paquet = CENT-DIX ! C'est facile d'assembler les paquets ! 🎁",
  'learn-hundreds-combination': "Maintenant on assemble TOUT ! 📦📦📦 La machine va montrer : 1 GRAND paquet + 2 paquets + 3 billes = CENT-VINGT-TROIS ! Comme une tour de LEGO avec 3 étages ! 🏗️",
  
  // Thousands phases
  'celebration-before-thousands': "🏆 BRAVO CHAMPION ! Tu maîtrises les centaines ! Maintenant, on va découvrir les MILLE ! C'est le niveau EXPERT ! 🎓 Si tu es fatigué, tu peux faire une pause. Sinon, clique sur DÉMARRER L'APPRENTISSAGE DES MILLIERS !",
  'practice-thousand': "STOP ! 🛑 Regarde bien : TOUT, TOUT, TOUT est plein ! 999 ! Que va-t-il se passer si on ajoute encore 1 toute petite bille ? Clique sur △ pour voir !",
  'learn-thousand-to-thousand-ten': "MILLE ! 1 énorme paquet ! Maintenant ajoute des billes pour comprendre la COMBINAISON : 1000 + 1 = 1001, 1000 + 2 = 1002... Clique sur △ jusqu'à 1020 !",
  'learn-thousand-to-thousand-hundred': "Super ! Tu comprends la combinaison : 1 millier + centaines + dizaines + unités ! Monte jusqu'à 1100 pour pratiquer !",
  'learn-thousand-hundred-to-two-thousand': "Excellent ! Continue à pratiquer jusqu'à 2000 pour bien comprendre les milliers !",
  'learn-two-thousand-to-three-thousand': "DEUX-MILLE ! Monte directement à 2500, puis 2900, puis 2999, puis 3000 ! Clique sur △ sur les UNITÉS !",
  'learn-thousands': "Regarde ! 👀 La machine compte par milliers : 3000, 4000, 5000... Imagine combien de billes ça fait !",
  'learn-thousands-very-simple-combination': "Les ÉNORMES paquets de 1000 ! 🎁✨ La machine va montrer : 1 ÉNORME paquet = MILLE, puis 1 ÉNORME + 1 GRAND = MILLE-CENT ! C'est magique d'assembler de si grands nombres ! 🚀",
  'learn-thousands-full-combination': "Prépare-toi pour le GRAND spectacle ! 🎪 La machine va montrer comment assembler TOUS les paquets ensemble : 1 ÉNORME + 2 GRANDS + 3 paquets + 4 billes = MILLE-DEUX-CENT-TRENTE-QUATRE ! Tu es un CHAMPION ! 🏆",
  'learn-thousands-combination': "Le niveau EXPERT ! 🎓 Regarde comment la machine assemble les plus GRANDS nombres en combinant ÉNORMES paquets + GRANDS paquets + paquets + billes ! C'est impressionnant ! 💪",
  'celebration-thousands-complete': "🏆🎉 INCROYABLE ! TU ES UN CHAMPION DES NOMBRES ! Tu sais maintenant compter jusqu'à 9999 ! Très peu d'enfants de ton âge savent faire ça ! Tu peux être très fier de toi ! 💪 Clique sur MODE LIBRE pour créer tes nombres !",
  
  // Normal mode
  'normal': "Mode exploration ! 🚀 Construis des grands nombres !",
  
  // Default
  'default': "Prépare-toi pour l'aventure des nombres !",
} as const;

// ============================================================================
// CHALLENGE INSTRUCTIONS
// Dynamic instructions for challenges based on phase, target, and progress
// ============================================================================

export const CHALLENGE_INSTRUCTIONS = {
  tutorialChallenge: (targetNumber: number) =>
    `
    Maintenant on va apprendre le challenge 
  🎯 PREMIER DÉFI : Affiche le nombre **${targetNumber}** puis clique sur VALIDER ! 
    
Essaie de le faire ! Si tu te trompes, ce n'est pas grave, tu apprendras ce qu'il se passe ! 😊`,
  
  units: (challengeIndex: number, targetNumber: number, successCount: number, totalTargets: number) =>
    `DÉFI ${challengeIndex + 1} : Affiche **${targetNumber}** puis clique sur VALIDER ! (${successCount}/${totalTargets})`,
  
  tenToTwenty: (targetNumber: number, successCount: number, totalTargets: number) =>
    `Mini-défi : Affiche **${targetNumber}** puis clique sur VALIDER ! (${successCount}/${totalTargets})`,
  
  tens: (challengeIndex: number, targetNumber: number, successCount: number, totalTargets: number) =>
    `DÉFI ${challengeIndex + 1} : Affiche **${targetNumber}** puis clique sur VALIDER ! (${successCount}/${totalTargets})`,
  
  hundredToTwoHundred: (targetNumber: number, successCount: number, totalTargets: number) =>
    `Mini-défi 100-200 : Affiche **${targetNumber}** puis clique sur VALIDER ! (${successCount}/${totalTargets})`,
  
  twoHundredToThreeHundred: (targetNumber: number, successCount: number, totalTargets: number) =>
    `Mini-défi 200-300 : Affiche **${targetNumber}** puis clique sur VALIDER ! (${successCount}/${totalTargets})`,
  
  hundreds: (challengeIndex: number, targetNumber: number, successCount: number, totalTargets: number) =>
    `DÉFI ${challengeIndex + 1} : Affiche **${targetNumber}** puis clique sur VALIDER ! (${successCount}/${totalTargets})`,
  
  thousandToTwoThousand: (targetNumber: number, successCount: number, totalTargets: number) =>
    `Mini-défi 1000-2000 ! Affiche **${targetNumber}** puis clique sur VALIDER ! (${successCount}/${totalTargets})`,
  
  twoThousandToThreeThousand: (targetNumber: number, successCount: number, totalTargets: number) =>
    `Mini-défi 2000-3000 ! Affiche **${targetNumber}** puis clique sur VALIDER ! (${successCount}/${totalTargets})`,
  
  thousandsSimpleCombination: (targetNumber: number, successCount: number, totalTargets: number) =>
    `Défi nombres RONDS ! Affiche **${targetNumber}** puis clique sur VALIDER ! (${successCount}/${totalTargets})`,
  
  thousands: (challengeIndex: number, targetNumber: number, successCount: number, totalTargets: number) => {
    const difficultyNames = ['FACILE', 'MOYEN', 'DIFFICILE'];
    return `DÉFI ${challengeIndex + 1} (${difficultyNames[challengeIndex]}) : Affiche **${targetNumber}** puis clique sur VALIDER ! (${successCount}/${totalTargets})`;
  },
} as const;

// ============================================================================
// UI MESSAGES
// Text for buttons, labels, and general interface elements
// ============================================================================

export const UI_MESSAGES = {
  buttons: {
    startLearning: {
      default: "Commencer l'apprentissage",
      thousands: "🚀 DÉMARRER L'APPRENTISSAGE DES MILLIERS",
      freeMode: "🎮 MODE LIBRE : CRÉE TES NOMBRES !",
    },
    unlock: "🔓 Débloquer la colonne suivante",
    continue: "✓ Continuer",
    validate: "✓ Valider",
  },
  
  responses: {
    machineFeedback: {
      belle: "Trop belle ! ✨",
      bof: "Bof... 😐",
      comprendsRien: "J'y comprends rien ! 🤔",
      cestQuoi: "C'est quoi ? 🧐",
    },
    secondColumn: {
      ajouterRouleau: "Ajouter un rouleau ! 🎡",
      plusGrande: "Faire une plus grande machine ! 📏",
      saisPas: "Je ne sais pas ! 🤷",
    },
  },
  
  placeholders: {
    name: "Ton prénom (optionnel)...",
    answer: "Ta réponse...",
  },
  
  attemptIndicators: {
    attempt1: "⭐ Essai 1/4",
    attempt2: "💪 Essai 2/4 - Tu peux le faire !",
    attempt3: "💡 Essai 3/4 - Voici des indices !",
    attempt4: "🤝 Besoin d'aide ?",
  },
  
  modeIndicators: {
    guided: "🤝 Mode guidé actif - Suis les instructions !",
    solution: (target: number) => `👀 Regarde bien comment on construit le nombre ${target} !`,
  },
  
  progress: (count: number) => 
    `🌟 ${count} défi${count > 1 ? 's' : ''} réussi${count > 1 ? 's' : ''} ! Continue ! 💪`,
  
  helpQuestion: "Comment veux-tu continuer ? 🤔",
  
  helpOptions: {
    tryAgain: "💪 Essayer encore tout seul !",
    guided: "🤝 Aide-moi à le faire !",
    showSolution: "👀 Montre-moi la solution !",
  },
  
  assistantTitle: "Assistant Pédagogique",
} as const;

// ============================================================================
// FEEDBACK MESSAGES
// Messages for various attempt levels and error types
// ============================================================================

export const FEEDBACK_MESSAGES = {
  // First attempt - Simple encouragement based on proximity
  attempt1: {
    'very-close': [
      "Ooh ! Tu es TOUT PROCHE ! 🔥",
      "Tu y es presque ! Continue !",
      "C'est presque ça ! Tu brûles !"
    ],
    'close': [
      "Pas mal ! Tu n'es pas loin ! 👍",
      "Presque ! Essaie encore !",
      "Tu t'approches ! Réessaie !"
    ],
    'medium': [
      "Ce n'est pas encore ça, mais continue ! 💪",
      "Pas tout à fait ! Essaie à nouveau !",
      "Hmm, pas encore ! Réfléchis bien !"
    ],
    'far': [
      "Ce n'est pas le bon nombre, mais c'est normal ! 😊",
      "Oups ! Réessaie, tu peux le faire !",
      "Pas encore ! Regarde bien les colonnes !"
    ],
    'very-far': [
      "Ce n'est pas ça, mais ne t'inquiète pas ! 🌟",
      "Oups ! Prends ton temps et réessaie !",
      "Pas le bon nombre, mais tu vas trouver !"
    ]
  },
  
  // Second attempt - Error-specific hints
  attempt2: {
    errorTypes: {
      column: "Attention ! Les chiffres sont bons mais pas à la bonne place ! 🔄\nRegarde bien les COLONNES : Milliers, Centaines, Dizaines, Unités ! 👀",
      composition: "Tu as commencé, mais il manque des choses ! 🧩\nN'oublie pas de remplir TOUTES les colonnes nécessaires ! 📊",
      magnitude: "Attention à l'ordre de grandeur ! 🔍\nRegarde combien de colonnes tu dois utiliser ! 📏",
      directionUp: "C'est trop petit ! 📈\nLe nombre est PLUS GRAND que ça !\nMonte ! Utilise △ !",
      directionDown: "C'est un peu trop grand ! 📉\nLe nombre est PLUS PETIT que ça !\nDescends ! Utilise ∇ !",
      randomUp: "Le nombre est beaucoup PLUS GRAND ! 📈\nRecommence tranquillement ! 😊",
      randomDown: "Le nombre est beaucoup PLUS PETIT ! 📉\nRecommence tranquillement ! 😊",
    },
    rangeHint: (lowerBound: number, upperBound: number) =>
      `\n\n💡 Indice : Le nombre est entre ${lowerBound} et ${upperBound} !`,
  },
  
  // Third attempt - Decomposition guidance
  attempt3: {
    units: (units: number) =>
      `Il faut ${units} bille${units > 1 ? 's' : ''} dans la colonne UNITÉS ! 
Compte sur tes doigts : ${units} doigt${units > 1 ? 's' : ''} = ${units} bille${units > 1 ? 's' : ''} ! ✋
Regarde : ${units} petite${units > 1 ? 's' : ''} lumière${units > 1 ? 's' : ''} dans la colonne de DROITE ! 💡`,
    
    tens: (tens: number, units: number, target: number) =>
      `C'est une COMBINAISON ! 🧩
    
On assemble des paquets comme des LEGO ! 🧱

Il faut :
- ${tens} paquet${tens > 1 ? 's' : ''} de 10 dans les DIZAINES = ${tens * 10}
- ${units} bille${units > 1 ? 's' : ''} dans les UNITÉS = ${units}

COMBINAISON : ${tens * 10} + ${units} = ${target} ! 🎯

C'est comme dire : ${tens} paquet${tens > 1 ? 's' : ''} ET ${units} bille${units > 1 ? 's' : ''} !
Maintenant construis ce nombre ! 🔨`,
    
    hundreds: (hundreds: number, tens: number, units: number, target: number) =>
      `C'est une COMBINAISON ! 🧩
    
On assemble 3 types de paquets ! 📦📦📦

Il faut :
- ${hundreds} GRAND${hundreds > 1 ? 'S' : ''} paquet${hundreds > 1 ? 's' : ''} de 100 = ${hundreds * 100}
- ${tens} paquet${tens > 1 ? 's' : ''} de 10 = ${tens * 10}
- ${units} bille${units > 1 ? 's' : ''} = ${units}

COMBINAISON : ${hundreds * 100} + ${tens * 10} + ${units} = ${target} ! 🎯

C'est comme dire : ${hundreds} grand${hundreds > 1 ? 's' : ''} paquet${hundreds > 1 ? 's' : ''} ET ${tens} paquet${tens > 1 ? 's' : ''} ET ${units} bille${units > 1 ? 's' : ''} !
Assemble ces paquets ensemble ! 🔨`,
    
    thousands: (thousands: number, hundreds: number, tens: number, units: number, target: number) =>
      `C'est une GRANDE COMBINAISON ! 🧩
  
On assemble 4 types de paquets ! 📦📦📦📦

Il faut :
- ${thousands} paquet${thousands > 1 ? 's' : ''} GÉANT${thousands > 1 ? 'S' : ''} de 1000 = ${thousands * 1000}
- ${hundreds} GRAND${hundreds > 1 ? 'S' : ''} paquet${hundreds > 1 ? 's' : ''} de 100 = ${hundreds * 100}
- ${tens} paquet${tens > 1 ? 's' : ''} de 10 = ${tens * 10}
- ${units} bille${units > 1 ? 's' : ''} = ${units}

COMBINAISON : ${thousands * 1000} + ${hundreds * 100} + ${tens * 10} + ${units} = ${target} ! 🎯

C'est comme assembler des paquets de différentes tailles ! 📦
Prends ton temps et construis ce nombre ! 🔨`,
  },
  
  // Fourth attempt - Offer help
  attempt4: `C'est un nombre difficile celui-là, hein ? 😊
Pas de problème ! Même les grands ont du mal parfois ! 🤗
Tu as fait de ton mieux, bravo d'avoir essayé ! 👏
Maintenant, je vais t'aider à réussir ! 🤝

Comment veux-tu continuer ? 🤔`,
} as const;

// ============================================================================
// SUCCESS MESSAGES
// Celebration messages based on attempt count and guidance
// ============================================================================

export const SUCCESS_MESSAGES = {
  guided: [
    "BRAVO ! Tu as appris comment faire ! 🤝",
    "SUPER ! Maintenant tu sais ! 💡",
    "TU AS RÉUSSI ! Avec un peu d'aide, c'est OK ! 🌟",
    "L'important c'est de COMPRENDRE ! Bravo ! 🎉"
  ],
  
  attempt1: [
    "WAOUH ! DU PREMIER COUP ! 🎯🎯🎯",
    "INCROYABLE ! Tu es un PRO ! 🏆",
    "PARFAIT ! Tu as tout compris ! ⭐⭐⭐",
    "CHAMPION ! Du premier coup ! 💪"
  ],
  
  attempt2: [
    "BRAVO ! Tu as réussi ! 🎉",
    "SUPER ! 2ème essai et c'est bon ! 👍",
    "TU L'AS EU ! Bien joué ! ⭐"
  ],
  
  attempt3: [
    "BRAVO ! Tu as persévéré ! 💪",
    "TU AS RÉUSSI ! Tu n'as pas abandonné ! 🌟",
    "GÉNIAL ! La persévérance paie ! 🏆"
  ],
  
  attempt4Plus: (attemptCount: number) => [
    "YESSS ! TU L'AS EU ! 🎉🎉🎉",
    "Tu n'as pas abandonné ! BRAVO ! 🏆",
    `${attemptCount} essais mais tu as réussi ! CHAMPION ! 💪`
  ],
} as const;

// ============================================================================
// GUIDED MODE MESSAGES
// Messages for step-by-step guided construction
// ============================================================================

export const GUIDED_MESSAGES = {
  start: `On va le construire ENSEMBLE ! 🤝
Je vais te guider colonne par colonne !
Tu fais exactement ce que je te dis, d'accord ? 😊`,
  
  step: {
    thousands: (target: number) =>
      `ÉTAPE 1/4 : Les MILLIERS\n(La colonne de GAUCHE)\n\nIl faut ${target} paquet${target > 1 ? 's' : ''} GÉANT${target > 1 ? 'S' : ''} !\n\n`,
    
    hundreds: (target: number) =>
      `ÉTAPE 2/4 : Les CENTAINES\n(La 2ème colonne en partant de la gauche)\n\nIl faut ${target} grand${target > 1 ? 's' : ''} paquet${target > 1 ? 's' : ''} !\n\n`,
    
    tens: (target: number) =>
      `ÉTAPE 3/4 : Les DIZAINES\n(La 3ème colonne)\n\nIl faut ${target} paquet${target > 1 ? 's' : ''} !\n\n`,
    
    units: (target: number) =>
      `ÉTAPE 4/4 : Les UNITÉS\n(La dernière colonne à DROITE)\n\nIl faut ${target} bille${target > 1 ? 's' : ''} !\n\n`,
    
    action: {
      increase: (clicks: number, columnName: string) =>
        `Clique ${clicks} FOIS sur △ dans la colonne des ${columnName} !`,
      decrease: (clicks: number, columnName: string) =>
        `Clique ${clicks} FOIS sur ∇ dans la colonne des ${columnName} !`,
    },
  },
  
  clickFeedback: {
    perfect: "PARFAIT ! ✅\nOn passe à l'étape suivante ! ➡️",
    almostDone: "Encore un ! 💪",
    continue: (remaining: number) => `${remaining} ! Continue ! 👍`,
  },
  
  completion: (target: number, breakdown: string) =>
    `🎉🎉🎉 BRAVO ! TU L'AS CONSTRUIT ! 🎉🎉🎉

${target} ! TU L'AS FAIT ! 🏗️

Tu vois ? ENSEMBLE on y arrive ! 🤝

Tu as fait :
${breakdown}
= ${target} ! PARFAIT ! ✅

Maintenant tu sais comment faire ! 💡
Le prochain, tu pourras le faire TOUT SEUL ! 💪`,
} as const;

// ============================================================================
// SOLUTION ANIMATION MESSAGES
// Messages shown during solution animation
// ============================================================================

export const SOLUTION_MESSAGES = {
  step: {
    thousands: (value: number, runningTotal: number) =>
      `D'abord, ${value} paquet${value > 1 ? 's' : ''} GÉANT${value > 1 ? 'S' : ''} dans les MILLIERS !\n${runningTotal} ! ✨`,
    
    hundreds: (value: number, runningTotal: number) =>
      `Ensuite, ${value} grand${value > 1 ? 's' : ''} paquet${value > 1 ? 's' : ''} dans les CENTAINES !\n${runningTotal} ! ✨`,
    
    tens: (value: number, runningTotal: number) =>
      `Puis, ${value} paquet${value > 1 ? 's' : ''} dans les DIZAINES !\n${runningTotal} ! ✨`,
    
    units: (value: number, runningTotal: number) =>
      `Enfin, ${value} bille${value > 1 ? 's' : ''} dans les UNITÉS !\n${runningTotal} ! ✨`,
  },
} as const;

// ============================================================================
// HELP CHOICE MESSAGES
// Messages for different help options
// ============================================================================

export const HELP_CHOICE_MESSAGES = {
  tryAgain: (target: number, decomp: { thousands: number; hundreds: number; tens: number; units: number }) =>
    `D'accord champion ! Dernier essai ! 🎯
Je laisse TOUS les indices affichés pour t'aider !

RAPPEL : Il faut faire ${target}

DÉCOMPOSITION :
${decomp.thousands > 0 ? `- ${decomp.thousands} milliers = ${decomp.thousands * 1000}\n` : ''}${decomp.hundreds > 0 ? `- ${decomp.hundreds} centaines = ${decomp.hundreds * 100}\n` : ''}${decomp.tens > 0 ? `- ${decomp.tens} dizaines = ${decomp.tens * 10}\n` : ''}${decomp.units > 0 ? `- ${decomp.units} unités = ${decomp.units}\n` : ''}
TOTAL = ${target}

Tu peux le faire ! Je crois en toi ! ⭐
Prends ton temps ! Pas de pression ! 😊`,
  
  showSolution: (target: number) =>
    `D'accord ! Je vais te MONTRER comment construire ${target} ! 👀
Regarde bien chaque étape ! ✨
C'est comme une RECETTE de cuisine ! 👨‍🍳`,
} as const;

// ============================================================================
// FRUSTRATION MESSAGES
// Messages for different frustration levels
// ============================================================================

export const FRUSTRATION_MESSAGES = {
  low: `Hey ! 🤗
Je vois que ces défis sont un peu difficiles !
C'est NORMAL ! Tu apprends des choses compliquées ! 📚
Tu veux faire une petite pause ou continuer ? 😊`,
  
  medium: `STOP ! On fait une pause ! 🛑
Tu travailles depuis longtemps ! ⏰
Tu as besoin d'une pause !
Choisis ce que tu veux faire :`,
  
  high: `Hey ! 🤗 Je vois que tu as beaucoup de mal...
C'est VRAIMENT difficile ce que tu essaies de faire !
Même des enfants plus grands ont du mal ! 😊
Tu as déjà fait BEAUCOUP ! Tu peux être fier de toi ! 🏆
Je pense qu'on devrait choisir ensemble comment continuer :`,
} as const;

// ============================================================================
// SEQUENCE FEEDBACK MESSAGES
// Two-part feedback messages used in sequenceFeedback
// ============================================================================

export const SEQUENCE_FEEDBACK = {
  learnUnits: {
    part1: "C'est parti ! 🎉 La machine va compter de 1 à 9 !",
    part2: "Observe bien les billes ! Compte avec tes doigts !",
  },
  
  practiceThousand: {
    part1: "STOP ! 🛑 Regarde bien : TOUT, TOUT, TOUT est plein !",
    part2: "9 GRANDS paquets + 9 paquets + 9 billes. C'est le MAXIMUM ! Que va-t-il se passer si on ajoute encore 1 toute petite bille ? Clique sur △",
  },
  
  normalMode: {
    part1: "Mode libre activé ! 🚀",
    part2: "Tu peux maintenant créer TOUS les nombres que tu veux jusqu'à 9999 !",
  },
  
  unlockHundreds: {
    part1: "NIVEAU DÉBLOQUÉ : Les CENTAINES ! 💯",
    part2: "Regarde ! 👀 La machine va compter par centaines : 100, 200, 300... !",
  },
  
  unlockThousands: {
    part1: "NIVEAU MAXIMUM : Les MILLIERS ! 🎉",
    part2: "Regarde ! 👀 La machine va compter par milliers : 1000, 2000, 3000... !",
  },
} as const;

// ============================================================================
// ERROR MESSAGES
// Error and warning messages
// ============================================================================

export const ERROR_MESSAGES = {
  mustCompleteTens: "⚠️ Tu dois d'abord compléter le défi des dizaines !",
  mustMasterTens: "⚠️ Tu dois d'abord maîtriser les dizaines !",
  mustMasterHundreds: "⚠️ Tu dois d'abord maîtriser les centaines !",
} as const;

// ============================================================================
// COLUMN NAMES
// Names for the different columns
// ============================================================================

export const COLUMN_NAMES = {
  0: 'UNITÉS',
  1: 'DIZAINES',
  2: 'CENTAINES',
  3: 'MILLIERS',
} as const;

export const COLUMN_EMOJIS = {
  0: '🔵',
  1: '📦',
  2: '📦📦',
  3: '📦📦📦',
} as const;
