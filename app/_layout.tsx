import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../constants/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      // TODO: Load fonts, check auth session
      setIsReady(true);
      await SplashScreen.hideAsync();
    }
    prepare();
  }, []);

  if (!isReady) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen
          name="story/[id]"
          options={{
            presentation: "fullScreenModal",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="collection/[id]"
          options={{ animation: "slide_from_right" }}
        />
      </Stack>
    </>
  );
}
