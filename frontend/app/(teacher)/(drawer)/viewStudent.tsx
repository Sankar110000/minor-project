import { BASE_URL } from "@/components/config";
import UserCard from "@/components/UserCard";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

const viewStident = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const theme = useColorScheme();
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const textMain = isDark ? "text-white" : "text-gray-900";

  const onRefresh = async () => {
    setRefreshing(true);
    const userString = await AsyncStorage.getItem("user");
    const user = userString && JSON.parse(userString);
    const res = await axios.post(`${BASE_URL}/api/class/getCurrClass`, {
      teacherID: user._id,
    });
    console.log(res.data);
    if (res.data.success) {
      setStudents(res.data.currClass.total_students);
    }
    setRefreshing(false);
  };

  const getData = async () => {
    setLoading(true);
    const userString = await AsyncStorage.getItem("user");
    const user = userString && JSON.parse(userString);
    try {
      const res = await axios.post(`${BASE_URL}/api/user/getAllStudents`);
      if (res.data.success) {
        setStudents(res.data.users);
      }
      setLoading(false);
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
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="scale-125"
          />
        </View>
      ) : students.length == 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl font-semibold text-gray-600">
            No students
          </Text>
        </View>
      ) : (
        <View>
          <View className="flex gap-x-4 flex-row pl-3">
            <FontAwesome5 name="user-graduate" size={28} color={"orange"} />
            <Text className={`text-2xl font-medium mb-5 ${textMain}`}>
              All Students
            </Text>
          </View>
          <FlatList
            data={students}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => <UserCard userDet={item} />}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default viewStident;
