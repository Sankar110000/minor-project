import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TeacherProfile = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === "dark";
  const textColor = isDarkMode ? "#fff" : "#1a1a1a";
  const subTextColor = isDarkMode ? "#b3b3b3" : "#4b5563";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const iconColor = isDarkMode ? "#fff" : "#000";
  const [user, setUser] = useState({ fullname: "", email: "", role: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await AsyncStorage.getItem("user");

        if (userProfile) {
          const data = JSON.parse(userProfile);
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("role");
      Alert.alert("Logout Successful", "Your session has been cleared.");
      setMenuVisible(false);
      router.push("/(auth)/login");
    } catch (error) {
      console.error("Error clearing token", error);
    }
  };

  const toggleMenu = () => setMenuVisible((prev) => !prev);

  return (
    <SafeAreaView className="flex-1">
      {/* Background Gradient */}
      <LinearGradient
        colors={
          isDarkMode
            ? ["#111827", "#111827", "#111827"]
            : ["#fefefe", "#ffe7d6", "#ffd1a9"]
        }
        style={{ flex: 1 }}
      >
        {/* Header with Glass Effect */}
        <BlurView
          intensity={80}
          tint={isDarkMode ? "dark" : "light"}
          className="px-5 py-4 flex-row justify-between items-center border-b"
          style={{ borderBottomColor: borderColor }}
        >
          <Text
            className="text-2xl font-semibold tracking-wide"
            style={{ color: textColor }}
          >
            Teacher Profile
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleMenu}
            className="p-2 rounded-full"
          >
            <Entypo name="dots-three-vertical" size={22} color={iconColor} />
          </TouchableOpacity>

          {menuVisible && (
            <View
              className="absolute top-16 right-5 rounded-xl shadow-lg"
              style={{
                backgroundColor: cardBg,
                borderColor: borderColor,
                borderWidth: 1,
              }}
            >
              <TouchableOpacity
                onPress={handleLogout}
                activeOpacity={0.8}
                className="px-5 py-3 bg-red-600 rounded"
              >
                <Text className="text-white font-semibold text-base">
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </BlurView>

        {/* Profile Section */}
        <View className="items-center mt-8">
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            className="w-32 h-32 rounded-full"
            style={{ borderWidth: 4, borderColor: borderColor }}
          />
          <Text
            className="text-2xl font-semibold mt-4"
            style={{ color: textColor }}
          >
            {user && user.fullname}
          </Text>
          <Text className="text-base mt-1" style={{ color: subTextColor }}>
            {user && user.role}
          </Text>
        </View>

        {/* Info Cards */}
        <View className="mt-8 px-6 gap-5">
          {[
            { label: "Experience", value: "8 Years" },
            { label: "Subjects Taught", value: "Physics, Mathematics" },
            { label: "Email", value: user && user.email },
            { label: "Contact Number", value: "+91 98765 43210" },
          ].map((item, index) => (
            <View
              key={index}
              className="rounded-2xl p-4"
              style={{
                backgroundColor: cardBg,
                borderColor: borderColor,
                borderWidth: 1,
              }}
            >
              <Text className="text-sm" style={{ color: subTextColor }}>
                {item.label}
              </Text>
              <Text
                className="text-lg font-semibold mt-1"
                style={{ color: textColor }}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default TeacherProfile;
