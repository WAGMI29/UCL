import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing } from "../../constants/theme";
import { useAuthStore, useStreakStore, useNotesStore, useProgressStore } from "../../lib/store";

export default function ProfileScreen() {
  const { displayName, user, signOut } = useAuthStore();
  const { currentStreak } = useStreakStore();
  const { notes } = useNotesStore();
  const { progressMap } = useProgressStore();

  const completedStories = Object.values(progressMap).filter(
    (p) => p.completed
  ).length;

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "P";

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

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
          Profile
        </Text>

        {/* Avatar */}
        <View style={{ alignItems: "center", marginBottom: Spacing.xl }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: Colors.primary,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: Spacing.md,
            }}
          >
            <Text style={{ fontSize: 32, color: "#FFFFFF", fontWeight: "700" }}>
              {initials}
            </Text>
          </View>
          <Text
            style={{
              fontSize: FontSize.lg,
              fontWeight: "700",
              color: Colors.textPrimary,
            }}
          >
            {displayName || "Parables User"}
          </Text>
          {memberSince ? (
            <Text
              style={{ fontSize: FontSize.sm, color: Colors.textSecondary }}
            >
              Member since {memberSince}
            </Text>
          ) : null}
          <Text
            style={{
              fontSize: FontSize.sm,
              color: Colors.accent,
              fontWeight: "600",
              marginTop: Spacing.xs,
            }}
          >
            Free Plan
          </Text>
        </View>

        {/* Stats */}
        <View
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 16,
            padding: Spacing.lg,
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: Spacing.lg,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          {[
            { label: "Stories", value: String(completedStories) },
            { label: "Streak", value: String(currentStreak) },
            { label: "Notes", value: String(notes.length) },
            { label: "Questions", value: "0" },
          ].map((stat) => (
            <View key={stat.label} style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: FontSize.xl,
                  fontWeight: "700",
                  color: Colors.primary,
                }}
              >
                {stat.value}
              </Text>
              <Text
                style={{
                  fontSize: FontSize.xs,
                  color: Colors.textSecondary,
                  marginTop: 2,
                }}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Upgrade CTA */}
        <TouchableOpacity
          style={{
            backgroundColor: Colors.accent,
            borderRadius: 12,
            padding: Spacing.lg,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: Spacing.lg,
          }}
          accessibilityLabel="Upgrade to Premium"
          accessibilityRole="button"
        >
          <Ionicons name="star" size={20} color="#FFFFFF" />
          <Text
            style={{
              fontSize: FontSize.md,
              fontWeight: "700",
              color: "#FFFFFF",
              marginLeft: Spacing.sm,
            }}
          >
            Upgrade to Premium
          </Text>
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 12,
            padding: Spacing.lg,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: Spacing.md,
          }}
          accessibilityLabel="Settings"
          accessibilityRole="button"
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="settings-outline"
              size={20}
              color={Colors.textPrimary}
            />
            <Text
              style={{
                fontSize: FontSize.md,
                color: Colors.textPrimary,
                marginLeft: Spacing.md,
              }}
            >
              Settings
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textMuted}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 12,
            padding: Spacing.lg,
            flexDirection: "row",
            alignItems: "center",
          }}
          accessibilityLabel="Sign out"
          accessibilityRole="button"
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text
            style={{
              fontSize: FontSize.md,
              color: Colors.error,
              marginLeft: Spacing.md,
            }}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
