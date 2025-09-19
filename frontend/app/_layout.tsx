import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedRole = await AsyncStorage.getItem("role");
      //  console.log(storedToken);
      //  console.log(storedRole);
       
        setToken(storedToken);
        setRole(storedRole);
      } catch (error) {
        console.error("Error loading auth data:", error);
      } finally {
        setLoading(false);
        setTimeout(() => {
          SplashScreen.hideAsync();
        }, 2000);
      }
    };

    loadAuthData();
  }, []);

  // While loading (before AsyncStorage resolves), show nothing or a splash
  if (loading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>

        {/* 🔑 Conditional redirects based on token + role */}
        {!token ? (
          <Redirect href={"/(auth)"} />
        ) : role === "student" ? (
          <Redirect href={"/(user)"} />
        ) : role === "teacher" ? (
          <Redirect href={"/(teacher)"} />
        ) : (
          <Redirect href={"/(not_found)"} />
        )}

        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
