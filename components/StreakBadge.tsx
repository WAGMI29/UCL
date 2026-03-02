import { View, Text } from "react-native";
import { Colors, FontSize, Spacing } from "../constants/theme";

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.surface,
        borderRadius: 9999,
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
      }}
      accessibilityLabel={`${streak} day streak`}
    >
      <Text style={{ fontSize: 16, marginRight: Spacing.xs }}>🔥</Text>
      <Text
        style={{
          fontSize: FontSize.sm,
          fontWeight: "700",
          color: Colors.textPrimary,
        }}
      >
        {streak}
      </Text>
    </View>
  );
}
