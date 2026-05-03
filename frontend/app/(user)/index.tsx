import { Card } from "@/components/Card";
import { BASE_URL, profileImage } from "@/components/config";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StudentHome() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayClasses, setTodayClasses] = useState<any[]>([]);

  const bgColor = isDark ? "bg-gray-950" : "bg-gray-50";
  const cardBg = isDark ? "bg-gray-800/80" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-500";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/api/user/getUser`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const { email, fullname, _id, role } = res.data?.data;
      setUser({ email, fullname, _id, role });
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(res.data?.data),
      );
    } catch (error) {
      // Fallback to cached user data
      const cached = await AsyncStorage.getItem("user");
      if (cached) setUser(JSON.parse(cached));
      console.log(`Error fetching user: ${error}`);
    }
  };

  const fetchTodayClasses = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      const userData = userString ? JSON.parse(userString) : null;

      // Use getAllClasses to get all classes (works for students)
      const res = await axios.post(`${BASE_URL}/api/class/getAllClasses`, {});

      let classes: any[] = [];
      if (res.data.success && res.data.classes?.length > 0) {
        classes = res.data.classes;
      }

      const todayStr = new Date().toDateString();
      const filtered = classes.filter((c: any) => {
        const startDate = new Date(c.startTime);
        // Guard against invalid dates
        if (isNaN(startDate.getTime())) return false;
        return startDate.toDateString() === todayStr;
      });
      
      // Map to include presence status
      const withStatus = filtered.map((c: any) => ({
        ...c,
        // classTeacher may be a populated object or a plain ID string
        classTeacher: typeof c.classTeacher === "object" ? c.classTeacher : { fullname: "Teacher", _id: c.classTeacher },
        present: c.total_students?.some((s: any) => {
          const sId = typeof s === 'string' ? s : s._id;
          return sId === userData?._id;
        }),
      })).reverse();
      
      setTodayClasses(withStatus);
    } catch (error) {
      console.log("Error fetching today's classes:", error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await fetchUserData();
    await fetchTodayClasses();
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    await fetchTodayClasses();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const quickActions = [
    {
      title: "All Assignments",
      subtitle: "View your tasks",
      icon: "assignment",
      iconFamily: "MaterialIcons",
      route: "/(user)/(drawer)/allAssignment",
      gradient: ["#3b82f6", "#60a5fa"] as [string, string],
    },
    {
      title: "All Classes",
      subtitle: "View class history",
      icon: "book-outline",
      iconFamily: "Ionicons",
      route: "/(user)/(drawer)/allClass",
      gradient: ["#8b5cf6", "#a78bfa"] as [string, string],
    },
  ];

  const renderIcon = (
    iconFamily: string,
    icon: string,
    size: number,
    color: string,
  ) => {
    switch (iconFamily) {
      case "MaterialIcons":
        return <MaterialIcons name={icon as any} size={size} color={color} />;
      case "Ionicons":
        return <Ionicons name={icon as any} size={size} color={color} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        className={`flex-1 justify-center items-center ${bgColor}`}
      >
        <ActivityIndicator size="large" color="#f97316" />
        <Text className={`mt-4 text-base ${textSub}`}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#f97316"
          />
        }
      >
        {/* ──── Header Section ──── */}
        <View className="flex-row justify-between items-center mt-4 mb-6">
          <View className="flex-1 mr-4">
            <Text className={`text-base ${textSub}`}>{getGreeting()},</Text>
            <Text className={`text-2xl font-bold ${textMain}`}>
              {user?.fullname || "Student"} 👋
            </Text>
            <Text className={`text-sm mt-1 ${textSub}`}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(user)/profile")}
            className="relative"
          >
            <View
              className="rounded-full p-[2px]"
              style={{ borderWidth: 2, borderColor: "#f97316" }}
            >
              <Image
                source={{ uri: profileImage }}
                className="w-12 h-12 rounded-full"
              />
            </View>
            <View
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2"
              style={{
                backgroundColor: "#22c55e",
                borderColor: isDark ? "#030712" : "#f9fafb",
              }}
            />
          </TouchableOpacity>
        </View>

        {/* ──── Scan QR Shortcut ──── */}
        <TouchableOpacity
          onPress={() => router.push("/(user)/generate_qr")}
          activeOpacity={0.9}
          className="mb-6"
        >
          <LinearGradient
            colors={isDark ? ["#f97316", "#ea580c"] : ["#f97316", "#fb923c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl p-5 flex-row items-center justify-between"
          >
            <View className="flex-1 mr-4">
              <Text className="text-white text-lg font-bold">
                Mark Attendance
              </Text>
              <Text className="text-white/80 text-sm mt-1">
                Scan QR code to mark your presence
              </Text>
            </View>
            <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center">
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={28}
                color="white"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ──── Quick Actions ──── */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className={`text-lg font-bold ${textMain}`}>
            Quick Actions
          </Text>
          <View
            className="h-[2px] flex-1 ml-3"
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.06)",
            }}
          />
        </View>

        <View className="flex-row flex-wrap justify-between mb-6">
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.85}
              className="w-[48%] mb-4"
            >
              <View
                className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}
              >
                <LinearGradient
                  colors={action.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ height: 4 }}
                />
                <View className="p-4">
                  <View
                    className="w-11 h-11 rounded-xl items-center justify-center mb-3"
                    style={{ backgroundColor: action.gradient[0] + "18" }}
                  >
                    {renderIcon(
                      action.iconFamily,
                      action.icon,
                      22,
                      action.gradient[0],
                    )}
                  </View>
                  <Text className={`${textMain} text-base font-semibold`}>
                    {action.title}
                  </Text>
                  <Text className={`${textSub} text-xs mt-1`}>
                    {action.subtitle}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ──── Today's Classes ──── */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className={`text-lg font-bold ${textMain}`}>
            Today's Classes
          </Text>
          <View
            className="h-[2px] flex-1 ml-3"
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.06)",
            }}
          />
        </View>

        {todayClasses.length > 0 ? (
          <View>
            {todayClasses.map((activity, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push("/(user)/(drawer)/allClass")}
                activeOpacity={0.8}
                className={`${cardBg} rounded-2xl border ${borderColor} p-4 mb-3 flex-row items-center`}
              >
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ 
                    backgroundColor: activity.present 
                      ? "rgba(34, 197, 94, 0.12)" 
                      : "rgba(249, 115, 22, 0.12)" 
                  }}
                >
                  <MaterialCommunityIcons
                    name={activity.present ? "calendar-check" : "calendar-clock"}
                    size={24}
                    color={activity.present ? "#22c55e" : "#f97316"}
                  />
                </View>
                <View className="flex-1">
                  <Text className={`${textMain} font-semibold text-base`}>
                    {activity.title}
                  </Text>
                  <Text className={`${textSub} text-xs mt-0.5`}>
                    {new Date(activity.startTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} • {activity.classTeacher?.fullname || "Teacher"}
                  </Text>
                </View>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: activity.present
                      ? "rgba(34, 197, 94, 0.12)"
                      : "rgba(249, 115, 22, 0.12)",
                  }}
                >
                  <Text
                    className="text-[10px] font-bold"
                    style={{ color: activity.present ? "#22c55e" : "#f97316" }}
                  >
                    {activity.present ? "PRESENT" : "SCHEDULED"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View
            className={`${cardBg} rounded-2xl border ${borderColor} p-5 items-center`}
          >
            <MaterialCommunityIcons
              name="school-outline"
              size={48}
              color={isDark ? "#4b5563" : "#d1d5db"}
            />
            <Text className={`${textSub} text-base mt-3 text-center`}>
              No classes scheduled for today
            </Text>
            <Text className={`${textSub} text-sm mt-1 text-center`}>
              Your upcoming classes will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
