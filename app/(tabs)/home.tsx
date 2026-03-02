import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize, Spacing } from "../../constants/theme";

export default function HomeScreen() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: Spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: FontSize.xxl,
            fontWeight: "700",
            color: Colors.textPrimary,
            marginBottom: Spacing.xs,
          }}
        >
          {getGreeting()}
        </Text>
        <Text
          style={{
            fontSize: FontSize.md,
            color: Colors.textSecondary,
            marginBottom: Spacing.xl,
          }}
        >
          What story will you explore today?
        </Text>

        {/* Streak Widget */}
        <View
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 16,
            padding: Spacing.lg,
            marginBottom: Spacing.lg,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 32, marginRight: Spacing.md }}>🔥</Text>
          <View>
            <Text
              style={{
                fontSize: FontSize.lg,
                fontWeight: "700",
                color: Colors.textPrimary,
              }}
            >
              0 Day Streak
            </Text>
            <Text
              style={{ fontSize: FontSize.sm, color: Colors.textSecondary }}
            >
              Start listening to build your streak
            </Text>
          </View>
        </View>

        {/* Featured Collection */}
        <Text
          style={{
            fontSize: FontSize.lg,
            fontWeight: "700",
            color: Colors.textPrimary,
            marginBottom: Spacing.md,
          }}
        >
          Featured Collection
        </Text>
        <View
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 16,
            padding: Spacing.lg,
            marginBottom: Spacing.lg,
          }}
        >
          <Text
            style={{
              fontSize: FontSize.xl,
              fontWeight: "700",
              color: "#FFFFFF",
              marginBottom: Spacing.xs,
            }}
          >
            Stories of Faith
          </Text>
          <Text
            style={{
              fontSize: FontSize.sm,
              color: "rgba(255,255,255,0.8)",
              lineHeight: 20,
            }}
          >
            Abraham, David, Ruth, and Mary — people who trusted God in the
            impossible.
          </Text>
        </View>

        {/* Quick Actions */}
        <Text
          style={{
            fontSize: FontSize.lg,
            fontWeight: "700",
            color: Colors.textPrimary,
            marginBottom: Spacing.md,
          }}
        >
          Quick Actions
        </Text>
        <View style={{ flexDirection: "row", gap: Spacing.md }}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.surface,
              borderRadius: 12,
              padding: Spacing.lg,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: Spacing.sm }}>📖</Text>
            <Text
              style={{
                fontSize: FontSize.sm,
                fontWeight: "600",
                color: Colors.textPrimary,
                textAlign: "center",
              }}
            >
              Start a Story
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.surface,
              borderRadius: 12,
              padding: Spacing.lg,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: Spacing.sm }}>📝</Text>
            <Text
              style={{
                fontSize: FontSize.sm,
                fontWeight: "600",
                color: Colors.textPrimary,
                textAlign: "center",
              }}
            >
              Your Notes
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
