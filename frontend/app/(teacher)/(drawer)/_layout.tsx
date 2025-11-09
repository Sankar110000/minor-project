import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
const theme = useColorScheme()

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
       

        <Drawer.Screen
          name="attendance"
          options={{
            title: "Attendance",
            drawerIcon: ({ size }) => (
              <Ionicons name="calendar-outline" size={size} color={"orange"} />
            ),
            drawerLabelStyle: {
              color: theme=="dark"? "white":"black",
              fontWeight: "600",
            },
          }}
        />
         <Drawer.Screen
          name="viewStudent"
          options={{
            title: "View Student",
            drawerIcon: ({ size }) => (
              <FontAwesome5 name="user-graduate" size={28} color="#f97316" />
            ),
            drawerLabelStyle: {
              color: theme=="dark"? "white":"black",
              fontWeight: "600",
            },
          }}
        />
         <Drawer.Screen
          name="previousClass"
          options={{
            title: "Previous Classes",
            drawerIcon: ({ size }) => (
              <MaterialIcons name="class" size={size} color={"orange"} />
            ),
            drawerLabelStyle: {
              color: theme=="dark"? "white":"black",
              fontWeight: "600",
            },
          }}
        />
         <Drawer.Screen
          name="adminAssignment"
          options={{
            title: "Assignment",
            drawerIcon: ({ size }) => (
              <MaterialIcons name="assignment" size={size} color={"orange"} />
            ),
            drawerLabelStyle: {
              color: theme=="dark"? "white":"black",
              fontWeight: "600",
            },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
