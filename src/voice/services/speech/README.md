# Utilitaire Speech-to-Text Global

Un système complet de reconnaissance vocale pour le site Meko Academy.

## Installation et Configuration

L'utilitaire est déjà configuré et prêt à l'emploi. Il utilise l'API Web Speech Recognition du navigateur.

## Utilisation Simple

### 1. Fonction globale `listen()`

```typescript
import { listen, isVoiceSupported } from '@/speech';

// Vérifier le support
if (isVoiceSupported()) {
  try {
    // Écouter une fois et récupérer le texte
    const text = await listen({
      language: 'fr-FR',
      timeout: 10000 // 10 secondes max
    });
    console.log('Texte reconnu:', text);
  } catch (error) {
    console.error('Erreur:', error);
  }
}
```

### 2. Hook React `useSpeechToText`

```typescript
import { useSpeechToText } from '@/speech';

function MonComposant() {
  const {
    transcript,
    isListening,
    start,
    stop,
    reset
  } = useSpeechToText({
    config: { language: 'fr-FR' },
    onResult: (result) => {
      console.log('Résultat:', result.transcript);
    }
  });

  return (
    <div>
      <button onClick={start}>Démarrer</button>
      <button onClick={stop}>Arrêter</button>
      <p>Texte: {transcript}</p>
    </div>
  );
}
```

### 3. Composant prêt à l'emploi `QuickVoiceInput`

```typescript
import { QuickVoiceInput } from '@/speech';

function MonFormulaire() {
  return (
    <form>
      <QuickVoiceInput 
        placeholder="Parlez pour remplir ce champ..."
        onTranscript={(text) => {
          console.log('Transcription:', text);
          // Utiliser le texte dans votre formulaire
        }}
      />
    </form>
  );
}
```

## API Complète

### Service Principal

```typescript
import { speechToTextService } from '@/speech';

// Configuration
speechToTextService.setConfig({
  language: 'fr-FR',
  continuous: true,
  interimResults: true
});

// Callbacks
speechToTextService.setCallbacks({
  onResult: (result) => console.log(result),
  onError: (error) => console.error(error)
});

// Contrôle
speechToTextService.start();
speechToTextService.stop();
```

### Helper Avancé

```typescript
import { voiceHelper } from '@/speech';

// Écoute avec callbacks intermédiaires
const text = await voiceHelper.listen({
  language: 'fr-FR',
  timeout: 15000,
  onInterim: (interimText) => {
    // Afficher le texte en cours de reconnaissance
    console.log('En cours:', interimText);
  },
  onStart: () => console.log('Écoute démarrée'),
  onEnd: () => console.log('Écoute terminée')
});
```

## Exemples d'Usage

### Dans un jeu Unity

```typescript
import { listen } from '@/speech';

async function handleVoiceCommand() {
  try {
    const command = await listen({
      language: 'fr-FR',
      timeout: 5000
    });
    
    // Traiter la commande vocale
    if (command.includes('oui') || command.includes('valider')) {
      // Valider l'action
      handleValidation();
    }
  } catch (error) {
    console.error('Commande vocale échouée:', error);
  }
}
```

### Dans un formulaire

```typescript
import { useSpeechToText } from '@/speech';

function VoiceForm() {
  const [name, setName] = useState('');
  const { transcript, isListening, start, stop, reset } = useSpeechToText({
    onResult: (result) => {
      if (result.isFinal) {
        setName(result.transcript);
        stop();
      }
    }
  });

  return (
    <div>
      <input 
        type="text" 
        value={name || transcript} 
        onChange={(e) => setName(e.target.value)}
        placeholder="Votre nom"
      />
      <button onClick={isListening ? stop : start}>
        {isListening ? '🛑 Arrêter' : '🎤 Parler'}
      </button>
      <button onClick={reset}>Effacer</button>
    </div>
  );
}
```

## Configuration Avancée

### Langues supportées

- `fr-FR` - Français (France)
- `en-US` - Anglais (États-Unis)
- `es-ES` - Espagnol (Espagne)
- `de-DE` - Allemand (Allemagne)
- Et bien d'autres...

### Options de configuration

```typescript
{
  language: 'fr-FR',           // Langue de reconnaissance
  continuous: true,            // Reconnaissance continue
  interimResults: true,        // Résultats intermédiaires
  maxAlternatives: 1           // Nombre d'alternatives max
}
```

## Support Navigateur

La reconnaissance vocale est supportée sur :
- Chrome (desktop et mobile)
- Edge
- Safari (partiel)
- Firefox (expérimental)

Vérifiez toujours le support avec `isVoiceSupported()`.

## Gestion d'Erreurs

```typescript
import { listen } from '@/speech';

try {
  const text = await listen();
  // Utiliser le texte
} catch (error) {
  switch (error.message) {
    case 'Reconnaissance vocale non supportée':
      // Fallback : afficher un clavier virtuel
      break;
    case 'Timeout: reconnaissance vocale trop longue':
      // Proposer de réessayer
      break;
    default:
      console.error('Erreur inconnue:', error);
  }
}
```
