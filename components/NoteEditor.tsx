import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, BorderRadius } from "../constants/theme";

interface NoteEditorProps {
  visible: boolean;
  storyTitle: string;
  onSave: (content: string) => void;
  onClose: () => void;
}

export function NoteEditor({
  visible,
  storyTitle,
  onSave,
  onClose,
}: NoteEditorProps) {
  const [content, setContent] = useState("");

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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: Spacing.lg,
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            accessibilityLabel="Cancel"
            accessibilityRole="button"
          >
            <Text style={{ fontSize: FontSize.md, color: Colors.textSecondary }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: FontSize.md,
              fontWeight: "700",
              color: Colors.textPrimary,
            }}
          >
            New Note
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (content.trim()) {
                onSave(content.trim());
                setContent("");
              }
            }}
            accessibilityLabel="Save note"
            accessibilityRole="button"
          >
            <Text
              style={{
                fontSize: FontSize.md,
                fontWeight: "700",
                color: Colors.primary,
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            fontSize: FontSize.sm,
            color: Colors.textSecondary,
            marginBottom: Spacing.md,
          }}
        >
          {storyTitle}
        </Text>

        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Write your reflection..."
          placeholderTextColor={Colors.textMuted}
          multiline
          textAlignVertical="top"
          accessibilityLabel="Note content"
          style={{
            flex: 1,
            backgroundColor: Colors.surface,
            borderRadius: BorderRadius.md,
            padding: Spacing.lg,
            fontSize: FontSize.md,
            color: Colors.textPrimary,
            lineHeight: 24,
          }}
        />
      </View>
    </Modal>
  );
}
