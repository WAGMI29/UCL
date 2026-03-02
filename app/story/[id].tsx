import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  FontSize,
  Spacing,
  BorderRadius,
} from "../../constants/theme";
import { STORY_METADATA, STORY_SCRIPTS, COLLECTIONS } from "../../constants/content";

export default function StoryPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const meta = STORY_METADATA[id];
  const script = STORY_SCRIPTS[id];
  const collection = COLLECTIONS.find((c) => c.id === meta?.collectionId);

  if (!meta || !script) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <Text style={{ padding: Spacing.lg, color: Colors.textPrimary }}>
          Story not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.background }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: Spacing.lg,
          paddingBottom: Spacing.sm,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: FontSize.sm,
            color: Colors.textSecondary,
            fontWeight: "500",
          }}
        >
          {collection?.title}
        </Text>
        <TouchableOpacity
          accessibilityLabel="Take a note"
          accessibilityRole="button"
        >
          <Ionicons
            name="document-text-outline"
            size={22}
            color={Colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Player Area */}
      <View
        style={{
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.xl,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: FontSize.xxl,
            fontWeight: "700",
            color: Colors.textPrimary,
            textAlign: "center",
            marginBottom: Spacing.lg,
          }}
        >
          {meta.title}
        </Text>

        {/* Waveform Placeholder */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: 48,
            gap: 3,
            marginBottom: Spacing.lg,
          }}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <View
              key={i}
              style={{
                width: 3,
                height: 8 + Math.random() * 32,
                backgroundColor: Colors.primary,
                borderRadius: 2,
                opacity: 0.3,
              }}
            />
          ))}
        </View>

        {/* Time / Seek Placeholder */}
        <View
          style={{
            width: "100%",
            marginBottom: Spacing.md,
          }}
        >
          <View
            style={{
              height: 4,
              backgroundColor: Colors.border,
              borderRadius: 2,
              marginBottom: Spacing.sm,
            }}
          >
            <View
              style={{
                height: 4,
                width: "0%",
                backgroundColor: Colors.primary,
                borderRadius: 2,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{ fontSize: FontSize.xs, color: Colors.textMuted }}
            >
              0:00
            </Text>
            <Text
              style={{ fontSize: FontSize.xs, color: Colors.textMuted }}
            >
              --:--
            </Text>
          </View>
        </View>

        {/* Controls */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: Spacing.xl,
            marginBottom: Spacing.md,
          }}
        >
          <TouchableOpacity
            accessibilityLabel="Skip back 15 seconds"
            accessibilityRole="button"
          >
            <Ionicons
              name="play-back"
              size={28}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Play story"
            accessibilityRole="button"
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: Colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="play" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Skip forward 15 seconds"
            accessibilityRole="button"
          >
            <Ionicons
              name="play-forward"
              size={28}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Speed */}
        <TouchableOpacity
          accessibilityLabel="Playback speed, currently 1x"
          accessibilityRole="button"
          style={{
            backgroundColor: Colors.surface,
            borderRadius: BorderRadius.full,
            paddingVertical: Spacing.xs,
            paddingHorizontal: Spacing.md,
            borderWidth: 1,
            borderColor: Colors.border,
          }}
        >
          <Text
            style={{
              fontSize: FontSize.sm,
              fontWeight: "600",
              color: Colors.textPrimary,
            }}
          >
            1x
          </Text>
        </TouchableOpacity>
      </View>

      {/* Story Text */}
      <ScrollView
        contentContainerStyle={{
          padding: Spacing.lg,
          paddingTop: 0,
        }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        {script
          .trim()
          .split("\n\n")
          .map((paragraph, index) => (
            <Text
              key={index}
              style={{
                fontSize: FontSize.md,
                color: Colors.textPrimary,
                lineHeight: 28,
                marginBottom: Spacing.lg,
              }}
            >
              {paragraph.trim()}
            </Text>
          ))}
      </ScrollView>

      {/* Voice Q&A FAB */}
      <TouchableOpacity
        accessibilityLabel="Ask a question about this story"
        accessibilityRole="button"
        style={{
          position: "absolute",
          bottom: 40,
          right: Spacing.lg,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: Colors.accent,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Ionicons name="mic" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
