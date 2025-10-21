/**
 * Système de gestion des ERREURS et FEEDBACK pédagogique
 * Pour enfants de 5-6 ans
 */

import {
  FEEDBACK_MESSAGES,
  SUCCESS_MESSAGES,
  GUIDED_MESSAGES,
  SOLUTION_MESSAGES,
  FRUSTRATION_MESSAGES,
  COLUMN_NAMES,
  COLUMN_EMOJIS,
} from './instructions';

export interface AttemptState {
  attemptCount: number;
  consecutiveFailures: number;
  frustrationLevel: 'low' | 'medium' | 'high';
  currentTarget: number;
  lastUserAnswer: number;
}

export interface FeedbackMessage {
  message: string;
  type: 'encouragement' | 'directional' | 'decomposition' | 'assisted';
  showHelp: boolean;
  helpOptions?: {
    tryAgain: boolean;
    guided: boolean;
    showSolution: boolean;
  };
  decomposition?: {
    thousands: number;
    hundreds: number;
    tens: number;
    units: number;
  };
}

/**
 * Calculate the difference between user input and target
 */
export function calculateDistance(userAnswer: number, target: number): number {
  return Math.abs(userAnswer - target);
}

/**
 * Get proximity level based on distance (according to specification)
 * Type 1: 1-5 (very close)
 * Type 2: 6-20 (close)
 * Type 3: 21-50 (medium)
 * Type 4: 51-100 (far)
 * Type 5: >100 (very far)
 */
export function getProximityLevel(distance: number): 'very-close' | 'close' | 'medium' | 'far' | 'very-far' {
  if (distance >= 1 && distance <= 5) return 'very-close';
  if (distance >= 6 && distance <= 20) return 'close';
  if (distance >= 21 && distance <= 50) return 'medium';
  if (distance >= 51 && distance <= 100) return 'far';
  return 'very-far';
}

/**
 * Décompose un nombre en ses composantes (milliers, centaines, dizaines, unités)
 */
export function decomposeNumber(num: number): { thousands: number; hundreds: number; tens: number; units: number } {
  const thousands = Math.floor(num / 1000);
  const hundreds = Math.floor((num % 1000) / 100);
  const tens = Math.floor((num % 100) / 10);
  const units = num % 10;
  return { thousands, hundreds, tens, units };
}

/**
 * Error type classification
 */
export type ErrorType = 'column' | 'composition' | 'magnitude' | 'direction' | 'random';

/**
 * Detect the type of error the child made
 */
export function detectErrorType(userAnswer: number, target: number): ErrorType {
  const userDecomp = decomposeNumber(userAnswer);
  const targetDecomp = decomposeNumber(target);
  
  // Check for column error (digits are correct but in wrong positions)
  const userDigits = [userDecomp.units, userDecomp.tens, userDecomp.hundreds, userDecomp.thousands].filter(d => d > 0).sort();
  const targetDigits = [targetDecomp.units, targetDecomp.tens, targetDecomp.hundreds, targetDecomp.thousands].filter(d => d > 0).sort();
  
  if (JSON.stringify(userDigits) === JSON.stringify(targetDigits) && userAnswer !== target) {
    return 'column';
  }
  
  // Check for composition error (partially filled)
  const userNonZero = [userDecomp.thousands, userDecomp.hundreds, userDecomp.tens, userDecomp.units].filter(d => d > 0).length;
  const targetNonZero = [targetDecomp.thousands, targetDecomp.hundreds, targetDecomp.tens, targetDecomp.units].filter(d => d > 0).length;
  
  if (userNonZero < targetNonZero && userAnswer < target) {
    // Check if some columns match
    let matchingColumns = 0;
    if (userDecomp.thousands === targetDecomp.thousands) matchingColumns++;
    if (userDecomp.hundreds === targetDecomp.hundreds) matchingColumns++;
    if (userDecomp.tens === targetDecomp.tens) matchingColumns++;
    if (userDecomp.units === targetDecomp.units) matchingColumns++;
    
    if (matchingColumns > 0) {
      return 'composition';
    }
  }
  
  // Check for magnitude error (factor of 10, 100, or 1000)
  const ratio = userAnswer / target;
  if (ratio === 10 || ratio === 0.1 || ratio === 100 || ratio === 0.01 || ratio === 1000 || ratio === 0.001) {
    return 'magnitude';
  }
  
  // Check for direction error (in right ballpark)
  const distance = Math.abs(userAnswer - target);
  if (distance <= 100 && distance > 0) {
    return 'direction';
  }
  
  // Random/completely off
  return 'random';
}

