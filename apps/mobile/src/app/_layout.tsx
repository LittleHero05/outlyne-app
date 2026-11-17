import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/store/auth";
import { DraftProvider } from "@/store/draft";
import { theme } from "@/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
      <DraftProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.blue },
            headerTintColor: theme.colors.text,
            headerShadowVisible: false,
            headerTitleStyle: { fontWeight: "600" },
            contentStyle: { backgroundColor: theme.colors.blue },
          }}
        >
          <Stack.Screen name="index" options={{ title: "Outlyne" }} />
          <Stack.Screen name="generate/[activity]" options={{ title: "Details" }} />
          <Stack.Screen name="generate/customize" options={{ title: "Customize" }} />
          <Stack.Screen name="generate/preview" options={{ title: "Preview" }} />
          <Stack.Screen name="cards" options={{ title: "My cards" }} />
          <Stack.Screen name="sign-in" options={{ title: "Sign in", presentation: "modal" }} />
        </Stack>
      </DraftProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
