import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing } from "../../constants/theme";
import { COLLECTIONS } from "../../constants/content";

export default function LibraryScreen() {
  const router = useRouter();

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
          Library
        </Text>
        <Text
          style={{
            fontSize: FontSize.md,
            color: Colors.textSecondary,
            marginBottom: Spacing.xl,
          }}
        >
          {COLLECTIONS.length} collections · {COLLECTIONS.reduce((sum, c) => sum + c.stories.length, 0)} stories
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: Spacing.md,
          }}
        >
          {COLLECTIONS.map((collection) => (
            <TouchableOpacity
              key={collection.id}
              onPress={() => router.push(`/collection/${collection.id}`)}
              activeOpacity={0.8}
              accessibilityLabel={`${collection.title}, ${collection.stories.length} stories${!collection.free ? ", premium" : ""}`}
              accessibilityRole="button"
              style={{
                width: "47%",
                backgroundColor: Colors.surface,
                borderRadius: 16,
                padding: Spacing.lg,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
                position: "relative",
              }}
            >
              {!collection.free && (
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

              {/* Progress Ring Placeholder */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  borderWidth: 3,
                  borderColor: collection.free
                    ? Colors.primary
                    : Colors.border,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: Spacing.md,
                }}
              >
                <Text
                  style={{
                    fontSize: FontSize.xs,
                    fontWeight: "700",
                    color: collection.free
                      ? Colors.primary
                      : Colors.textMuted,
                  }}
                >
                  0%
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
                {collection.title}
              </Text>
              <Text
                style={{
                  fontSize: FontSize.xs,
                  color: Colors.textSecondary,
                }}
              >
                {collection.stories.length} stories
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
