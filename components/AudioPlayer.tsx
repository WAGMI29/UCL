import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing } from "../constants/theme";

interface AudioPlayerProps {
  isPlaying: boolean;
  isLoading: boolean;
  position: number;
  duration: number;
  playbackSpeed: number;
  onPlay: () => void;
  onPause: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onSetSpeed: (rate: number) => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AudioPlayer({
  isPlaying,
  isLoading,
  position,
  duration,
  playbackSpeed,
  onPlay,
  onPause,
  onSkipForward,
  onSkipBackward,
  onSetSpeed,
}: AudioPlayerProps) {
  const progress = duration > 0 ? position / duration : 0;

  return (
    <View style={{ alignItems: "center" }}>
      {/* Seek bar */}
      <View style={{ width: "100%", marginBottom: Spacing.md }}>
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
              width: `${progress * 100}%`,
              backgroundColor: Colors.primary,
              borderRadius: 2,
            }}
          />
        </View>
        <View
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <Text style={{ fontSize: FontSize.xs, color: Colors.textMuted }}>
            {formatTime(position)}
          </Text>
          <Text style={{ fontSize: FontSize.xs, color: Colors.textMuted }}>
            {duration > 0 ? formatTime(duration) : "--:--"}
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
          onPress={onSkipBackward}
          accessibilityLabel="Skip back 15 seconds"
          accessibilityRole="button"
        >
          <Ionicons name="play-back" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={isPlaying ? onPause : onPlay}
          accessibilityLabel={isPlaying ? "Pause" : "Play"}
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
          {isLoading ? (
            <Text style={{ color: "#FFFFFF", fontSize: FontSize.xs }}>...</Text>
          ) : (
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={28}
              color="#FFFFFF"
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSkipForward}
          accessibilityLabel="Skip forward 15 seconds"
          accessibilityRole="button"
        >
          <Ionicons name="play-forward" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Speed */}
      <TouchableOpacity
        onPress={() => {
          const speeds = [0.75, 1, 1.25, 1.5, 2];
          const currentIndex = speeds.indexOf(playbackSpeed);
          const nextIndex = (currentIndex + 1) % speeds.length;
          onSetSpeed(speeds[nextIndex]);
        }}
        accessibilityLabel={`Playback speed ${playbackSpeed}x`}
        accessibilityRole="button"
        style={{
          backgroundColor: Colors.surface,
          borderRadius: 9999,
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
          {playbackSpeed}x
        </Text>
      </TouchableOpacity>
    </View>
  );
}
