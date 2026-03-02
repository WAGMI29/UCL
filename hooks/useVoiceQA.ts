import { useState } from "react";

interface UseVoiceQAReturn {
  isListening: boolean;
  isProcessing: boolean;
  response: string | null;
  remainingQuestions: number;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  askTextQuestion: (question: string) => Promise<void>;
}

export function useVoiceQA(
  storyId: string,
  storyContext: string
): UseVoiceQAReturn {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [remainingQuestions] = useState(5);

  const startListening = async () => {
    // TODO: Start recording with expo-av
    setIsListening(true);
  };

  const stopListening = async () => {
    // TODO: Stop recording, transcribe, send to AI
    setIsListening(false);
  };

  const askTextQuestion = async (question: string) => {
    // TODO: Send text question to ElevenLabs Conversational AI
    setIsProcessing(true);
    setResponse(null);

    try {
      // Placeholder response
      setResponse(
        "This feature will be available once the ElevenLabs API key is configured."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isListening,
    isProcessing,
    response,
    remainingQuestions,
    startListening,
    stopListening,
    askTextQuestion,
  };
}
