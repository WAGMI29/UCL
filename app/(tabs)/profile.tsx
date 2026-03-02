import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing } from "../../constants/theme";
import {
  useAuthStore,
  useStreakStore,
  useNotesStore,
  useProgressStore,
} from "../../lib/store";
import { useSubscription } from "../../hooks/useSubscription";
import { supabase } from "../../lib/supabase";

const BADGE_DEFINITIONS = [
  { type: "first_story", label: "First Story", icon: "📖", desc: "Complete your first story" },
  { type: "streak_3", label: "3-Day Streak", icon: "🔥", desc: "Listen 3 days in a row" },
  { type: "streak_7", label: "Weekly Warrior", icon: "⚡", desc: "7-day listening streak" },
  { type: "streak_30", label: "Faithful Listener", icon: "👑", desc: "30-day listening streak" },
  { type: "collection_complete", label: "Collection Master", icon: "🏆", desc: "Complete an entire collection" },
  { type: "notes_5", label: "Reflective", icon: "📝", desc: "Write 5 notes" },
  { type: "questions_10", label: "Curious Mind", icon: "💡", desc: "Ask 10 questions" },
  { type: "all_stories", label: "Scholar", icon: "🎓", desc: "Complete all 21 stories" },
];

export default function ProfileScreen() {
  const { displayName, user, signOut } = useAuthStore();
  const { currentStreak, longestStreak } = useStreakStore();
  const { notes } = useNotesStore();
  const { progressMap } = useProgressStore();
  const { isPremium, tier } = useSubscription();
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  const completedStories = Object.values(progressMap).filter(
    (p) => p.completed
  ).length;

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_badges")
      .select("badge_type")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setEarnedBadges(data.map((b) => b.badge_type));
      });
  }, [user]);

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
      <ScrollView
        contentContainerStyle={{ padding: Spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
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
            <Text
              style={{ fontSize: 32, color: "#FFFFFF", fontWeight: "700" }}
            >
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
          <View
            style={{
              backgroundColor: isPremium ? Colors.accent : Colors.surface,
              borderRadius: 9999,
              paddingVertical: Spacing.xs,
              paddingHorizontal: Spacing.md,
              marginTop: Spacing.sm,
              borderWidth: isPremium ? 0 : 1,
              borderColor: Colors.border,
            }}
          >
            <Text
              style={{
                fontSize: FontSize.xs,
                color: isPremium ? "#FFFFFF" : Colors.textSecondary,
                fontWeight: "600",
              }}
            >
              {isPremium ? "Premium" : "Free Plan"}
            </Text>
          </View>
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
            { label: "Best", value: String(longestStreak) },
            { label: "Notes", value: String(notes.length) },
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

        {/* Badges */}
        <Text
          style={{
            fontSize: FontSize.lg,
            fontWeight: "700",
            color: Colors.textPrimary,
            marginBottom: Spacing.md,
          }}
        >
          Badges
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: Spacing.sm,
            marginBottom: Spacing.lg,
          }}
        >
          {BADGE_DEFINITIONS.map((badge) => {
            const earned = earnedBadges.includes(badge.type);
            return (
              <View
                key={badge.type}
                style={{
                  width: "23%",
                  alignItems: "center",
                  opacity: earned ? 1 : 0.35,
                  marginBottom: Spacing.sm,
                }}
              >
                <Text style={{ fontSize: 28, marginBottom: 4 }}>
                  {badge.icon}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "600",
                    color: Colors.textPrimary,
                    textAlign: "center",
                  }}
                  numberOfLines={2}
                >
                  {badge.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Upgrade CTA */}
        {!isPremium && (
          <TouchableOpacity
            style={{
              backgroundColor: Colors.accent,
              borderRadius: 12,
              padding: Spacing.lg,
              marginBottom: Spacing.lg,
            }}
            accessibilityLabel="Upgrade to Premium"
            accessibilityRole="button"
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: Spacing.sm,
              }}
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
            </View>
            <Text
              style={{
                fontSize: FontSize.xs,
                color: "rgba(255,255,255,0.8)",
                textAlign: "center",
              }}
            >
              $5.99/month or $49.99/year · Unlock all collections
            </Text>
          </TouchableOpacity>
        )}

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

        {isPremium && (
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
            accessibilityLabel="Manage subscription"
            accessibilityRole="button"
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="card-outline"
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
                Manage Subscription
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        )}

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
      </ScrollView>
    </SafeAreaView>
  );
}
