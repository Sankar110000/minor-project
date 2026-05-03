import React, { useEffect, useState } from "react";
import { View, Text, FlatList, useColorScheme, ActivityIndicator, RefreshControl } from "react-native";
import { Card } from "@/components/Card";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "@/components/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AllClass() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);

  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const bgColor = isDark ? "bg-gray-950" : "bg-gray-50";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-500";

  const fetchData = async () => {
    setLoading(true);
    try {
      const userString = await AsyncStorage.getItem("user");
      const userData = userString ? JSON.parse(userString) : null;
      setUser(userData);

      console.log("Fetching classes for student:", userData?._id);

      // Use getAllClasses endpoint to get ALL classes (works for students)
      const res = await axios.post(`${BASE_URL}/api/class/getAllClasses`, {});

      let classList: any[] = [];
      if (res.data.success && res.data.classes?.length > 0) {
        classList = res.data.classes;
      }

      console.log("Total classes found:", classList.length);

      const formattedClasses = classList.map((c: any) => {
        // Check if student is present — total_students may be IDs or objects
        const isPresent = c.total_students?.some((s: any) => {
          const sId = typeof s === "string" ? s : s._id;
          return sId === userData?._id;
        });

        return {
          id: c._id,
          maamName: c.classTeacher?.fullname || c.classTeacher || "Teacher",
          subject: c.title || "Untitled Class",
          time: c.startTime,
          present: isPresent,
        };
      }).reverse();

      setClasses(formattedClasses);
    } catch (error: any) {
      console.log("Error fetching classes:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View className={`flex-1 ${bgColor}`}>
      {/* Stats */}
      <View className="flex-row px-5 pt-4 pb-2 gap-3">
        <View
          className="flex-1 rounded-xl px-4 py-3 flex-row items-center"
          style={{
            backgroundColor: isDark
              ? "rgba(34, 197, 94, 0.1)"
              : "rgba(34, 197, 94, 0.06)",
            borderWidth: 1,
            borderColor: isDark
              ? "rgba(34, 197, 94, 0.2)"
              : "rgba(34, 197, 94, 0.12)",
          }}
        >
          <MaterialCommunityIcons
            name="check-circle"
            size={20}
            color="#22c55e"
          />
          <View className="ml-2">
            <Text className="text-lg font-bold" style={{ color: "#22c55e" }}>
              {classes.filter((c) => c.present).length}
            </Text>
            <Text className="text-xs" style={{ color: "#22c55e" }}>
              Present
            </Text>
          </View>
        </View>

        <View
          className="flex-1 rounded-xl px-4 py-3 flex-row items-center"
          style={{
            backgroundColor: isDark
              ? "rgba(239, 68, 68, 0.1)"
              : "rgba(239, 68, 68, 0.06)",
            borderWidth: 1,
            borderColor: isDark
              ? "rgba(239, 68, 68, 0.2)"
              : "rgba(239, 68, 68, 0.12)",
          }}
        >
          <MaterialCommunityIcons
            name="close-circle"
            size={20}
            color="#ef4444"
          />
          <View className="ml-2">
            <Text className="text-lg font-bold" style={{ color: "#ef4444" }}>
              {classes.filter((c) => !c.present).length}
            </Text>
            <Text className="text-xs" style={{ color: "#ef4444" }}>
              Absent
            </Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#f97316"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
          renderItem={({ item }) => (
            <Card
              maamName={item.maamName}
              subject={item.subject}
              time={item.time}
              present={item.present}
              title={item.present ? "Present" : "Absent"}
            />
          )}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <MaterialCommunityIcons name="calendar-remove-outline" size={48} color={textSub} />
              <Text className={`mt-4 ${textSub}`}>No class history available</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