/**
 * Get error-specific hint message for attempt 2
 */
export function getErrorTypeHint(errorType: ErrorType, userAnswer: number, target: number): string {
  switch (errorType) {
    case 'column':
      return FEEDBACK_MESSAGES.attempt2.errorTypes.column;
    
    case 'composition':
      return FEEDBACK_MESSAGES.attempt2.errorTypes.composition;
    
    case 'magnitude':
      return FEEDBACK_MESSAGES.attempt2.errorTypes.magnitude;
    
    case 'direction': {
      const diff = target - userAnswer;
      if (diff > 0) {
        return FEEDBACK_MESSAGES.attempt2.errorTypes.directionUp;
      } else {
        return FEEDBACK_MESSAGES.attempt2.errorTypes.directionDown;
      }
    }
    
    case 'random':
    default: {
      const difference = target - userAnswer;
      if (difference > 0) {
        return FEEDBACK_MESSAGES.attempt2.errorTypes.randomUp;
      } else {
        return FEEDBACK_MESSAGES.attempt2.errorTypes.randomDown;
      }
    }
  }
}

/**
 * Generate encouragement message for first attempt (Tentative 1)
 */
function getAttempt1Message(proximity: string): string {
  const msgArray = FEEDBACK_MESSAGES.attempt1[proximity as keyof typeof FEEDBACK_MESSAGES.attempt1] || FEEDBACK_MESSAGES.attempt1['medium'];
  return msgArray[Math.floor(Math.random() * msgArray.length)];
}

/**
 * Generate directional hint message for second attempt (Tentative 2)
 * Now includes error type detection
 */
function getAttempt2Message(userAnswer: number, target: number): string {
  const errorType = detectErrorType(userAnswer, target);
  const distance = calculateDistance(userAnswer, target);
  const proximity = getProximityLevel(distance);
  
  // Get error-specific hint
  let message = getErrorTypeHint(errorType, userAnswer, target);
  
  // Add range hint for medium to very far errors
  if (proximity === 'medium' || proximity === 'far' || proximity === 'very-far') {
    const lowerBound = Math.floor(target * 0.8);
    const upperBound = Math.ceil(target * 1.2);
    message += FEEDBACK_MESSAGES.attempt2.rangeHint(lowerBound, upperBound);
  }
  
  return message;
}

/**
 * Generate decomposition guidance for third attempt (Tentative 3)
 */
function getAttempt3Message(target: number): string {
  const { thousands, hundreds, tens, units } = decomposeNumber(target);
  
  // For units only (0-9)
  if (target < 10) {
    return FEEDBACK_MESSAGES.attempt3.units(units);
  }
  
  // For tens (10-99)
  if (target < 100) {
    return FEEDBACK_MESSAGES.attempt3.tens(tens, units, target);
  }
  
  // For hundreds (100-999)
  if (target < 1000) {
    return FEEDBACK_MESSAGES.attempt3.hundreds(hundreds, tens, units, target);
  }
  
  // For thousands (1000-9999)
  return FEEDBACK_MESSAGES.attempt3.thousands(thousands, hundreds, tens, units, target);
}

/**
 * Generate help options message for fourth attempt (Tentative 4)
 */
function getAttempt4Message(): string {
  return FEEDBACK_MESSAGES.attempt4;
}

/**
 * Generate success message based on attempt count
 */
