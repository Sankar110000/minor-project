import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons";

const Index = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Dynamic colors based on mode
  const bgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const cardBg = isDark ? "bg-white/10" : "bg-white";
  const borderColor = isDark ? "border-white/20" : "border-gray-300";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-300" : "text-gray-600";

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-4"
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Header Section */}
        <View className="flex-row justify-between items-center mt-4 mb-6">
          <View>
            <Text className={`text-2xl font-bold ${textMain}`}>
              Welcome Back,
            </Text>
            <Text className="text-orange-500 text-xl font-semibold">
              Mr. Narayan 👋
            </Text>
          </View>

          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
            className="w-12 h-12 rounded-full border-2 border-orange-500"
          />
        </View>

        {/* Quick Actions Section */}
        <Text className={`text-lg font-semibold mb-3 ${textSub}`}>
          Quick Actions
        </Text>
        <View className="flex-row flex-wrap justify-between">
          <TouchableOpacity
            className={`w-[48%] ${cardBg} p-4 rounded-2xl mb-3 ${borderColor} border backdrop-blur-md`}
          >
            <FontAwesome5 name="user-graduate" size={28} color="#f97316" />
            <Text className={`${textMain} text-base mt-2 font-semibold`}>
              View Students
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`w-[48%] ${cardBg} p-4 rounded-2xl mb-3 ${borderColor} border backdrop-blur-md`}
          >
            <MaterialIcons name="assignment" size={28} color="#f97316" />
            <Text className={`${textMain} text-base mt-2 font-semibold`}>
              Assignments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`w-[48%] ${cardBg} p-4 rounded-2xl mb-3 ${borderColor} border backdrop-blur-md`}
          >
            <Ionicons name="calendar-outline" size={28} color="#f97316" />
            <Text className={`${textMain} text-base mt-2 font-semibold`}>
              Attendance
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`w-[48%] ${cardBg} p-4 rounded-2xl mb-3 ${borderColor} border backdrop-blur-md`}
          >
            <MaterialIcons name="notifications" size={28} color="#f97316" />
            <Text className={`${textMain} text-base mt-2 font-semibold`}>
              Announcements
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Updates */}
        <View className="mt-5">
          <Text className={`text-lg font-semibold mb-3 ${textSub}`}>
            Recent Updates
          </Text>

          <View
            className={`${cardBg} p-4 rounded-2xl mb-3 ${borderColor} border backdrop-blur-md`}
          >
            <Text className={`${textMain} font-semibold`}>
              📢 Class 10A - Science Assignment Uploaded
            </Text>
            <Text className={`${textSub} text-sm mt-1`}>2 hours ago</Text>
          </View>

          <View
            className={`${cardBg} p-4 rounded-2xl mb-3 ${borderColor} border backdrop-blur-md`}
          >
            <Text className={`${textMain} font-semibold`}>
              🧮 Math Quiz Scheduled for Monday
            </Text>
            <Text className={`${textSub} text-sm mt-1`}>Yesterday</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
