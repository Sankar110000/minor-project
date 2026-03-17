import { Card } from "@/components/Card";
import { BASE_URL } from "@/components/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  useColorScheme,
  View,
} from "react-native";

const previousClass = () => {
  // const classData = [
  //   {
  //     id: "1",
  //     teacherName: "Mrs. Smith",
  //     subject: "Math",
  //     time: "9:00 AM",
  //   }
  // ];

  const [classData, setClassData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    const userString = await AsyncStorage.getItem("user");
    const user = userString && JSON.parse(userString);
    const res = await axios.post(`${BASE_URL}/api/class/getPrevoiusClass`, {
      teacherID: user._id,
    });
    if (res.data.success) {
      setClassData(res.data.classes.reverse());
    }
    setRefreshing(false);
  };

  const getData = async () => {
    const userString = await AsyncStorage.getItem("user");
    const user = userString && JSON.parse(userString);
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/class/getPrevoiusClass`, {
        teacherID: user._id,
      });
      if (res.data.success) {
        setClassData(res.data.classes.reverse());
      }
    } catch (error) {
      console.log("Error while fetching data in previousClass", error);
    }
    setLoading(false);
  };
  const theme = useColorScheme();
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-100";

  useEffect(() => {
    getData();
  }, []);

  return (
    <View className={`${bgColor} flex-1 pt-4`}>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="scale-125"
          />
        </View>
      ) : (
        <FlatList
          data={classData}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <Card
              subject={item?.title}
              maamName={item?.classTeacher.fullname}
              time={`${item?.startTime}`}
            />
          )}
        />
      )}
    </View>
  );
};

export default previousClass;
