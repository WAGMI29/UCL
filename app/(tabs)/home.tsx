import { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing } from "../../constants/theme";
import { COLLECTIONS, STORY_METADATA } from "../../constants/content";
import {
  useAuthStore,
  useStreakStore,
  useProgressStore,
} from "../../lib/store";

export default function HomeScreen() {
  const router = useRouter();
  const { displayName } = useAuthStore();
  const { currentStreak, fetchStreak } = useStreakStore();
  const { progressMap, fetchProgress, getLastPlayed, getCollectionProgress } =
    useProgressStore();

  useEffect(() => {
    fetchStreak();
    fetchProgress();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const lastPlayed = getLastPlayed();
  const lastPlayedMeta = lastPlayed
    ? STORY_METADATA[lastPlayed.storyId]
    : null;

  // Find recommended collection based on user's bible familiarity
  const { bibleFamiliarity } = useAuthStore();
  const recommendedMap: Record<string, string> = {
    beginner: "stories-of-faith",
    intermediate: "courage-and-strength",
    advanced: "wisdom-and-proverbs",
  };
  const featuredId = bibleFamiliarity
    ? recommendedMap[bibleFamiliarity] || "stories-of-faith"
    : "stories-of-faith";
  const featuredCollection = COLLECTIONS.find((c) => c.id === featuredId);

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
          {displayName ? `, ${displayName}` : ""}
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
              {currentStreak} Day Streak
            </Text>
            <Text
              style={{ fontSize: FontSize.sm, color: Colors.textSecondary }}
            >
              {currentStreak > 0
                ? "Keep it going!"
                : "Start listening to build your streak"}
            </Text>
          </View>
        </View>

        {/* Continue Listening */}
        {lastPlayed && lastPlayedMeta && (
          <>
            <Text
              style={{
                fontSize: FontSize.lg,
                fontWeight: "700",
                color: Colors.textPrimary,
                marginBottom: Spacing.md,
              }}
            >
              Continue Listening
            </Text>
            <TouchableOpacity
              onPress={() => router.push(`/story/${lastPlayed.storyId}`)}
              activeOpacity={0.8}
              accessibilityLabel={`Continue listening to ${lastPlayedMeta.title}`}
              accessibilityRole="button"
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
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: Colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: Spacing.md,
                }}
              >
                <Ionicons name="play" size={20} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: FontSize.md,
                    fontWeight: "600",
                    color: Colors.textPrimary,
                    marginBottom: 2,
                  }}
                >
                  {lastPlayedMeta.title}
                </Text>
                <Text
                  style={{ fontSize: FontSize.xs, color: Colors.textSecondary }}
                >
                  {Math.floor(lastPlayed.positionSeconds / 60)}m listened
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </>
        )}

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
        <TouchableOpacity
          onPress={() =>
            router.push(`/collection/${featuredCollection?.id || "stories-of-faith"}`)
          }
          activeOpacity={0.8}
          accessibilityLabel={`Featured collection: ${featuredCollection?.title}`}
          accessibilityRole="button"
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
            {featuredCollection?.title || "Stories of Faith"}
          </Text>
          <Text
            style={{
              fontSize: FontSize.sm,
              color: "rgba(255,255,255,0.8)",
              lineHeight: 20,
              marginBottom: Spacing.md,
            }}
          >
            {featuredCollection?.description || ""}
          </Text>
          {featuredCollection && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: FontSize.xs,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {featuredCollection.stories.length} stories ·{" "}
                {Math.round(
                  getCollectionProgress(
                    featuredCollection.id,
                    featuredCollection.stories
                  ) * 100
                )}
                % complete
              </Text>
            </View>
          )}
        </TouchableOpacity>

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
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/library")}
            activeOpacity={0.8}
            accessibilityLabel="Browse stories"
            accessibilityRole="button"
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
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/notes")}
            activeOpacity={0.8}
            accessibilityLabel="View your notes"
            accessibilityRole="button"
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
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
