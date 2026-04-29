import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "@/components/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AllAssignment() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const bgColor = isDark ? "bg-gray-950" : "bg-gray-50";
  const cardBg = isDark ? "#111827" : "#ffffff";
  const borderColor = isDark ? "#1f2937" : "#e5e7eb";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-500";

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/assignment/getAll`);
      if (res.data.success) {
        setAssignments(res.data.assignments);
      }
    } catch (error) {
      console.log("Error fetching assignments:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAssignments();
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity activeOpacity={0.85} className="mb-3">
      <View
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: cardBg,
          borderWidth: 1,
          borderColor: borderColor,
        }}
      >
        {/* Accent bar */}
        <View
          style={{
            height: 3,
            backgroundColor: item.completed ? "#22c55e" : "#f97316",
          }}
        />
        <View className="p-4 flex-row items-center">
          {/* Status icon */}
          <View
            className="w-10 h-10 rounded-xl items-center justify-center mr-4"
            style={{
              backgroundColor: item.completed
                ? "rgba(34, 197, 94, 0.12)"
                : "rgba(249, 115, 22, 0.12)",
            }}
          >
            <Ionicons
              name={item.completed ? "checkmark-done-circle" : "time-outline"}
              size={22}
              color={item.completed ? "#22c55e" : "#f97316"}
            />
          </View>

          {/* Content */}
          <View className="flex-1">
            <Text className={`text-base font-semibold ${textMain}`}>
              {item.title}
            </Text>
            <Text className={`text-xs mt-0.5 ${textSub}`}>
              Due: {item.dueDate}
            </Text>
          </View>

          {/* Status badge */}
          <View
            className="px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: item.completed
                ? "rgba(34, 197, 94, 0.12)"
                : "rgba(249, 115, 22, 0.12)",
            }}
          >
            <Text
              className="text-xs font-semibold"
              style={{
                color: item.completed ? "#22c55e" : "#f97316",
              }}
            >
              {item.completed ? "Done" : "Pending"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className={`flex-1 ${bgColor}`}>
      {/* Summary Stats */}
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
              {assignments.filter((a) => a.completed).length}
            </Text>
            <Text className="text-xs" style={{ color: "#22c55e" }}>
              Completed
            </Text>
          </View>
        </View>

        <View
          className="flex-1 rounded-xl px-4 py-3 flex-row items-center"
          style={{
            backgroundColor: isDark
              ? "rgba(249, 115, 22, 0.1)"
              : "rgba(249, 115, 22, 0.06)",
            borderWidth: 1,
            borderColor: isDark
              ? "rgba(249, 115, 22, 0.2)"
              : "rgba(249, 115, 22, 0.12)",
          }}
        >
          <MaterialCommunityIcons
            name="clock-outline"
            size={20}
            color="#f97316"
          />
          <View className="ml-2">
            <Text className="text-lg font-bold" style={{ color: "#f97316" }}>
              {assignments.filter((a) => !a.completed).length}
            </Text>
            <Text className="text-xs" style={{ color: "#f97316" }}>
              Pending
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
          data={assignments}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#f97316"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, paddingTop: 8 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <MaterialCommunityIcons name="clipboard-text-off-outline" size={48} color={textSub} />
              <Text className={`mt-4 ${textSub}`}>No assignments assigned yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
