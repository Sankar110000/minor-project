import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Card } from "@/components/Card";
import { useColorScheme } from "react-native";

const classData = [
  { id: "1", maamName: "Mrs. Smith", subject: "Math", time: "9:00 AM", present: false, title: "Absent" },
  { id: "2", maamName: "Ms. Johnson", subject: "Science", time: "10:00 AM", present: true, title: "Present" },
  { id: "3", maamName: "Mrs. Lee", subject: "History", time: "11:00 AM", present: false, title: "Absent" },
  { id: "4", maamName: "Mr. Khan", subject: "Computer Science", time: "02:00 PM", present: true, title: "Present" },
];

export default function AllClass() {
  const [classes, setClasses] = useState(classData);
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  // ✅ Same theme system as Teacher UI
  const bgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const textMain = isDark ? "text-white" : "text-gray-900";



  return (
    <View className={`flex-1 px-5 py-6 ${bgColor}`}>
      <Text className={`text-2xl font-medium mb-5 ${textMain}`}>
        📚 Today’s Classes
      </Text>

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
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
