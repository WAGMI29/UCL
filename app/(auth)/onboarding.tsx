import { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, BorderRadius } from "../../constants/theme";

const { width } = Dimensions.get("window");

const STEPS = [
  {
    title: "Welcome to Parables",
    subtitle: "Hear the story. Ask the question.\nLive the lesson.",
    icon: "📖",
  },
  {
    title: "How familiar are you\nwith the Bible?",
    subtitle: "This helps us recommend the right stories for you.",
    options: ["Just starting out", "I know some stories", "I want to go deeper"],
  },
  {
    title: "You're all set",
    subtitle:
      "We've picked a collection just for you.\nStart your free trial and explore.",
    icon: "✨",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      router.replace("/(tabs)/home");
    }
  };

  const currentStep = STEPS[step];

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
          {STEPS.map((_, i) => (
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

        {currentStep.icon && (
          <Text style={{ fontSize: 64, marginBottom: Spacing.xl }}>
            {currentStep.icon}
          </Text>
        )}

        <Text
          style={{
            fontSize: FontSize.xxl,
            fontWeight: "700",
            color: Colors.textPrimary,
            textAlign: "center",
            marginBottom: Spacing.md,
          }}
        >
          {currentStep.title}
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
          {currentStep.subtitle}
        </Text>

        {currentStep.options && (
          <View style={{ width: "100%", gap: Spacing.md, marginBottom: Spacing.xl }}>
            {currentStep.options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setSelectedOption(option)}
                accessibilityLabel={option}
                accessibilityRole="radio"
                accessibilityState={{ selected: selectedOption === option }}
                style={{
                  backgroundColor:
                    selectedOption === option ? Colors.primary : Colors.surface,
                  borderRadius: BorderRadius.md,
                  padding: Spacing.lg,
                  borderWidth: 1,
                  borderColor:
                    selectedOption === option
                      ? Colors.primary
                      : Colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: FontSize.md,
                    fontWeight: "600",
                    color:
                      selectedOption === option
                        ? "#FFFFFF"
                        : Colors.textPrimary,
                    textAlign: "center",
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={handleNext}
          disabled={step === 1 && !selectedOption}
          accessibilityLabel={step === STEPS.length - 1 ? "Get started" : "Continue"}
          accessibilityRole="button"
          style={{
            backgroundColor:
              step === 1 && !selectedOption
                ? Colors.border
                : Colors.primary,
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
            {step === STEPS.length - 1 ? "Get Started" : "Continue"}
          </Text>
        </TouchableOpacity>

        {step === 0 && (
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/home")}
            style={{ marginTop: Spacing.lg }}
            accessibilityLabel="Skip onboarding"
            accessibilityRole="button"
          >
            <Text
              style={{
                fontSize: FontSize.sm,
                color: Colors.textSecondary,
              }}
            >
              Skip
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