export function getSuccessMessage(attemptCount: number, wasGuided: boolean = false): string {
  if (wasGuided) {
    return SUCCESS_MESSAGES.guided[Math.floor(Math.random() * SUCCESS_MESSAGES.guided.length)];
  }
  
  if (attemptCount === 1) {
    return SUCCESS_MESSAGES.attempt1[Math.floor(Math.random() * SUCCESS_MESSAGES.attempt1.length)];
  }
  
  if (attemptCount === 2) {
    return SUCCESS_MESSAGES.attempt2[Math.floor(Math.random() * SUCCESS_MESSAGES.attempt2.length)];
  }
  
  if (attemptCount === 3) {
    return SUCCESS_MESSAGES.attempt3[Math.floor(Math.random() * SUCCESS_MESSAGES.attempt3.length)];
  }
  
  // 4+ attempts
  const messages = SUCCESS_MESSAGES.attempt4Plus(attemptCount);
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Main feedback generator function
 */
export function generateFeedback(state: AttemptState): FeedbackMessage {
  const distance = calculateDistance(state.lastUserAnswer, state.currentTarget);
  const proximity = getProximityLevel(distance);
  
  // Attempt 1: Simple encouragement
  if (state.attemptCount === 1) {
    return {
      message: getAttempt1Message(proximity),
      type: 'encouragement',
      showHelp: false
    };
  }
  
  // Attempt 2: Directional hint with error type
  if (state.attemptCount === 2) {
    return {
      message: getAttempt2Message(state.lastUserAnswer, state.currentTarget),
      type: 'directional',
      showHelp: false
    };
  }
  
  // Attempt 3: Decomposition guidance
  if (state.attemptCount === 3) {
    const decomp = decomposeNumber(state.currentTarget);
    return {
      message: getAttempt3Message(state.currentTarget),
      type: 'decomposition',
      showHelp: false,
      decomposition: decomp
    };
  }
  
  // Attempt 4+: Offer help with decomposition
  const decomp = decomposeNumber(state.currentTarget);
  return {
    message: getAttempt4Message(),
    type: 'assisted',
    showHelp: true,
    helpOptions: {
      tryAgain: true,
      guided: true,
      showSolution: true
    },
    decomposition: decomp
  };
}

/**
 * Detect frustration level based on consecutive failures
 */
export function detectFrustration(consecutiveFailures: number): 'low' | 'medium' | 'high' {
  if (consecutiveFailures >= 3) return 'high';
  if (consecutiveFailures >= 2) return 'medium';
  return 'low';
}

/**
 * Get intervention message for high frustration
 */
export function getFrustrationInterventionMessage(): string {
  return FRUSTRATION_MESSAGES.high;
}

/**
 * Generate step-by-step guided instructions for a specific column
 */
export function getGuidedStepMessage(
  targetValue: number, 
  currentValue: number, 
  columnName: string,
  columnIndex: number
): string {
  const remaining = targetValue - currentValue;
  
  if (remaining === 0) {
    return `PARFAIT ! ${columnName} est bon ! ✅`;
  }
  
  if (remaining > 0) {
    return `Il faut ${remaining} dans les ${COLUMN_NAMES[columnIndex as keyof typeof COLUMN_NAMES]} ! 
Clique ${remaining} fois sur △ dans les ${COLUMN_NAMES[columnIndex as keyof typeof COLUMN_NAMES]} ! ${COLUMN_EMOJIS[columnIndex as keyof typeof COLUMN_EMOJIS]}`;
  } else {
    return `Il y a trop dans les ${COLUMN_NAMES[columnIndex as keyof typeof COLUMN_NAMES]} ! 
Clique ${Math.abs(remaining)} fois sur ∇ dans les ${COLUMN_NAMES[columnIndex as keyof typeof COLUMN_NAMES]} !`;
  }
}

/**
 * Get attempt indicator emoji
 */
export function getAttemptIndicator(attemptCount: number): string {
  if (attemptCount === 1) return '⭐';
  if (attemptCount === 2) return '💪';
  if (attemptCount === 3) return '💡';
  return '🤝';
}

/**
 * Get attempt color
 */
export function getAttemptColor(attemptCount: number): string {
  if (attemptCount === 1) return '#3b82f6'; // Blue - neutral
  if (attemptCount === 2) return '#fbbf24'; // Yellow - attention
  if (attemptCount === 3) return '#f97316'; // Orange - help
  return '#ef4444'; // Red light - assistance
}

/**
 * Get guided step instructions for building a number column by column
 */
export interface GuidedStepInfo {
  columnIndex: number; // 0=units, 1=tens, 2=hundreds, 3=thousands
  columnName: string;
  targetValue: number;
  currentValue: number;
  action: 'increase' | 'decrease' | 'complete';
  message: string;
}

/**
 * Calculate next guided step
 */
export function getNextGuidedStep(
  target: number,
  currentColumns: number[]
): GuidedStepInfo | null {
  const targetDecomp = decomposeNumber(target);
  const targetArray = [targetDecomp.units, targetDecomp.tens, targetDecomp.hundreds, targetDecomp.thousands];
  
  const columnNames = ['UNITÉS', 'DIZAINES', 'CENTAINES', 'MILLIERS'];
  
  // Check from highest to lowest column
  for (let i = 3; i >= 0; i--) {
    if (currentColumns[i] !== targetArray[i]) {
      const diff = targetArray[i] - currentColumns[i];
      const action = diff > 0 ? 'increase' : 'decrease';
      const clicksNeeded = Math.abs(diff);
      
      let message = '';
      if (i === 3) {
        message = GUIDED_MESSAGES.step.thousands(targetArray[i]);
      } else if (i === 2) {
        message = GUIDED_MESSAGES.step.hundreds(targetArray[i]);
      } else if (i === 1) {
        message = GUIDED_MESSAGES.step.tens(targetArray[i]);
      } else {
        message = GUIDED_MESSAGES.step.units(targetArray[i]);
      }
      
      if (action === 'increase') {
        message += GUIDED_MESSAGES.step.action.increase(clicksNeeded, columnNames[i]);
      } else {
        message += GUIDED_MESSAGES.step.action.decrease(clicksNeeded, columnNames[i]);
      }
      
      return {
        columnIndex: i,
        columnName: columnNames[i],
        targetValue: targetArray[i],
        currentValue: currentColumns[i],
        action,
        message
      };
    }
  }
  
  // All columns complete
  return null;
}

/**
 * Get click feedback message during guided mode
 */
export function getGuidedClickFeedback(remaining: number): string {
  if (remaining === 0) {
    return GUIDED_MESSAGES.clickFeedback.perfect;
  }
  
  if (remaining === 1) {
    return GUIDED_MESSAGES.clickFeedback.almostDone;
  }
  
  return GUIDED_MESSAGES.clickFeedback.continue(remaining);
}

/**
 * Get completion message for guided mode
 */
export function getGuidedCompletionMessage(target: number): string {
  const decomp = decomposeNumber(target);
  
  let breakdown = '';
  if (decomp.thousands > 0) {
    breakdown += `- ${decomp.thousands * 1000} (milliers)\n`;
  }
  if (decomp.hundreds > 0) {
    breakdown += `- + ${decomp.hundreds * 100} (centaines)\n`;
  }
  if (decomp.tens > 0) {
    breakdown += `- + ${decomp.tens * 10} (dizaines)\n`;
  }
  if (decomp.units > 0) {
    breakdown += `- + ${decomp.units} (unités)\n`;
  }
  
  return GUIDED_MESSAGES.completion(target, breakdown);
}

/**
 * Get animation step message for solution display
 */
export function getSolutionAnimationStep(
  columnIndex: number,
  value: number,
  runningTotal: number
): string {
  if (columnIndex === 3) {
    return SOLUTION_MESSAGES.step.thousands(value, runningTotal);
  } else if (columnIndex === 2) {
    return SOLUTION_MESSAGES.step.hundreds(value, runningTotal);
  } else if (columnIndex === 1) {
    return SOLUTION_MESSAGES.step.tens(value, runningTotal);
  } else {
    return SOLUTION_MESSAGES.step.units(value, runningTotal);
  }
}

/**
 * Frustration intervention messages by level
 */
export function getFrustrationMessage(level: 'low' | 'medium' | 'high'): string {
  return FRUSTRATION_MESSAGES[level];
}
