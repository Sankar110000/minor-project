import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import TouchableBtn from "@/components/TouchableBtn";
import { BlurView } from "expo-blur";

// Step 1: Define user type
type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

const UserProfile: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  // Color palette
  const bgColor = isDarkMode ? "#0f1115" : "#f2f2f7";
  const textColor = isDarkMode ? "#ffffff" : "#1f2937";
  const subTextColor = isDarkMode ? "#b3b3b3" : "#6b7280";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.05)" : "#ffffff";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.1)" : "#e5e7eb";
  const inputBg = isDarkMode ? "#1f1f25" : "#f9fafb";
  const iconColor = isDarkMode ? "#ffffff" : "#1f2937";

  // Step 2: Fetch user from AsyncStorage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userProfile = await AsyncStorage.getItem("user");
        if (userProfile) setUser(JSON.parse(userProfile));
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("role");
      Alert.alert("Logout Successful", "You have been logged out.");
      setMenuVisible(false);
      router.push("/(auth)/login");
    } catch (error) {
      console.error("Error clearing token", error);
    }
  };

  const toggleMenu = () => setMenuVisible((prev) => !prev);

  return (
    <SafeAreaView
      className="flex-1 px-5 pt-10"
      style={{ backgroundColor: bgColor }}
    >
      {/* Header with Glass Effect */}
      <BlurView
        intensity={80}
        tint={isDarkMode ? "dark" : "light"}
        className="px-5 py-4 flex-row justify-between items-center rounded-xl mb-6"
        style={{
          backgroundColor: isDarkMode
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.6)",
          borderColor: borderColor,
          borderWidth: 1,
        }}
      >
        <Text className="text-2xl font-semibold" style={{ color: textColor }}>
          User Profile
        </Text>

        <TouchableOpacity onPress={toggleMenu} className="p-2 rounded-full">
          <Entypo name="dots-three-vertical" size={22} color={iconColor} />
        </TouchableOpacity>

        {menuVisible && (
          <View
            className="absolute z-50 top-16 right-5 rounded-xl shadow-lg"
            style={{
              backgroundColor: cardBg,
              borderColor: borderColor,
              borderWidth: 1,
            }}
          >
            <TouchableOpacity
              onPress={handleLogout}
              className="px-5 py-3 rounded"
              style={{ backgroundColor: "#ef4444" }}
            >
              <Text className="text-white font-semibold text-base">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </BlurView>

      {/* Profile Card */}
      <View
        className="rounded-xl overflow-hidden p-5 mb-5"
        style={{
          backgroundColor: cardBg,
          borderColor: borderColor,
          borderWidth: 1,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <View className="flex-row items-center gap-5">
          <Image
            source={{
              uri:
                user?.avatar ||
                "https://www.cartoonize.net/wp-content/uploads/2024/05/avatar-maker-photo-to-cartoon.png",
            }}
            className="w-24 h-24 rounded-full"
            style={{ borderWidth: 1, borderColor: borderColor }}
          />
          <View>
            <Text
              className="text-2xl font-semibold"
              style={{ color: textColor }}
            >
              {user?.name || "Narayan"}
            </Text>
            <Text style={{ color: subTextColor }}>{user?.role || "Role"}</Text>
            <Text style={{ color: subTextColor, marginTop: 4 }}>
              ID: {user?._id || "1234"}
            </Text>
            <Text style={{ color: subTextColor, marginTop: 2 }}>
              {user?.email || "user@email.com"}
            </Text>
          </View>
        </View>
      </View>

      {/* Editable Fields */}
      <View className="space-y-4 mb-5">
        <View>
          <Text
            className="text-lg font-semibold mb-1"
            style={{ color: textColor }}
          >
            Username
          </Text>
          <TextInput
            placeholder="Edit your username"
            className="border rounded-lg p-3 text-lg"
            style={{
              borderColor: borderColor,
              backgroundColor: inputBg,
              color: textColor,
            }}
            defaultValue={user?.name || "Narayan"}
          />
        </View>

        <View>
          <Text
            className="text-lg font-semibold mb-1"
            style={{ color: textColor }}
          >
            Email
          </Text>
          <TextInput
            placeholder="Edit your email"
            className="border rounded-lg p-3 text-lg"
            style={{
              borderColor: borderColor,
              backgroundColor: inputBg,
              color: textColor,
            }}
            defaultValue={user?.email}
          />
        </View>
      </View>

      {/* Buttons */}
      <View className="flex-row justify-start gap-4">
        <TouchableBtn
          onPress={() => Alert.alert("Edit Details pressed")}
          title="Edit Details"
          btnStyle="px-6 py-4 bg-orange-500 rounded-md"
          textStyle="text-center text-lg font-semibold text-white"
        />
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;
