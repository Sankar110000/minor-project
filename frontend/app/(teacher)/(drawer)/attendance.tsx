import { Card } from "@/components/Card";
/* import { BASE_URL } from "@/components/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"; */
import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { useColorScheme } from "react-native";

const Attendance = () => {
  /* const [presentStu, setPresentStu] = useState([]); */
  const theme = useColorScheme();
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-100";

 /*  useEffect(() => {
    const fetchClass = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        console.log(user);
        
        const res = await axios.post(
          `${BASE_URL}/api/class/getCurrClass`,
          { teacherID: user?._id },
          { withCredentials: true }
        );

        console.log("Current Class: ", res?.data?.currClass);

        setPresentStu(res.data.currClass || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchClass();
  }, []);
 */
  return (
    <View className={`${bgColor} flex-1 p-4`}>
     {/*  <FlatList
        data={presentStu}
        keyExtractor={(item) => item?._id}
        renderItem={({ item }) => (
          {<Card
            subject={item?.subject}
            maamName={item?.classTeacher?.name || "Unknown"}
            time={`${item?.startTime} - ${item?.endTime}`}
            present={true}
            title={item?.title}
            color="orange"
          />}
        )}
        showsVerticalScrollIndicator={false}
      /> */}
    </View>
  );
};

export default Attendance;
