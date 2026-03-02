import { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, BorderRadius } from "../../constants/theme";
import { STORY_METADATA } from "../../constants/content";
import { useNotesStore } from "../../lib/store";

export default function NotesScreen() {
  const { notes, fetchNotes, deleteNote } = useNotesStore();

  useEffect(() => {
    fetchNotes();
  }, []);

  // Group notes by story
  const grouped = notes.reduce(
    (acc, note) => {
      if (!acc[note.storyId]) acc[note.storyId] = [];
      acc[note.storyId].push(note);
      return acc;
    },
    {} as Record<string, typeof notes>
  );

  const storyIds = Object.keys(grouped);

  const handleDelete = (noteId: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteNote(noteId),
      },
    ]);
  };

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
          Notes
        </Text>
        <Text
          style={{
            fontSize: FontSize.md,
            color: Colors.textSecondary,
            marginBottom: Spacing.lg,
          }}
        >
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </Text>
      </View>

      {notes.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: Spacing.xl,
          }}
        >
          <Ionicons
            name="document-text-outline"
            size={64}
            color={Colors.border}
          />
          <Text
            style={{
              fontSize: FontSize.lg,
              fontWeight: "600",
              color: Colors.textPrimary,
              marginTop: Spacing.lg,
              textAlign: "center",
            }}
          >
            No notes yet
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
            Start taking notes while listening to stories. Your reflections will
            appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={storyIds}
          keyExtractor={(item) => item}
          contentContainerStyle={{ padding: Spacing.lg, paddingTop: 0 }}
          renderItem={({ item: storyId }) => {
            const storyNotes = grouped[storyId];
            const meta = STORY_METADATA[storyId];

            return (
              <View style={{ marginBottom: Spacing.xl }}>
                <Text
                  style={{
                    fontSize: FontSize.md,
                    fontWeight: "700",
                    color: Colors.primary,
                    marginBottom: Spacing.md,
                  }}
                >
                  {meta?.title || storyId}
                </Text>

                {storyNotes.map((note) => (
                  <View
                    key={note.id}
                    style={{
                      backgroundColor: Colors.surface,
                      borderRadius: BorderRadius.md,
                      padding: Spacing.lg,
                      marginBottom: Spacing.sm,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.04,
                      shadowRadius: 4,
                      elevation: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: FontSize.md,
                        color: Colors.textPrimary,
                        lineHeight: 24,
                        marginBottom: Spacing.sm,
                      }}
                    >
                      {note.content}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: FontSize.xs,
                          color: Colors.textMuted,
                        }}
                      >
                        {new Date(note.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDelete(note.id)}
                        accessibilityLabel="Delete note"
                        accessibilityRole="button"
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color={Colors.textMuted}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
