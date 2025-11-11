import { BASE_URL } from "@/components/config";
import UserCard from "@/components/UserCard";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, useColorScheme, View } from "react-native";

const viewStident = () => {
  const classData = [
    { id: "1", studentName: "Niranjan", time: "9:00 AM" },
    { id: "2", studentName: "Narayan", time: "10:00 AM" },
    { id: "3", studentName: "Banti", time: "11:00 AM" },
    { id: "4", studentName: "Soumya", time: "02:00 PM" },
    { id: "5", studentName: "Kaibalya", time: "02:00 PM" },
  ];

  const [students, setStudents] = useState([]);

  const theme = useColorScheme();
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const textMain = isDark ? "text-white" : "text-gray-900";

  const getData = async () => {
    const userString = await AsyncStorage.getItem("user");
    const user = userString && JSON.parse(userString);
    try {
      const res = await axios.post(`${BASE_URL}/api/class/getCurrClass`, {
        teacherID: user._id,
      });
      console.log(res.data);
      if (res.data.success) {
        setStudents(res.data.currClass.total_students);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Network Error", "Something went wrong");
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <View className={`flex-1 px-5 py-6 ${bgColor}`}>
      <View className="flex gap-x-4 flex-row pl-3">
        <FontAwesome5 name="user-graduate" size={28} color={"orange"} />
        <Text className={`text-2xl font-medium mb-5 ${textMain}`}>
          All Presents Student
        </Text>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => <UserCard userDet={item} />}
      />
    </View>
  );
};

export default viewStident;
