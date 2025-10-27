<<<<<<< HEAD
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
=======
import { BASE_URL } from "@/components/config";
import TouchableBtn from "@/components/TouchableBtn";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function profile() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [user, setUser] = useState({ email: "", id: "", role: "" });

  axios.defaults.withCredentials = true;

  const handleClick = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e: any) => {
    setEditedName(e.target.value);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token"); // removes only "token"
      await AsyncStorage.removeItem("role"); // removes only "token"

      Alert.alert("Loggedout successfully");
>>>>>>> 85fab5ec15a0d30c7d01425c9cfe8a9290e3dfcd
      setMenuVisible(false);
      router.push("/(auth)/login");
    } catch (error) {
      console.error("Error clearing token", error);
    }
  };

<<<<<<< HEAD
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
=======
  const getData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post(
        `${BASE_URL}/api/user/getUser`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(res.data.data);
    } catch (error) {
      console.log(`Error in the axios: ${error}`);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView className="pt-10 px-5">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-black dark:text-white text-3xl font-semibold">
          Profile
        </Text>

        {/* 3-dot icon */}
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Entypo
            name="dots-three-vertical"
            size={24}
            color="dark:white dark"
          />
        </TouchableOpacity>

        {/* Logout option (only visible when menuVisible=true) */}
        {menuVisible && (
          <TouchableOpacity
            className="absolute right-10 bg-red-600 px-4 py-2 rounded-lg shadow"
            onPress={handleLogout}
          >
            <Text className="text-white font-semibold">Logout</Text>
          </TouchableOpacity>
        )}
>>>>>>> 85fab5ec15a0d30c7d01425c9cfe8a9290e3dfcd
      </View>
      <View className="border border-slate-400 rounded-lg overflow-hidden">
        <View className="flex-row p-4">
          <View className="flex flex-row items-center justify-around w-full px-30">
            <Image
              source={{
                uri: "https://www.cartoonize.net/wp-content/uploads/2024/05/avatar-maker-photo-to-cartoon.png",
              }}
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
                marginTop: 10,
                borderWidth: 1,
              }}
            />
            <View className="flex gap-3">
              <Text className="text-black dark:text-white text-3xl">
                {user.email}
              </Text>
              <Text className="dark:text-gray-500 text-zinc-500 text-xl">
                Role: {user.role}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {/* <TouchableBtn
        onPress={handleClick}
        title={"Edit Details"}
        btnStyle={"py-2 bg-orange-400 mt-5 w-[150] rounded-md"}
        textStyle={"text-center text-lg"}
      /> */}
      {showForm ? (
        <View className="border border-slate-500 p-4 flex-col gap-3">
          <TouchableBtn
            title={"X"}
            className="absolute right-2 top-2 text-2xl p-2"
            onPress={handleClick}
          />
          <View>
            <Text nativeID="labelUsername" className="mb-1 ms-1 text-lg">
              Username
            </Text>
            <TextInput
              placeholder="Edit ur name"
              className="border border-white rounded-lg p-3 text-xl text-white"
              aria-labelledby="labelUsername"
              value={editedName}
              onChange={handleInputChange}
            />
          </View>
          <TouchableBtn
            onPress={handleClick}
            title={"Edit"}
            btnStyle={
              "px-6 py-2 bg-orange-400 w-[70] rounded-md flex-row justify-end relative"
            }
            textStyle={"text-center text-lg"}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default UserProfile;
