import { useEffect, useCallback, useMemo, useState, useRef } from "react";
import { useStore } from "./store.ts";
import { UnityGame } from "./components/UnityGame";
import { parse, useUnity } from "./hooks/useUnity";
import { UI_MESSAGES } from "./instructions.ts";


function formatNumber(num: number, length = 4) {
  return num.toString().padStart(length, "0");
}
function MachineANombres() {
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const {
    init,
    columns,
    phase,
    instruction,
    feedback,
    isCountingAutomatically,
    userInput,
    showInputField,
    handleAdd,
    handleSubtract,
    handleSetValue,
    handleValidateLearning,
    handleValidateTenToTwenty,
    handleValidateTens,
    handleValidateHundredToTwoHundred,
    handleValidateTwoHundredToThreeHundred,
    handleValidateHundreds,
    handleValidateThousands,
    handleValidateThousandToTwoThousand,
    handleValidateTwoThousandToThreeThousand,
    handleValidateThousandsSimpleCombination,
    startLearningPhase,
    unlockNextColumn,
    showUnlockButton,
    showStartLearningButton,
    showValidateLearningButton,
    showValidateTensButton,
    showValidateHundredsButton,
    showValidateThousandsButton,
    setUserInput,
    handleUserInputSubmit,
    attemptCount,
    showHelpOptions,
    totalChallengesCompleted,
    handleHelpChoice,
    guidedMode,
    showSolutionAnimation,
    currentTarget,
    // New intro state
    showResponseButtons,
    setSelectedResponse,
    handleIntroNameSubmit,
    handleIntroMachineResponse,
    handleIntroSecondColumnChoice,
    introMaxAttempt,
  } = useStore();

  // Unity integration
  const {
    isLoaded: unityLoaded,
    changeCurrentValue,
    lockThousandRoll,
    lockHundredRoll,
    lockTenRoll,
    lockUnitRoll,
  } = useUnity();

  // Local typing animation state
  const [typedInstruction, setTypedInstruction] = useState("");
  const [typedFeedback, setTypedFeedback] = useState("");
  const [isTypingInstruction, setIsTypingInstruction] = useState(false);
  const [isTypingFeedback, setIsTypingFeedback] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);
  // Validation lock to prevent duplicate validations
  const validationInProgressRef = useRef(false);
  const lastValidationTimeRef = useRef(0);

  // Handle manual validation button click
  const handleManualValidation = useCallback(() => {
    // Prevent duplicate validations within 500ms window
    const now = Date.now();
    if (validationInProgressRef.current || (now - lastValidationTimeRef.current) < 500) {
      return;
    }
    validationInProgressRef.current = true;
    lastValidationTimeRef.current = now;
    setTimeout(() => {
      validationInProgressRef.current = false;
    }, 100);
    if (phase === "challenge-ten-to-twenty") {
      handleValidateTenToTwenty();
    } else if (
      phase === "challenge-unit-1" ||
      phase === "challenge-unit-2" ||
      phase === "challenge-unit-3"
    ) {
      handleValidateLearning();
    } else if (
      phase === "challenge-tens-1" ||
      phase === "challenge-tens-2" ||
      phase === "challenge-tens-3"
    ) {
      handleValidateTens();
    } else if (phase === "challenge-hundred-to-two-hundred") {
      handleValidateHundredToTwoHundred();
    } else if (phase === "challenge-two-hundred-to-three-hundred") {
      handleValidateTwoHundredToThreeHundred();
    } else if (
      phase === "challenge-hundreds-1" ||
      phase === "challenge-hundreds-2" ||
      phase === "challenge-hundreds-3"
    ) {
      handleValidateHundreds();
    } else if (phase === "challenge-thousand-to-two-thousand") {
      handleValidateThousandToTwoThousand();
    } else if (phase === "challenge-two-thousand-to-three-thousand") {
      handleValidateTwoThousandToThreeThousand();
    } else if (phase === "challenge-thousands-simple-combination") {
      handleValidateThousandsSimpleCombination();
    } else if (
      phase === "challenge-thousands-1" ||
      phase === "challenge-thousands-2" ||
      phase === "challenge-thousands-3"
    ) {
      handleValidateThousands();
    }
  }, [phase]);

  // Handle messages from Unity (button clicks)
  const handleUnityMessage = useCallback(
    (message: string) => {
      const data = parse(message);
      if (!data || typeof data !== "object" || !("type" in data)) {
        return;
      }
      const parsedData = data as { type: string; numericValue?: number };
      const getColumnIndex = (value?: number): number => {
        if (!value) return 0;
        if (value === 1) return 0;
        if (value === 10) return 1;
        if (value === 100) return 2;
        if (value === 1000) return 3;
        return 0;
      };
      const columnIndex = getColumnIndex(parsedData.numericValue);
      if (parsedData.type === "increaseValue") {
        handleAdd(columnIndex);
      } else if (parsedData.type === "decreaseValue") {
        handleSubtract(columnIndex);
      } else if (parsedData.type == "setValue") {
        handleSetValue(formatNumber(parsedData.numericValue || 0));
      } else if (parsedData.type === "addGoal") {
        // Note: This message type is no longer used for automatic validation.
      } else if (parsedData.type == "validButton") {
        handleManualValidation();
      }
      // Les autres cas sont ignorés ou loggés
    },
    [handleAdd, handleSubtract, handleSetValue, handleManualValidation]
  );

  // Set up Unity message handler
  useEffect(() => {
    window.onUnityMessage = handleUnityMessage;
    return () => {
      window.onUnityMessage = undefined;
    };
  }, [handleUnityMessage]);


  // Démarrage du jeu après interaction utilisateur pour déverrouiller l'audio
  useEffect(() => {
    if (audioUnlocked) {
      init();
    }
  }, [audioUnlocked, init]);


  const totalNumber = useMemo(
    () =>
      columns.reduce((acc, col, idx) => acc + col.value * Math.pow(10, idx), 0),
    [columns]
  );

  // Typing animation effect for instruction
  useEffect(() => {
    if (!instruction) return;

    setIsTypingInstruction(true);
    setTypedInstruction("");
    setTypedFeedback("");

    let currentIndex = 0;
    const typeNextChar = () => {
      if (currentIndex <= instruction.length) {
        setTypedInstruction(instruction.slice(0, currentIndex));
        currentIndex++;
        typingTimeoutRef.current = setTimeout(typeNextChar, 18);
      } else {
        setIsTypingInstruction(false);
      }
    };

    typeNextChar();

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [instruction]);

  // Typing animation effect for feedback
  useEffect(() => {
    if (!feedback) return;

    setIsTypingFeedback(true);
    setTypedFeedback("");

    const prefixed = ` ${feedback}`;
    let currentIndex = 0;
    const typeNextChar = () => {
      if (currentIndex <= prefixed.length) {
        setTypedFeedback(prefixed.slice(0, currentIndex));
        currentIndex++;
        typingTimeoutRef.current = setTimeout(typeNextChar, 18);
      } else {
        setIsTypingFeedback(false);
      }
    };

    typeNextChar();

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [feedback]);

  const displayText = useMemo(
    () => typedFeedback || typedInstruction,
    [typedInstruction, typedFeedback]
  );

  const isTyping = isTypingInstruction || isTypingFeedback;

  // Sync Unity machine value with current state
  useEffect(() => {
    if (unityLoaded) {
      changeCurrentValue(totalNumber.toString());
    }
  }, [totalNumber, unityLoaded, changeCurrentValue]);

  // Sync Unity roll locks based on phase and unlocked columns
  useEffect(() => {
    // Check if Unity instance is available instead of relying on isLoaded flag
    if (!window.unityInstance && !unityLoaded) return;

    // Add a delay to ensure Unity is ready to process lock commands
    // Unity needs time after loading to fully initialize its message handling
    const timeoutId = setTimeout(() => {
      // Lock all rolls initially
      let lockUnits = true;
      let lockTens = true;
      let lockHundreds = true;
      let lockThousands = true;

      // Unlock based on unlocked columns and phase
      const isUnit = columns[0]?.unlocked || false;
      const isTen = columns[1]?.unlocked || false;
      const isHundred = columns[2]?.unlocked || false;
      const isThousand = columns[3]?.unlocked || false;

      // Determine which rolls should be unlocked based on phase
      if (phase === "intro-welcome" && isUnit) {
        lockUnits = false;
      } else if (phase === "intro-discover" && isUnit) {
        lockUnits = false;
      } else if (phase === "intro-add-roll" && isUnit) {
        lockUnits = false;
      } else if (phase === "normal") {
        lockUnits = !isUnit;
        lockTens = !isTen;
        lockHundreds = !isHundred;
        lockThousands = !isThousand;
      } else if (
        (phase === "tutorial" ||
          phase === "explore-units" ||
          phase === "click-add" ||
          phase === "click-remove" ||
          phase.startsWith("challenge-unit-") ||
          phase === "challenge-ten-to-twenty") &&
        isUnit
      ) {
        lockUnits = false;
      } else if (phase === "learn-carry" && isUnit) {
        lockUnits = false;
      } else if (phase === "practice-ten" && (isUnit || isTen)) {
        lockUnits = !isUnit;
        lockTens = !isTen;
      } else if (
        (phase === "learn-ten-to-twenty" ||
          phase === "learn-twenty-to-thirty") &&
        isUnit
      ) {
        lockUnits = false;
      } else if (
        phase === "practice-hundred" &&
        (isUnit || isTen || isHundred)
      ) {
        lockUnits = !isUnit;
        lockTens = !isTen;
        lockHundreds = !isHundred;
      } else if (
        (phase === "learn-hundred-to-hundred-ten" ||
          phase === "learn-hundred-ten-to-two-hundred" ||
          phase === "challenge-hundred-to-two-hundred" ||
          phase === "learn-two-hundred-to-three-hundred" ||
          phase === "challenge-two-hundred-to-three-hundred") &&
        isUnit
      ) {
        lockUnits = false;
      } else if (
        (phase.startsWith("challenge-tens-") ||
          phase === "learn-tens-combination") &&
        (isUnit || isTen)
      ) {
        lockUnits = !isUnit;
        lockTens = !isTen;
      } else if (
        (phase.startsWith("challenge-hundreds-") ||
          phase === "learn-hundreds-combination" ||
          phase === "learn-hundreds-simple-combination") &&
        (isUnit || isTen || isHundred)
      ) {
        lockUnits = !isUnit;
        lockTens = !isTen;
        lockHundreds = !isHundred;
      } else if (
        phase === "practice-thousand" &&
        (isUnit || isTen || isHundred || isThousand)
      ) {
        lockUnits = !isUnit;
        lockTens = !isTen;
        lockHundreds = !isHundred;
        lockThousands = !isThousand;
      } else if (
        (phase === "learn-thousand-to-thousand-ten" ||
          phase === "learn-thousand-to-thousand-hundred" ||
          phase === "learn-thousand-hundred-to-two-thousand" ||
          phase === "challenge-thousand-to-two-thousand" ||
          phase === "learn-two-thousand-to-three-thousand" ||
          phase === "challenge-two-thousand-to-three-thousand") &&
        isUnit
      ) {
        lockUnits = false;
      } else if (
        (phase.startsWith("challenge-thousands-") ||
          phase === "learn-thousands-combination" ||
          phase === "challenge-thousands-simple-combination" ||
          phase === "learn-thousands-very-simple-combination" ||
          phase === "learn-thousands-full-combination") &&
        (isUnit || isTen || isHundred || isThousand)
      ) {
        lockUnits = !isUnit;
        lockTens = !isTen;
        lockHundreds = !isHundred;
        lockThousands = !isThousand;
      }

      // During auto-counting, lock everything
      if (isCountingAutomatically) {
        lockUnits = true;
        lockTens = true;
        lockHundreds = true;
        lockThousands = true;
      }

      // Apply locks to Unity
      lockUnitRoll(lockUnits);
      lockTenRoll(lockTens);
      lockHundredRoll(lockHundreds);
      lockThousandRoll(lockThousands);
    }, 500); // 500ms delay to ensure Unity is fully ready to process messages

    return () => clearTimeout(timeoutId);
  }, [
    phase,
    columns,
    isCountingAutomatically,
    unityLoaded,
    lockUnitRoll,
    lockTenRoll,
    lockHundredRoll,
    lockThousandRoll,
    introMaxAttempt,
  ]);


  // Variable pour l'écran de démarrage
  const showStartScreen = !audioUnlocked;

  // Tous les hooks doivent être appelés avant tout return

  // Rendu conditionnel de l'écran de démarrage
  if (showStartScreen) {
    return (
      <div style={{
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: 22,
        color: '#0ea5e9',
        background: '#f0f4f8',
      }}>
        <div style={{ marginBottom: 32 }}>Bienvenue dans la machine à compter !</div>
        <button
          style={{
            fontSize: 20,
            padding: '16px 40px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(14, 165, 233, 0.3)',
            transition: 'all 0.2s ease',
          }}
          onClick={async () => {
            // Débloquer l'AudioContext si besoin (compatibilité Chrome/Safari)
             const AudioCtx = window.AudioContext || (window.webkitAudioContext as typeof window.AudioContext);
            if (AudioCtx) {
              try {
                const ctx = new AudioCtx();
                if (ctx.state === 'suspended') {
                  await ctx.resume();
                }
                ctx.close();
              } catch { /* ignore */ }
            }
            setAudioUnlocked(true);
          }}
        >
          Commencer
        </button>
        <div style={{ marginTop: 24, fontSize: 16, color: '#64748b' }}>
          (Clique sur “Commencer” pour activer le son)
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        fontFamily: "sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 24,
        margin: "2rem auto",
        flexWrap: "wrap",
        padding: "0 1rem",
        maxWidth: 900,
      }}
    >
      {/* Machine principale */}
      <div
        style={{
          maxWidth: 450,
          width: "100%",
          padding: 16,
          background: "#fff",
          borderRadius: 4,
          border: "1px solid #cbd5e1",
        }}
      >
        <p>{phase}</p>
        <p>{currentTarget}</p>
        <div
          style={{
            width: "100%",
            height: "450px",
            border: "2px solid #cbd5e1",
            borderRadius: 8,
            overflow: "hidden",
            background: "#000",
            marginBottom: 16,
          }}
        >
          <UnityGame />
        </div>

        {/* Boutons de phase (Débloquer / Commencer) */}
        {(showUnlockButton || showStartLearningButton) && (
          <div style={{ marginTop: 16, textAlign: "center" }}>
            {showStartLearningButton && (
              <button
                onClick={startLearningPhase}
                style={{
                  fontSize: 16,
                  padding: "10px 24px",
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: "0 4px 8px rgba(14, 165, 233, 0.3)",
                  transition: "all 0.2s ease",
                  animation: "pulse 2s ease-in-out infinite",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 12px rgba(14, 165, 233, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(14, 165, 233, 0.3)";
                }}
              >
                {phase === "celebration-before-thousands"
                  ? UI_MESSAGES.buttons.startLearning.thousands
                  : phase === "celebration-thousands-complete"
                    ? UI_MESSAGES.buttons.startLearning.freeMode
                    : UI_MESSAGES.buttons.startLearning.default}
              </button>
            )}
            {showUnlockButton && (
              <button
                onClick={unlockNextColumn}
                style={{
                  fontSize: 15,
                  padding: "8px 20px",
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "all 0.2s ease",
                  marginLeft: showStartLearningButton ? "12px" : "0",
                  boxShadow: "0 4px 8px rgba(139, 92, 246, 0.3)",
                  animation: "pulse 2s ease-in-out infinite",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 12px rgba(139, 92, 246, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(139, 92, 246, 0.3)";
                }}
              >
                {UI_MESSAGES.buttons.unlock}
              </button>
            )}
          </div>
        )}

        {/* Input field for questions */}
        {showInputField && (
          <div style={{ marginTop: 20, textAlign: "center" }}>
            {phase === "intro-welcome-personalized" ? (
              // Text input for name
              <>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleIntroNameSubmit();
                    }
                  }}
                  placeholder="Ton prénom (optionnel)..."
                  style={{
                    fontSize: 16,
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "2px solid #cbd5e1",
                    width: "200px",
                    textAlign: "center",
                    marginRight: 8,
                  }}
                />
                <button
                  onClick={handleIntroNameSubmit}
                  style={{
                    fontSize: 16,
                    padding: "8px 20px",
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: "bold",
                    boxShadow: "0 4px 8px rgba(14, 165, 233, 0.3)",
                    transition: "all 0.2s ease",
                  }}
                >
                  ✓ Continuer
                </button>
              </>
            ) : (
              // Default number input
              <>
                <input
                  type="number"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUserInputSubmit();
                    }
                  }}
                  placeholder="Ta réponse..."
                  style={{
                    fontSize: 16,
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "2px solid #cbd5e1",
                    width: "120px",
                    textAlign: "center",
                    marginRight: 8,
                  }}
                />
                <button
                  onClick={handleUserInputSubmit}
                  style={{
                    fontSize: 16,
                    padding: "8px 20px",
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: "bold",
                    boxShadow: "0 4px 8px rgba(14, 165, 233, 0.3)",
                    transition: "all 0.2s ease",
                  }}
                >
                  ✓ Valider
                </button>
              </>
            )}
          </div>
        )}

        {/* Response buttons for intro-discover-machine */}
        {showResponseButtons && phase === "intro-discover-machine" && (
          <div
            style={{
              marginTop: 20,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
            }}
          >
            <button
              onClick={() => {
                setSelectedResponse("belle");
                handleIntroMachineResponse();
              }}
              style={{
                fontSize: 16,
                padding: "10px 20px",
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(245, 158, 11, 0.3)",
                width: "250px",
              }}
            >
              Trop belle ! ✨
            </button>
            <button
              onClick={() => {
                setSelectedResponse("bof");
                handleIntroMachineResponse();
              }}
              style={{
                fontSize: 16,
                padding: "10px 20px",
                background: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(148, 163, 184, 0.3)",
                width: "250px",
              }}
            >
              Bof... 😐
            </button>
            <button
              onClick={() => {
                setSelectedResponse("comprends-rien");
                handleIntroMachineResponse();
              }}
              style={{
                fontSize: 16,
                padding: "10px 20px",
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(139, 92, 246, 0.3)",
                width: "250px",
              }}
            >
              J'y comprends rien ! 🤔
            </button>
            <button
              onClick={() => {
                setSelectedResponse("cest-quoi");
                handleIntroMachineResponse();
              }}
              style={{
                fontSize: 16,
                padding: "10px 20px",
                background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(14, 165, 233, 0.3)",
                width: "250px",
              }}
            >
              C'est quoi ? 🧐
            </button>
          </div>
        )}

        {/* Choice buttons for intro-second-column */}
        {phase === "intro-second-column" && (
          <div
            style={{
              marginTop: 20,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
            }}
          >
            <button
              onClick={() => handleIntroSecondColumnChoice("ajouter-rouleau")}
              style={{
                fontSize: 16,
                padding: "10px 20px",
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(34, 197, 94, 0.3)",
                width: "280px",
              }}
            >
              Ajouter un rouleau ! 🎡
            </button>
            <button
              onClick={() => handleIntroSecondColumnChoice("plus-grande")}
              style={{
                fontSize: 16,
                padding: "10px 20px",
                background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(14, 165, 233, 0.3)",
                width: "280px",
              }}
            >
              Faire une plus grande machine ! 📏
            </button>
            <button
              onClick={() => handleIntroSecondColumnChoice("sais-pas")}
              style={{
                fontSize: 16,
                padding: "10px 20px",
                background: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(148, 163, 184, 0.3)",
                width: "280px",
              }}
            >
              Je ne sais pas ! 🤷
            </button>
          </div>
        )}

        {/* Affichage du nombre total */}
        <div
          style={{
            marginTop: 20,
            padding: "12px",
            background: "#f1f5f9",
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: "bold", color: "#0ea5e9" }}>
            {totalNumber.toString().padStart(4, "0")}
          </div>
        </div>

        {/* Attempt indicator for challenges */}
        {(showValidateLearningButton ||
          showValidateTensButton ||
          showValidateHundredsButton ||
          showValidateThousandsButton) &&
          attemptCount > 0 && (
            <div
              style={{
                marginTop: 12,
                padding: "8px 12px",
                background:
                  attemptCount === 1
                    ? "#dbeafe"
                    : attemptCount === 2
                      ? "#fef3c7"
                      : attemptCount === 3
                        ? "#fed7aa"
                        : "#fee2e2",
                borderRadius: 6,
                textAlign: "center",
                fontSize: 13,
                fontWeight: "bold",
                color:
                  attemptCount === 1
                    ? "#1e40af"
                    : attemptCount === 2
                      ? "#92400e"
                      : attemptCount === 3
                        ? "#9a3412"
                        : "#991b1b",
              }}
            >
              {attemptCount === 1 && "⭐ Essai 1/4"}
              {attemptCount === 2 && "💪 Essai 2/4 - Tu peux le faire !"}
              {attemptCount === 3 && "💡 Essai 3/4 - Voici des indices !"}
              {attemptCount >= 4 && "🤝 Besoin d'aide ?"}
            </div>
          )}

        {/* Help options when user has tried 4+ times */}
        {showHelpOptions && (
          <div
            style={{
              marginTop: 16,
              padding: "16px",
              background: "#fef3c7",
              borderRadius: 8,
              border: "2px solid #fbbf24",
            }}
          >
            <p
              style={{
                margin: "0 0 12px 0",
                fontSize: 14,
                fontWeight: "bold",
                color: "#92400e",
                textAlign: "center",
              }}
            >
              Comment veux-tu continuer ? 🤔
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={() => handleHelpChoice("tryAgain")}
                style={{
                  fontSize: 14,
                  padding: "10px 16px",
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: "0 2px 4px rgba(245, 158, 11, 0.3)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                💪 Essayer encore tout seul !
              </button>
              <button
                onClick={() => handleHelpChoice("guided")}
                style={{
                  fontSize: 14,
                  padding: "10px 16px",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                🤝 Aide-moi à le faire !
              </button>
              <button
                onClick={() => handleHelpChoice("showSolution")}
                style={{
                  fontSize: 14,
                  padding: "10px 16px",
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: "0 2px 4px rgba(139, 92, 246, 0.3)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                👀 Montre-moi la solution !
              </button>
            </div>
          </div>
        )}

        {/* Progress tracker showing total challenges completed */}
        {totalChallengesCompleted > 0 && (
          <div
            style={{
              marginTop: 12,
              padding: "8px 12px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: 6,
              textAlign: "center",
              fontSize: 13,
              fontWeight: "bold",
              color: "#fff",
              boxShadow: "0 2px 4px rgba(16, 185, 129, 0.3)",
            }}
          >
            🌟 {totalChallengesCompleted} défi
            {totalChallengesCompleted > 1 ? "s" : ""} réussi
            {totalChallengesCompleted > 1 ? "s" : ""} ! Continue ! 💪
          </div>
        )}

        {/* Guided mode indicator */}
        {guidedMode && (
          <div
            style={{
              marginTop: 12,
              padding: "8px 12px",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              borderRadius: 6,
              textAlign: "center",
              fontSize: 13,
              fontWeight: "bold",
              color: "#fff",
              boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
            }}
          >
            🤝 Mode guidé actif - Suis les instructions !
          </div>
        )}

        {/* Solution animation indicator */}
        {showSolutionAnimation && (
          <div
            style={{
              marginTop: 12,
              padding: "8px 12px",
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              borderRadius: 6,
              textAlign: "center",
              fontSize: 13,
              fontWeight: "bold",
              color: "#fff",
              boxShadow: "0 2px 4px rgba(139, 92, 246, 0.3)",
            }}
          >
            👀 Regarde bien comment on construit le nombre {currentTarget} !
          </div>
        )}
      </div>

      {/* Assistant pédagogique */}
      <div
        style={{
          width: 280,
          minHeight: 240,
          borderRadius: 12,
          padding: 0,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 20 }} role="img" aria-label="robot">
            🤖
          </span>
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: "#334155",
            }}
          >
            Assistant Pédagogique
          </h3>
        </div>
        <div
          style={{
            flex: 1,
            padding: "16px",
            fontSize: 14,
            lineHeight: 1.6,
            color: "#475569",
            minHeight: 100,
            position: "relative",
          }}
        >
          <p
            style={{ margin: 0 }}
            dangerouslySetInnerHTML={{
              __html: displayText.replace(
                /\*\*(.*?)\*\*/g,
                "<strong>$1</strong>"
              ),
            }}
          />
          {isTyping && (
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 14,
                background: "#3b82f6",
                borderRadius: 1,
                animation: "blink 1s step-end infinite",
                marginLeft: 2,
                verticalAlign: "text-bottom",
              }}
            ></span>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blink {
          from, to { background: transparent }
          50% { background: #3b82f6; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        @keyframes celebration {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default MachineANombres;
