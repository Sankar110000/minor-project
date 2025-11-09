import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

const assignmentsData = [
  { id: "1", title: "Math Homework", completed: true },
  { id: "2", title: "Science Project", completed: false },
  { id: "3", title: "English Essay", completed: true },
  { id: "4", title: "Computer Assignment", completed: false },
  { id: "5", title: "Physics Notes", completed: true },
];

export default function AllAssignment() {
  const [assignments, setAssignments] = useState(assignmentsData);
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  // ✅ Same UI variables from teacher UI
  const bgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const cardBg = isDark ? "bg-white/10" : "bg-white";
  const borderColor = isDark ? "border-white/20" : "border-gray-300";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-300" : "text-gray-700";

  

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.85}
      className={`
        flex-row justify-between items-center p-5 mb-4 
        rounded-2xl border backdrop-blur-md
        ${cardBg} ${borderColor}
      `}
  
    >
      <View className="flex-row items-center">
        <Ionicons
          name={item.completed ? "checkmark-done-circle" : "time-outline"}
          size={30}
          color={item.completed ? "#22c55e" : "#f97316"}
        />

        <Text className={`ml-3 text-lg font-medium ${textMain}`}>
          {item.title}
        </Text>
      </View>

      <View
        className={`
          px-3 py-1 rounded-full 
          ${item.completed ? "bg-green-500/20" : "bg-orange-500/20"}
        `}
      >
        <Text
          className={`
            text-sm font-medium
            ${item.completed ? "text-green-400" : "text-orange-400"}
          `}
        >
          {item.completed ? "Completed" : "Pending"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className={`flex-1 px-5 py-6 ${bgColor}`}>
      <Text className={`text-2xl font-medium mb-5 ${textMain}`}>
        ✅ Assignments List
      </Text>

      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
