import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, BorderRadius } from "../constants/theme";

interface VoiceQAProps {
  visible: boolean;
  storyTitle: string;
  onClose: () => void;
  onAskQuestion: (question: string) => void;
  isProcessing: boolean;
  response: string | null;
  remainingQuestions: number;
}

export function VoiceQA({
  visible,
  storyTitle,
  onClose,
  onAskQuestion,
  isProcessing,
  response,
  remainingQuestions,
}: VoiceQAProps) {
  const [textQuestion, setTextQuestion] = useState("");

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          padding: Spacing.lg,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: Spacing.xl,
          }}
        >
          <Text
            style={{
              fontSize: FontSize.lg,
              fontWeight: "700",
              color: Colors.textPrimary,
            }}
          >
            Ask about "{storyTitle}"
          </Text>
          <TouchableOpacity
            onPress={onClose}
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Mic button */}
        <View style={{ alignItems: "center", marginBottom: Spacing.xl }}>
          <TouchableOpacity
            accessibilityLabel="Tap to ask a voice question"
            accessibilityRole="button"
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: Colors.accent,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: Spacing.md,
            }}
          >
            <Ionicons name="mic" size={36} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={{ fontSize: FontSize.sm, color: Colors.textSecondary }}>
            Tap to ask a voice question
          </Text>
        </View>

        {/* Text input */}
        <View
          style={{
            flexDirection: "row",
            gap: Spacing.sm,
            marginBottom: Spacing.lg,
          }}
        >
          <TextInput
            value={textQuestion}
            onChangeText={setTextQuestion}
            placeholder="Or type your question..."
            placeholderTextColor={Colors.textMuted}
            accessibilityLabel="Type your question"
            style={{
              flex: 1,
              backgroundColor: Colors.surface,
              borderRadius: BorderRadius.md,
              padding: Spacing.md,
              fontSize: FontSize.md,
              color: Colors.textPrimary,
              borderWidth: 1,
              borderColor: Colors.border,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              if (textQuestion.trim()) {
                onAskQuestion(textQuestion.trim());
                setTextQuestion("");
              }
            }}
            accessibilityLabel="Send question"
            accessibilityRole="button"
            style={{
              backgroundColor: Colors.primary,
              borderRadius: BorderRadius.md,
              padding: Spacing.md,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Response */}
        {isProcessing && (
          <View
            style={{
              backgroundColor: Colors.surface,
              borderRadius: BorderRadius.md,
              padding: Spacing.lg,
              marginBottom: Spacing.md,
            }}
          >
            <Text style={{ color: Colors.textSecondary }}>Thinking...</Text>
          </View>
        )}

        {response && (
          <View
            style={{
              backgroundColor: Colors.surface,
              borderRadius: BorderRadius.md,
              padding: Spacing.lg,
              marginBottom: Spacing.md,
            }}
          >
            <Text
              style={{
                fontSize: FontSize.md,
                color: Colors.textPrimary,
                lineHeight: 24,
              }}
            >
              {response}
            </Text>
          </View>
        )}

        {/* Remaining questions */}
        <Text
          style={{
            fontSize: FontSize.sm,
            color: Colors.textMuted,
            textAlign: "center",
          }}
        >
          {remainingQuestions} of 5 free questions remaining today
        </Text>
      </View>
    </Modal>
  );
}
