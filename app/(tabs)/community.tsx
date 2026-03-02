import { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, BorderRadius } from "../../constants/theme";
import { STORY_METADATA } from "../../constants/content";
import { supabase } from "../../lib/supabase";

interface ActivityItem {
  id: string;
  userId: string;
  displayName: string;
  activityType: string;
  storyId: string | null;
  createdAt: string;
}

const ACTIVITY_ICONS: Record<string, { icon: string; color: string }> = {
  completed_story: { icon: "checkmark-circle", color: "#4CAF50" },
  started_story: { icon: "play-circle", color: Colors.primary },
  earned_badge: { icon: "trophy", color: Colors.accent },
  joined: { icon: "person-add", color: "#2196F3" },
};

function getActivityMessage(item: ActivityItem): string {
  const storyTitle = item.storyId
    ? STORY_METADATA[item.storyId]?.title || "a story"
    : "";

  switch (item.activityType) {
    case "completed_story":
      return `finished listening to "${storyTitle}"`;
    case "started_story":
      return `started "${storyTitle}"`;
    case "earned_badge":
      return "earned a new badge";
    case "joined":
      return "joined Parables";
    default:
      return "was active";
  }
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function CommunityScreen() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("activity_feed")
      .select("*, profiles(display_name)")
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) {
      setActivities(
        data.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          displayName: row.profiles?.display_name || "A fellow reader",
          activityType: row.activity_type,
          storyId: row.story_id,
          createdAt: row.created_at,
        }))
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchActivities();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("activity_feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_feed" },
        () => fetchActivities()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ padding: Spacing.lg, paddingBottom: 0 }}>
        <Text
          style={{
            fontSize: FontSize.xxl,
            fontWeight: "700",
            color: Colors.textPrimary,
            marginBottom: Spacing.xs,
          }}
        >
          Community
        </Text>
        <Text
          style={{
            fontSize: FontSize.md,
            color: Colors.textSecondary,
            marginBottom: Spacing.lg,
          }}
        >
          See what others are exploring
        </Text>
      </View>

      {activities.length === 0 && !isLoading ? (
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
            See what stories others are exploring and share your journey
            together.
          </Text>
        </View>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: Spacing.lg, paddingTop: 0 }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchActivities}
              tintColor={Colors.primary}
            />
          }
          renderItem={({ item }) => {
            const config = ACTIVITY_ICONS[item.activityType] || {
              icon: "ellipse",
              color: Colors.textMuted,
            };

            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginBottom: Spacing.lg,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: Colors.surface,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: Spacing.md,
                  }}
                >
                  <Ionicons
                    name={config.icon as any}
                    size={18}
                    color={config.color}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: FontSize.sm,
                      color: Colors.textPrimary,
                      lineHeight: 20,
                    }}
                  >
                    <Text style={{ fontWeight: "700" }}>
                      {item.displayName}
                    </Text>{" "}
                    {getActivityMessage(item)}
                  </Text>
                  <Text
                    style={{
                      fontSize: FontSize.xs,
                      color: Colors.textMuted,
                      marginTop: 2,
                    }}
                  >
                    {getTimeAgo(item.createdAt)}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
