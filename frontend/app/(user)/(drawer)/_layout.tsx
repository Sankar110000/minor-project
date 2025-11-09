import { Ionicons } from "@expo/vector-icons";

import { Drawer } from "expo-router/drawer";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
       const theme = useColorScheme()
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="allAssignment"
          options={{
            title: "Assignments",
            drawerIcon: ({ size }) => (
              <Ionicons name="calendar-outline" size={size} color={"orange"} />
            ),
            drawerLabelStyle: {
              color: theme==="light"?"black":"white",
              fontWeight: "600",
            },
          }}
        />

        <Drawer.Screen
          name="allClass"
          options={{
            title: "Classes",
            drawerIcon: ({ size }) => (
              <Ionicons name="book-outline" size={size} color={"orange"} />
            ),
            drawerLabelStyle: {
              color: theme==="light"?"black":"white",
              fontWeight: "600",
            },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
