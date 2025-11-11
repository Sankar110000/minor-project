import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import * as ScreenCapture from "expo-screen-capture";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ScreenCapture.preventScreenCaptureAsync();
    const sub = ScreenCapture.addScreenshotListener(() => {
      Alert.alert("Screenshots are not allowed!");
    });
    return () => {
      sub.remove();
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  useEffect(() => {
    const loadAuthData = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedRole = await AsyncStorage.getItem("role");
      setToken(storedToken);
      setRole(storedRole);

      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 2000);

      setLoading(false);
    };

    loadAuthData();
  }, []);

  if (loading) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {/* ✅ Stack Navigation */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>

        {/* ✅ Redirect based on Login + Role */}
        {!token ? (
          <Redirect href="/(auth)" />
        ) : role === "student" ? (
          <Redirect href="/(user)" />
        ) : role === "teacher" ? (
          <Redirect href="/(teacher)" />
        ) : (
          <Redirect href="/(not_found)" />
        )}

        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
