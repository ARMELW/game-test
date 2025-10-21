import { speechToTextService } from '../services/speech/speech-to-text';
import { textToSpeechService } from '../services/speech/text-to-speech';

/**
 * Utilitaire simple pour déclencher la reconnaissance vocale
 * Utilisation directe sans hook React
 */
export class VoiceHelper {
  private static instance: VoiceHelper;
  private isActive = false;

  static getInstance(): VoiceHelper {
    if (!VoiceHelper.instance) {
      VoiceHelper.instance = new VoiceHelper();
    }
    return VoiceHelper.instance;
  }

  /**
   * Fonction principale pour faire parler (reconnaissance vocale)
   * @param options Configuration pour la reconnaissance
   * @returns Promise qui se résout avec le texte reconnu
   */
  async listen(options: {
    language?: string;
    timeout?: number;
    onInterim?: (text: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
  } = {}): Promise<string> {
    const {
      language = 'fr-FR',
      timeout = 10000,
      onInterim,
      onStart,
      onEnd
    } = options;

    if (!speechToTextService.isSupported()) {
      throw new Error('Reconnaissance vocale non supportée');
    }

    if (this.isActive) {
      throw new Error('Une reconnaissance vocale est déjà en cours');
    }

    return new Promise((resolve, reject) => {
      let finalTranscript = '';
      let timeoutId: NodeJS.Timeout;

      this.isActive = true;

      // Configuration
      speechToTextService.setConfig({
        language,
        continuous: false,
        interimResults: true,
        maxAlternatives: 1
      });

      // Timeout
      if (timeout > 0) {
        timeoutId = setTimeout(() => {
          speechToTextService.abort();
          this.isActive = false;
          reject(new Error('Timeout: reconnaissance vocale trop longue'));
        }, timeout);
      }

      // Callbacks
      speechToTextService.setCallbacks({
        onStart: () => {
          onStart?.();
        },
        onEnd: () => {
          this.isActive = false;
          onEnd?.();
          if (timeoutId) clearTimeout(timeoutId);
          resolve(finalTranscript.trim());
        },
        onResult: (result) => {
          if (result.isFinal) {
            finalTranscript += result.transcript + ' ';
          } else {
            onInterim?.(result.transcript);
          }
        },
        onError: (error) => {
          this.isActive = false;
          if (timeoutId) clearTimeout(timeoutId);
          reject(new Error(`Erreur de reconnaissance: ${error}`));
        }
      });

      // Démarrer
      speechToTextService.start();
    });
  }

  /**
   * Fait lire un texte par le navigateur (synthèse vocale)
   */
  speak(text: string, options: {
    language?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
  } = {}): void {
    const {
      language = 'fr-FR',
      rate = 1,
      pitch = 1,
      volume = 1,
      onStart,
      onEnd,
      onError
    } = options;

    // Configuration
    textToSpeechService.setConfig({
      language,
      rate,
      pitch,
      volume
    });

    // Callbacks
    textToSpeechService.setCallbacks({
      onStart,
      onEnd,
      onError
    });

    // Lire le texte
    textToSpeechService.speak(text);
  }

  /**
   * Arrête la lecture en cours
   */
  stopSpeaking(): void {
    textToSpeechService.stop();
  }

  /**
   * Met en pause la lecture
   */
  pauseSpeaking(): void {
    textToSpeechService.pause();
  }

  /**
   * Reprend la lecture
   */
  resumeSpeaking(): void {
    textToSpeechService.resume();
  }

  /**
   * Arrête la reconnaissance en cours
   */
  stop(): void {
    if (this.isActive) {
      speechToTextService.stop();
      this.isActive = false;
    }
  }

  /**
   * Abandonne la reconnaissance en cours
   */
  abort(): void {
    if (this.isActive) {
      speechToTextService.abort();
      this.isActive = false;
    }
  }

  /**
   * Vérifie si la reconnaissance vocale est supportée
   */
  isSupported(): boolean {
    return speechToTextService.isSupported();
  }

  /**
   * Vérifie si la synthèse vocale est supportée
   */
  isSpeechSupported(): boolean {
    return textToSpeechService.isSupported();
  }

  /**
   * Vérifie si une reconnaissance est en cours
   */
  isListening(): boolean {
    return this.isActive;
  }

  /**
   * Vérifie si une lecture est en cours
   */
  isSpeaking(): boolean {
    return textToSpeechService.getStatus().speaking;
  }
}

// Instance globale pour utilisation directe
export const voiceHelper = VoiceHelper.getInstance();

/**
 * Fonction utilitaire simple pour faire une reconnaissance vocale
 * Usage: const text = await listen();
 */
export async function listen(options?: {
  language?: string;
  timeout?: number;
  onInterim?: (text: string) => void;
}): Promise<string> {
  return voiceHelper.listen(options);
}

/**
 * Fonction utilitaire simple pour faire lire un texte
 * Usage: speak("Bonjour tout le monde");
 */
export function speak(text: string, options?: {
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}): void {
  voiceHelper.speak(text, options);
}

/**
 * Fonction utilitaire pour arrêter la reconnaissance
 */
export function stopListening(): void {
  voiceHelper.stop();
}

/**
 * Fonction utilitaire pour arrêter la lecture
 */
export function stopSpeaking(): void {
  voiceHelper.stopSpeaking();
}

/**
 * Vérifie si la reconnaissance vocale est supportée
 */
export function isVoiceSupported(): boolean {
  return voiceHelper.isSupported();
}

/**
 * Vérifie si la synthèse vocale est supportée
 */
export function isSpeechSupported(): boolean {
  return voiceHelper.isSpeechSupported();
}
