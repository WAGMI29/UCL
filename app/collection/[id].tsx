import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, BorderRadius } from "../../constants/theme";
import { COLLECTIONS, STORY_METADATA } from "../../constants/content";

export default function CollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const collection = COLLECTIONS.find((c) => c.id === id);

  if (!collection) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <Text style={{ padding: Spacing.lg, color: Colors.textPrimary }}>
          Collection not found
        </Text>
      </SafeAreaView>
    );
  }

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
          }}
        >
          {collection.description}
        </Text>
        <Text
          style={{
            fontSize: FontSize.xs,
            color: "rgba(255,255,255,0.6)",
            marginTop: Spacing.sm,
          }}
        >
          {collection.stories.length} stories
        </Text>
      </View>

      {/* Story List */}
      <FlatList
        data={collection.stories}
        keyExtractor={(item) => item}
        contentContainerStyle={{ padding: Spacing.lg }}
        renderItem={({ item, index }) => {
          const meta = STORY_METADATA[item];
          return (
            <TouchableOpacity
              onPress={() => router.push(`/story/${item}`)}
              activeOpacity={0.7}
              accessibilityLabel={`Play ${meta?.title || item}`}
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
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: Colors.background,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: Spacing.md,
                }}
              >
                <Text
                  style={{
                    fontSize: FontSize.sm,
                    fontWeight: "700",
                    color: Colors.primary,
                  }}
                >
                  {index + 1}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: FontSize.md,
                    fontWeight: "600",
                    color: Colors.textPrimary,
                  }}
                >
                  {meta?.title || item}
                </Text>
              </View>
              <Ionicons
                name="play-circle-outline"
                size={28}
                color={Colors.primary}
              />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
