import { BASE_URL } from "@/components/config";
import UserCard from "@/components/UserCard";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  useColorScheme,
  View,
} from "react-native";

const Attendance = () => {
  const [presentStu, setPresentStu] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState("");

  const theme = useColorScheme();
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-gray-950" : "bg-gray-50";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-500";

  const onRefresh = async () => {
    setRefreshing(true);
    const storedUser = await AsyncStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const res = await axios.post(
      `${BASE_URL}/api/class/getCurrClass`,
      { teacherID: user?._id },
      { withCredentials: true },
    );

    if (res.data.success) {
      setPresentStu(res.data.currClass.total_students);
      setClassName(res.data.currClass.title || "");
    }
    setRefreshing(false);
  };

  useEffect(() => {
    const fetchClass = async () => {
      try {
        setLoading(true);
        const currClassString = await AsyncStorage.getItem("currClass");
        const currClass = currClassString ? JSON.parse(currClassString) : null;

        const res = await axios.get(
          `${BASE_URL}/api/class/getClassByID?classId=${currClass?._id}`,
          { withCredentials: true },
        );

        if (res.data.success) {
          setPresentStu(res.data.class?.total_students || []);
          setClassName(res.data.class?.title || "");
        }
        setLoading(false);
      } catch (err) {
        console.log("error while fetching", err);
        setLoading(false);
      }
    };

    fetchClass();
  }, []);

  return (
    <View className={`${bgColor} flex-1`}>
      {/* Header */}
      <View className="px-5 pt-4 pb-2">
        <View className="flex-row items-center mb-1">
          <Ionicons name="calendar-outline" size={22} color="#f97316" />
          <Text className={`text-2xl font-bold ml-3 ${textMain}`}>
            Attendance
          </Text>
        </View>
        {className ? (
          <Text className={`text-sm ${textSub}`}>
            Current class: <Text className="font-semibold text-orange-500">{className}</Text>
          </Text>
        ) : null}
      </View>

      {/* Stats Bar */}
      {presentStu.length > 0 && (
        <View className="mx-5 mb-3">
          <View
            className="flex-row items-center rounded-xl px-4 py-3"
            style={{
              backgroundColor: isDark
                ? "rgba(34, 197, 94, 0.12)"
                : "rgba(34, 197, 94, 0.08)",
              borderWidth: 1,
              borderColor: isDark
                ? "rgba(34, 197, 94, 0.2)"
                : "rgba(34, 197, 94, 0.15)",
            }}
          >
            <MaterialCommunityIcons
              name="account-check"
              size={22}
              color="#22c55e"
            />
            <Text className="ml-2 text-sm font-semibold" style={{ color: "#22c55e" }}>
              {presentStu.length} {presentStu.length === 1 ? "student" : "students"} present
            </Text>
          </View>
        </View>
      )}

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className={`mt-3 ${textSub}`}>Loading attendance...</Text>
        </View>
      ) : presentStu.length === 0 ? (
        <View className="flex-1 justify-center items-center px-8">
          <MaterialCommunityIcons
            name="clipboard-text-clock-outline"
            size={56}
            color={isDark ? "#374151" : "#d1d5db"}
          />
          <Text className={`text-lg font-semibold mt-4 ${textMain}`}>
            No attendance yet
          </Text>
          <Text className={`text-sm mt-2 text-center ${textSub}`}>
            Students who scan the QR code will appear here in real-time. Pull down to refresh.
          </Text>
        </View>
      ) : (
        <FlatList
          data={presentStu}
          keyExtractor={(item) => item?._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#f97316"
            />
          }
          renderItem={({ item }) => <UserCard userDet={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default Attendance;
