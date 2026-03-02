import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, BorderRadius } from "../../constants/theme";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View
        style={{
          flex: 1,
          padding: Spacing.lg,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: FontSize.title,
            fontWeight: "700",
            color: Colors.primary,
            textAlign: "center",
            marginBottom: Spacing.xs,
          }}
        >
          Parables
        </Text>
        <Text
          style={{
            fontSize: FontSize.md,
            color: Colors.textSecondary,
            textAlign: "center",
            marginBottom: Spacing.xxl,
          }}
        >
          Hear the story. Ask the question. Live the lesson.
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          accessibilityLabel="Email address"
          style={{
            backgroundColor: Colors.surface,
            borderRadius: BorderRadius.md,
            padding: Spacing.lg,
            fontSize: FontSize.md,
            color: Colors.textPrimary,
            marginBottom: Spacing.md,
            borderWidth: 1,
            borderColor: Colors.border,
          }}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={Colors.textMuted}
          secureTextEntry
          accessibilityLabel="Password"
          style={{
            backgroundColor: Colors.surface,
            borderRadius: BorderRadius.md,
            padding: Spacing.lg,
            fontSize: FontSize.md,
            color: Colors.textPrimary,
            marginBottom: Spacing.lg,
            borderWidth: 1,
            borderColor: Colors.border,
          }}
        />

        <TouchableOpacity
          accessibilityLabel="Sign in"
          accessibilityRole="button"
          style={{
            backgroundColor: Colors.primary,
            borderRadius: BorderRadius.md,
            padding: Spacing.lg,
            alignItems: "center",
            marginBottom: Spacing.lg,
          }}
        >
          <Text
            style={{
              fontSize: FontSize.md,
              fontWeight: "700",
              color: "#FFFFFF",
            }}
          >
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/signup")}
          accessibilityLabel="Create an account"
          accessibilityRole="button"
        >
          <Text
            style={{
              fontSize: FontSize.md,
              color: Colors.primary,
              textAlign: "center",
            }}
          >
            Don't have an account?{" "}
            <Text style={{ fontWeight: "700" }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
