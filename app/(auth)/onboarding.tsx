import { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, BorderRadius } from "../../constants/theme";
import { useAuthStore } from "../../lib/store";

const FAMILIARITY_OPTIONS = [
  { label: "Just starting out", value: "beginner" },
  { label: "I know some stories", value: "intermediate" },
  { label: "I want to go deeper", value: "advanced" },
];

const RECOMMENDED: Record<string, string> = {
  beginner: "Stories of Faith",
  intermediate: "Courage & Strength",
  advanced: "Wisdom & Proverbs",
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateProfile, setHasCompletedOnboarding } = useAuthStore();
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = async () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1 && selectedOption) {
      await updateProfile({ bible_familiarity: selectedOption });
      setStep(2);
    } else if (step === 2) {
      setHasCompletedOnboarding(true);
      router.replace("/(tabs)/home");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View
        style={{
          flex: 1,
          padding: Spacing.lg,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Progress dots */}
        <View
          style={{
            flexDirection: "row",
            gap: Spacing.sm,
            marginBottom: Spacing.xxl,
          }}
        >
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={{
                width: i === step ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === step ? Colors.primary : Colors.border,
              }}
            />
          ))}
        </View>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <>
            <Text style={{ fontSize: 64, marginBottom: Spacing.xl }}>📖</Text>
            <Text
              style={{
                fontSize: FontSize.xxl,
                fontWeight: "700",
                color: Colors.textPrimary,
                textAlign: "center",
                marginBottom: Spacing.md,
              }}
            >
              Welcome to Parables
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
              Hear the story. Ask the question.{"\n"}Live the lesson.
            </Text>
          </>
        )}

        {/* Step 1: Bible familiarity */}
        {step === 1 && (
          <>
            <Text
              style={{
                fontSize: FontSize.xxl,
                fontWeight: "700",
                color: Colors.textPrimary,
                textAlign: "center",
                marginBottom: Spacing.md,
              }}
            >
              How familiar are you{"\n"}with the Bible?
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
              This helps us recommend the right stories for you.
            </Text>
            <View
              style={{
                width: "100%",
                gap: Spacing.md,
                marginBottom: Spacing.xl,
              }}
            >
              {FAMILIARITY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setSelectedOption(option.value)}
                  accessibilityLabel={option.label}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: selectedOption === option.value }}
                  style={{
                    backgroundColor:
                      selectedOption === option.value
                        ? Colors.primary
                        : Colors.surface,
                    borderRadius: BorderRadius.md,
                    padding: Spacing.lg,
                    borderWidth: 1,
                    borderColor:
                      selectedOption === option.value
                        ? Colors.primary
                        : Colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: FontSize.md,
                      fontWeight: "600",
                      color:
                        selectedOption === option.value
                          ? "#FFFFFF"
                          : Colors.textPrimary,
                      textAlign: "center",
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Step 2: Recommendation */}
        {step === 2 && (
          <>
            <Text style={{ fontSize: 64, marginBottom: Spacing.xl }}>✨</Text>
            <Text
              style={{
                fontSize: FontSize.xxl,
                fontWeight: "700",
                color: Colors.textPrimary,
                textAlign: "center",
                marginBottom: Spacing.md,
              }}
            >
              You're all set
            </Text>
            <Text
              style={{
                fontSize: FontSize.md,
                color: Colors.textSecondary,
                textAlign: "center",
                lineHeight: 24,
                marginBottom: Spacing.sm,
              }}
            >
              We recommend starting with
            </Text>
            <Text
              style={{
                fontSize: FontSize.lg,
                fontWeight: "700",
                color: Colors.primary,
                textAlign: "center",
                marginBottom: Spacing.xl,
              }}
            >
              {selectedOption ? RECOMMENDED[selectedOption] : "Stories of Faith"}
            </Text>
          </>
        )}

        {/* Continue button */}
        <TouchableOpacity
          onPress={handleNext}
          disabled={step === 1 && !selectedOption}
          accessibilityLabel={step === 2 ? "Get started" : "Continue"}
          accessibilityRole="button"
          style={{
            backgroundColor:
              step === 1 && !selectedOption ? Colors.border : Colors.primary,
            borderRadius: BorderRadius.md,
            paddingVertical: Spacing.lg,
            paddingHorizontal: Spacing.xxl,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: FontSize.md,
              fontWeight: "700",
              color: "#FFFFFF",
            }}
          >
            {step === 2 ? "Get Started" : "Continue"}
          </Text>
        </TouchableOpacity>

        {step === 0 && (
          <TouchableOpacity
            onPress={() => {
              setHasCompletedOnboarding(true);
              router.replace("/(tabs)/home");
            }}
            style={{ marginTop: Spacing.lg }}
            accessibilityLabel="Skip onboarding"
            accessibilityRole="button"
          >
            <Text
              style={{ fontSize: FontSize.sm, color: Colors.textSecondary }}
            >
              Skip
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
