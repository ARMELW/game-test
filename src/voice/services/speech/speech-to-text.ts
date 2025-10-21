/**
 * Service global de reconnaissance vocale (Speech-to-Text)
 * Utilise l'API Web Speech Recognition
 */

// Types pour l'API Web Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  
  class SpeechRecognition extends EventTarget {
    continuous: boolean;
    grammars: SpeechGrammarList;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    serviceURI: string;
    
    onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
    onend: ((this: SpeechRecognition, ev: Event) => void) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
    
    start(): void;
    stop(): void;
    abort(): void;
  }
  
  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
  }
  
  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }
  
  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }
  
  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }
  
  interface SpeechGrammarList {
    readonly length: number;
    item(index: number): SpeechGrammar;
    [index: number]: SpeechGrammar;
    addFromURI(src: string, weight?: number): void;
    addFromString(string: string, weight?: number): void;
  }
  
  interface SpeechGrammar {
    src: string;
    weight: number;
  }
}

export interface SpeechToTextConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export interface SpeechResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechToTextCallbacks {
  onResult?: (result: SpeechResult) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

class SpeechToTextService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private callbacks: SpeechToTextCallbacks = {};
  private config: SpeechToTextConfig = {
    language: 'fr-FR',
    continuous: true,
    interimResults: true,
    maxAlternatives: 1
  };

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech Recognition API not supported in this browser');
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognitionAPI();

    if (this.recognition) {
      this.setupRecognitionEvents();
      this.applyConfig();
    }
  }

  private setupRecognitionEvents() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks.onStart?.();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.callbacks.onEnd?.();
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;
        
        this.callbacks.onResult?.({
          transcript,
          confidence,
          isFinal: result.isFinal
        });
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.callbacks.onError?.(event.error);
    };
  }

  private applyConfig() {
    if (!this.recognition) return;

    this.recognition.lang = this.config.language || 'fr-FR';
    this.recognition.continuous = this.config.continuous || true;
    this.recognition.interimResults = this.config.interimResults || true;
    this.recognition.maxAlternatives = this.config.maxAlternatives || 1;
  }

  setCallbacks(callbacks: SpeechToTextCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  setConfig(config: Partial<SpeechToTextConfig>) {
    this.config = { ...this.config, ...config };
    this.applyConfig();
  }

  start() {
    if (!this.recognition) {
      this.callbacks.onError?.('Speech Recognition not available');
      return;
    }

    if (this.isListening) {
      return;
    }

    try {
      this.recognition.start();
    } catch (error) {
      this.callbacks.onError?.(`Failed to start recognition: ${error}`);
    }
  }

  stop() {
    if (!this.recognition || !this.isListening) {
      return;
    }

    this.recognition.stop();
  }

  abort() {
    if (!this.recognition || !this.isListening) {
      return;
    }

    this.recognition.abort();
  }

  getIsListening() {
    return this.isListening;
  }

  isSupported() {
    return this.recognition !== null;
  }
}

// Instance globale
export const speechToTextService = new SpeechToTextService();
