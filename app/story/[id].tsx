import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  FontSize,
  Spacing,
  BorderRadius,
} from "../../constants/theme";
import {
  STORY_METADATA,
  STORY_SCRIPTS,
  COLLECTIONS,
} from "../../constants/content";
import { useAudio } from "../../hooks/useAudio";
import { AudioPlayer } from "../../components/AudioPlayer";
import { NoteEditor } from "../../components/NoteEditor";
import { generateStoryAudio, getCachedAudioUri } from "../../lib/elevenlabs";
import {
  useProgressStore,
  useStreakStore,
  useNotesStore,
} from "../../lib/store";

export default function StoryPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const meta = STORY_METADATA[id];
  const script = STORY_SCRIPTS[id];
  const collection = COLLECTIONS.find((c) => c.id === meta?.collectionId);

  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);

  const { updateProgress, progressMap } = useProgressStore();
  const { checkAndUpdateStreak } = useStreakStore();
  const { addNote } = useNotesStore();

  const audio = useAudio(audioUri);
  const lastSaveRef = useRef(0);
  const hasMarkedComplete = useRef(false);

  // Load cached audio on mount
  useEffect(() => {
    if (!id) return;
    getCachedAudioUri(id).then((uri) => {
      if (uri) setAudioUri(uri);
    });
  }, [id]);

  // Save progress every 5 seconds while playing
  useEffect(() => {
    if (!audio.isPlaying || !meta) return;

    const now = Date.now();
    if (now - lastSaveRef.current < 5000) return;
    lastSaveRef.current = now;

    updateProgress(id, meta.collectionId, audio.position, false);
  }, [audio.position, audio.isPlaying]);

  // Mark story complete when reaching end
  useEffect(() => {
    if (
      audio.duration > 0 &&
      audio.position >= audio.duration - 2 &&
      !hasMarkedComplete.current &&
      meta
    ) {
      hasMarkedComplete.current = true;
      updateProgress(id, meta.collectionId, audio.duration, true);
      checkAndUpdateStreak();
    }
  }, [audio.position, audio.duration]);

  // Restore position from saved progress
  useEffect(() => {
    const saved = progressMap[id];
    if (saved && saved.positionSeconds > 0 && audio.duration > 0 && !saved.completed) {
      audio.seek(saved.positionSeconds);
    }
  }, [audio.duration]);

  const handleGenerateAudio = async () => {
    if (!script) return;
    setIsGenerating(true);
    try {
      const uri = await generateStoryAudio(id, script);
      setAudioUri(uri);
    } catch (error) {
      Alert.alert(
        "Audio Error",
        "Failed to generate audio. Check your ElevenLabs API key."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextStory = useCallback(() => {
    if (!collection) return;
    const currentIndex = collection.stories.indexOf(id);
    if (currentIndex < collection.stories.length - 1) {
      const nextId = collection.stories[currentIndex + 1];
      router.replace(`/story/${nextId}`);
    } else {
      router.back();
    }
  }, [collection, id, router]);

  const handleSaveNote = async (content: string) => {
    await addNote(id, content);
    setShowNoteEditor(false);
  };

  if (!meta || !script) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <Text style={{ padding: Spacing.lg, color: Colors.textPrimary }}>
          Story not found
        </Text>
      </SafeAreaView>
    );
  }

  const paragraphs = script.trim().split("\n\n");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
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
          onPress={() => setShowNoteEditor(true)}
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

        {audioUri ? (
          <AudioPlayer
            isPlaying={audio.isPlaying}
            isLoading={audio.isLoading}
            position={audio.position}
            duration={audio.duration}
            playbackSpeed={audio.playbackSpeed}
            onPlay={audio.play}
            onPause={audio.pause}
            onSkipForward={audio.skipForward}
            onSkipBackward={audio.skipBackward}
            onSetSpeed={audio.setSpeed}
          />
        ) : (
          <View style={{ alignItems: "center", gap: Spacing.md }}>
            {/* Waveform Placeholder */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                height: 48,
                gap: 3,
              }}
            >
              {Array.from({ length: 30 }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 3,
                    height: 8 + ((i * 7 + 13) % 32),
                    backgroundColor: Colors.primary,
                    borderRadius: 2,
                    opacity: 0.3,
                  }}
                />
              ))}
            </View>

            <TouchableOpacity
              onPress={handleGenerateAudio}
              disabled={isGenerating}
              accessibilityLabel="Generate audio narration"
              accessibilityRole="button"
              style={{
                backgroundColor: isGenerating
                  ? Colors.textMuted
                  : Colors.primary,
                borderRadius: BorderRadius.md,
                paddingVertical: Spacing.md,
                paddingHorizontal: Spacing.xl,
                flexDirection: "row",
                alignItems: "center",
                gap: Spacing.sm,
              }}
            >
              {isGenerating ? (
                <>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text
                    style={{
                      fontSize: FontSize.md,
                      fontWeight: "700",
                      color: "#FFFFFF",
                    }}
                  >
                    Generating Audio...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="volume-high" size={20} color="#FFFFFF" />
                  <Text
                    style={{
                      fontSize: FontSize.md,
                      fontWeight: "700",
                      color: "#FFFFFF",
                    }}
                  >
                    Listen to Story
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Completed banner */}
        {hasMarkedComplete.current && (
          <TouchableOpacity
            onPress={handleNextStory}
            accessibilityLabel="Play next story"
            accessibilityRole="button"
            style={{
              backgroundColor: Colors.accent,
              borderRadius: BorderRadius.md,
              paddingVertical: Spacing.md,
              paddingHorizontal: Spacing.xl,
              marginTop: Spacing.lg,
              flexDirection: "row",
              alignItems: "center",
              gap: Spacing.sm,
            }}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text
              style={{
                fontSize: FontSize.md,
                fontWeight: "700",
                color: "#FFFFFF",
              }}
            >
              Next Story
            </Text>
          </TouchableOpacity>
        )}
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
        {paragraphs.map((paragraph, index) => (
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

      {/* Note Editor Modal */}
      <NoteEditor
        visible={showNoteEditor}
        onClose={() => setShowNoteEditor(false)}
        onSave={handleSaveNote}
      />
    </SafeAreaView>
  );
}
