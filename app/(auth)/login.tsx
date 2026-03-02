import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, BorderRadius } from "../../constants/theme";
import { useAuthStore } from "../../lib/store";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setIsSubmitting(false);

    if (error) {
      Alert.alert("Sign in failed", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
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
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
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
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            autoComplete="password"
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
            onPress={handleSignIn}
            disabled={isSubmitting}
            accessibilityLabel="Sign in"
            accessibilityRole="button"
            style={{
              backgroundColor: isSubmitting ? Colors.textMuted : Colors.primary,
              borderRadius: BorderRadius.md,
              padding: Spacing.lg,
              alignItems: "center",
              marginBottom: Spacing.lg,
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  fontSize: FontSize.md,
                  fontWeight: "700",
                  color: "#FFFFFF",
                }}
              >
                Sign In
              </Text>
            )}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
