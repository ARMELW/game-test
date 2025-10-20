import { useUnityContext } from 'react-unity-webgl';
import { useEffect, useCallback, useRef } from 'react';

/**
 * Génère un parseur de message générique pour un jeu Unity.
 * @param patterns Liste des patterns à matcher
 * @param unknownType Valeur à utiliser pour le type UNKNOWN
 * @returns Fonction de parsing typée
 */
export function parse(message: string) {
    if (!message || typeof message !== 'string') return null;
    const normalizedMessage = message.toLowerCase().trim();
    if (!normalizedMessage) return null;
    for (const patternConfig of COUNTING_MACHINE_PATTERNS) {
      const match = normalizedMessage.match(patternConfig.pattern);
      if (match) {
        const result = {
          type: patternConfig.type,
          timestamp: Date.now()
        } as Record<string, unknown>;
        if (match[1]) {
          result.value = match[1];
          if (patternConfig.hasNumericValue && /^\d+$/.test(match[1])) {
            const numericValue = parseInt(match[1], 10);
            if (!isNaN(numericValue)) {
              result.numericValue = numericValue;
            }
          }
        }
        return result as unknown;
      }
    }
    return {
      value: message,
      timestamp: Date.now()
  };
}


 export enum CountingMachineMessageType {
  SET_VALUE = 'setValue',
  ADD_GOAL = 'addGoal',
  INCREASE_VALUE = 'increaseValue',
  DECREASE_VALUE = 'decreaseValue',
  NEXT_GOAL = 'nextGoal',
  VALID_BUTTON = 'validButton',
  CORRECT_VALUE = 'correctValue',
  WRONG_VALUE = 'wrongValue',
  DONE = 'done',
  UNKNOWN = 'unknown',
  LOCK_THOUSAND_ROLL = 'lockThousandRoll',
  LOCK_HUNDRED_ROLL = 'lockHundredRoll',
  LOCK_TEN_ROLL = 'lockTenRoll',
  LOCK_UNIT_ROLL = 'lockUnitRoll',
}

export interface CountingMachineParsedMessage {
  type: CountingMachineMessageType;
  value?: string;
  numericValue?: number;
  timestamp: number;
}

 export const COUNTING_MACHINE_PATTERNS = [
  { pattern: /^set value (\d+)$/, type: CountingMachineMessageType.SET_VALUE, hasNumericValue: true },
  { pattern: /^add to goal list (\d+)$/, type: CountingMachineMessageType.ADD_GOAL, hasNumericValue: true },
  { pattern: /^increase value by (\d+)$/, type: CountingMachineMessageType.INCREASE_VALUE, hasNumericValue: true },
  { pattern: /^decrease value by (\d+)$/, type: CountingMachineMessageType.DECREASE_VALUE, hasNumericValue: true },
  { pattern: /^next goal (\d+)$/, type: CountingMachineMessageType.NEXT_GOAL, hasNumericValue: true },
  { pattern: /^on valid button clicked$/, type: CountingMachineMessageType.VALID_BUTTON },
  { pattern: /^correct value$/, type: CountingMachineMessageType.CORRECT_VALUE },
  { pattern: /^wrong value$/, type: CountingMachineMessageType.WRONG_VALUE },
  { pattern: /^done$/, type: CountingMachineMessageType.DONE },
  { pattern: /^lock thousand roll$/, type: CountingMachineMessageType.LOCK_THOUSAND_ROLL },
  { pattern: /^lock hundred roll$/, type: CountingMachineMessageType.LOCK_HUNDRED_ROLL },
  { pattern: /^lock ten roll$/, type: CountingMachineMessageType.LOCK_TEN_ROLL },
  { pattern: /^lock unit roll$/, type: CountingMachineMessageType.LOCK_UNIT_ROLL },
];
// Extend window to include unityInstance
declare global {
  interface Window {
    unityInstance?: {
      SendMessage: (objectName: string, methodName: string, value?: string | number) => void;
    };
  }
}


export function useUnity() {
  const unityContext = useUnityContext({
    loaderUrl: './counting-machine/Build/counting-machine.loader.js',
    dataUrl: './counting-machine/Build/counting-machine.data.br',
    frameworkUrl: './counting-machine/Build/counting-machine.framework.js.br',
    codeUrl: './counting-machine/Build/counting-machine.wasm.br',
    streamingAssetsUrl: './counting-machine/StreamingAssets',
    companyName: 'Mena Mena Games',
    productName: 'Counting Machine',
    productVersion: '0.0.5',
  });

  const { unityProvider, sendMessage, addEventListener, removeEventListener, isLoaded, loadingProgression } = unityContext;

  // Anti-loop protection refs
  const sendingMessageRef = useRef(false);
  const lastMessageRef = useRef<string>('');
  const messageTimestampRef = useRef<number>(0);

  // Protected send function with anti-loop guards
  const protectedSend = useCallback((message: string) => {
    if (!isLoaded) return;
    
    // Block duplicate messages (< 100ms)
    const now = Date.now();
    if (message === lastMessageRef.current && 
        (now - messageTimestampRef.current) < 100) {
      return;
    }
    
    // Block recursive sending
    if (sendingMessageRef.current) return;
    
    try {
      sendingMessageRef.current = true;
      lastMessageRef.current = message;
      messageTimestampRef.current = now;
      sendMessage('WebBridge', 'ReceiveStringMessageFromJs', message);
    } finally {
      setTimeout(() => {
        sendingMessageRef.current = false;
      }, 50);
    }
  }, [isLoaded, sendMessage]);

  // Expose Unity instance globally when loaded
  useEffect(() => {
    if (isLoaded) {
      window.unityInstance = {
        SendMessage: (objectName: string, methodName: string, value?: string | number) => {
          sendMessage(objectName, methodName, value);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Function to change the current value displayed on the machine
  // SetValue322 -> the machine will display 0322
  const changeCurrentValue = useCallback((value: string | number) => {
    protectedSend(`SetValue${value}`);
  }, [protectedSend]);

  // Function to send the list of goals to Unity
  // ChangeList544/1352/9871 -> goals will be 544 then 1352 then 9871
  const changeCurrentGoalList = useCallback((value: string) => {
    protectedSend(`ChangeList${value}`);
  }, [protectedSend]);

  // Function to lock/unlock the thousands roll
  const lockThousandRoll = useCallback((locked: boolean) => {
    protectedSend(`LockThousand:${locked ? 1 : 0}`);
  }, [protectedSend]);

  // Function to lock/unlock the hundreds roll
  const lockHundredRoll = useCallback((locked: boolean) => {
    protectedSend(`LockHundred:${locked ? 1 : 0}`);
  }, [protectedSend]);

  // Function to lock/unlock the tens roll
  const lockTenRoll = useCallback((locked: boolean) => {
    protectedSend(`LockTen:${locked ? 1 : 0}`);
  }, [protectedSend]);

  // Function to lock/unlock the units roll
  const lockUnitRoll = useCallback((locked: boolean) => {
    protectedSend(`LockUnit:${locked ? 1 : 0}`);
  }, [protectedSend]);

  return {
    unityProvider,
    isLoaded,
    loadingProgression,
    changeCurrentValue,
    changeCurrentGoalList,
    lockThousandRoll,
    lockHundredRoll,
    lockTenRoll,
    lockUnitRoll,
    addEventListener,
    removeEventListener,
  };
}
