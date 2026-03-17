import { BASE_URL } from "@/components/config";
import UserCard from "@/components/UserCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

const Attendance = () => {
  const [presentStu, setPresentStu] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useColorScheme();
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-100";

  const onRefresh = async () => {
    setRefreshing(true);
    const storedUser = await AsyncStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    console.log(user);

    const res = await axios.post(
      `${BASE_URL}/api/class/getCurrClass`,
      { teacherID: user?._id },
      { withCredentials: true },
    );

    if (res.data.success) {
      console.log("Current Class: ", res?.data.currClass.total_students);
      setPresentStu(res.data.currClass.total_students);
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

        console.log(res.data);

        if (res.data.success) {
          console.log("Current Class: ", res?.data.class.total_students);
          setPresentStu(res.data.class?.total_students);
        }
        setLoading(false);
      } catch (err) {
        console.log("error while fetching", err);
      }
    };

    fetchClass();
  }, []);
  return (
    <View className={`${bgColor} flex-1 p-4`}>
      {presentStu.length == 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl font-semibold text-gray-600">
            No attendance yet !!
          </Text>
        </View>
      ) : (
        <FlatList
          data={presentStu}
          keyExtractor={(item) => item?._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => <UserCard userDet={item} />}
          showsVerticalScrollIndicator={false}
        />
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

export default Attendance;
