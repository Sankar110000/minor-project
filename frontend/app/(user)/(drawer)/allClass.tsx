import React, { useState } from "react";
import { View, Text, FlatList, useColorScheme } from "react-native";
import { Card } from "@/components/Card";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const classData = [
  {
    id: "1",
    maamName: "Mrs. Smith",
    subject: "Math",
    time: "9:00 AM",
    present: false,
    title: "Absent",
  },
  {
    id: "2",
    maamName: "Ms. Johnson",
    subject: "Science",
    time: "10:00 AM",
    present: true,
    title: "Present",
  },
  {
    id: "3",
    maamName: "Mrs. Lee",
    subject: "History",
    time: "11:00 AM",
    present: false,
    title: "Absent",
  },
  {
    id: "4",
    maamName: "Mr. Khan",
    subject: "Computer Science",
    time: "02:00 PM",
    present: true,
    title: "Present",
  },
];

export default function AllClass() {
  const [classes, setClasses] = useState(classData);
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const bgColor = isDark ? "bg-gray-950" : "bg-gray-50";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-500";

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

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
        renderItem={({ item }) => (
          <Card
            maamName={item.maamName}
            subject={item.subject}
            time={item.time}
            present={item.present}
            title={item.title}
          />
        )}
      />
    </View>
  );
}
