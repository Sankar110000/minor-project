import { BASE_URL, profileImage } from "@/components/config";
import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserProfile() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [user, setUser] = useState<{
    fullname: string;
    email: string;
    role: string;
    _id?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogout, setShowLogout] = useState(false);

  // Theme colors — matching admin profile
  const bgColor = isDark ? "#030712" : "#f8fafc";
  const cardBg = isDark ? "#111827" : "#ffffff";
  const borderColor = isDark ? "#1f2937" : "#e5e7eb";
  const textMain = isDark ? "#f9fafb" : "#111827";
  const textSub = isDark ? "#9ca3af" : "#6b7280";
  const surfaceBg = isDark ? "#1f2937" : "#f1f5f9";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await axios.post(
          `${BASE_URL}/api/user/getUser`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.data?.data) {
          const { email, role, fullname, _id } = res.data.data;
          setUser({ email, role, fullname, _id });
        }
      } catch (error) {
        // Fallback to cached
        const cached = await AsyncStorage.getItem("user");
        if (cached) setUser(JSON.parse(cached));
        console.log("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout? You will need to sign in again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(["token", "role", "user"]);
              router.replace("/(auth)/login");
            } catch (err) {
              console.error(err);
            }
          },
        },
      ],
    );
  };

  const profileFields = [
    {
      label: "Full Name",
      value: user?.fullname || "—",
      icon: "account-outline" as const,
      color: "#f97316",
    },
    {
      label: "Email Address",
      value: user?.email || "—",
      icon: "email-outline" as const,
      color: "#3b82f6",
    },
    {
      label: "Role",
      value: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "—",
      icon: "shield-account-outline" as const,
      color: "#8b5cf6",
    },
    {
      label: "Account ID",
      value: user?._id
        ? `${user._id.slice(0, 8)}...${user._id.slice(-4)}`
        : "—",
      icon: "identifier" as const,
      color: "#10b981",
    },
  ];

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: bgColor }}
        className="justify-center items-center"
      >
        <ActivityIndicator size="large" color="#f97316" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ──── Header ──── */}
        <View
          className="px-5 py-4 flex-row justify-between items-center"
          style={{ borderBottomWidth: 1, borderBottomColor: borderColor }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: surfaceBg }}
          >
            <Ionicons name="chevron-back" size={22} color={textMain} />
          </TouchableOpacity>

          <Text
            className="text-lg font-semibold"
            style={{ color: textMain }}
          >
            My Profile
          </Text>

          <TouchableOpacity
            onPress={() => setShowLogout(!showLogout)}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: surfaceBg }}
          >
            <Entypo name="dots-three-vertical" size={18} color={textMain} />
          </TouchableOpacity>
        </View>

        {/* ──── Logout Dropdown ──── */}
        {showLogout && (
          <View
            className="absolute top-20 right-5 z-50 rounded-xl overflow-hidden"
            style={{
              backgroundColor: cardBg,
              borderWidth: 1,
              borderColor: borderColor,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center px-5 py-3.5"
              activeOpacity={0.7}
            >
              <Feather name="log-out" size={18} color="#ef4444" />
              <Text className="text-red-500 font-semibold text-base ml-3">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ──── Profile Avatar Section ──── */}
        <View className="items-center mt-8 mb-6 px-5">
          <View className="relative mb-4">
            <View
              className="rounded-full p-[3px]"
              style={{
                borderWidth: 2,
                borderColor: "#f97316",
                backgroundColor: bgColor,
              }}
            >
              <Image
                source={{ uri: profileImage }}
                className="w-28 h-28 rounded-full"
              />
            </View>

            {/* Online indicator */}
            <View
              className="absolute bottom-1 right-1 w-6 h-6 rounded-full items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              <View
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "#22c55e" }}
              />
            </View>
          </View>

          <Text
            className="text-2xl font-bold"
            style={{ color: textMain }}
          >
            {user?.fullname || "Student"}
          </Text>

          <View className="flex-row items-center mt-2">
            <View
              className="px-3 py-1.5 rounded-full flex-row items-center"
              style={{ backgroundColor: "#f97316" + "18" }}
            >
              <MaterialCommunityIcons
                name="school"
                size={14}
                color="#f97316"
              />
              <Text
                className="ml-1.5 text-sm font-semibold"
                style={{ color: "#f97316" }}
              >
                {user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : "Student"}
              </Text>
            </View>
          </View>
        </View>

        {/* ──── Profile Info Cards ──── */}
        <View className="px-5 mt-2">
          <Text
            className="text-base font-bold mb-4"
            style={{ color: textMain }}
          >
            Account Information
          </Text>

          <View
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: cardBg,
              borderWidth: 1,
              borderColor: borderColor,
            }}
          >
            {profileFields.map((field, index) => (
              <View
                key={index}
                className={`flex-row items-center px-5 py-4 ${index < profileFields.length - 1 ? "border-b" : ""
                  }`}
                style={{ borderBottomColor: borderColor }}
              >
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: field.color + "15" }}
                >
                  <MaterialCommunityIcons
                    name={field.icon}
                    size={22}
                    color={field.color}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-xs font-medium mb-0.5"
                    style={{ color: textSub }}
                  >
                    {field.label}
                  </Text>
                  <Text
                    className="text-base font-semibold"
                    style={{ color: textMain }}
                    numberOfLines={1}
                  >
                    {field.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ──── Sign Out Button ──── */}
        <View className="px-5 mt-8">
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: isDark
                ? "rgba(239, 68, 68, 0.1)"
                : "rgba(239, 68, 68, 0.05)",
              borderWidth: 1,
              borderColor: isDark
                ? "rgba(239, 68, 68, 0.2)"
                : "rgba(239, 68, 68, 0.15)",
            }}
          >
            <View className="flex-row items-center justify-center px-5 py-4">
              <Feather name="log-out" size={20} color="#ef4444" />
              <Text className="text-red-500 font-bold text-base ml-3">
                Sign Out
              </Text>
            </View>
          </TouchableOpacity>

          <Text
            className="text-xs text-center mt-4"
            style={{ color: textSub }}
          >
            Attendify v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
