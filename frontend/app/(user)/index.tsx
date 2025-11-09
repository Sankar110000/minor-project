import { Card } from "@/components/Card";
import React, { useEffect, useState } from "react";
import { FlatList, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/components/config";

const data = [
  { id: "1", maamName: "Mrs. Smith", subject: "Math", time: "9:00 AM", present: true, title: "Going On..." },
  { id: "2", maamName: "Ms. Johnson", subject: "Science", time: "10:00 AM", present: true, title: "Going On..." },
  { id: "3", maamName: "Mrs. Lee", subject: "History", time: "11:00 AM", present: true, title: "Going On..." }
];

export default function App() {

  const [user, setUser] = useState({
    email: "",
    fullname: ""
  });

  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const bgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const cardBg = isDark ? "bg-white/10" : "bg-white";
  const borderColor = isDark ? "border-white/20" : "border-gray-300";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-300" : "text-gray-600";

  const getData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/api/user/getUser`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { email, fullname } = res.data?.data;
      setUser({ email, fullname });
    } catch (error) {
      console.log(`Error in the axios: ${error}`);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView className={`flex-1 px-5 ${bgColor}`}>
      
      {/* Username */}
      <Text className={`text-3xl font-semibold mt-3 ${textMain}`}>
        Hello, {user?.fullname} 👋
      </Text>

      {/* Feature Boxes */}
      <View className="flex-row justify-between mt-6">
        
        <TouchableOpacity
        activeOpacity={0.9}
          onPress={() => router.push("/(user)/(drawer)/allAssignment")}
          className={`w-[48%] p-5 rounded-xl flex items-center justify-center 
          border ${borderColor} ${cardBg} shadow`}
        >
          <Ionicons name="calendar-outline" size={28} color="red" />
          <Text className={`text-base font-semibold mt-1 ${textMain}`}>
            All Assignments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
        activeOpacity={0.9}
          onPress={() => router.push("/(user)/(drawer)/allClass")}
          className={`w-[48%] p-5 rounded-xl flex items-center border 
          ${borderColor} ${cardBg} shadow`}
        >
          <Ionicons name="book-outline" size={28} color={isDark?"white":"gray"} />
          <Text className={`text-base font-semibold mt-1 ${textMain}`}>
            All Classes
          </Text>
        </TouchableOpacity>

      </View>

      {/* Today Classes Title */}
      <Text className={`text-2xl font-semibold mt-8 mb-3 ${textMain}`}>
        Today’s Classes 📚
      </Text>

      {/* Class Card List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <Card
            maamName={item.maamName}
            subject={item.subject}
            time={item.time}
            present={item.present}
            title={item.title}
            cardBg={cardBg}
            borderColor={borderColor}
            textMain={textMain}
            textSub={textSub}
          />
        )}
      />
    </SafeAreaView>
  );
}
