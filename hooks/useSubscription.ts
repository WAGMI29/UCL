import { useState, useEffect } from "react";

interface UseSubscriptionReturn {
  isPremium: boolean;
  tier: "free" | "premium";
  isLoading: boolean;
}

export function useSubscription(): UseSubscriptionReturn {
  const [isPremium] = useState(false);
  const [isLoading] = useState(false);

  // TODO: Check RevenueCat entitlements on mount
  // useEffect(() => { checkPremiumStatus() }, []);

  return {
    isPremium,
    tier: isPremium ? "premium" : "free",
    isLoading,
  };
}
