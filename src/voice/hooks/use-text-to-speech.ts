import { useCallback, useEffect, useState } from 'react';
import { textToSpeechService, type TextToSpeechConfig } from '../services/speech/text-to-speech';
import { PersonaLanguage } from '../services/speech/persona.types';

export interface UseTextToSpeechOptions {
  config?: Partial<TextToSpeechConfig>;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  speaking: boolean;
  paused: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
}

/**
 * Hook React pour utiliser la synthèse vocale
 */
export function useTextToSpeech(options: UseTextToSpeechOptions = {}): UseTextToSpeechReturn {
  const { config, onStart, onEnd, onError } = options;

  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const isSupported = textToSpeechService.isSupported();

  const speak = useCallback((text: string) => {
    if (!isSupported) {
      const errorMsg = 'Synthèse vocale non supportée dans ce navigateur';
      onError?.(errorMsg);
      return;
    }

    textToSpeechService.speak(text);
  }, [isSupported, onError]);

  const pause = useCallback(() => {
    textToSpeechService.pause();
  }, []);

  const resume = useCallback(() => {
    textToSpeechService.resume();
  }, []);

  const stop = useCallback(() => {
    textToSpeechService.stop();
  }, []);

  useEffect(() => {
    if (config) {
      textToSpeechService.setVoiceConfig(config);
    }

    textToSpeechService.setCallbacks({
      onStart: () => {
        setSpeaking(true);
        setPaused(false);
        onStart?.();
      },
      onEnd: () => {
        setSpeaking(false);
        setPaused(false);
        onEnd?.();
      },
      onError: (error: string) => {
        setSpeaking(false);
        setPaused(false);
        onError?.(error);
      },
      onPause: () => {
        setPaused(true);
      },
      onResume: () => {
        setPaused(false);
      }
    });

    // Charger les voix disponibles
    const loadVoices = () => {
      setVoices(textToSpeechService.getVoices());
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Cleanup
    return () => {
      textToSpeechService.stop();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [config, onStart, onEnd, onError]);

  return {
    speak,
    pause,
    resume,
    stop,
    speaking,
    paused,
    isSupported,
    voices
  };
}

/**
 * Hook simplifié pour lire du texte
 */
export function useVoiceReader(language = 'fr-FR') {
  const tts = useTextToSpeech({
    config: {
      rate: 1,
      pitch: 1,
      volume: 1
    }
  });
  
  // Set persona language separately
  useEffect(() => {
    // Map string to PersonaLanguage enum
    const langEnum = language === 'en-US' ? PersonaLanguage.Anglais : PersonaLanguage.Francais;
    textToSpeechService.setPersona({
      language: langEnum
    });
  }, [language]);
  
  return tts;
}
