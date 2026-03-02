import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing } from "../../constants/theme";

export default function CommunityScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ padding: Spacing.lg }}>
        <Text
          style={{
            fontSize: FontSize.xxl,
            fontWeight: "700",
            color: Colors.textPrimary,
            marginBottom: Spacing.xl,
          }}
        >
          Community
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: Spacing.xl,
        }}
      >
        <Ionicons name="people-outline" size={64} color={Colors.border} />
        <Text
          style={{
            fontSize: FontSize.lg,
            fontWeight: "600",
            color: Colors.textPrimary,
            marginTop: Spacing.lg,
            textAlign: "center",
          }}
        >
          Community Activity
        </Text>
        <Text
          style={{
            fontSize: FontSize.md,
            color: Colors.textSecondary,
            marginTop: Spacing.sm,
            textAlign: "center",
            lineHeight: 22,
          }}
        >
          See what stories others are exploring and share your journey together.
        </Text>
      </View>
    </SafeAreaView>
  );
}
