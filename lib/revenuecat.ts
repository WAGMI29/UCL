import { Platform } from "react-native";

const API_KEY =
  Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || "placeholder-ios-key"
    : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || "placeholder-android-key";

// TODO: Initialize RevenueCat when real keys are available
// import Purchases from "react-native-purchases";

export async function initRevenueCat(userId: string) {
  // Purchases.configure({ apiKey: API_KEY, appUserID: userId });
}

export async function checkPremiumStatus(): Promise<boolean> {
  // TODO: Check RevenueCat entitlements
  return false;
}

export async function getOfferings() {
  // TODO: Fetch RevenueCat offerings
  return null;
}

export async function restorePurchases(): Promise<boolean> {
  // TODO: Restore purchases
  return false;
}
