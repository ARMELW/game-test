import { useCallback, useEffect, useState } from 'react';
import { speechToTextService, type SpeechResult, type SpeechToTextConfig } from '../services/speech/speech-to-text';

export interface UseSpeechToTextOptions {
  config?: Partial<SpeechToTextConfig>;
  autoStart?: boolean;
  onResult?: (result: SpeechResult) => void;
  onError?: (error: string) => void;
}

export interface UseSpeechToTextReturn {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  confidence: number;
  error: string | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
  reset: () => void;
}

/**
 * Hook React pour utiliser le service de reconnaissance vocale
 * @param options Configuration et callbacks
 * @returns Objet avec l'état et les méthodes de contrôle
 */
export function useSpeechToText(options: UseSpeechToTextOptions = {}): UseSpeechToTextReturn {
  const { config, autoStart = false, onResult, onError } = options;

  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isSupported = speechToTextService.isSupported();

  const reset = useCallback(() => {
    setTranscript('');
    setConfidence(0);
    setError(null);
  }, []);

  const start = useCallback(() => {
    if (!isSupported) {
      const errorMsg = 'Speech Recognition not supported in this browser';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    reset();
    speechToTextService.start();
  }, [isSupported, onError, reset]);

  const stop = useCallback(() => {
    speechToTextService.stop();
  }, []);

  const abort = useCallback(() => {
    speechToTextService.abort();
  }, []);

  useEffect(() => {
    if (config) {
      speechToTextService.setConfig(config);
    }

    speechToTextService.setCallbacks({
      onStart: () => {
        setIsListening(true);
        setError(null);
      },
      onEnd: () => {
        setIsListening(false);
      },
      onResult: (result: SpeechResult) => {
        if (result.isFinal) {
          setTranscript(prev => prev + result.transcript + ' ');
          setConfidence(result.confidence);
        } else {
          // Pour les résultats intermédiaires, on peut les afficher différemment
          setTranscript(prev => {
            const finalPart = prev.split(' ').slice(0, -1).join(' ');
            return finalPart + (finalPart ? ' ' : '') + result.transcript;
          });
        }
        onResult?.(result);
      },
      onError: (errorMsg: string) => {
        setError(errorMsg);
        setIsListening(false);
        onError?.(errorMsg);
      }
    });

    // Auto-start si demandé
    if (autoStart && isSupported) {
      start();
    }

    // Cleanup à la fin
    return () => {
      if (speechToTextService.getIsListening()) {
        speechToTextService.abort();
      }
    };
  }, [config, autoStart, isSupported, onResult, onError, start]);

  return {
    transcript: transcript.trim(),
    isListening,
    isSupported,
    confidence,
    error,
    start,
    stop,
    abort,
    reset
  };
}

// Hook simplifié pour un usage basique
export function useVoiceRecognition(language = 'fr-FR') {
  return useSpeechToText({
    config: {
      language,
      continuous: true,
      interimResults: true
    }
  });
}
