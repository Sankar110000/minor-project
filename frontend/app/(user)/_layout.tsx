import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "black" : "white";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 4,
          backgroundColor: isDark ? "#030712" : "#ffffff",
          borderTopColor: isDark ? "#1f2937" : "#e5e7eb",
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <AntDesign size={26} name="home" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(drawer)"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="generate_qr"
        options={{
          title: "Scan QR",
          tabBarIcon: ({ color }) => {
            return (
              <View className="bottom-8 justify-center items-center overflow-hidden rounded-full w-[70px] h-[70px] bg-black dark:bg-white">
                <MaterialCommunityIcons name="qrcode-scan" size={30} color={iconColor} />
              </View>
            );
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <AntDesign size={26} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
