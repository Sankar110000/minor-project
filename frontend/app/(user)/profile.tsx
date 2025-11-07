import { BASE_URL } from "@/components/config";
import TouchableBtn from "@/components/TouchableBtn";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "react-native";

export default function UserProfile() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const textColor = isDark ? "#fff" : "#1a1a1a";
  const subTextColor = isDark ? "#b3b3b3" : "#4b5563";
  const cardBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const iconColor = isDark ? "#fff" : "#000";

  const [menuVisible, setMenuVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [user, setUser] = useState({ email: "", id: "", role: "" });

  axios.defaults.withCredentials = true;

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "role"]);
      Alert.alert("Logout Successful");
      setMenuVisible(false);
      router.push("/(auth)/login");
    } catch (err) {
      console.error(err);
    }
  };

  const getData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(`${BASE_URL}/api/user/getUser`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={isDark ? ["#111827", "#111827"] : ["#ffffff", "#ffffff"]}
        style={{ flex: 1 }}
      >

        {/* Header */}
        <BlurView
          intensity={90}
          tint={isDark ? "dark" : "light"}
          className="px-5 py-4 flex-row justify-between items-center border-b"
          style={{ borderBottomColor: borderColor }}
        >
          <Text style={{ color: textColor }} className="text-2xl font-semibold">
            Profile
          </Text>

          <TouchableOpacity  activeOpacity={0.9} onPress={toggleMenu}>
            
            <Entypo name="dots-three-vertical" size={24} color={iconColor} />
          </TouchableOpacity>

          {menuVisible && (
            <View
              className="absolute top-14 right-4 rounded-xl shadow-md"
              style={{ backgroundColor: cardBg, borderColor, borderWidth: 1 }}
            >
              <Pressable
                className="px-5 py-3 bg-red-600 rounded"
                onPress={handleLogout}
              >
                <Text className="text-white font-bold text-base">Logout</Text>
              </Pressable>
            </View>
          )}
        </BlurView>

        {/* Profile Section */}
        <View className="items-center mt-10">
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            className="w-32 h-32 rounded-full"
            style={{ borderColor: borderColor, borderWidth: 3 }}
          />

          <Text style={{ color: textColor }} className="text-2xl font-bold mt-4">
            {editedName || user.email.split("@")[0]}
          </Text>
        
          <Text
            className="text-base mt-1"
            style={{ color: isDark ? "#F97316" : "#EA580C" }}
          >
            Role: {user.role}
          </Text>
          
        </View>
       
 <View
                      className="rounded-2xl p-4 mx-6 mt-5"
                      style={{ backgroundColor: cardBg, borderColor: borderColor, borderWidth: 1 }}
                    >
                      <Text className="text-sm" style={{ color: subTextColor }}>
                        {"email"}
                      </Text>
                      <Text className="text-lg font-semibold mt-1" style={{ color: textColor }}>
                        {user.email}
                      </Text>
                    </View>
        {/* Edit Button */}
        <View className="mt-8 px-6">
          <TouchableBtn
            onPress={() => setShowForm(!showForm)}
            title={showForm ? "Close" : "Edit Details"}
            btnStyle="bg-orange-500 rounded-xl py-3"
            textStyle="text-white text-lg font-semibold text-center"
          />
        </View>

        {/* Edit Form */}
        {showForm && (
          <View
            className="mt-6 mx-6 p-5 rounded-xl"
            style={{ backgroundColor: cardBg, borderColor, borderWidth: 1 }}
          >
            <Text style={{ color: textColor }} className="font-semibold text-lg mb-2">
              Update Username
            </Text>

            <TextInput
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter new name"
              placeholderTextColor={subTextColor}
              className="rounded-lg p-3 text-lg"
              style={{
                backgroundColor: isDark ? "#1f2937" : "#e5e7eb",
                color: textColor,
              }}
            />

            <TouchableBtn

              onPress={() => Alert.alert("Updated Successfully")}
              title="Save"
              btnStyle="bg-orange-500 rounded-xl py-3 mt-4"
              textStyle="text-white text-lg font-bold text-center"
            />
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}
