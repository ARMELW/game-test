import { defaultPersonaConfig, PersonaConfig } from './persona.types';

/**
 * Service global de synthèse vocale (Text-to-Speech)
 * Utilise l'API Web Speech Synthesis
 */

export interface TextToSpeechConfig {
  voice?: string;
  rate?: number; // Vitesse (0.1 à 10)
  pitch?: number; // Hauteur (0 à 2)
  volume?: number; // Volume (0 à 1)
}

export interface TextToSpeechCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onPause?: () => void;
  onResume?: () => void;
}

class TextToSpeechService {
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private callbacks: TextToSpeechCallbacks = {};
  private voiceConfig: TextToSpeechConfig = {
    rate: 1,
    pitch: 1,
    volume: 1
  };
  private personaConfig: PersonaConfig = defaultPersonaConfig;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  private createUtterance(text: string): SpeechSynthesisUtterance {
    const utterance = new SpeechSynthesisUtterance(text);

    // Configuration de la voix
    utterance.lang = this.personaConfig.language;
    utterance.rate = this.voiceConfig.rate || 1;
    utterance.pitch = this.voiceConfig.pitch || 1;
    utterance.volume = this.voiceConfig.volume || 1;

    // Sélection de la voix si spécifiée
    if (this.voiceConfig.voice) {
      const voices = this.getVoices();
      const selectedVoice = voices.find(
        voice =>
          voice.name === this.voiceConfig.voice ||
          voice.lang === this.voiceConfig.voice
      );
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    // Événements
    utterance.onstart = () => {
      this.callbacks.onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      this.callbacks.onEnd?.();
    };

    utterance.onerror = (event) => {
      this.currentUtterance = null;
      this.callbacks.onError?.(event.error);
    };

    utterance.onpause = () => {
      this.callbacks.onPause?.();
    };

    utterance.onresume = () => {
      this.callbacks.onResume?.();
    };

    return utterance;
  }

  setCallbacks(callbacks: TextToSpeechCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  setVoiceConfig(config: Partial<TextToSpeechConfig>) {
    this.voiceConfig = { ...this.voiceConfig, ...config };
  }

  setPersona(config: Partial<PersonaConfig>) {
    this.personaConfig = { ...this.personaConfig, ...config };
  }

  getPersona(): PersonaConfig {
    return this.personaConfig;
  }

  /**
   * Fait lire un texte par le navigateur
   */
  speak(text: string): void {
    if (!text.trim()) {
      this.callbacks.onError?.('Texte vide');
      return;
    }

    // Arrêter la lecture en cours
    this.stop();

    // Créer et lancer la nouvelle lecture
    this.currentUtterance = this.createUtterance(text);
    this.synthesis.speak(this.currentUtterance);
  }

  /**
   * Met en pause la lecture en cours
   */
  pause(): void {
    if (this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  /**
   * Reprend la lecture en pause
   */
  resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  /**
   * Arrête complètement la lecture
   */
  stop(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  /**
   * Récupère les voix disponibles
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }

  /**
   * Récupère les voix pour une langue donnée
   */
  getVoicesForLanguage(language: string): SpeechSynthesisVoice[] {
    return this.getVoices().filter(voice => voice.lang.startsWith(language));
  }

  /**
   * État de la synthèse vocale
   */
  getStatus() {
    return {
      speaking: this.synthesis.speaking,
      paused: this.synthesis.paused,
      pending: this.synthesis.pending,
      hasCurrentUtterance: this.currentUtterance !== null
    };
  }

  /**
   * Vérifie si la synthèse vocale est supportée
   */
  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

// Instance globale
export const textToSpeechService = new TextToSpeechService();
