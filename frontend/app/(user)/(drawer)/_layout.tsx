import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity, useColorScheme } from "react-native";

export default function StackLayout() {
  const theme = useColorScheme();
  const isDark = theme === "dark";

  const headerBg = isDark ? "#030712" : "#f8fafc";
  const headerText = isDark ? "#f9fafb" : "#111827";

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: headerBg,
        },
        headerTintColor: headerText,
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
        headerShadowVisible: false,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.push('/(user)')}
            className="mr-3"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="chevron-back"
              size={26}
              color="#f97316"
            />
          </TouchableOpacity>
        ),
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="allAssignment"
        options={{ title: "Assignments" }}
      />
      <Stack.Screen
        name="allClass"
        options={{ title: "All Classes" }}
      />
    </Stack>
  );
}
