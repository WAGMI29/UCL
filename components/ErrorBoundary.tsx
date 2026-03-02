import { Component, ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Colors, FontSize, Spacing, BorderRadius } from "../constants/theme";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.background,
            alignItems: "center",
            justifyContent: "center",
            padding: Spacing.xl,
          }}
        >
          <Text style={{ fontSize: 48, marginBottom: Spacing.lg }}>📖</Text>
          <Text
            style={{
              fontSize: FontSize.xl,
              fontWeight: "700",
              color: Colors.textPrimary,
              textAlign: "center",
              marginBottom: Spacing.md,
            }}
          >
            Something went wrong
          </Text>
          <Text
            style={{
              fontSize: FontSize.md,
              color: Colors.textSecondary,
              textAlign: "center",
              lineHeight: 24,
              marginBottom: Spacing.xl,
            }}
          >
            An unexpected error occurred. Please try again.
          </Text>
          <TouchableOpacity
            onPress={() => this.setState({ hasError: false })}
            accessibilityLabel="Try again"
            accessibilityRole="button"
            style={{
              backgroundColor: Colors.primary,
              borderRadius: BorderRadius.md,
              paddingVertical: Spacing.md,
              paddingHorizontal: Spacing.xl,
            }}
          >
            <Text
              style={{
                fontSize: FontSize.md,
                fontWeight: "700",
                color: "#FFFFFF",
              }}
            >
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
