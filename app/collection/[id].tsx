import { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, BorderRadius } from "../../constants/theme";
import { COLLECTIONS, STORY_METADATA } from "../../constants/content";
import { useProgressStore } from "../../lib/store";
import { ProgressBar } from "../../components/ProgressBar";

export default function CollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { progressMap, fetchProgress, getCollectionProgress } =
    useProgressStore();
  const collection = COLLECTIONS.find((c) => c.id === id);

  useEffect(() => {
    fetchProgress();
  }, []);

  if (!collection) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <Text style={{ padding: Spacing.lg, color: Colors.textPrimary }}>
          Collection not found
        </Text>
      </SafeAreaView>
    );
  }

  const collectionProgress = getCollectionProgress(
    collection.id,
    collection.stories
  );
  const completedCount = collection.stories.filter(
    (sid) => progressMap[sid]?.completed
  ).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: Colors.primary,
          padding: Spacing.lg,
          paddingTop: Spacing.md,
          paddingBottom: Spacing.xl,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={{ marginBottom: Spacing.md }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: FontSize.xxl,
            fontWeight: "700",
            color: "#FFFFFF",
            marginBottom: Spacing.xs,
          }}
        >
          {collection.title}
        </Text>
        <Text
          style={{
            fontSize: FontSize.sm,
            color: "rgba(255,255,255,0.8)",
            lineHeight: 20,
            marginBottom: Spacing.md,
          }}
        >
          {collection.description}
        </Text>

        {/* Progress bar */}
        <View style={{ marginBottom: Spacing.xs }}>
          <ProgressBar
            progress={collectionProgress}
            height={6}
            color="#FFFFFF"
            backgroundColor="rgba(255,255,255,0.3)"
          />
        </View>
        <Text
          style={{
            fontSize: FontSize.xs,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {completedCount} of {collection.stories.length} stories completed
        </Text>
      </View>

      {/* Premium Gate Overlay */}
      {!collection.free && (
        <View
          style={{
            backgroundColor: Colors.accent,
            marginHorizontal: Spacing.lg,
            marginTop: Spacing.md,
            borderRadius: BorderRadius.md,
            padding: Spacing.lg,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="star"
            size={20}
            color="#FFFFFF"
            style={{ marginRight: Spacing.md }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: FontSize.sm,
                fontWeight: "700",
                color: "#FFFFFF",
                marginBottom: 2,
              }}
            >
              Premium Collection
            </Text>
            <Text
              style={{
                fontSize: FontSize.xs,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Upgrade to unlock all stories
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </View>
      )}

      {/* Story List */}
      <FlatList
        data={collection.stories}
        keyExtractor={(item) => item}
        contentContainerStyle={{ padding: Spacing.lg }}
        renderItem={({ item, index }) => {
          const meta = STORY_METADATA[item];
          const storyProgress = progressMap[item];
          const isCompleted = storyProgress?.completed;
          const isInProgress =
            storyProgress &&
            storyProgress.positionSeconds > 0 &&
            !isCompleted;

          return (
            <TouchableOpacity
              onPress={() => router.push(`/story/${item}`)}
              activeOpacity={0.7}
              accessibilityLabel={`${isCompleted ? "Completed: " : ""}Play ${meta?.title || item}`}
              accessibilityRole="button"
              style={{
                backgroundColor: Colors.surface,
                borderRadius: BorderRadius.md,
                padding: Spacing.lg,
                marginBottom: Spacing.md,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 1,
              }}
            >
              {/* Number / Status Icon */}
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: isCompleted
                    ? Colors.primary
                    : Colors.background,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: Spacing.md,
                }}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                ) : (
                  <Text
                    style={{
                      fontSize: FontSize.sm,
                      fontWeight: "700",
                      color: isInProgress
                        ? Colors.primary
                        : Colors.textMuted,
                    }}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: FontSize.md,
                    fontWeight: "600",
                    color: Colors.textPrimary,
                    marginBottom: isInProgress ? 4 : 0,
                  }}
                >
                  {meta?.title || item}
                </Text>
                {isInProgress && (
                  <ProgressBar
                    progress={
                      storyProgress.positionSeconds /
                      Math.max(storyProgress.positionSeconds + 60, 180)
                    }
                    height={3}
                  />
                )}
              </View>

              {isCompleted ? (
                <Ionicons
                  name="play-circle"
                  size={28}
                  color={Colors.primary}
                />
              ) : isInProgress ? (
                <Ionicons
                  name="pause-circle"
                  size={28}
                  color={Colors.primary}
                />
              ) : (
                <Ionicons
                  name="play-circle-outline"
                  size={28}
                  color={Colors.primary}
                />
              )}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
