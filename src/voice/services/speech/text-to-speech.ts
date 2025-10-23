import { defaultPersonaConfig, type PersonaConfig } from './persona.types';

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
    
    // Test simple pour voir si les voix se chargent
    console.log('[TTS] Constructor - Voix disponibles immédiatement :', this.getVoices().length);
    
    // Attendre le chargement des voix
    setTimeout(() => {
      console.log('[TTS] Après 1s - Voix disponibles :', this.getVoices().length);
    }, 1000);
    
    this.synthesis.onvoiceschanged = () => {
      console.log('[TTS] onvoiceschanged - Voix disponibles :', this.getVoices().length);
    };
  }

  /**
   * Test simple de synthèse vocale
   */
  testSpeak(): void {
    console.log('[TTS] testSpeak() appelé');
    const utterance = new SpeechSynthesisUtterance('Bonjour test');
    utterance.onstart = () => console.log('[TTS] Test onstart');
    utterance.onend = () => console.log('[TTS] Test onend');
    utterance.onerror = (e) => console.log('[TTS] Test onerror:', e);
    this.synthesis.speak(utterance);
    console.log('[TTS] synthesis.speak() appelé pour test');
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

    // Capture callbacks in closure to avoid race condition when stop() is called
    // This ensures each utterance has its own callback references
    const capturedCallbacks = { ...this.callbacks };

    // Événements
    utterance.onstart = () => {
      capturedCallbacks.onStart?.();
    };

    utterance.onend = () => {
      // Only process if this utterance is still the current one
      if (this.currentUtterance === utterance) {
        this.currentUtterance = null;
        this.callbacks = {};
      }
      capturedCallbacks.onEnd?.();
    };

    utterance.onerror = (event) => {
      // Only process if this utterance is still the current one
      if (this.currentUtterance === utterance) {
        this.currentUtterance = null;
        this.callbacks = {};
      }
      capturedCallbacks.onError?.(event.error);
    };

    utterance.onpause = () => {
      capturedCallbacks.onPause?.();
    };

    utterance.onresume = () => {
      capturedCallbacks.onResume?.();
    };

    return utterance;
  }

  setCallbacks(callbacks: TextToSpeechCallbacks) {
    // Replace callbacks instead of merging to avoid callback pollution from previous utterances
    this.callbacks = callbacks;
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
      console.warn('[TTS] Texte vide, rien à lire.');
      this.callbacks.onError?.('Texte vide');
      return;
    }
    if (!this.isSupported()) {
      console.error('[TTS] Synthèse vocale non supportée.');
      this.callbacks.onError?.('Synthèse non supportée');
      return;
    }
    console.log('[TTS] speak() appelé avec :', text);
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
