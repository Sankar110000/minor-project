import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useColorScheme,
} from "react-native";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

const assignmentsData = [
  {
    id: "1",
    title: "Math Homework",
    completed: true,
    isBtnShow: false,
    dueDate: "Apr 20, 2026",
  },
  {
    id: "2",
    title: "Science Project",
    completed: true,
    isBtnShow: false,
    dueDate: "Apr 22, 2026",
  },
  {
    id: "3",
    title: "English Essay",
    completed: true,
    isBtnShow: false,
    dueDate: "Apr 24, 2026",
  },
  {
    id: "4",
    title: "Computer Assignment",
    completed: true,
    isBtnShow: false,
    dueDate: "Apr 25, 2026",
  },
  {
    id: "5",
    title: "Physics Notes",
    completed: true,
    isBtnShow: false,
    dueDate: "Apr 26, 2026",
  },
];

export default function AdminAssignment() {
  const [assignments, setAssignments] = useState(assignmentsData);
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const bgColor = isDark ? "bg-gray-950" : "bg-gray-50";
  const cardBg = isDark ? "#111827" : "#ffffff";
  const borderColor = isDark ? "#1f2937" : "#e5e7eb";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-500";

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      activeOpacity={0.85}
      className="mb-3"
    >
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
          {/* Index badge */}
          <View
            className="w-10 h-10 rounded-xl items-center justify-center mr-4"
            style={{
              backgroundColor: item.completed
                ? "rgba(34, 197, 94, 0.12)"
                : "rgba(249, 115, 22, 0.12)",
            }}
          >
            <Ionicons
              name={
                item.completed ? "checkmark-done-circle" : "time-outline"
              }
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
          {item.isBtnShow ? (
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
                {item.completed ? "Completed" : "Pending"}
              </Text>
            </View>
          ) : (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#4b5563" : "#d1d5db"}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className={`flex-1 ${bgColor}`}>
      {/* Header */}
      <PageHeader 
        title="Assignments" 
        subtitle={`${assignments.length} total assignments`}
        iconName="assignment"
        iconType="MaterialIcons"
      />

      {/* Summary Stats */}
      <View className="flex-row px-5 mb-4 gap-3">
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

      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
      />
    </View>
  );
}
