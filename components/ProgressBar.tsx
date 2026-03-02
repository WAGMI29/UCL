import { View } from "react-native";
import { Colors } from "../constants/theme";

interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
}

export function ProgressBar({
  progress,
  height = 4,
  color = Colors.primary,
  backgroundColor = Colors.border,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      style={{
        height,
        backgroundColor,
        borderRadius: height / 2,
        overflow: "hidden",
      }}
      accessibilityLabel={`Progress: ${Math.round(clampedProgress * 100)} percent`}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: 100,
        now: Math.round(clampedProgress * 100),
      }}
    >
      <View
        style={{
          height,
          width: `${clampedProgress * 100}%`,
          backgroundColor: color,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}
