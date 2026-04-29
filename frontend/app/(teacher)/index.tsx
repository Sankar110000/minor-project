import {
  FontAwesome5,
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
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL, profileImage } from "@/components/config";

const Index = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    classesToday: 0,
    attendanceRate: 0,
    assignments: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Dynamic colors based on mode
  const bgColor = isDark ? "bg-gray-950" : "bg-gray-50";
  const cardBg = isDark ? "bg-gray-800/80" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-500";

  const fetchUserData = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      const userData = userString ? JSON.parse(userString) : null;

      // Fetch total students
      const studentsRes = await axios.post(
        `${BASE_URL}/api/user/getAllStudents`,
      );
      if (studentsRes.data.success) {
        setStats((prev) => ({
          ...prev,
          totalStudents: studentsRes.data.users?.length || 0,
        }));
      }

      // Fetch previous classes for stats
      if (userData?._id) {
        const classRes = await axios.post(
          `${BASE_URL}/api/class/getPrevoiusClass`,
          { teacherID: userData._id },
        );
        if (classRes.data.success) {
          const classes = classRes.data.classes || [];
          const today = new Date().toDateString();
          const todayClasses = classes.filter(
            (c: any) => new Date(c.startTime).toDateString() === today,
          );
          setStats((prev) => ({
            ...prev,
            classesToday: todayClasses.length,
          }));
          setRecentActivities(classes.slice(-3).reverse());
        }
      }
    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await fetchUserData();
    await fetchStats();
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    await fetchStats();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const quickActions = [
    {
      title: "View Students",
      subtitle: "Manage enrolled students",
      icon: "user-graduate",
      iconFamily: "FontAwesome5",
      route: "/(teacher)/(drawer)/viewStudent",
      gradient: ["#f97316", "#fb923c"] as [string, string],
    },
    {
      title: "Assignments",
      subtitle: "Create & review tasks",
      icon: "assignment",
      iconFamily: "MaterialIcons",
      route: "/(teacher)/(drawer)/adminAssignment",
      gradient: ["#3b82f6", "#60a5fa"] as [string, string],
    },
    {
      title: "Attendance",
      subtitle: "Track class attendance",
      icon: "calendar-outline",
      iconFamily: "Ionicons",
      route: "/(teacher)/(drawer)/attendance",
      gradient: ["#10b981", "#34d399"] as [string, string],
    },
    {
      title: "Previous Classes",
      subtitle: "View class history",
      icon: "class",
      iconFamily: "MaterialIcons",
      route: "/(teacher)/(drawer)/previousClass",
      gradient: ["#8b5cf6", "#a78bfa"] as [string, string],
    },
  ];

  const statCards = [
    {
      label: "Students",
      value: stats.totalStudents,
      icon: "account-group",
      color: "#f97316",
      bgLight: "#fff7ed",
      bgDark: "rgba(249, 115, 22, 0.15)",
    },
    {
      label: "Classes Today",
      value: stats.classesToday,
      icon: "book-open-variant",
      color: "#3b82f6",
      bgLight: "#eff6ff",
      bgDark: "rgba(59, 130, 246, 0.15)",
    },
  ];

  const renderIcon = (iconFamily: string, icon: string, size: number, color: string) => {
    switch (iconFamily) {
      case "FontAwesome5":
        return <FontAwesome5 name={icon} size={size} color={color} />;
      case "MaterialIcons":
        return <MaterialIcons name={icon} size={size} color={color} />;
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
        <Text className={`mt-4 text-base ${textSub}`}>Loading dashboard...</Text>
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
              {user?.fullname || "Teacher"} 👋
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
            onPress={() => router.push("/(teacher)/profile")}
            className="relative"
          >
            <View
              className="rounded-full p-[2px]"
              style={{
                borderWidth: 2,
                borderColor: "#f97316",
              }}
            >
              <Image
                source={{
                  uri: profileImage,
                }}
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

        {/* ──── Stats Cards ──── */}
        <View className="flex-row justify-between mb-6">
          {statCards.map((stat, index) => (
            <View
              key={index}
              className={`flex-1 rounded-2xl p-4 border ${borderColor} ${index === 0 ? "mr-2" : "ml-2"}`}
              style={{
                backgroundColor: isDark ? stat.bgDark : stat.bgLight,
              }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <MaterialCommunityIcons
                  name={stat.icon as any}
                  size={28}
                  color={stat.color}
                />
                <View
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: stat.color + "20" }}
                >
                  <Text style={{ color: stat.color, fontWeight: "700", fontSize: 12 }}>
                    {stat.value}
                  </Text>
                </View>
              </View>
              <Text
                className="text-2xl font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </Text>
              <Text className={`text-sm mt-0.5 ${textSub}`}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

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

        <View className="flex-row flex-wrap justify-between">
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
                {/* Gradient accent bar */}
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
                    {renderIcon(action.iconFamily, action.icon, 22, action.gradient[0])}
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

        {/* ──── Generate QR Shortcut ──── */}
        <TouchableOpacity
          onPress={() => router.push("/(teacher)/qrscanner")}
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
                Start a Class
              </Text>
              <Text className="text-white/80 text-sm mt-1">
                Generate QR code for attendance
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

        {/* ──── Activity Section ──── */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className={`text-lg font-bold ${textMain}`}>
            Recent Activity
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

        {recentActivities.length > 0 ? (
          <View>
            {recentActivities.map((activity, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push("/(teacher)/(drawer)/previousClass")}
                activeOpacity={0.8}
                className={`${cardBg} rounded-2xl border ${borderColor} p-4 mb-3 flex-row items-center`}
              >
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: "rgba(249, 115, 22, 0.12)" }}
                >
                  <MaterialCommunityIcons
                    name="book-check-outline"
                    size={24}
                    color="#f97316"
                  />
                </View>
                <View className="flex-1">
                  <Text className={`${textMain} font-semibold text-base`}>
                    {activity.title}
                  </Text>
                  <Text className={`${textSub} text-xs mt-0.5`}>
                    {new Date(activity.startTime).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-orange-500 font-bold text-sm">
                    {activity.total_students?.length || 0}
                  </Text>
                  <Text className={`${textSub} text-[10px]`}>Students</Text>
                </View>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              onPress={() => router.push("/(teacher)/(drawer)/previousClass")}
              className="py-2 items-center"
            >
              <Text className="text-orange-500 font-semibold text-sm">View All Activities</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            className={`${cardBg} rounded-2xl border ${borderColor} p-5 items-center`}
          >
            <MaterialCommunityIcons
              name="clipboard-text-clock-outline"
              size={48}
              color={isDark ? "#4b5563" : "#d1d5db"}
            />
            <Text className={`${textSub} text-base mt-3 text-center`}>
              Your recent activity will appear here.
            </Text>
            <Text className={`${textSub} text-sm mt-1 text-center`}>
              Start a class or manage assignments to see updates.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
