import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, BorderRadius } from "../constants/theme";

interface CollectionCardProps {
  title: string;
  storyCount: number;
  progress: number;
  isFree: boolean;
  onPress: () => void;
}

export function CollectionCard({
  title,
  storyCount,
  progress,
  isFree,
  onPress,
}: CollectionCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={`${title}, ${storyCount} stories${!isFree ? ", premium" : ""}`}
      accessibilityRole="button"
      style={{
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        position: "relative",
      }}
    >
      {!isFree && (
        <View
          style={{
            position: "absolute",
            top: Spacing.sm,
            right: Spacing.sm,
            backgroundColor: Colors.accent,
            borderRadius: 12,
            width: 24,
            height: 24,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="lock-closed" size={12} color="#FFFFFF" />
        </View>
      )}

      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          borderWidth: 3,
          borderColor: isFree ? Colors.primary : Colors.border,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: Spacing.md,
        }}
      >
        <Text
          style={{
            fontSize: FontSize.xs,
            fontWeight: "700",
            color: isFree ? Colors.primary : Colors.textMuted,
          }}
        >
          {Math.round(progress * 100)}%
        </Text>
      </View>

      <Text
        style={{
          fontSize: FontSize.md,
          fontWeight: "700",
          color: Colors.textPrimary,
          marginBottom: Spacing.xs,
        }}
      >
        {title}
      </Text>
      <Text style={{ fontSize: FontSize.xs, color: Colors.textSecondary }}>
        {storyCount} stories
      </Text>
    </TouchableOpacity>
  );
}
