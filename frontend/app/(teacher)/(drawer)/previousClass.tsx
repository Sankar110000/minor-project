import { Card } from "@/components/Card";
import { BASE_URL } from "@/components/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FlatList, useColorScheme, View } from "react-native";

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

  const getData = async () => {
    const userString = await AsyncStorage.getItem("user");
    const user = userString && JSON.parse(userString);
    try {
      const res = await axios.post(`${BASE_URL}/api/class/getPrevoiusClass`, {
        teacherID: user._id,
      });
      if (res.data.success) {
        setClassData(res.data.classes);
      }
    } catch (error) {
      console.log("Error while fetching data in previousClass", error);
    }
  };
  const theme = useColorScheme();
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-100";

  useEffect(() => {
    getData();
  }, []);

  return (
    <View className={`${bgColor} flex-1 p-4`}>
      <FlatList
        data={classData}
        renderItem={({ item }) => (
          <Card
            subject={item?.title}
            maamName={item?.classTeacher}
            time={`${item?.startTime}`}
          />
        )}
      />
    </View>
  );
};

export default previousClass;
