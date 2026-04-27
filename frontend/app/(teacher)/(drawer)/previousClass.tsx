import { Card } from "@/components/Card";
import { BASE_URL } from "@/components/config";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import PageHeader from "@/components/PageHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  useColorScheme,
  View,
} from "react-native";

const PreviousClass = () => {
  const [classData, setClassData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const theme = useColorScheme();
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-gray-950" : "bg-gray-50";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-500";

  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
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

  useEffect(() => {
    getData();
  }, []);

  return (
    <View className={`${bgColor} flex-1`}>
      {/* Header */}
      <PageHeader 
        title="Previous Classes" 
        subtitle={`${classData.length} ${classData.length === 1 ? "class" : "classes"} conducted`}
        iconName="class"
        iconType="MaterialIcons"
      />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className={`mt-3 ${textSub}`}>Loading class history...</Text>
        </View>
      ) : classData.length === 0 ? (
        <View className="flex-1 justify-center items-center px-8">
          <MaterialCommunityIcons
            name="book-clock-outline"
            size={56}
            color={isDark ? "#374151" : "#d1d5db"}
          />
          <Text className={`text-lg font-semibold mt-4 ${textMain}`}>
            No classes yet
          </Text>
          <Text className={`text-sm mt-2 text-center ${textSub}`}>
            Your class history will appear here after you complete sessions.
          </Text>
        </View>
      ) : (
        <FlatList
          data={classData}
          keyExtractor={(item) => item?._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#f97316"
            />
          }
          renderItem={({ item }) => (
            <Card
              subject={item?.title}
              maamName={item?.classTeacher?.fullname}
              time={`${item?.startTime}`}
              studentCount={item?.total_students?.length}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default PreviousClass;
