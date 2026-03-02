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

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuthStore();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp(email.trim(), password, displayName.trim());
    setIsSubmitting(false);

    if (error) {
      Alert.alert("Sign up failed", error);
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
              fontSize: FontSize.xxl,
              fontWeight: "700",
              color: Colors.textPrimary,
              textAlign: "center",
              marginBottom: Spacing.xs,
            }}
          >
            Create Account
          </Text>
          <Text
            style={{
              fontSize: FontSize.md,
              color: Colors.textSecondary,
              textAlign: "center",
              marginBottom: Spacing.xxl,
            }}
          >
            Begin your journey with Parables
          </Text>

          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Display Name"
            placeholderTextColor={Colors.textMuted}
            autoComplete="name"
            accessibilityLabel="Display name"
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
            placeholder="Password (min 6 characters)"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            autoComplete="new-password"
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
            onPress={handleSignUp}
            disabled={isSubmitting}
            accessibilityLabel="Create account"
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
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            accessibilityLabel="Go to sign in"
            accessibilityRole="button"
          >
            <Text
              style={{
                fontSize: FontSize.md,
                color: Colors.primary,
                textAlign: "center",
              }}
            >
              Already have an account?{" "}
              <Text style={{ fontWeight: "700" }}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
